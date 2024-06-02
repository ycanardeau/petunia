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
`;
		expect(actual).toBe(expected);
	});

	test('generateNginxNginxConf letsEncrypt', () => {
		const project = new TypeScriptYohiraFullStackProject(undefined, {
			projectName: 'petunia',
			letsEncrypt: {
				domain: 'example.org',
				email: 'username@example.org',
			},
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
    server_name example.org;
    server_tokens off;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name example.org;
    server_tokens off;

    ssl_certificate /etc/letsencrypt/live/example.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.org/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location /petunia/api {
        rewrite ^/petunia/api/(.*) /$1 break;
        proxy_pass http://petunia.api/;
        proxy_set_header    Host                $http_host;
        proxy_set_header    X-Real-IP           $remote_addr;
        proxy_set_header    X-Forwarded-For     $proxy_add_x_forwarded_for;
    }
    location /petunia {
        proxy_pass http://petunia.frontend/;
        proxy_set_header    Host                $http_host;
        proxy_set_header    X-Real-IP           $remote_addr;
        proxy_set_header    X-Forwarded-For     $proxy_add_x_forwarded_for;
    }
}
`;
		expect(actual).toBe(expected);
	});

	test('generateNginxNginxConf letsEncrypt httpBasicAuthentication', () => {
		const project = new TypeScriptYohiraFullStackProject(undefined, {
			projectName: 'petunia',
			letsEncrypt: {
				domain: 'example.org',
				email: 'username@example.org',
			},
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
    server_name example.org;
    server_tokens off;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name example.org;
    server_tokens off;

    ssl_certificate /etc/letsencrypt/live/example.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.org/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    auth_basic "Restricted";
    auth_basic_user_file /etc/nginx/.htpasswd;

    location /petunia/api {
        rewrite ^/petunia/api/(.*) /$1 break;
        proxy_pass http://petunia.api/;
        proxy_set_header    Host                $http_host;
        proxy_set_header    X-Real-IP           $remote_addr;
        proxy_set_header    X-Forwarded-For     $proxy_add_x_forwarded_for;
    }
    location /petunia {
        proxy_pass http://petunia.frontend/;
        proxy_set_header    Host                $http_host;
        proxy_set_header    X-Real-IP           $remote_addr;
        proxy_set_header    X-Forwarded-For     $proxy_add_x_forwarded_for;
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
    restart: unless-stopped
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

	test('generateComposeYaml setUpLetsEncrypt', () => {
		const project = new TypeScriptYohiraFullStackProject(undefined, {
			projectName: 'petunia',
			letsEncrypt: {
				domain: 'example.org',
				email: '',
			},
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
    restart: unless-stopped
    volumes:
      - ./data/certbot/conf:/etc/letsencrypt
      - ./data/certbot/www:/var/www/certbot
    ports:
      - "80:80"
      - "443:443"
    command: '/bin/sh -c ''while :; do sleep 6h & wait $\${!}; nginx -s reload; done & nginx -g "daemon off;"'''
    depends_on:
      - petunia.api
      - petunia.frontend
    networks:
      - app-network

  certbot:
    image: certbot/certbot
    restart: unless-stopped
    volumes:
      - ./data/certbot/conf:/etc/letsencrypt
      - ./data/certbot/www:/var/www/certbot
    entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $\${!}; done;'"
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
    restart: unless-stopped
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

	test('generateInitLetsEncryptSh', () => {
		const letsEncrypt: NonNullable<
			TypeScriptYohiraFullStackProject['options']['letsEncrypt']
		> = {
			domain: 'example.org',
			email: 'username@example.org',
		};
		const project = new TypeScriptYohiraFullStackProject(undefined, {
			projectName: 'petunia',
			letsEncrypt: letsEncrypt,
		});
		const actual = project.generateInitLetsEncryptSh(letsEncrypt);
		const expected = `#!/bin/bash

# https://raw.githubusercontent.com/wmnnd/nginx-certbot/master/init-letsencrypt.sh

if ! [ -x "$(command -v docker compose)" ]; then
  echo 'Error: docker compose is not installed.' >&2
  exit 1
fi

domains=(example.org www.example.org)
rsa_key_size=4096
data_path="./data/certbot"
email="username@example.org" # Adding a valid address is strongly recommended
staging=0 # Set to 1 if you're testing your setup to avoid hitting request limits

if [ -d "$data_path" ]; then
  read -p "Existing data found for $domains. Continue and replace existing certificate? (y/N) " decision
  if [ "$decision" != "Y" ] && [ "$decision" != "y" ]; then
    exit
  fi
fi


if [ ! -e "$data_path/conf/options-ssl-nginx.conf" ] || [ ! -e "$data_path/conf/ssl-dhparams.pem" ]; then
  echo "### Downloading recommended TLS parameters ..."
  mkdir -p "$data_path/conf"
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf > "$data_path/conf/options-ssl-nginx.conf"
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > "$data_path/conf/ssl-dhparams.pem"
  echo
fi

echo "### Creating dummy certificate for $domains ..."
path="/etc/letsencrypt/live/$domains"
mkdir -p "$data_path/conf/live/$domains"
docker compose run --rm --entrypoint "\\
  openssl req -x509 -nodes -newkey rsa:$rsa_key_size -days 1\\
    -keyout '$path/privkey.pem' \\
    -out '$path/fullchain.pem' \\
    -subj '/CN=localhost'" certbot
echo


echo "### Starting nginx ..."
docker compose up --force-recreate -d gateway
echo

echo "### Deleting dummy certificate for $domains ..."
docker compose run --rm --entrypoint "\\
  rm -Rf /etc/letsencrypt/live/$domains && \\
  rm -Rf /etc/letsencrypt/archive/$domains && \\
  rm -Rf /etc/letsencrypt/renewal/$domains.conf" certbot
echo


echo "### Requesting Let's Encrypt certificate for $domains ..."
#Join $domains to -d args
domain_args=""
for domain in "\${domains[@]}"; do
  domain_args="$domain_args -d $domain"
done

# Select appropriate email arg
case "$email" in
  "") email_arg="--register-unsafely-without-email" ;;
  *) email_arg="--email $email" ;;
esac

# Enable staging mode if needed
if [ $staging != "0" ]; then staging_arg="--staging"; fi

docker compose run --rm --entrypoint "\\
  certbot certonly --webroot -w /var/www/certbot \\
    $staging_arg \\
    $email_arg \\
    $domain_args \\
    --rsa-key-size $rsa_key_size \\
    --agree-tos \\
    --force-renewal" certbot
echo

echo "### Reloading nginx ..."
docker compose exec gateway nginx -s reload
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
			'packages/petunia.api/src/endpoints/Endpoint.ts',
			'packages/petunia.api/src/endpoints/UserGetEndpoint.ts',
			'packages/petunia.api/src/endpoints/UserLoginEndpoint.ts',
			'packages/petunia.api/src/endpoints/UserLogoutEndpoint.ts',
			'packages/petunia.api/src/endpoints/UserSignUpEndpoint.ts',
			'packages/petunia.api/src/endpoints.ts',
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
			'packages/petunia.api/src/endpoints/Endpoint.ts',
			'packages/petunia.api/src/endpoints/UserGetEndpoint.ts',
			'packages/petunia.api/src/endpoints/UserLoginEndpoint.ts',
			'packages/petunia.api/src/endpoints/UserLogoutEndpoint.ts',
			'packages/petunia.api/src/endpoints/UserSignUpEndpoint.ts',
			'packages/petunia.api/src/endpoints.ts',
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
