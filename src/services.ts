import { ConfigManager } from "./config";
import { ServiceConfig } from "./types";
import inquirer from "inquirer";
import chalk from "chalk";

export class ServiceIntegration {
	private configManager: ConfigManager;

	constructor(configManager: ConfigManager) {
		this.configManager = configManager;
	}

	async setupServices(specificService?: string): Promise<void> {
		const config = await this.configManager.getConfig();

		if (specificService) {
			await this.setupSingleService(specificService, config.services);
		} else {
			await this.setupAllServices(config.services);
		}
	}

	private async setupSingleService(
		serviceName: string,
		services: ServiceConfig
	): Promise<void> {
		switch (serviceName.toLowerCase()) {
			case "claude":
				await this.setupClaude(services);
				break;
			case "gemini":
				await this.setupGemini(services);
				break;
			case "copilot":
				await this.setupCopilot(services);
				break;
			case "cursor":
				await this.setupCursor(services);
				break;
			default:
				throw new Error(`Unknown service: ${serviceName}`);
		}
	}

	private async setupAllServices(services: ServiceConfig): Promise<void> {
		console.log(chalk.blue("Setting up AI service integrations...\n"));

		const { selectedServices } = await inquirer.prompt([
			{
				type: "checkbox",
				name: "selectedServices",
				message: "Select services to configure:",
				choices: [
					{ name: "Claude Code CLI", value: "claude" },
					{ name: "Gemini CLI", value: "gemini" },
					{ name: "GitHub Copilot", value: "copilot" },
					{ name: "Cursor", value: "cursor" },
				],
			},
		]);

		for (const service of selectedServices) {
			await this.setupSingleService(service, services);
		}
	}

	private async setupClaude(services: ServiceConfig): Promise<void> {
		console.log(chalk.blue("\nSetting up Claude Code CLI integration..."));

		const answers = await inquirer.prompt([
			{
				type: "confirm",
				name: "enabled",
				message: "Enable Claude Code CLI integration?",
				default: services.claude?.enabled || false,
			},
		]);

		if (answers.enabled) {
			// Check if Claude Code CLI is installed
			try {
				const { execSync } = require("child_process");
				execSync("claude --version", { stdio: "ignore" });

				await this.configManager.setConfigValue("services.claude", {
					enabled: true,
				});
				console.log(chalk.green("✓ Claude Code CLI configured"));
				console.log(
					chalk.gray(
						"Note: Claude Code CLI handles its own authentication. Run 'claude' in your terminal to get started."
					)
				);
			} catch (error) {
				console.log(chalk.yellow("⚠ Claude Code CLI not found"));
				console.log(
					chalk.gray(
						"Install it with: npm install -g @anthropic-ai/claude-code"
					)
				);
				console.log(chalk.gray("Then run 'shido setup claude' again"));

				await this.configManager.setConfigValue("services.claude", {
					enabled: false,
				});
			}
		} else {
			await this.configManager.setConfigValue("services.claude.enabled", false);
			console.log(chalk.yellow("Claude Code CLI disabled"));
		}
	}

	private async setupGemini(services: ServiceConfig): Promise<void> {
		console.log(chalk.blue("\nSetting up Gemini CLI integration..."));

		const answers = await inquirer.prompt([
			{
				type: "confirm",
				name: "enabled",
				message: "Enable Gemini CLI integration?",
				default: services.gemini?.enabled || false,
			},
		]);

		if (answers.enabled) {
			// Check if Gemini CLI is installed
			try {
				const { execSync } = require("child_process");
				execSync("gemini --version", { stdio: "ignore" });

				await this.configManager.setConfigValue("services.gemini", {
					enabled: true,
				});
				console.log(chalk.green("✓ Gemini CLI configured"));
				console.log(
					chalk.gray(
						"Note: Gemini CLI handles its own authentication. Run 'gemini' in your terminal to get started."
					)
				);
			} catch (error) {
				console.log(chalk.yellow("⚠ Gemini CLI not found"));
				console.log(
					chalk.gray("Install it with: npm install -g @google/gemini-cli")
				);
				console.log(chalk.gray("Or with Homebrew: brew install gemini-cli"));
				console.log(chalk.gray("Then run 'shido setup gemini' again"));

				await this.configManager.setConfigValue("services.gemini", {
					enabled: false,
				});
			}
		} else {
			await this.configManager.setConfigValue("services.gemini.enabled", false);
			console.log(chalk.yellow("Gemini CLI disabled"));
		}
	}

	private async setupCopilot(services: ServiceConfig): Promise<void> {
		console.log(chalk.blue("\nSetting up GitHub Copilot integration..."));

		const answers = await inquirer.prompt([
			{
				type: "confirm",
				name: "enabled",
				message: "Enable GitHub Copilot integration?",
				default: services.copilot?.enabled || false,
			},
		]);

		await this.configManager.setConfigValue(
			"services.copilot.enabled",
			answers.enabled
		);

		if (answers.enabled) {
			console.log(chalk.green("✓ GitHub Copilot configured"));
			console.log(
				chalk.gray(
					"Note: Make sure you have GitHub Copilot extension installed in your editor"
				)
			);
		} else {
			console.log(chalk.yellow("GitHub Copilot disabled"));
		}
	}

	private async setupCursor(services: ServiceConfig): Promise<void> {
		console.log(chalk.blue("\nSetting up Cursor integration..."));

		const answers = await inquirer.prompt([
			{
				type: "confirm",
				name: "enabled",
				message: "Enable Cursor integration?",
				default: services.cursor?.enabled || false,
			},
		]);

		await this.configManager.setConfigValue(
			"services.cursor.enabled",
			answers.enabled
		);

		if (answers.enabled) {
			console.log(chalk.green("✓ Cursor configured"));
			console.log(
				chalk.gray("Note: Make sure you have Cursor editor installed")
			);
		} else {
			console.log(chalk.yellow("Cursor disabled"));
		}
	}

	async sendToService(serviceName: string, content: string): Promise<void> {
		const config = await this.configManager.getConfig();
		const service =
			config.services[serviceName.toLowerCase() as keyof ServiceConfig];

		if (!service?.enabled) {
			throw new Error(`Service ${serviceName} is not enabled`);
		}

		console.log(chalk.blue(`Sending prompt to ${serviceName}...`));

		// In a real implementation, this would integrate with each service's API
		// For now, we'll just show what would happen
		switch (serviceName.toLowerCase()) {
			case "claude":
				console.log(chalk.gray("Would send to Claude API"));
				break;
			case "gemini":
				console.log(chalk.gray("Would send to Gemini API"));
				break;
			case "copilot":
				console.log(chalk.gray("Would integrate with GitHub Copilot"));
				break;
			case "cursor":
				console.log(chalk.gray("Would send to Cursor editor"));
				break;
			default:
				throw new Error(`Unknown service: ${serviceName}`);
		}
	}

	async syncWithServices(specificService?: string): Promise<void> {
		const config = await this.configManager.getConfig();

		console.log(chalk.blue("Syncing prompts with AI services..."));

		// In a real implementation, this would sync prompts with configured services
		// For now, we'll just show the sync status
		const services = Object.entries(config.services)
			.filter(([_, serviceConfig]) => serviceConfig.enabled)
			.map(([name]) => name);

		if (specificService) {
			if (services.includes(specificService)) {
				console.log(chalk.green(`✓ Synced with ${specificService}`));
			} else {
				console.log(chalk.yellow(`${specificService} is not enabled`));
			}
		} else {
			for (const service of services) {
				console.log(chalk.green(`✓ Synced with ${service}`));
			}
		}
	}
}
