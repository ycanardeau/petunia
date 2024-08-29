import {
	EditorConfig,
	ProjectFile,
} from '@/features/typescript/projects/Project';
import {
	TypeScriptNodeConsoleProject,
	TypeScriptNodeConsoleProjectOptions,
} from '@/features/typescript/projects/TypeScriptNodeConsoleProject';
import { TypeScriptProject } from '@/features/typescript/projects/TypeScriptProject';

export type TypeScriptYohiraBackendProjectOptions =
	TypeScriptNodeConsoleProjectOptions;

export class TypeScriptYohiraBackendProject extends TypeScriptProject<TypeScriptYohiraBackendProjectOptions> {
	private readonly typeScriptNodeConsoleProject: TypeScriptNodeConsoleProject;

	constructor(
		editorConfig: EditorConfig | undefined,
		options: TypeScriptYohiraBackendProjectOptions,
	) {
		super(editorConfig, options);

		this.typeScriptNodeConsoleProject = new TypeScriptNodeConsoleProject(
			editorConfig,
			options,
		);
	}

	generateSrcModelsRequestsUserGetRequestTS(): string {
		return `import { JSONSchemaType } from 'ajv';

export interface UserGetRequest {}

export const UserGetRequestSchema: JSONSchemaType<UserGetRequest> = {
	type: 'object',
	properties: {},
};
`;
	}

	generateSrcModelsRequestsUserLoginRequestTS(): string {
		return `import { JSONSchemaType } from 'ajv';

export interface UserLoginRequest {
	username: string;
	password: string;
}

export const UserLoginRequestSchema: JSONSchemaType<UserLoginRequest> = {
	type: 'object',
	properties: {
		username: {
			type: 'string',
		},
		password: {
			type: 'string',
		},
	},
	required: ['username', 'password'],
};
`;
	}

	generateSrcModelsRequestsUserLogoutRequestTS(): string {
		return `import { JSONSchemaType } from 'ajv';

export interface UserLogoutRequest {}

export const UserLogoutRequestSchema: JSONSchemaType<UserLogoutRequest> = {
	type: 'object',
};
`;
	}

	generateSrcModelsRequestsUserSignUpRequestTS(): string {
		return `import { JSONSchemaType } from 'ajv';

export interface UserSignUpRequest {
	username: string;
	email: string;
	password: string;
}

export const UserSignUpRequestSchema: JSONSchemaType<UserSignUpRequest> = {
	type: 'object',
	properties: {
		username: {
			type: 'string',
		},
		email: {
			type: 'string',
		},
		password: {
			type: 'string',
		},
	},
	required: ['username', 'email', 'password'],
};
`;
	}

	generateSrcModelsResponsesUserGetResponseTS(): string {
		return `import { UserDto } from '@/models/dto/UserDto';

export type UserGetResponse = UserDto;
`;
	}

	generateSrcModelsResponsesUserLoginResponseTS(): string {
		return `import { UserDto } from '@/models/dto/UserDto';

export type UserLoginResponse = UserDto;
`;
	}

	generateSrcModelsResponsesUserLogoutResponseTS(): string {
		return `export interface UserLogoutResponse {}
`;
	}

	generateSrcModelsResponsesUserSignUpResponseTS(): string {
		return `import { UserDto } from '@/models/dto/UserDto';

export type UserSignUpResponse = UserDto;
`;
	}

	generateSrcEntitiesUserTS(): string {
		return `import { Login } from '@/entities/Login';
import {
	Collection,
	Entity,
	Enum,
	OneToMany,
	PrimaryKey,
	Property,
	Ref,
} from '@mikro-orm/core';
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

	@OneToMany(() => Login, (login) => login.user)
	logins = new Collection(this);

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

export interface IUserOwnedEntity {
	user: Ref<User>;
}
`;
	}

	generateSrcEntitiesLoginTS(): string {
		return `import { IUserOwnedEntity, User } from '@/entities/User';
import {
	Entity,
	ManyToOne,
	PrimaryKey,
	Property,
	Ref,
	ref,
} from '@mikro-orm/core';

@Entity({ tableName: 'logins' })
export class Login implements IUserOwnedEntity {
	@PrimaryKey()
	id!: number;

	@Property()
	createdAt = new Date();

	@ManyToOne(() => User)
	user: Ref<User>;

	@Property()
	ip: string;

	@Property()
	success: boolean;

	constructor(user: User, ip: string, success: boolean) {
		this.user = ref(user);
		this.ip = ip;
		this.success = success;
	}
}
`;
	}

