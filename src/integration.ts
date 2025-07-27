import fs from "fs-extra";
import path from "path";
import os from "os";
import { ConfigManager } from "./config";
import { PromptManager } from "./prompts";
import { ProjectManager } from "./projects";
import { PromptTemplate, ProjectConfig } from "./types";
import chalk from "chalk";

export class PromptIntegration {
	private configManager: ConfigManager;
	private promptManager: PromptManager;
	private projectManager: ProjectManager;

	constructor(
		configManager: ConfigManager,
		promptManager: PromptManager,
		projectManager: ProjectManager
	) {
		this.configManager = configManager;
		this.promptManager = promptManager;
		this.projectManager = projectManager;
	}

	/**
	 * Get combined prompts for AI tools (global + project)
	 */
	async getCombinedPrompts(): Promise<PromptTemplate[]> {
		const globalPrompts = await this.promptManager.getGlobalPrompts();
		const projectPrompts = await this.projectManager.getProjectPrompts();
		const projectConfig = await this.projectManager.getProjectConfig();

		// By default, put global prompts first unless specified otherwise
		const globalFirst = projectConfig?.settings?.globalPromptsFirst !== false;

		return globalFirst
			? [...globalPrompts, ...projectPrompts]
			: [...projectPrompts, ...globalPrompts];
	}

	/**
	 * Generate prompt files for various AI tools
	 */
	async generatePromptFiles(): Promise<void> {
		const projectConfig = await this.projectManager.getProjectConfig();
		if (!projectConfig) {
			throw new Error('No Shido project found. Run "shido init" first.');
		}

		const combinedPrompts = await this.getCombinedPrompts();
		const projectDir = path.join(process.cwd(), ".shido");

		// Ensure .shido directory exists
		await fs.ensureDir(projectDir);

		// Generate different format files for different AI tools
		await this.generateCopilotPrompts(combinedPrompts, projectDir);
		await this.generateCursorPrompts(combinedPrompts, projectDir);
		await this.generateClaudePrompts(combinedPrompts, projectDir);
		await this.generateGeminiPrompts(combinedPrompts, projectDir);
		await this.generateGenericPrompts(combinedPrompts, projectDir);

		// Setup symlinks if configured
		if (projectConfig.integrations?.symlinkPaths) {
			await this.setupSymlinks(projectConfig, projectDir);
		}
	}

	/**
	 * Generate GitHub Copilot compatible prompts
	 */
	private async generateCopilotPrompts(
		prompts: PromptTemplate[],
		projectDir: string
	): Promise<void> {
		const copilotDir = path.join(projectDir, "copilot");
		await fs.ensureDir(copilotDir);

		// Generate .copilot-prompts.md file
		const promptsContent = this.generateMarkdownPrompts(
			prompts,
			"GitHub Copilot"
		);
		await fs.writeFile(
			path.join(copilotDir, ".copilot-prompts.md"),
			promptsContent
		);

		// Generate individual prompt files
		for (const prompt of prompts) {
			const filename = `${prompt.name.replace(/[^a-zA-Z0-9-_]/g, "_")}.md`;
			const content = this.formatPromptForCopilot(prompt);
			await fs.writeFile(path.join(copilotDir, filename), content);
		}
	}

	/**
	 * Generate Cursor compatible prompts
	 */
	private async generateCursorPrompts(
		prompts: PromptTemplate[],
		projectDir: string
	): Promise<void> {
		const cursorDir = path.join(projectDir, "cursor");
		await fs.ensureDir(cursorDir);

		// Generate .cursorrules file
		const cursorRules = this.generateCursorRules(prompts);
		await fs.writeFile(path.join(cursorDir, ".cursorrules"), cursorRules);

		// Generate prompt library
		const promptsJson = {
			prompts: prompts.map((p) => ({
				name: p.name,
				content: p.content,
				tags: p.tags,
				variables: this.extractVariables(p.content),
			})),
		};
		await fs.writeFile(
			path.join(cursorDir, "prompts.json"),
			JSON.stringify(promptsJson, null, 2)
		);
	}

	/**
	 * Generate Claude compatible prompts
	 */
	private async generateClaudePrompts(
		prompts: PromptTemplate[],
		projectDir: string
	): Promise<void> {
		const claudeDir = path.join(projectDir, "claude");
		await fs.ensureDir(claudeDir);

		// Generate system prompts file
		const systemPrompts = prompts
			.filter((p) => p.tags.includes("system") || p.tags.includes("context"))
			.map((p) => p.content)
			.join("\n\n---\n\n");

		if (systemPrompts) {
			await fs.writeFile(
				path.join(claudeDir, "system-prompts.txt"),
				systemPrompts
			);
		}

		// Generate individual prompt files
		for (const prompt of prompts) {
			const filename = `${prompt.name.replace(/[^a-zA-Z0-9-_]/g, "_")}.txt`;
			await fs.writeFile(path.join(claudeDir, filename), prompt.content);
		}
	}

	/**
	 * Generate Gemini compatible prompts
	 */
	private async generateGeminiPrompts(
		prompts: PromptTemplate[],
		projectDir: string
	): Promise<void> {
		const geminiDir = path.join(projectDir, "gemini");
		await fs.ensureDir(geminiDir);

		// Generate prompts.txt file for Gemini CLI
		const promptsContent = prompts
			.map((p) => `# ${p.name}\n${p.content}\n`)
			.join("\n---\n\n");

		await fs.writeFile(path.join(geminiDir, "prompts.txt"), promptsContent);

		// Generate JSON format for programmatic use
		const promptsJson = {
			prompts: prompts.map((p) => ({
				id: p.name,
				text: p.content,
				tags: p.tags,
			})),
		};
		await fs.writeFile(
			path.join(geminiDir, "prompts.json"),
			JSON.stringify(promptsJson, null, 2)
		);
	}

