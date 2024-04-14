import { Database } from '@/core/projects/Database';
import { OrmFramework } from '@/core/projects/OrmFramework';
import { EditorConfig, ProjectFile } from '@/core/projects/Project';
import {
	TypeScriptProject,
	TypeScriptProjectOptions,
} from '@/core/projects/TypeScriptProject';
import {
	IconLibrary,
	OutputType,
	TypeScriptViteReactProject,
	UIFramework,
} from '@/core/projects/TypeScriptViteReactProject';
import { TypeScriptYohiraBackendProject } from '@/core/projects/TypeScriptYohiraBackendProject';

interface TypeScriptYohiraFullStackProjectOptions
	extends TypeScriptProjectOptions {
	orm?: OrmFramework;
	database?: Database;
	useYohira?: boolean;
	useBcrypt?: boolean;
	generateDockerfile?: boolean;
	ui?: UIFramework;
	icon?: IconLibrary;
	deployToSubdirectory?: boolean;
	buildAndDeployToServerViaSsh?: boolean;
	letsEncrypt?: {
		domain: string;
		email: string;
	};
	httpBasicAuthentication?: boolean;
}

export class TypeScriptYohiraFullStackProject extends TypeScriptProject<TypeScriptYohiraFullStackProjectOptions> {
	private readonly typeScriptYohiraBackendProject: TypeScriptYohiraBackendProject;
	private readonly typeScriptViteReactProject: TypeScriptViteReactProject;

	constructor(
		editorConfig: EditorConfig | undefined,
		options: TypeScriptYohiraFullStackProjectOptions,
	) {
		super(editorConfig, options);

		this.typeScriptYohiraBackendProject =
			new TypeScriptYohiraBackendProject(editorConfig, {
				projectName: `${this.options.projectName}.api`,
				packageManager: this.options.packageManager,
				test: this.options.test,
				orm: OrmFramework.MikroOrm /* TODO */,
				enablePrettier: this.options.enablePrettier,
				sortImports: this.options.sortImports,
				enableESLint: this.options.enableESLint,
				configurePathAliases: this.options.configurePathAliases,
				useAjv: true,
				useLodash: true,
				useQs: true,
				useYohira: true,
				useBcrypt: true,
				generateDockerfile: this.options.generateDockerfile,
			});

		this.typeScriptViteReactProject = new TypeScriptViteReactProject(
			editorConfig,
			{
				reactMajorVersion:
					this.options.ui === UIFramework.Mantine ? 18 : 17,
				outputType: OutputType.ReactApplication,
				projectName: `${this.options.projectName}.frontend`,
				packageManager: this.options.packageManager,
				test: this.options.test,
				ui: this.options.ui,
				icon: this.options.icon,
				enablePrettier: this.options.enablePrettier,
				sortImports: this.options.sortImports,
				enableESLint: this.options.enableESLint,
				configurePathAliases: this.options.configurePathAliases,
				useAjv: true,
				useLodash: true,
				useMobX: true,
				useQs: true,
				useReactRouter: true,
				useSwc: false,
				useRouteSphere: true,
				generateStores: true,
				configureCustomProxyRules: true,
				generateDockerfile: this.options.generateDockerfile,
				publicBasePath: this.options.deployToSubdirectory
					? this.options.projectName
					: undefined,
			},
		);
	}

	generateNginxNginxConf(): string {
		const lines: string[] = [];

		lines.push(
			'# https://medium.com/@r.thilina/deploying-multiple-containerized-angular-applications-in-different-subdirectories-of-a-single-73923688bece',
		);

		lines.push('');
		lines.push(`upstream ${this.options.projectName}.api {`);
		lines.push(`    server ${this.options.projectName}.api:5000;`);
		lines.push('}');
		lines.push(`upstream ${this.options.projectName}.frontend {`);
		lines.push(`    server ${this.options.projectName}.frontend:8080;`);
		lines.push('}');

		if (this.options.letsEncrypt) {
			lines.push('');
			lines.push('server {');
			lines.push('    listen 80;');
			lines.push(`    server_name ${this.options.letsEncrypt.domain};`);
			lines.push('    server_tokens off;');
			lines.push('');
			lines.push('    location /.well-known/acme-challenge/ {');
			lines.push('        root /var/www/certbot;');
			lines.push('    }');
			lines.push('');
			lines.push('    location / {');
			lines.push('        return 301 https://$host$request_uri;');
			lines.push('    }');
			lines.push('}');

			lines.push('');
			lines.push('server {');
			lines.push('    listen 443 ssl;');
			lines.push(`    server_name ${this.options.letsEncrypt.domain};`);
			lines.push('    server_tokens off;');
			lines.push('');
			lines.push(
				`    ssl_certificate /etc/letsencrypt/live/${this.options.letsEncrypt.domain}/fullchain.pem;`,
			);
			lines.push(
				`    ssl_certificate_key /etc/letsencrypt/live/${this.options.letsEncrypt.domain}/privkey.pem;`,
			);
			lines.push(`    include /etc/letsencrypt/options-ssl-nginx.conf;`);
			lines.push(`    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;`);

			if (this.options.letsEncrypt) {
				if (this.options.httpBasicAuthentication) {
					lines.push('');
					lines.push('    auth_basic "Restricted";');
					lines.push(
						'    auth_basic_user_file /etc/nginx/.htpasswd;',
					);
				}
			}

			lines.push('');
			lines.push(`    location /${this.options.projectName}/api {`);
			lines.push(
				`        rewrite ^/${this.options.projectName}/api/(.*) /$1 break;`,
			);
			lines.push(
				`        proxy_pass http://${this.options.projectName}.api/;`,
			);
			lines.push('    }');
			lines.push(`    location /${this.options.projectName} {`);
			lines.push(
				`        proxy_pass http://${this.options.projectName}.frontend/;`,
			);
			lines.push('    }');
			lines.push('}');
		}

		return this.joinLines(lines);
	}

