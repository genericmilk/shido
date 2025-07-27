import fs from "fs-extra";
import path from "path";
import YAML from "yaml";
import { ConfigManager } from "./config";
import { PromptTemplate, AddPromptOptions, GlobalConfig } from "./types";

export class PromptManager {
	private configManager: ConfigManager;

	constructor(configManager: ConfigManager) {
		this.configManager = configManager;
	}

	async addGlobalPrompt(
		name: string,
		options: AddPromptOptions
	): Promise<void> {
		const config = await this.configManager.getConfig();

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
		config.globalPrompts = config.globalPrompts.filter((p) => p.name !== name);
		config.globalPrompts.push(prompt);

		await this.configManager.saveConfig(config);
	}

	async getGlobalPrompts(): Promise<PromptTemplate[]> {
		const config = await this.configManager.getConfig();
		return config.globalPrompts;
	}

	async getPromptByName(name: string): Promise<PromptTemplate | undefined> {
		const config = await this.configManager.getConfig();
		return config.globalPrompts.find((p) => p.name === name);
	}

	async removeGlobalPrompt(name: string): Promise<boolean> {
		const config = await this.configManager.getConfig();
		const initialLength = config.globalPrompts.length;
		config.globalPrompts = config.globalPrompts.filter((p) => p.name !== name);

		if (config.globalPrompts.length < initialLength) {
			await this.configManager.saveConfig(config);
			return true;
		}
		return false;
	}

	async updateGlobalPrompt(
		name: string,
		updates: Partial<PromptTemplate>
	): Promise<boolean> {
		const config = await this.configManager.getConfig();
		const promptIndex = config.globalPrompts.findIndex((p) => p.name === name);

		if (promptIndex === -1) {
			return false;
		}

		config.globalPrompts[promptIndex] = {
			...config.globalPrompts[promptIndex],
			...updates,
			updatedAt: new Date(),
		};

		await this.configManager.saveConfig(config);
		return true;
	}

	processPromptVariables(
		content: string,
		variables?: Record<string, string>
	): string {
		if (!variables) return content;

		let processed = content;
		for (const [key, value] of Object.entries(variables)) {
			const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g");
			processed = processed.replace(regex, value);
		}

		return processed;
	}

	filterPromptsByTag(prompts: PromptTemplate[], tag: string): PromptTemplate[] {
		return prompts.filter((prompt) => prompt.tags.includes(tag));
	}
}