	generateSrcErrorsDataNotFoundErrorTS(): string {
		return `export class DataNotFoundError extends Error {
	_DataNotFoundErrorBrand: undefined;
}
`;
	}

	generateSrcErrorsUnauthorizedErrorTS(): string {
		return `export class UnauthorizedError extends Error {
	_UnauthorizedErrorBrand: undefined;
}
`;
	}

	generateSrcMappersUserMapperTS(): string {
		return `import { User } from '@/entities/User';
import { DataNotFoundError } from '@/errors/DataNotFoundError';
import { UserDto } from '@/models/dto/UserDto';
import { Ok, Result } from 'yohira';

export function toUserDto(user: User): Result<UserDto, DataNotFoundError> {
	return new Ok({
		_UserDtoBrand: undefined,
		id: user.id,
		createdAt: user.createdAt.toISOString(),
		username: user.username,
		avatarUrl: user.avatarUrl,
	});
}
`;
	}

	generateSrcEndpointsEndpointTS(): string {
		return `import Ajv, { JSONSchemaType, ValidateFunction } from 'ajv';
import {
	Err,
	IActionResult,
	IHttpContext,
	IHttpRequest,
	Ok,
	Result,
} from 'yohira';

const ajv = new Ajv({
	coerceTypes: true,
	removeAdditional: 'all',
});

export abstract class Endpoint<TRequest, TResponse> {
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
							new URLSearchParams(
								httpRequest.queryString.toString(),
							),
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
			return new Err(new Error(this.validate.errors?.[0].message));
		});
	}

	abstract handle(
		httpContext: IHttpContext,
		request: TRequest,
	): Promise<Result<IActionResult, Error>>;
}
`;
	}

	generateSrcEndpointsUserGetEndpointTS(): string {
		return `import { DataNotFoundError } from '@/errors/DataNotFoundError';
import { UnauthorizedError } from '@/errors/UnauthorizedError';
import { toUserDto } from '@/mappers/UserMapper';
import { UserDto } from '@/models/dto/UserDto';
import {
	UserGetRequest,
	UserGetRequestSchema,
} from '@/models/requests/UserGetRequest';
import { UserGetResponse } from '@/models/responses/UserGetResponse';
import { Endpoint } from '@/endpoints/Endpoint';
import { ICurrentUserService } from '@/services/CurrentUserService';
import { Err, IHttpContext, JsonResult, Ok, Result, inject } from 'yohira';

export class UserGetEndpoint extends Endpoint<
	UserGetRequest,
	UserGetResponse
> {
	constructor(
		@inject(ICurrentUserService)
		private readonly currentUserService: ICurrentUserService,
	) {
		super(UserGetRequestSchema);
	}

	async handle(
		httpContext: IHttpContext,
		request: UserGetRequest,
	): Promise<
		Result<JsonResult<UserDto>, UnauthorizedError | DataNotFoundError>
	> {
		const currentUser =
			await this.currentUserService.getCurrentUser(httpContext);

		if (!currentUser) {
			return new Err(new UnauthorizedError());
		}

		const userDtoResult = toUserDto(currentUser);

		if (userDtoResult.err) {
			return userDtoResult;
		}

		const userDto = userDtoResult.val;

		return new Ok(new JsonResult(userDto));
	}
}
`;
	}