	generateNginxDockerfile(): string {
		const lines: string[] = [];

		lines.push('FROM nginx:latest');

		if (this.options.httpBasicAuthentication) {
			lines.push('');
			lines.push('ARG BASIC_AUTH_USERNAME');
			lines.push('ARG BASIC_AUTH_PASSWORD');
			lines.push('');
			lines.push(
				'RUN apt-get update -y && apt-get install -y apache2-utils && rm -rf /var/lib/apt/lists/*',
			);
			lines.push('');
			lines.push(
				'RUN htpasswd -b -c /etc/nginx/.htpasswd $BASIC_AUTH_USERNAME $BASIC_AUTH_PASSWORD',
			);
		}

		lines.push('');
		lines.push('COPY ./nginx.conf /etc/nginx/conf.d/default.conf');

		return this.joinLines(lines);
	}

	generateComposeYaml(): string {
		const lines: string[] = [];

		lines.push(
			'# https://github.com/workfall/workfall-chatgpt-be/blob/aba89c916fcd516f3e8ee070475c4c5d1c0a32be/docker-compose.yml',
		);
		lines.push('');
		lines.push('version: "3.9"');
		lines.push('');
		lines.push('networks:');
		lines.push('  app-network:');
		lines.push('    driver: bridge');
		lines.push('');
		lines.push('services:');
		lines.push(`  ${this.options.projectName}.api:`);
		lines.push(
			`    # image: ghcr.io/ycanardeau/${this.options.projectName}.api:main`,
		);
		lines.push('    platform: linux/amd64');
		lines.push(`    container_name: ${this.options.projectName}.api`);
		lines.push('    restart: always');
		lines.push('    environment:');
		lines.push(`      - MIKRO_ORM_HOST=\${MIKRO_ORM_HOST}`);
		lines.push(`      - MIKRO_ORM_DB_NAME=${this.options.projectName}`);
		lines.push(`      - MIKRO_ORM_DEBUG=\${MIKRO_ORM_DEBUG}`);
		lines.push(`      - MIKRO_ORM_USER=\${MIKRO_ORM_USER}`);
		lines.push(`      - MIKRO_ORM_PASSWORD=\${MIKRO_ORM_PASSWORD}`);
		lines.push(
			`      - MIKRO_ORM_ALLOW_GLOBAL_CONTEXT=\${MIKRO_ORM_ALLOW_GLOBAL_CONTEXT}`,
		);
		lines.push('    networks:');
		lines.push('      - app-network');
		lines.push(`  ${this.options.projectName}.frontend:`);
		lines.push(
			`    # image: ghcr.io/ycanardeau/${this.options.projectName}.frontend:main`,
		);
		lines.push('    platform: linux/amd64');
		lines.push(
			`    container_name: ${this.options.projectName}.frontend # must match the name of the container in the nginx config`,
		);
		lines.push('    restart: always');
		lines.push('    depends_on:');
		lines.push(`      - ${this.options.projectName}.api`);
		lines.push('    networks:');
		lines.push('      - app-network');
		lines.push('');
		lines.push('  gateway:');
		lines.push('    build:');
		lines.push('      context: nginx');

		if (this.options.httpBasicAuthentication) {
			lines.push('      args:');
			lines.push(`        - BASIC_AUTH_USERNAME=\${BASIC_AUTH_USERNAME}`);
			lines.push(`        - BASIC_AUTH_PASSWORD=\${BASIC_AUTH_PASSWORD}`);
		}

		lines.push('    container_name: gateway');
		lines.push('    restart: unless-stopped');

		if (this.options.letsEncrypt) {
			lines.push('    volumes:');
			lines.push('      - ./data/certbot/conf:/etc/letsencrypt');
			lines.push('      - ./data/certbot/www:/var/www/certbot');
		}

		lines.push('    ports:');
		lines.push('      - "80:80"');

		if (this.options.letsEncrypt) {
			lines.push('      - "443:443"');
			lines.push(
				`    command: '/bin/sh -c ''while :; do sleep 6h & wait $\${!}; nginx -s reload; done & nginx -g "daemon off;"'''`,
			);
		}

		lines.push('    depends_on:');
		lines.push(`      - ${this.options.projectName}.api`);
		lines.push(`      - ${this.options.projectName}.frontend`);
		lines.push('    networks:');
		lines.push('      - app-network');

		if (this.options.letsEncrypt) {
			lines.push('');
			lines.push('  certbot:');
			lines.push('    image: certbot/certbot');
			lines.push('    restart: unless-stopped');
			lines.push('    volumes:');
			lines.push('      - ./data/certbot/conf:/etc/letsencrypt');
			lines.push('      - ./data/certbot/www:/var/www/certbot');
			lines.push(
				`    entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $\${!}; done;'"`,
			);
		}

		return this.joinLines(lines);
	}

