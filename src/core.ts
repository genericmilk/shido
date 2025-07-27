import { ConfigManager } from "./config";
import { PromptManager } from "./prompts";
import { ProjectManager } from "./projects";
import { ServiceIntegration } from "./services";
import { PromptIntegration } from "./integration";
import {
	AddPromptOptions,
	ListPromptsOptions,
	UsePromptOptions,
	PromptTemplate,
} from "./types";
import chalk from "chalk";
import inquirer from "inquirer";

export class ShidoCore {
	private configManager: ConfigManager;
	private promptManager: PromptManager;
	private projectManager: ProjectManager;
	private serviceIntegration: ServiceIntegration;
	private promptIntegration: PromptIntegration;

	constructor() {
		this.configManager = new ConfigManager();
		this.promptManager = new PromptManager(this.configManager);
		this.projectManager = new ProjectManager(this.configManager);
		this.serviceIntegration = new ServiceIntegration(this.configManager);
		this.promptIntegration = new PromptIntegration(
			this.configManager,
			this.promptManager,
			this.projectManager
		);
	}

	async addGlobalPrompt(
		name: string,
		options: AddPromptOptions
	): Promise<void> {
		await this.promptManager.addGlobalPrompt(name, options);
	}

	async addProjectPrompt(
		name: string,
		options: AddPromptOptions
	): Promise<void> {
		await this.projectManager.addProjectPrompt(name, options);
	}

	async listPrompts(options: ListPromptsOptions = {}): Promise<string> {
		const globalPrompts = await this.promptManager.getGlobalPrompts();
		const projectPrompts = await this.projectManager.getProjectPrompts();

		let prompts: PromptTemplate[] = [];

		if (options.global) {
			prompts = globalPrompts;
		} else if (options.project) {
			prompts = projectPrompts;
		} else {
			prompts = [...globalPrompts, ...projectPrompts];
		}

		if (options.tag) {
			prompts = this.promptManager.filterPromptsByTag(prompts, options.tag);
		}

		if (prompts.length === 0) {
			return chalk.yellow("No prompts found.");
		}

		let output = "";

		if (!options.project) {
			const globalFiltered = options.tag
				? this.promptManager.filterPromptsByTag(globalPrompts, options.tag)
				: globalPrompts;

			if (globalFiltered.length > 0) {
				output += chalk.bold.blue("Global Prompts:\n");
				globalFiltered.forEach((prompt) => {
					output += `  ${chalk.green("●")} ${prompt.name}`;
					if (prompt.tags.length > 0) {
						output += ` ${chalk.gray("(" + prompt.tags.join(", ") + ")")}`;
					}
					output += "\n";
				});
				output += "\n";
			}
		}

		if (!options.global) {
			const projectFiltered = options.tag
				? this.promptManager.filterPromptsByTag(projectPrompts, options.tag)
				: projectPrompts;

			if (projectFiltered.length > 0) {
				output += chalk.bold.yellow("Project Prompts:\n");
				projectFiltered.forEach((prompt) => {
					output += `  ${chalk.green("●")} ${prompt.name}`;
					if (prompt.tags.length > 0) {
						output += ` ${chalk.gray("(" + prompt.tags.join(", ") + ")")}`;
					}
					output += "\n";
				});
			}
		}

		return output.trim();
	}

	async usePrompt(name: string, options: UsePromptOptions = {}): Promise<void> {
		// First try to find in project prompts, then global
		let prompt = (await this.projectManager.getProjectPrompts()).find(
			(p) => p.name === name
		);
		if (!prompt) {
			prompt = await this.promptManager.getPromptByName(name);
		}

		if (!prompt) {
			throw new Error(`Prompt '${name}' not found`);
		}

		let content = prompt.content;

		// Process variables if provided
		if (options.variables) {
			try {
				const variables = JSON.parse(options.variables);
				content = this.promptManager.processPromptVariables(content, variables);
			} catch (error) {
				throw new Error("Invalid JSON format for variables");
			}
		}

		// Copy to clipboard (simplified - in real implementation, use a clipboard library)
		await this.copyToClipboard(content);

		// If service is specified, integrate with that service
		if (options.service) {
			await this.serviceIntegration.sendToService(options.service, content);
		}
	}