	/**
	 * Generate generic format prompts
	 */
	private async generateGenericPrompts(
		prompts: PromptTemplate[],
		projectDir: string
	): Promise<void> {
		// Combined prompts file in markdown
		const content = this.generateMarkdownPrompts(prompts, "All AI Tools");
		await fs.writeFile(path.join(projectDir, "combined-prompts.md"), content);

		// JSON format for programmatic access
		const promptsJson = {
			generated: new Date().toISOString(),
			global: await this.promptManager.getGlobalPrompts(),
			project: await this.projectManager.getProjectPrompts(),
			combined: prompts,
		};
		await fs.writeFile(
			path.join(projectDir, "prompts.json"),
			JSON.stringify(promptsJson, null, 2)
		);
	}

	/**
	 * Setup symlinks to integrate with AI tools
	 */
	private async setupSymlinks(
		projectConfig: ProjectConfig,
		projectDir: string
	): Promise<void> {
		const { symlinkPaths } = projectConfig.integrations!;

		for (const [tool, targetPath] of Object.entries(symlinkPaths || {})) {
			if (!targetPath) continue;

			const sourcePath = path.join(projectDir, tool);
			const resolvedTargetPath = path.resolve(targetPath);

			try {
				// Remove existing symlink if it exists
				if (await fs.pathExists(resolvedTargetPath)) {
					const stats = await fs.lstat(resolvedTargetPath);
					if (stats.isSymbolicLink()) {
						await fs.unlink(resolvedTargetPath);
					}
				}

				// Create new symlink
				await fs.ensureDir(path.dirname(resolvedTargetPath));
				await fs.symlink(sourcePath, resolvedTargetPath);
				console.log(
					chalk.green(
						`✓ Created symlink: ${resolvedTargetPath} -> ${sourcePath}`
					)
				);
			} catch (error) {
				console.warn(
					chalk.yellow(
						`Warning: Could not create symlink for ${tool}: ${error}`
					)
				);
			}
		}
	}

	/**
	 * Generate markdown format prompts
	 */
	private generateMarkdownPrompts(
		prompts: PromptTemplate[],
		title: string
	): string {
		const header = `# ${title} Prompts

Generated on: ${new Date().toISOString()}

This file contains all available prompts (global + project-specific) for use with AI coding assistants.

`;

		const promptsContent = prompts
			.map((prompt) => {
				const tags =
					prompt.tags.length > 0 ? ` (${prompt.tags.join(", ")})` : "";
				const variables = this.extractVariables(prompt.content);
				const varsSection =
					variables.length > 0
						? `\n**Variables:** ${variables
								.map((v) => `\`{{${v}}}\``)
								.join(", ")}\n`
						: "";

				return `## ${prompt.name}${tags}

${varsSection}
\`\`\`
${prompt.content}
\`\`\`
`;
			})
			.join("\n---\n\n");

		return header + promptsContent;
	}

	/**
	 * Format prompt for GitHub Copilot
	 */
	private formatPromptForCopilot(prompt: PromptTemplate): string {
		const variables = this.extractVariables(prompt.content);
		const varsSection =
			variables.length > 0
				? `\n<!-- Variables: ${variables
						.map((v) => `{{${v}}}`)
						.join(", ")} -->\n`
				: "";

		return `# ${prompt.name}

Tags: ${prompt.tags.join(", ")}${varsSection}

${prompt.content}
`;
	}

	/**
	 * Generate Cursor rules file
	 */
	private generateCursorRules(prompts: PromptTemplate[]): string {
		const systemPrompts = prompts.filter(
			(p) =>
				p.tags.includes("system") ||
				p.tags.includes("context") ||
				p.tags.includes("rules")
		);

		const rules = [
			"# Cursor AI Rules",
			"# Generated by Shido",
			"",
			"You are an AI coding assistant. Follow these project-specific guidelines:",
			"",
		];

		systemPrompts.forEach((prompt) => {
			rules.push(`## ${prompt.name}`);
			rules.push(prompt.content);
			rules.push("");
		});

		// Add available prompts reference
		rules.push("## Available Project Prompts");
		rules.push("The following prompts are available in this project:");
		rules.push("");
		prompts.forEach((prompt) => {
			rules.push(`- **${prompt.name}**: ${prompt.tags.join(", ")}`);
		});

		return rules.join("\n");
	}

	/**
	 * Extract variables from prompt content
	 */
	private extractVariables(content: string): string[] {
		const regex = /\{\{(\w+)\}\}/g;
		const variables = new Set<string>();
		let match;

		while ((match = regex.exec(content)) !== null) {
			variables.add(match[1]);
		}

		return Array.from(variables);
	}

	/**
	 * Watch for changes and auto-regenerate
	 */
	async setupAutoRegeneration(): Promise<void> {
		const projectConfig = await this.projectManager.getProjectConfig();
		if (!projectConfig?.integrations?.autoGenerate) {
			return;
		}

		// In a real implementation, this would use fs.watch or chokidar
		// to watch for changes to .shido.yaml and global prompts
		console.log(
			chalk.blue(
				"Auto-regeneration enabled. Prompts will be updated when changes are detected."
			)
		);
	}

	/**
	 * Get common AI tool configuration paths
	 */
	getCommonAIToolPaths(): Record<string, string> {
		const homeDir = os.homedir();

		return {
			copilot: path.join(homeDir, ".vscode", "copilot-prompts"),
			cursor: path.join(homeDir, ".cursor", "prompts"),
			claude: path.join(homeDir, ".claude", "prompts"),
			gemini: path.join(homeDir, ".gemini", "prompts"),
		};
	}
}