	generateSrcEndpointsUserLoginEndpointTS(): string {
		return `import { Login } from '@/entities/Login';
import { User } from '@/entities/User';
import { DataNotFoundError } from '@/errors/DataNotFoundError';
import { UnauthorizedError } from '@/errors/UnauthorizedError';
import { toUserDto } from '@/mappers/UserMapper';
import {
	UserLoginRequest,
	UserLoginRequestSchema,
} from '@/models/requests/UserLoginRequest';
import { UserLoginResponse } from '@/models/responses/UserLoginResponse';
import { Endpoint } from '@/endpoints/Endpoint';
import { IPasswordServiceFactory } from '@/services/PasswordServiceFactory';
import { EntityManager } from '@mikro-orm/core';
import {
	AuthenticationProperties,
	Claim,
	ClaimTypes,
	ClaimsIdentity,
	ClaimsPrincipal,
	CookieAuthenticationDefaults,
	Err,
	IHttpContext,
	JsonResult,
	Ok,
	Result,
	inject,
	signIn,
} from 'yohira';

export class UserLoginEndpoint extends Endpoint<
	UserLoginRequest,
	UserLoginResponse
> {
	constructor(
		@inject(Symbol.for('EntityManager')) private readonly em: EntityManager,
		@inject(IPasswordServiceFactory)
		private readonly passwordServiceFactory: IPasswordServiceFactory,
	) {
		super(UserLoginRequestSchema);
	}

	// TODO
	async handle(
		httpContext: IHttpContext,
		request: UserLoginRequest,
	): Promise<
		Result<
			JsonResult<UserLoginResponse>,
			DataNotFoundError | UnauthorizedError
		>
	> {
		const userResult = await this.em.transactional(async (em) => {
			const realIp = httpContext.request.headers['x-real-ip'];

			if (typeof realIp !== 'string') {
				return new Err(new UnauthorizedError());
			}

			const user = await this.em.findOne(User, {
				username: request.username,
			});

			if (!user) {
				return new Err(new DataNotFoundError());
			}

			const passwordService = this.passwordServiceFactory.create(
				user.passwordHashAlgorithm,
			);

			const passwordHash = await passwordService.hashPassword(
				request.password,
				user.salt,
			);

			const success = passwordHash === user.passwordHash;

			const login = new Login(user, realIp, success);

			em.persist(login);

			return success ? new Ok(user) : new Err(new UnauthorizedError());
		});

		if (userResult.err) {
			return userResult;
		}

		const user = userResult.val;

		const userDtoResult = toUserDto(user);

		if (userDtoResult.err) {
			return userDtoResult;
		}

		const userDto = userDtoResult.val;

		const claims: Claim[] = [new Claim(ClaimTypes.name, userDto.username)];

		const claimsIdentity = new ClaimsIdentity(
			undefined,
			claims,
			CookieAuthenticationDefaults.authenticationScheme,
			undefined,
			undefined,
		);

		const authProperties = new AuthenticationProperties(
			undefined,
			undefined,
		);

		await signIn(
			httpContext,
			CookieAuthenticationDefaults.authenticationScheme,
			ClaimsPrincipal.fromIdentity(claimsIdentity),
			authProperties,
		);

		return new Ok(new JsonResult(userDto));
	}
}
`;
	}

	generateSrcEndpointsUserLogoutEndpointTS(): string {
		return `import {
	UserLogoutRequest,
	UserLogoutRequestSchema,
} from '@/models/requests/UserLogoutRequest';
import { UserLogoutResponse } from '@/models/responses/UserLogoutResponse';
import { Endpoint } from '@/endpoints/Endpoint';
import {
	CookieAuthenticationDefaults,
	IHttpContext,
	JsonResult,
	Ok,
	Result,
	signOut,
} from 'yohira';

export class UserLogoutEndpoint extends Endpoint<
	UserLogoutRequest,
	UserLogoutResponse
> {
	constructor() {
		super(UserLogoutRequestSchema);
	}

	async handle(
		httpContext: IHttpContext,
		request: UserLogoutRequest,
	): Promise<Result<JsonResult<UserLogoutResponse>, Error>> {
		await signOut(
			httpContext,
			CookieAuthenticationDefaults.authenticationScheme,
			undefined,
		);

		return new Ok(new JsonResult({}));
	}
}
`;
	}

