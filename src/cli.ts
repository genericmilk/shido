#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import inquirer from "inquirer";
import { ShidoCore } from "./core";
import { PromptTemplate } from "./types";

const program = new Command();
const shido = new ShidoCore();

program
	.name("shido")
	.description("System-wide AI prompts manager")
	.version("1.0.0");

// Global prompt commands
program
	.command("add <name>")
	.description("Add a global AI prompt")
	.option("-p, --prompt <text>", "Prompt text")
	.option("-f, --file <path>", "Load prompt from file")
	.option("-t, --tags <tags>", "Comma-separated tags")
	.action(async (name, options) => {
		try {
			await shido.addGlobalPrompt(name, options);
			console.log(chalk.green(`✓ Added global prompt: ${name}`));
		} catch (error) {
			console.error(
				chalk.red(
					`Error: ${error instanceof Error ? error.message : String(error)}`
				)
			);
			process.exit(1);
		}
	});

program
	.command("list")
	.description("List all available prompts")
	.option("-g, --global", "Show only global prompts")
	.option("-p, --project", "Show only project prompts")
	.option("-t, --tag <tag>", "Filter by tag")
	.action(async (options) => {
		try {
			const prompts = await shido.listPrompts(options);
			console.log(prompts);
		} catch (error) {
			console.error(
				chalk.red(
					`Error: ${error instanceof Error ? error.message : String(error)}`
				)
			);
			process.exit(1);
		}
	});

program
	.command("use <name>")
	.description("Use a prompt (copies to clipboard)")
	.option(
		"-s, --service <service>",
		"Target AI service (claude, gemini, copilot, cursor)"
	)
	.option("-v, --variables <vars>", "Variable substitutions as JSON")
	.action(async (name, options) => {
		try {
			await shido.usePrompt(name, options);
			console.log(chalk.green(`✓ Prompt "${name}" copied to clipboard`));
		} catch (error) {
			console.error(
				chalk.red(
					`Error: ${error instanceof Error ? error.message : String(error)}`
				)
			);
			process.exit(1);
		}
	});

program
	.command("edit <name>")
	.description("Edit an existing prompt")
	.action(async (name) => {
		try {
			await shido.editPrompt(name);
			console.log(chalk.green(`✓ Edited prompt: ${name}`));
		} catch (error) {
			console.error(
				chalk.red(
					`Error: ${error instanceof Error ? error.message : String(error)}`
				)
			);
			process.exit(1);
		}
	});

program
	.command("remove <name>")
	.description("Remove a prompt")
	.action(async (name) => {
		try {
			await shido.removePrompt(name);
			console.log(chalk.green(`✓ Removed prompt: ${name}`));
		} catch (error) {
			console.error(
				chalk.red(
					`Error: ${error instanceof Error ? error.message : String(error)}`
				)
			);
			process.exit(1);
		}
	});

// Project-specific commands
program
	.command("init")
	.description("Initialize Shido in current project")
	.option("-t, --template <name>", "Use a template")
	.action(async (options) => {
		try {
			await shido.initProject(options);
			console.log(chalk.green("✓ Initialized Shido in current project"));
		} catch (error) {
			console.error(
				chalk.red(
					`Error: ${error instanceof Error ? error.message : String(error)}`
				)
			);
			process.exit(1);
		}
	});

program
	.command("project")
	.description("Project-specific prompt management")
	.addCommand(
		new Command("add")
			.argument("<name>", "Prompt name")
			.option("-p, --prompt <text>", "Prompt text")
			.option("-f, --file <path>", "Load prompt from file")
			.option("-t, --tags <tags>", "Comma-separated tags")
			.description("Add a project-specific prompt")
			.action(async (name, options) => {
				try {
					await shido.addProjectPrompt(name, options);
					console.log(chalk.green(`✓ Added project prompt: ${name}`));
				} catch (error) {
					console.error(
						chalk.red(
							`Error: ${error instanceof Error ? error.message : String(error)}`
						)
					);
					process.exit(1);
				}
			})
	);

// Configuration commands
program
	.command("config")
	.description("Manage Shido configuration")
	.addCommand(
		new Command("set")
			.argument("<key>", "Configuration key")
			.argument("<value>", "Configuration value")
			.description("Set configuration value")
			.action(async (key, value) => {
				try {
					await shido.setConfig(key, value);
					console.log(chalk.green(`✓ Set ${key} = ${value}`));
				} catch (error) {
					console.error(
						chalk.red(
							`Error: ${error instanceof Error ? error.message : String(error)}`
						)
					);
					process.exit(1);
				}
			})
	)
	.addCommand(
		new Command("get")
			.argument("[key]", "Configuration key (optional)")
			.description("Get configuration value(s)")
			.action(async (key) => {
				try {
					const result = await shido.getConfig(key);
					console.log(result);
				} catch (error) {
					console.error(
						chalk.red(
							`Error: ${error instanceof Error ? error.message : String(error)}`
						)
					);
					process.exit(1);
				}
			})
	);

