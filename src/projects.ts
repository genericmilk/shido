import fs from "fs-extra";
import path from "path";
import YAML from "yaml";
import chalk from "chalk";
import { ConfigManager } from "./config";
import {
	ProjectConfig,
	PromptTemplate,
	AddPromptOptions,
	ProjectRule,
} from "./types";

export class ProjectManager {
	private configManager: ConfigManager;
	private projectConfigFile = "config.yaml"; // Now inside .shido folder
	private projectDir = ".shido";

	constructor(configManager: ConfigManager) {
		this.configManager = configManager;
	}

	async initProject(options: { template?: string } = {}): Promise<void> {
		const cwd = process.cwd();
		const shidoDir = path.join(cwd, this.projectDir);
		const configPath = path.join(shidoDir, this.projectConfigFile);

		if (fs.existsSync(configPath)) {
			throw new Error("Shido is already initialized in this project");
		}

		// Create .shido directory
		await fs.ensureDir(shidoDir);

		let projectConfig: ProjectConfig;

		if (options.template) {
			const globalConfig = await this.configManager.getConfig();
			const template = globalConfig.templates[options.template];
			if (!template) {
				throw new Error(`Template '${options.template}' not found`);
			}
			projectConfig = { ...template };
		} else {
			projectConfig = this.getDefaultProjectConfig();
		}

		// Set project directory in settings
		projectConfig.settings.projectDir = this.projectDir;

		const yamlContent = YAML.stringify(projectConfig);
		await fs.writeFile(configPath, yamlContent, "utf8");

		// Create subdirectories for different AI tools
		await fs.ensureDir(path.join(shidoDir, "copilot"));
		await fs.ensureDir(path.join(shidoDir, "cursor"));
		await fs.ensureDir(path.join(shidoDir, "claude"));
		await fs.ensureDir(path.join(shidoDir, "gemini"));

		console.log(
			chalk.green(`✓ Created project structure in ${this.projectDir}/`)
		);
	}

	private getDefaultProjectConfig(): ProjectConfig {
		return {
			name: path.basename(process.cwd()),
			prompts: [],
			rules: [],
			settings: {
				autoSync: false,
				excludePatterns: ["node_modules", ".git", "dist", "build"],
				projectDir: this.projectDir,
				globalPromptsFirst: true,
			},
			integrations: {
				autoGenerate: true,
				combineGlobal: true,
				symlinkPaths: {},
			},
		};
	}

	async getProjectConfig(): Promise<ProjectConfig | null> {
		const cwd = process.cwd();
		const configPath = path.join(cwd, this.projectDir, this.projectConfigFile);

		if (!fs.existsSync(configPath)) {
			return null;
		}

		try {
			const content = await fs.readFile(configPath, "utf8");
			return YAML.parse(content);
		} catch (error) {
			throw new Error(`Error reading project config: ${error}`);
		}
	}

	async saveProjectConfig(config: ProjectConfig): Promise<void> {
		const cwd = process.cwd();
		const shidoDir = path.join(cwd, this.projectDir);
		const configPath = path.join(shidoDir, this.projectConfigFile);

		await fs.ensureDir(shidoDir);
		const yamlContent = YAML.stringify(config);
		await fs.writeFile(configPath, yamlContent, "utf8");
	}

	async addProjectPrompt(
		name: string,
		options: AddPromptOptions
	): Promise<void> {
		const config = await this.getProjectConfig();
		if (!config) {
			throw new Error('No Shido project found. Run "shido init" first.');
		}

		let content = "";
		if (options.file) {
			content = await fs.readFile(options.file, "utf8");
		} else if (options.prompt) {
			content = options.prompt;
		} else {
			throw new Error("Either --prompt or --file must be provided");
		}

		const tags = options.tags
			? options.tags.split(",").map((t) => t.trim())
			: [];

		const prompt: PromptTemplate = {
			name,
			content,
			tags,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		// Remove existing prompt with same name
		config.prompts = config.prompts.filter((p) => p.name !== name);
		config.prompts.push(prompt);

		await this.saveProjectConfig(config);
	}

	async getProjectPrompts(): Promise<PromptTemplate[]> {
		const config = await this.getProjectConfig();
		return config?.prompts || [];
	}

	async addProjectRule(rule: ProjectRule): Promise<void> {
		const config = await this.getProjectConfig();
		if (!config) {
			throw new Error('No Shido project found. Run "shido init" first.');
		}

		config.rules.push(rule);
		await this.saveProjectConfig(config);
	}

	async getProjectRules(): Promise<ProjectRule[]> {
		const config = await this.getProjectConfig();
		return config?.rules || [];
	}

	isInProject(): boolean {
		const cwd = process.cwd();
		const configPath = path.join(cwd, this.projectDir, this.projectConfigFile);
		return fs.existsSync(configPath);
	}

	getProjectDirectory(): string {
		return path.join(process.cwd(), this.projectDir);
	}

	async setupSymlinks(symlinkPaths: Record<string, string>): Promise<void> {
		const config = await this.getProjectConfig();
		if (!config) {
			throw new Error('No Shido project found. Run "shido init" first.');
		}

		config.integrations = config.integrations || {};
		config.integrations.symlinkPaths = {
			...config.integrations.symlinkPaths,
			...symlinkPaths,
		};

		await this.saveProjectConfig(config);
	}
}
