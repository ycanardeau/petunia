import { ProjectFile } from '@/core/projects/Project';
import { TypeScriptNodeConsoleProject } from '@/core/projects/TypeScriptNodeConsoleProject';

export class TypeScriptYohiraProject extends TypeScriptNodeConsoleProject {
	generateSrcEntitiesUserTS(): string {
		return `import { Entity, Enum, PrimaryKey, Property } from '@mikro-orm/core';
import { createHash } from 'node:crypto';

export enum PasswordHashAlgorithm {
	Bcrypt = 'Bcrypt',
}

@Entity({ tableName: 'users' })
export class User {
	@PrimaryKey()
	id!: number;

	@Property()
	createdAt = new Date();

	@Property()
	username: string;

	@Property()
	email: string;

	@Property()
	normalizedEmail: string;

	@Enum(() => PasswordHashAlgorithm)
	passwordHashAlgorithm: PasswordHashAlgorithm;

	@Property()
	salt: string;

	@Property()
	passwordHash: string;

	constructor({
		username,
		email,
		normalizedEmail,
		passwordHashAlgorithm,
		salt,
		passwordHash,
	}: {
		username: string;
		email: string;
		normalizedEmail: string;
		passwordHashAlgorithm: PasswordHashAlgorithm;
		salt: string;
		passwordHash: string;
	}) {
		this.username = username;
		this.email = email;
		this.normalizedEmail = normalizedEmail;
		this.passwordHashAlgorithm = passwordHashAlgorithm;
		this.salt = salt;
		this.passwordHash = passwordHash;
	}

	get avatarUrl(): string {
		const hash = createHash('md5')
			.update(this.email.trim().toLowerCase())
			.digest('hex');
		return \`https://www.gravatar.com/avatar/\${hash}\`;
	}
}
`;
	}

	generateSrcRequestHandlersRequestHandlerTS(): string {
		return `import { JSONSchemaType, ValidateFunction } from 'ajv';
import Ajv from 'ajv';
import { Err, IHttpContext, IHttpRequest, Ok, Result } from 'yohira';

const ajv = new Ajv({
	coerceTypes: true,
	removeAdditional: 'all',
});

export abstract class RequestHandler<TRequest, TResponse> {
	private readonly validate: ValidateFunction<TRequest>;

	private getOrAddSchema(
		schema: JSONSchemaType<TRequest>,
		keyRef: string,
	): ValidateFunction<TRequest> {
		// https://ajv.js.org/guide/managing-schemas.html#pre-adding-all-schemas-vs-adding-on-demand
		let validate: ValidateFunction<TRequest> | undefined;
		validate = ajv.getSchema(keyRef);
		if (validate === undefined) {
			ajv.addSchema(schema, keyRef);
			validate = ajv.getSchema(keyRef);
		}

		if (validate === undefined || validate.schema !== schema) {
			throw new Error(
				\`Invalid schema. Expected: '\${JSON.stringify(
					schema,
				)}', but got '\${JSON.stringify(validate?.schema)}'.\`,
			);
		}

		return validate;
	}

	protected constructor(schema: JSONSchemaType<TRequest>) {
		this.validate = this.getOrAddSchema(schema, this.constructor.name);
	}

	private parseJson(text: string): Result<unknown, SyntaxError> {
		try {
			return new Ok(JSON.parse(text));
		} catch (error) {
			if (error instanceof SyntaxError) {
				return new Err(error);
			} else {
				throw error;
			}
		}
	}

	parseHttpRequest(httpRequest: IHttpRequest): Result<TRequest, Error> {
		const text = ((): string => {
			switch (httpRequest.method.toUpperCase()) {
				case 'GET':
					return JSON.stringify(
						Object.fromEntries(
							new URLSearchParams(httpRequest.queryString.toString()),
						),
					);

				case 'POST':
					return httpRequest.rawBody;

				default:
					// TODO
					return '';
			}
		})();

		return this.parseJson(text).andThen((json) => {
			if (this.validate(json)) {
				return new Ok(json);
			}
			return new Err(new Error() /* TODO */);
		});
	}

	abstract handle(
		httpContext: IHttpContext,
		request: TRequest,
	): Promise<Result<TResponse, Error>>;
}
`;
	}

