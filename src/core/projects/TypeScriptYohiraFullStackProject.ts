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
}

export class TypeScriptYohiraFullStackProject extends TypeScriptProject<TypeScriptYohiraFullStackProjectOptions> {
	private readonly typeScriptYohiraBackendProject: TypeScriptYohiraBackendProject;
	private readonly typeScriptViteReactProject: TypeScriptViteReactProject;

	constructor(
		editorConfig: EditorConfig,
		options: TypeScriptYohiraFullStackProjectOptions,
	) {
		super(editorConfig, options);

		this.typeScriptYohiraBackendProject =
			new TypeScriptYohiraBackendProject(editorConfig, {
				projectName: `${this.options.projectName}.backend`,
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
		return `# https://medium.com/@r.thilina/deploying-multiple-containerized-angular-applications-in-different-subdirectories-of-a-single-73923688bece

upstream ${this.options.projectName}.backend {
    server ${this.options.projectName}.backend:5000;
}
upstream ${this.options.projectName}.frontend {
    server ${this.options.projectName}.frontend:8080;
}

server {
    listen 80;

    location /${this.options.projectName}/api {
        rewrite ^/${this.options.projectName}/api/(.*) /$1 break;
        proxy_pass http://${this.options.projectName}.backend/;
    }
    location /${this.options.projectName} {
        proxy_pass http://${this.options.projectName}.frontend/;
    }
}
`;
	}

	generateComposeYaml(): string {
		return `# https://github.com/workfall/workfall-chatgpt-be/blob/aba89c916fcd516f3e8ee070475c4c5d1c0a32be/docker-compose.yml

version: "3.9"

networks:
  app-network:
    driver: bridge

services:
  ${this.options.projectName}.backend:
    # image: ghcr.io/ycanardeau/${this.options.projectName}.backend:main
    platform: linux/amd64
    container_name: ${this.options.projectName}.backend
    restart: always
    environment:
      - MIKRO_ORM_HOST=\${MIKRO_ORM_HOST}
      - MIKRO_ORM_DB_NAME=${this.options.projectName}
      - MIKRO_ORM_DEBUG=\${MIKRO_ORM_DEBUG}
      - MIKRO_ORM_USER=\${MIKRO_ORM_USER}
      - MIKRO_ORM_PASSWORD=\${MIKRO_ORM_PASSWORD}
      - MIKRO_ORM_ALLOW_GLOBAL_CONTEXT=\${MIKRO_ORM_ALLOW_GLOBAL_CONTEXT}
    networks:
      - app-network
  ${this.options.projectName}.frontend:
    # image: ghcr.io/ycanardeau/${this.options.projectName}.frontend:main
    platform: linux/amd64
    container_name: ${this.options.projectName}.frontend # must match the name of the container in the nginx config
    restart: always
    depends_on:
      - ${this.options.projectName}.backend
    networks:
      - app-network

  gateway:
    image: nginx:latest
    container_name: gateway
    ports:
      - "80:80"
    depends_on:
      - ${this.options.projectName}.backend
      - ${this.options.projectName}.frontend
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/conf.d/default.conf
    networks:
      - app-network
`;
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
          - image: ${this.options.projectName}.backend
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
				path: 'compose.yaml',
				text: this.generateComposeYaml(),
			};

			yield {
				path: '.github/workflows/main.yml',
				text: this.generateGitHubWorkflowsMainYml(),
			};
		}
	}
}
