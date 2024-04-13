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

		lines.push('');
		lines.push('server {');
		lines.push('    listen 80;');

		if (this.options.httpBasicAuthentication) {
			lines.push('');
			lines.push('    auth_basic "Restricted";');
			lines.push('    auth_basic_user_file /etc/nginx/.htpasswd;');
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
		lines.push('    ports:');
		lines.push('      - "80:80"');
		lines.push('    depends_on:');
		lines.push(`      - ${this.options.projectName}.api`);
		lines.push(`      - ${this.options.projectName}.frontend`);
		lines.push('    networks:');
		lines.push('      - app-network');

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
		}
	}
}