	private async copyToClipboard(text: string): Promise<void> {
		// This would use a proper clipboard library in production
		// For now, we'll just output the content
		console.log(chalk.gray("Prompt content:"));
		console.log(chalk.white(text));
	}

	async editPrompt(name: string): Promise<void> {
		// First try to find in project prompts, then global
		let prompt = (await this.projectManager.getProjectPrompts()).find(
			(p) => p.name === name
		);
		let isGlobal = false;

		if (!prompt) {
			prompt = await this.promptManager.getPromptByName(name);
			isGlobal = true;
		}

		if (!prompt) {
			throw new Error(`Prompt '${name}' not found`);
		}

		const answers = await inquirer.prompt([
			{
				type: "editor",
				name: "content",
				message: "Edit prompt content:",
				default: prompt.content,
			},
			{
				type: "input",
				name: "tags",
				message: "Tags (comma-separated):",
				default: prompt.tags.join(", "),
			},
		]);

		const updatedPrompt = {
			...prompt,
			content: answers.content,
			tags: answers.tags
				.split(",")
				.map((tag: string) => tag.trim())
				.filter(Boolean),
			updatedAt: new Date(),
		};

		if (isGlobal) {
			await this.promptManager.updateGlobalPrompt(name, updatedPrompt);
		} else {
			// Update project prompt (implementation needed)
			throw new Error("Project prompt editing not yet implemented");
		}
	}

	async removePrompt(name: string): Promise<void> {
		// Try to remove from project first, then global
		const projectPrompts = await this.projectManager.getProjectPrompts();
		const isInProject = projectPrompts.some((p) => p.name === name);

		if (isInProject) {
			// Remove from project (implementation needed)
			throw new Error("Project prompt removal not yet implemented");
		} else {
			const removed = await this.promptManager.removeGlobalPrompt(name);
			if (!removed) {
				throw new Error(`Prompt '${name}' not found`);
			}
		}
	}

	async initProject(options: { template?: string } = {}): Promise<void> {
		await this.projectManager.initProject(options);
	}

	async setConfig(key: string, value: string): Promise<void> {
		await this.configManager.setConfigValue(key, value);
	}

	async getConfig(key?: string): Promise<string> {
		const result = await this.configManager.getConfigValue(key);
		if (typeof result === "object") {
			return JSON.stringify(result, null, 2);
		}
		return String(result);
	}

	async setupServices(options: { service?: string } = {}): Promise<void> {
		await this.serviceIntegration.setupServices(options.service);
	}

	async syncWithServices(options: { service?: string } = {}): Promise<void> {
		await this.serviceIntegration.syncWithServices(options.service);
	}

	async generatePromptFiles(): Promise<void> {
		await this.promptIntegration.generatePromptFiles();
		console.log(chalk.green("✓ Generated prompt files for all AI tools"));
	}

	async getCombinedPrompts(): Promise<PromptTemplate[]> {
		return await this.promptIntegration.getCombinedPrompts();
	}

	async setupSymlinks(symlinkPaths: Record<string, string>): Promise<void> {
		await this.projectManager.setupSymlinks(symlinkPaths);
		await this.promptIntegration.generatePromptFiles();
		console.log(chalk.green("✓ Set up symlinks and regenerated prompt files"));
	}

	async getCommonAIToolPaths(): Promise<Record<string, string>> {
		return this.promptIntegration.getCommonAIToolPaths();
	}

	async enableAutoRegeneration(): Promise<void> {
		await this.promptIntegration.setupAutoRegeneration();
	}
}