	generateGitHubWorkflowsMainYml(): string {
		return `name: ci

on:
  push:
    branches:
      - "main"

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: \${{ github.repository }}

jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        include:
          - image: ${this.options.projectName}.api
          - image: ${this.options.projectName}.frontend

    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          registry: \${{ env.REGISTRY }}
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata (tags, labels) for Docker
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: \${{ env.REGISTRY }}/\${{ env.IMAGE_NAME }}/\${{ matrix.image }}
          tags: |
            type=ref,event=branch
            type=semver,pattern={{version}}
            type=sha

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: ./packages/\${{ matrix.image }}
          push: true
          tags: \${{ steps.meta.outputs.tags }}
          labels: \${{ steps.meta.outputs.labels }}

  deploy:
    needs: build
    runs-on: ubuntu-latest

    steps:
      - name: Deploy to server via SSH
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: \${{ secrets.SERVER_HOST }}
          username: \${{ secrets.SERVER_USERNAME }}
          key: \${{ secrets.SERVER_KEY }}
          script: |
            cd ${this.options.projectName}
            \${{ secrets.SERVER_SCRIPT }}
            CI=true sudo docker compose down
            CI=true sudo docker compose build --no-cache
            CI=true sudo docker image prune -a -f
            CI=true sudo docker compose up -d --force-recreate
`;
	}

	generateEnvExample(): string {
		const lines: string[] = [];

		if (this.options.httpBasicAuthentication) {
			lines.push('BASIC_AUTH_USERNAME =');
			lines.push('BASIC_AUTH_PASSWORD =');
		}

		return this.joinLines(lines);
	}

	generateInitLetsEncryptSh({
		domain,
		email,
	}: {
		domain: string;
		email: string;
	}): string {
		return `#!/bin/bash

# https://raw.githubusercontent.com/wmnnd/nginx-certbot/master/init-letsencrypt.sh

if ! [ -x "$(command -v docker compose)" ]; then
  echo 'Error: docker compose is not installed.' >&2
  exit 1
fi

domains=(${[domain, `www.${domain}`].join(' ')})
rsa_key_size=4096
data_path="./data/certbot"
email="${email}" # Adding a valid address is strongly recommended
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
	}

	*generateProjectFiles(): Generator<ProjectFile> {
		for (const projectFile of this.typeScriptYohiraBackendProject.generateProjectFiles()) {
			yield {
				path: `packages/${this.typeScriptYohiraBackendProject.options.projectName}/${projectFile.path}`,
				text: projectFile.text,
			};
		}

		for (const projectFile of this.typeScriptViteReactProject.generateProjectFiles()) {
			yield {
				path: `packages/${this.typeScriptViteReactProject.options.projectName}/${projectFile.path}`,
				text: projectFile.text,
			};
		}

		if (this.options.buildAndDeployToServerViaSsh) {
			yield {
				path: 'nginx/nginx.conf',
				text: this.generateNginxNginxConf(),
			};

			yield {
				path: 'nginx/Dockerfile',
				text: this.generateNginxDockerfile(),
			};

			yield {
				path: 'compose.yaml',
				text: this.generateComposeYaml(),
			};

			yield {
				path: '.github/workflows/main.yml',
				text: this.generateGitHubWorkflowsMainYml(),
			};

			yield {
				path: '.env.example',
				text: this.generateEnvExample(),
			};

			if (this.options.letsEncrypt) {
				yield {
					path: 'init-letsencrypt.sh',
					text: this.generateInitLetsEncryptSh(
						this.options.letsEncrypt,
					),
				};
			}
		}
	}
}