	generateSrcEndpointsUserSignUpEndpointTS(): string {
		return `import { User } from '@/entities/User';
import { toUserDto } from '@/mappers/UserMapper';
import {
	UserSignUpRequest,
	UserSignUpRequestSchema,
} from '@/models/requests/UserSignUpRequest';
import { UserSignUpResponse } from '@/models/responses/UserSignUpResponse';
import { Endpoint } from '@/endpoints/Endpoint';
import { IEmailService } from '@/services/EmailService';
import { IPasswordServiceFactory } from '@/services/PasswordServiceFactory';
import { EntityManager } from '@mikro-orm/core';
import { Err, IHttpContext, JsonResult, Ok, Result, inject } from 'yohira';

export class UserSignUpEndpoint extends Endpoint<
	UserSignUpRequest,
	UserSignUpResponse
> {
	constructor(
		@inject(Symbol.for('EntityManager')) private readonly em: EntityManager,
		@inject(IEmailService) private readonly emailService: IEmailService,
		@inject(IPasswordServiceFactory)
		private readonly passwordServiceFactory: IPasswordServiceFactory,
	) {
		super(UserSignUpRequestSchema);
	}

	async handle(
		httpContext: IHttpContext,
		request: UserSignUpRequest,
	): Promise<Result<JsonResult<UserSignUpResponse>, Error>> {
		const normalizedEmail = await this.emailService.normalizeEmail(
			request.email,
		);

		const userResult = await this.em.transactional(async (em) => {
			const existingUser = await this.em.findOne(User, {
				normalizedEmail: normalizedEmail,
			});
			if (existingUser) {
				return new Err(new Error(/* TODO */));
			}

			const passwordService = this.passwordServiceFactory.default;

			const salt = await passwordService.generateSalt();
			const passwordHash = await passwordService.hashPassword(
				request.password,
				salt,
			);

			const user = new User({
				username: request.username.trim(),
				email: request.email,
				normalizedEmail: normalizedEmail,
				salt: salt,
				passwordHashAlgorithm: passwordService.algorithm,
				passwordHash: passwordHash,
			});
			em.persist(user);

			return new Ok(user);
		});

		return userResult
			.andThen((user) => toUserDto(user))
			.map((userDto) => new JsonResult(userDto));
	}
}
`;
	}

	generateSrcIndexTS(): string {
		return `import config from '@/mikro-orm.config';
import { Endpoint } from '@/endpoints/Endpoint';
import { endpoints } from '@/endpoints';
import {
	CurrentUserService,
	ICurrentUserService,
} from '@/services/CurrentUserService';
import { EmailService, IEmailService } from '@/services/EmailService';
import {
	IPasswordServiceFactory,
	PasswordServiceFactory,
} from '@/services/PasswordServiceFactory';
import { MikroORM } from '@mikro-orm/core';
import {
	ActionContext,
	CookieAuthenticationDefaults,
	Envs,
	IHttpContext,
	StatusCodes,
	WebAppOptions,
	addAuthentication,
	addCookie,
	addMvcCoreServices,
	addRouting,
	addScopedFactory,
	addSingletonCtor,
	addSingletonFactory,
	addTransientCtor,
	createWebAppBuilder,
	getRequiredService,
	isDevelopment,
	mapGet,
	mapPost,
	useAuthentication,
	useEndpoints,
	useErrorHandler,
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

	addCookie(
		addAuthentication(
			services,
			CookieAuthenticationDefaults.authenticationScheme,
		),
	);

	// TODO: move
	const orm = await MikroORM.init(config);
	addSingletonFactory(services, Symbol.for('MikroORM'), () => orm);

	addScopedFactory(services, Symbol.for('EntityManager'), (serviceProvider) =>
		getRequiredService<MikroORM>(
			serviceProvider,
			Symbol.for('MikroORM'),
		).em.fork(),
	);

	addSingletonCtor(services, IEmailService, EmailService);
	addSingletonCtor(services, IPasswordServiceFactory, PasswordServiceFactory);

	addTransientCtor(services, ICurrentUserService, CurrentUserService);

	for (const { serviceType, implType } of endpoints) {
		addTransientCtor(services, serviceType, implType);
	}

	addMvcCoreServices(services);

	const app = builder.build();

	if (!isDevelopment(app.env)) {
		useErrorHandler(app);
	}

	useAuthentication(app);

	useRouting(app);

	for (const descriptor of endpoints) {
		const requestDelegate = async (
			httpContext: IHttpContext,
		): Promise<void> => {
			const endpoint = getRequiredService<
				Endpoint<unknown, unknown>
			>(httpContext.requestServices, descriptor.serviceType);

			const parseHttpRequestResult = endpoint.parseHttpRequest(
				httpContext.request,
			);

			if (parseHttpRequestResult.ok) {
				const handleResult = await endpoint.handle(
					httpContext,
					parseHttpRequestResult.val,
				);

				if (handleResult.ok) {
					await handleResult.val.executeResult(
						new ActionContext(httpContext),
					);
				} else {
					httpContext.response.statusCode =
						StatusCodes.Status400BadRequest;
					await write(
						httpContext.response,
						handleResult.val.message,
					);
				}
			} else {
				httpContext.response.statusCode =
					StatusCodes.Status400BadRequest;
				await write(
					httpContext.response,
					parseHttpRequestResult.val.message,
				);
			}
		};

		switch (descriptor.method) {
			case 'GET':
				mapGet(app, descriptor.endpoint, requestDelegate);
				break;

			case 'POST':
				mapPost(app, descriptor.endpoint, requestDelegate);
				break;
		}
	}

	useEndpoints(app, () => {});

	const migrator = orm.getMigrator();
	await migrator.up();

	await app.run();
}

main();
`;
	}