	generateSrcIndexTS(): string {
		return `import config from '@/mikro-orm.config';
import { RequestHandler } from '@/request-handlers/RequestHandler';
import { requestHandlerDescriptors } from '@/requestHandlerDescriptors';
import { MikroORM } from '@mikro-orm/core';
import {
	Envs,
	IHttpContext,
	StatusCodes,
	WebAppOptions,
	addRouting,
	addScopedFactory,
	addSingletonFactory,
	addTransientCtor,
	createWebAppBuilder,
	getRequiredService,
	mapGet,
	mapPost,
	useEndpoints,
	useRouting,
	write,
} from 'yohira';

async function main(): Promise<void> {
	// TODO: remove
	const options = new WebAppOptions();
	options.envName = process.env.NODE_ENV ?? Envs.Production;

	const builder = createWebAppBuilder(options);
	const services = builder.services;

	addRouting(services);

	// TODO: move
	const orm = await MikroORM.init(config);
	addSingletonFactory(services, Symbol.for('MikroORM'), () => {
		return orm;
	});

	addScopedFactory(
		services,
		Symbol.for('EntityManager'),
		(serviceProvider) => {
			const orm = getRequiredService<MikroORM>(
				serviceProvider,
				Symbol.for('MikroORM'),
			);
			return orm.em.fork();
		},
	);

	for (const { serviceType, implType } of Object.values(
		requestHandlerDescriptors,
	)) {
		addTransientCtor(services, serviceType, implType);
	}

	const app = builder.build();

	useRouting(app);

	for (const [endpoint, descriptor] of Object.entries(
		requestHandlerDescriptors,
	)) {
		const requestDelegate = async (
			httpContext: IHttpContext,
		): Promise<void> => {
			const requestHandler = getRequiredService<
				RequestHandler<unknown, unknown>
			>(httpContext.requestServices, descriptor.serviceType);

			const parseHttpRequestResult = requestHandler.parseHttpRequest(
				httpContext.request,
			);

			if (parseHttpRequestResult.ok) {
				const handleResult = await requestHandler.handle(
					httpContext,
					parseHttpRequestResult.val,
				);

				if (handleResult.ok) {
					return write(
						httpContext.response,
						JSON.stringify(handleResult.val),
					);
				} else {
					httpContext.response.statusCode =
						StatusCodes.Status400BadRequest;
					return write(
						httpContext.response,
						handleResult.val.message,
					);
				}
			} else {
				httpContext.response.statusCode =
					StatusCodes.Status400BadRequest;
				return write(httpContext.response, '' /* TODO */);
			}
		};

		switch (descriptor.method) {
			case 'GET':
				mapGet(app, endpoint, requestDelegate);
				break;

			case 'POST':
				mapPost(app, endpoint, requestDelegate);
				break;
		}
	}

	useEndpoints(app, () => {});

	await app.run();
}

main();
`;
	}

	generateRequestHandlerDescriptorsTS(): string {
		return `import { RequestHandler } from '@/request-handlers/RequestHandler';
import { Ctor } from 'yohira';

interface RequestHandlerDescriptor {
	method: 'GET' | 'POST';
	serviceType: symbol;
	implType: Ctor<RequestHandler<unknown, unknown>>;
}

export const requestHandlerDescriptors: Record<
	string,
	RequestHandlerDescriptor
> = {
};
`;
	}

	*generateProjectFiles(): Generator<ProjectFile> {
		yield* super.generateProjectFiles();

		yield {
			path: 'src/entities/User.ts',
			text: this.generateSrcEntitiesUserTS(),
		};

		yield {
			path: 'src/request-handlers/RequestHandler.ts',
			text: this.generateSrcRequestHandlersRequestHandlerTS(),
		};

		yield {
			path: 'src/requestHandlerDescriptors.ts',
			text: this.generateRequestHandlerDescriptorsTS(),
		};
	}
}