// Service integration commands
program
	.command("setup")
	.description("Setup AI service integrations")
	.option("-s, --service <service>", "Specific service to setup")
	.action(async (options) => {
		try {
			await shido.setupServices(options);
			console.log(chalk.green("✓ Service setup completed"));
		} catch (error) {
			console.error(
				chalk.red(
					`Error: ${error instanceof Error ? error.message : String(error)}`
				)
			);
			process.exit(1);
		}
	});

program
	.command("sync")
	.description("Sync prompts with AI services")
	.option("-s, --service <service>", "Sync with specific service")
	.action(async (options) => {
		try {
			await shido.syncWithServices(options);
			console.log(chalk.green("✓ Sync completed"));
		} catch (error) {
			console.error(
				chalk.red(
					`Error: ${error instanceof Error ? error.message : String(error)}`
				)
			);
			process.exit(1);
		}
	});

// New integration commands
program
	.command("generate")
	.description("Generate prompt files for all AI tools")
	.action(async () => {
		try {
			await shido.generatePromptFiles();
		} catch (error) {
			console.error(
				chalk.red(
					`Error: ${error instanceof Error ? error.message : String(error)}`
				)
			);
			process.exit(1);
		}
	});

program
	.command("link")
	.description("Setup symlinks to AI tool directories")
	.option("--copilot <path>", "Path to GitHub Copilot prompts directory")
	.option("--cursor <path>", "Path to Cursor prompts directory")
	.option("--claude <path>", "Path to Claude prompts directory")
	.option("--gemini <path>", "Path to Gemini prompts directory")
	.option("--auto", "Use common AI tool paths automatically")
	.action(async (options) => {
		try {
			let symlinkPaths: Record<string, string> = {};

			if (options.auto) {
				symlinkPaths = await shido.getCommonAIToolPaths();
				console.log(chalk.blue("Using common AI tool paths:"));
				Object.entries(symlinkPaths).forEach(([tool, path]) => {
					console.log(`  ${tool}: ${path}`);
				});
			} else {
				if (options.copilot) symlinkPaths.copilot = options.copilot;
				if (options.cursor) symlinkPaths.cursor = options.cursor;
				if (options.claude) symlinkPaths.claude = options.claude;
				if (options.gemini) symlinkPaths.gemini = options.gemini;
			}

			if (Object.keys(symlinkPaths).length === 0) {
				console.log(
					chalk.yellow(
						"No symlink paths specified. Use --auto or specify paths manually."
					)
				);
				return;
			}

			await shido.setupSymlinks(symlinkPaths);
		} catch (error) {
			console.error(
				chalk.red(
					`Error: ${error instanceof Error ? error.message : String(error)}`
				)
			);
			process.exit(1);
		}
	});

program
	.command("combined")
	.description("Show combined prompts (global + project)")
	.option(
		"-f, --format <format>",
		"Output format: text, json, markdown",
		"text"
	)
	.action(async (options) => {
		try {
			const prompts = await shido.getCombinedPrompts();

			if (options.format === "json") {
				console.log(JSON.stringify(prompts, null, 2));
			} else if (options.format === "markdown") {
				prompts.forEach((prompt: PromptTemplate) => {
					console.log(`## ${prompt.name}`);
					if (prompt.tags.length > 0) {
						console.log(`Tags: ${prompt.tags.join(", ")}`);
					}
					console.log("");
					console.log(prompt.content);
					console.log("\n---\n");
				});
			} else {
				console.log(chalk.bold.blue("Combined Prompts (Global + Project):\n"));
				prompts.forEach((prompt: PromptTemplate) => {
					console.log(`${chalk.green("●")} ${chalk.bold(prompt.name)}`);
					if (prompt.tags.length > 0) {
						console.log(`  ${chalk.gray("Tags:")} ${prompt.tags.join(", ")}`);
					}
					console.log(
						`  ${chalk.gray("Content:")} ${prompt.content.substring(0, 100)}${
							prompt.content.length > 100 ? "..." : ""
						}`
					);
					console.log("");
				});
			}
		} catch (error) {
			console.error(
				chalk.red(
					`Error: ${error instanceof Error ? error.message : String(error)}`
				)
			);
			process.exit(1);
		}
	});

// Parse arguments
program.parse();