	generateSrcModelsDtoUserDtoTS(): string {
		return `export interface UserDto {
	_UserDtoBrand: any;
	id: number;
	createdAt: string /* TODO: Date */;
	username: string;
	avatarUrl: string;
}
`;
	}

	generateEndpointsTS(): string {
		return `import { Endpoint } from '@/endpoints/Endpoint';
import { UserGetEndpoint } from '@/endpoints/UserGetEndpoint';
import { UserLoginEndpoint } from '@/endpoints/UserLoginEndpoint';
import { UserLogoutEndpoint } from '@/endpoints/UserLogoutEndpoint';
import { UserSignUpEndpoint } from '@/endpoints/UserSignUpEndpoint';
import { Ctor } from 'yohira';

export interface EndpointDescriptor {
	method: 'GET' | 'POST';
	endpoint: string;
	serviceType: symbol;
	implType: Ctor<Endpoint<unknown, unknown>>;
}

export const endpoints: EndpointDescriptor[] = [
	{
		method: 'GET',
		endpoint: '/users/get',
		serviceType: Symbol.for('UserGetEndpoint'),
		implType: UserGetEndpoint,
	},
	{
		method: 'POST',
		endpoint: '/users/login',
		serviceType: Symbol.for('UserLoginEndpoint'),
		implType: UserLoginEndpoint,
	},
	{
		method: 'POST',
		endpoint: '/users/logout',
		serviceType: Symbol.for('UserLogoutEndpoint'),
		implType: UserLogoutEndpoint,
	},
	{
		method: 'POST',
		endpoint: '/users/signup',
		serviceType: Symbol.for('UserSignUpEndpoint'),
		implType: UserSignUpEndpoint,
	},
];
`;
	}

	generateSrcServicesEmailServiceTS(): string {
		return `export const IEmailService = Symbol.for('IEmailService');
export interface IEmailService {
	normalizeEmail(email: string): Promise<string>;
}

export class EmailService implements IEmailService {
	normalizeEmail(email: string): Promise<string> {
		// TODO
		//throw new Error('Method not implemented.');
		return Promise.resolve(email);
	}
}
`;
	}

	generateSrcServicesPasswordServiceFactoryTS(): string {
		return `import { PasswordHashAlgorithm } from '@/entities/User';
import { genSalt, hash } from 'bcryptjs';

interface IPasswordService {
	readonly algorithm: PasswordHashAlgorithm;
	generateSalt(): Promise<string>;
	hashPassword(password: string, salt: string): Promise<string>;
}

class BcryptPasswordService implements IPasswordService {
	readonly algorithm = PasswordHashAlgorithm.Bcrypt;

	generateSalt(): Promise<string> {
		return genSalt(10);
	}

	hashPassword(password: string, salt: string): Promise<string> {
		// TODO: bcrypt has a maximum length input length of 72 bytes.
		if (new TextEncoder().encode(password).length > 72) {
			throw new Error('Password is too long.');
		}

		return hash(password, salt);
	}
}

export const IPasswordServiceFactory = Symbol.for('IPasswordServiceFactory');
export interface IPasswordServiceFactory {
	readonly default: IPasswordService;
	create(algorithm: PasswordHashAlgorithm): IPasswordService;
}

export class PasswordServiceFactory implements IPasswordServiceFactory {
	create(algorithm: PasswordHashAlgorithm): IPasswordService {
		switch (algorithm) {
			case PasswordHashAlgorithm.Bcrypt:
				return new BcryptPasswordService();
		}
	}

	get default(): IPasswordService {
		return this.create(PasswordHashAlgorithm.Bcrypt);
	}
}
`;
	}

