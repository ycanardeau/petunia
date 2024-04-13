import { TypeScriptYohiraFullStackProject } from '@/core/projects/TypeScriptYohiraFullStackProject';
import { describe, expect, test } from 'vitest';

describe('TypeScriptYohiraFullStackProject', () => {
	test('generateNginxNginxConf', () => {
		const project = new TypeScriptYohiraFullStackProject(undefined, {
			projectName: 'petunia',
		});
		const actual = project.generateNginxNginxConf();
		const expected = `# https://medium.com/@r.thilina/deploying-multiple-containerized-angular-applications-in-different-subdirectories-of-a-single-73923688bece

upstream petunia.api {
    server petunia.api:5000;
}
upstream petunia.frontend {
    server petunia.frontend:8080;
}

server {
    listen 80;

    location /petunia/api {
        rewrite ^/petunia/api/(.*) /$1 break;
        proxy_pass http://petunia.api/;
    }
    location /petunia {
        proxy_pass http://petunia.frontend/;
    }
}
`;
		expect(actual).toBe(expected);
	});

	test('generateNginxNginxConf httpBasicAuthentication', () => {
		const project = new TypeScriptYohiraFullStackProject(undefined, {
			projectName: 'petunia',
			httpBasicAuthentication: true,
		});
		const actual = project.generateNginxNginxConf();
		const expected = `# https://medium.com/@r.thilina/deploying-multiple-containerized-angular-applications-in-different-subdirectories-of-a-single-73923688bece

upstream petunia.api {
    server petunia.api:5000;
}
upstream petunia.frontend {
    server petunia.frontend:8080;
}

server {
    listen 80;

    auth_basic "Restricted";
    auth_basic_user_file /etc/nginx/.htpasswd;

    location /petunia/api {
        rewrite ^/petunia/api/(.*) /$1 break;
        proxy_pass http://petunia.api/;
    }
    location /petunia {
        proxy_pass http://petunia.frontend/;
    }
}
`;
		expect(actual).toBe(expected);
	});

	test('generateNginxDockerfile', () => {
		const project = new TypeScriptYohiraFullStackProject(undefined, {
			projectName: 'petunia',
		});
		const actual = project.generateNginxDockerfile();
		const expected = `FROM nginx:latest

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
`;
		expect(actual).toBe(expected);
	});

	test('generateNginxDockerfile httpBasicAuthentication', () => {
		const project = new TypeScriptYohiraFullStackProject(undefined, {
			projectName: 'petunia',
			httpBasicAuthentication: true,
		});
		const actual = project.generateNginxDockerfile();
		const expected = `FROM nginx:latest

ARG BASIC_AUTH_USERNAME
ARG BASIC_AUTH_PASSWORD

RUN apt-get update -y && apt-get install -y apache2-utils && rm -rf /var/lib/apt/lists/*

RUN htpasswd -b -c /etc/nginx/.htpasswd $BASIC_AUTH_USERNAME $BASIC_AUTH_PASSWORD

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
`;
		expect(actual).toBe(expected);
	});

	test('generateComposeYaml', () => {
		const project = new TypeScriptYohiraFullStackProject(undefined, {
			projectName: 'petunia',
		});
		const actual = project.generateComposeYaml();
		const expected = `# https://github.com/workfall/workfall-chatgpt-be/blob/aba89c916fcd516f3e8ee070475c4c5d1c0a32be/docker-compose.yml

version: "3.9"

networks:
  app-network:
    driver: bridge

services:
  petunia.api:
    # image: ghcr.io/ycanardeau/petunia.api:main
    platform: linux/amd64
    container_name: petunia.api
    restart: always
    environment:
      - MIKRO_ORM_HOST=\${MIKRO_ORM_HOST}
      - MIKRO_ORM_DB_NAME=petunia
      - MIKRO_ORM_DEBUG=\${MIKRO_ORM_DEBUG}
      - MIKRO_ORM_USER=\${MIKRO_ORM_USER}
      - MIKRO_ORM_PASSWORD=\${MIKRO_ORM_PASSWORD}
      - MIKRO_ORM_ALLOW_GLOBAL_CONTEXT=\${MIKRO_ORM_ALLOW_GLOBAL_CONTEXT}
    networks:
      - app-network
  petunia.frontend:
    # image: ghcr.io/ycanardeau/petunia.frontend:main
    platform: linux/amd64
    container_name: petunia.frontend # must match the name of the container in the nginx config
    restart: always
    depends_on:
      - petunia.api
    networks:
      - app-network

  gateway:
    build:
      context: nginx
    container_name: gateway
    ports:
      - "80:80"
    depends_on:
      - petunia.api
      - petunia.frontend
    networks:
      - app-network
`;
		expect(actual).toBe(expected);
	});

	test('generateComposeYaml httpBasicAuthentication', () => {
		const project = new TypeScriptYohiraFullStackProject(undefined, {
			projectName: 'petunia',
			httpBasicAuthentication: true,
		});
		const actual = project.generateComposeYaml();
		const expected = `# https://github.com/workfall/workfall-chatgpt-be/blob/aba89c916fcd516f3e8ee070475c4c5d1c0a32be/docker-compose.yml

version: "3.9"

networks:
  app-network:
    driver: bridge

services:
  petunia.api:
    # image: ghcr.io/ycanardeau/petunia.api:main
    platform: linux/amd64
    container_name: petunia.api
    restart: always
    environment:
      - MIKRO_ORM_HOST=\${MIKRO_ORM_HOST}
      - MIKRO_ORM_DB_NAME=petunia
      - MIKRO_ORM_DEBUG=\${MIKRO_ORM_DEBUG}
      - MIKRO_ORM_USER=\${MIKRO_ORM_USER}
      - MIKRO_ORM_PASSWORD=\${MIKRO_ORM_PASSWORD}
      - MIKRO_ORM_ALLOW_GLOBAL_CONTEXT=\${MIKRO_ORM_ALLOW_GLOBAL_CONTEXT}
    networks:
      - app-network
  petunia.frontend:
    # image: ghcr.io/ycanardeau/petunia.frontend:main
    platform: linux/amd64
    container_name: petunia.frontend # must match the name of the container in the nginx config
    restart: always
    depends_on:
      - petunia.api
    networks:
      - app-network

  gateway:
    build:
      context: nginx
      args:
        - BASIC_AUTH_USERNAME=\${BASIC_AUTH_USERNAME}
        - BASIC_AUTH_PASSWORD=\${BASIC_AUTH_PASSWORD}
    container_name: gateway
    ports:
      - "80:80"
    depends_on:
      - petunia.api
      - petunia.frontend
    networks:
      - app-network
`;
		expect(actual).toBe(expected);
	});

	test('generateEnvExample', () => {
		const project = new TypeScriptYohiraFullStackProject(undefined, {
			projectName: 'petunia',
		});
		const actual = project.generateEnvExample();
		const expected = `
`;
		expect(actual).toBe(expected);
	});

	test('generateEnvExample httpBasicAuthentication', () => {
		const project = new TypeScriptYohiraFullStackProject(undefined, {
			projectName: 'petunia',
			httpBasicAuthentication: true,
		});
		const actual = project.generateEnvExample();
		const expected = `BASIC_AUTH_USERNAME =
BASIC_AUTH_PASSWORD =
`;
		expect(actual).toBe(expected);
	});

	test('generateProjectFiles', () => {
		const project = new TypeScriptYohiraFullStackProject(undefined, {
			projectName: 'petunia',
		});
		const actual = Array.from(project.generateProjectFiles()).map(
			(projectFile) => projectFile.path,
		);
		const expected = [
			'packages/petunia.api/.editorconfig',
			'packages/petunia.api/.gitignore',
			'packages/petunia.api/package.json',
			'packages/petunia.api/tsconfig.json',
			'packages/petunia.api/tsconfig.orm.json',
			'packages/petunia.api/src/index.ts',
			'packages/petunia.api/.env.development.local.example',
			'packages/petunia.api/.env.production.local.example',
			'packages/petunia.api/.env.test.local.example',
			'packages/petunia.api/src/mikro-orm.config.ts',
			'packages/petunia.api/src/index.ts',
			'packages/petunia.api/src/models/dto/UserDto.ts',
			'packages/petunia.api/src/models/requests/UserGetRequest.ts',
			'packages/petunia.api/src/models/requests/UserLoginRequest.ts',
			'packages/petunia.api/src/models/requests/UserLogoutRequest.ts',
			'packages/petunia.api/src/models/requests/UserSignUpRequest.ts',
			'packages/petunia.api/src/models/responses/UserGetResponse.ts',
			'packages/petunia.api/src/models/responses/UserLoginResponse.ts',
			'packages/petunia.api/src/models/responses/UserLogoutResponse.ts',
			'packages/petunia.api/src/models/responses/UserSignUpResponse.ts',
			'packages/petunia.api/src/entities/User.ts',
			'packages/petunia.api/src/entities/Login.ts',
			'packages/petunia.api/src/errors/DataNotFoundError.ts',
			'packages/petunia.api/src/errors/UnauthorizedError.ts',
			'packages/petunia.api/src/mappers/UserMapper.ts',
			'packages/petunia.api/src/request-handlers/RequestHandler.ts',
			'packages/petunia.api/src/request-handlers/UserGetHandler.ts',
			'packages/petunia.api/src/request-handlers/UserLoginHandler.ts',
			'packages/petunia.api/src/request-handlers/UserLogoutHandler.ts',
			'packages/petunia.api/src/request-handlers/UserSignUpHandler.ts',
			'packages/petunia.api/src/requestHandlerDescriptors.ts',
			'packages/petunia.api/src/services/EmailService.ts',
			'packages/petunia.api/src/services/PasswordServiceFactory.ts',
			'packages/petunia.api/src/services/CurrentUserService.ts',
			'packages/petunia.frontend/.editorconfig',
			'packages/petunia.frontend/.gitignore',
			'packages/petunia.frontend/package.json',
			'packages/petunia.frontend/tsconfig.json',
			'packages/petunia.frontend/tsconfig.node.json',
			'packages/petunia.frontend/index.html',
			'packages/petunia.frontend/vite.config.ts',
			'packages/petunia.frontend/src/App.tsx',
			'packages/petunia.frontend/src/main.tsx',
			'packages/petunia.frontend/src/vite-env.d.ts',
			'packages/petunia.frontend/src/stores/PaginationStore.ts',
		];
		expect(actual).toEqual(expected);
	});

	test('generateProjectFiles buildAndDeployToServerViaSsh', () => {
		const project = new TypeScriptYohiraFullStackProject(undefined, {
			projectName: 'petunia',
			buildAndDeployToServerViaSsh: true,
		});
		const actual = Array.from(project.generateProjectFiles()).map(
			(projectFile) => projectFile.path,
		);
		const expected = [
			'packages/petunia.api/.editorconfig',
			'packages/petunia.api/.gitignore',
			'packages/petunia.api/package.json',
			'packages/petunia.api/tsconfig.json',
			'packages/petunia.api/tsconfig.orm.json',
			'packages/petunia.api/src/index.ts',
			'packages/petunia.api/.env.development.local.example',
			'packages/petunia.api/.env.production.local.example',
			'packages/petunia.api/.env.test.local.example',
			'packages/petunia.api/src/mikro-orm.config.ts',
			'packages/petunia.api/src/index.ts',
			'packages/petunia.api/src/models/dto/UserDto.ts',
			'packages/petunia.api/src/models/requests/UserGetRequest.ts',
			'packages/petunia.api/src/models/requests/UserLoginRequest.ts',
			'packages/petunia.api/src/models/requests/UserLogoutRequest.ts',
			'packages/petunia.api/src/models/requests/UserSignUpRequest.ts',
			'packages/petunia.api/src/models/responses/UserGetResponse.ts',
			'packages/petunia.api/src/models/responses/UserLoginResponse.ts',
			'packages/petunia.api/src/models/responses/UserLogoutResponse.ts',
			'packages/petunia.api/src/models/responses/UserSignUpResponse.ts',
			'packages/petunia.api/src/entities/User.ts',
			'packages/petunia.api/src/entities/Login.ts',
			'packages/petunia.api/src/errors/DataNotFoundError.ts',
			'packages/petunia.api/src/errors/UnauthorizedError.ts',
			'packages/petunia.api/src/mappers/UserMapper.ts',
			'packages/petunia.api/src/request-handlers/RequestHandler.ts',
			'packages/petunia.api/src/request-handlers/UserGetHandler.ts',
			'packages/petunia.api/src/request-handlers/UserLoginHandler.ts',
			'packages/petunia.api/src/request-handlers/UserLogoutHandler.ts',
			'packages/petunia.api/src/request-handlers/UserSignUpHandler.ts',
			'packages/petunia.api/src/requestHandlerDescriptors.ts',
			'packages/petunia.api/src/services/EmailService.ts',
			'packages/petunia.api/src/services/PasswordServiceFactory.ts',
			'packages/petunia.api/src/services/CurrentUserService.ts',
			'packages/petunia.frontend/.editorconfig',
			'packages/petunia.frontend/.gitignore',
			'packages/petunia.frontend/package.json',
			'packages/petunia.frontend/tsconfig.json',
			'packages/petunia.frontend/tsconfig.node.json',
			'packages/petunia.frontend/index.html',
			'packages/petunia.frontend/vite.config.ts',
			'packages/petunia.frontend/src/App.tsx',
			'packages/petunia.frontend/src/main.tsx',
			'packages/petunia.frontend/src/vite-env.d.ts',
			'packages/petunia.frontend/src/stores/PaginationStore.ts',
			'nginx/nginx.conf',
			'nginx/Dockerfile',
			'compose.yaml',
			'.github/workflows/main.yml',
			'.env.example',
		];
		expect(actual).toEqual(expected);
	});
});