	generateSrcServicesCurrentUserServiceTS(): string {
		return `import { User } from '@/entities/User';
import { EntityManager } from '@mikro-orm/core';
import { ClaimsIdentity, IHttpContext, inject } from 'yohira';

export const ICurrentUserService = Symbol.for('ICurrentUserService');
export interface ICurrentUserService {
	getCurrentUser(httpContext: IHttpContext): Promise<User | undefined>;
}

export class CurrentUserService implements ICurrentUserService {
	constructor(
		@inject(Symbol.for('EntityManager')) private readonly em: EntityManager,
	) {}

	async getCurrentUser(httpContext: IHttpContext): Promise<User | undefined> {
		const identity = httpContext.user.identity;
		if (!(identity instanceof ClaimsIdentity)) {
			return undefined;
		}

		const name = identity.name;
		if (typeof name !== 'string') {
			return undefined;
		}

		const user = await this.em.findOne(User, {
			username: name,
		});

		return user ?? undefined;
	}
}
`;
	}

	*generateProjectFiles(): Generator<ProjectFile> {
		yield* this.typeScriptNodeConsoleProject.generateProjectFiles();

		yield {
			path: 'src/index.ts',
			text: this.generateSrcIndexTS(),
		};

		yield {
			path: 'src/models/dto/UserDto.ts',
			text: this.generateSrcModelsDtoUserDtoTS(),
		};

		yield {
			path: 'src/models/requests/UserGetRequest.ts',
			text: this.generateSrcModelsRequestsUserGetRequestTS(),
		};

		yield {
			path: 'src/models/requests/UserLoginRequest.ts',
			text: this.generateSrcModelsRequestsUserLoginRequestTS(),
		};

		yield {
			path: 'src/models/requests/UserLogoutRequest.ts',
			text: this.generateSrcModelsRequestsUserLogoutRequestTS(),
		};

		yield {
			path: 'src/models/requests/UserSignUpRequest.ts',
			text: this.generateSrcModelsRequestsUserSignUpRequestTS(),
		};

		yield {
			path: 'src/models/responses/UserGetResponse.ts',
			text: this.generateSrcModelsResponsesUserGetResponseTS(),
		};

		yield {
			path: 'src/models/responses/UserLoginResponse.ts',
			text: this.generateSrcModelsResponsesUserLoginResponseTS(),
		};

		yield {
			path: 'src/models/responses/UserLogoutResponse.ts',
			text: this.generateSrcModelsResponsesUserLogoutResponseTS(),
		};

		yield {
			path: 'src/models/responses/UserSignUpResponse.ts',
			text: this.generateSrcModelsResponsesUserSignUpResponseTS(),
		};

		yield {
			path: 'src/entities/User.ts',
			text: this.generateSrcEntitiesUserTS(),
		};

		yield {
			path: 'src/entities/Login.ts',
			text: this.generateSrcEntitiesLoginTS(),
		};

		yield {
			path: 'src/errors/DataNotFoundError.ts',
			text: this.generateSrcErrorsDataNotFoundErrorTS(),
		};

		yield {
			path: 'src/errors/UnauthorizedError.ts',
			text: this.generateSrcErrorsUnauthorizedErrorTS(),
		};

		yield {
			path: 'src/mappers/UserMapper.ts',
			text: this.generateSrcMappersUserMapperTS(),
		};

		yield {
			path: 'src/endpoints/Endpoint.ts',
			text: this.generateSrcEndpointsEndpointTS(),
		};

		yield {
			path: 'src/endpoints/UserGetEndpoint.ts',
			text: this.generateSrcEndpointsUserGetEndpointTS(),
		};

		yield {
			path: 'src/endpoints/UserLoginEndpoint.ts',
			text: this.generateSrcEndpointsUserLoginEndpointTS(),
		};

		yield {
			path: 'src/endpoints/UserLogoutEndpoint.ts',
			text: this.generateSrcEndpointsUserLogoutEndpointTS(),
		};

		yield {
			path: 'src/endpoints/UserSignUpEndpoint.ts',
			text: this.generateSrcEndpointsUserSignUpEndpointTS(),
		};

		yield {
			path: 'src/endpoints.ts',
			text: this.generateEndpointsTS(),
		};

		yield {
			path: 'src/services/EmailService.ts',
			text: this.generateSrcServicesEmailServiceTS(),
		};

		yield {
			path: 'src/services/PasswordServiceFactory.ts',
			text: this.generateSrcServicesPasswordServiceFactoryTS(),
		};

		yield {
			path: 'src/services/CurrentUserService.ts',
			text: this.generateSrcServicesCurrentUserServiceTS(),
		};
	}
}
