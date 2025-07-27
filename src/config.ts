import { cosmiconfigSync } from "cosmiconfig";
import fs from "fs-extra";
import path from "path";
import os from "os";
import YAML from "yaml";
import { GlobalConfig, ServiceConfig } from "./types";

export class ConfigManager {
	private configDir: string;
	private configFile: string;
	private explorer;

	constructor() {
		this.configDir = path.join(os.homedir(), ".shido");
		this.configFile = path.join(this.configDir, "config.yaml");
		this.explorer = cosmiconfigSync("shido");
		this.ensureConfigDir();
	}

	private ensureConfigDir(): void {
		if (!fs.existsSync(this.configDir)) {
			fs.mkdirSync(this.configDir, { recursive: true });
		}
	}

	private getDefaultConfig(): GlobalConfig {
		return {
			defaultService: "claude",
			services: {
				claude: { enabled: true },
				gemini: { enabled: false },
				copilot: { enabled: false },
				cursor: { enabled: false },
			},
			globalPrompts: [],
			templates: {},
		};
	}

	async getConfig(): Promise<GlobalConfig> {
		try {
			if (fs.existsSync(this.configFile)) {
				const content = await fs.readFile(this.configFile, "utf8");
				return YAML.parse(content) || this.getDefaultConfig();
			}
			return this.getDefaultConfig();
		} catch (error) {
			console.warn("Error reading config, using defaults:", error);
			return this.getDefaultConfig();
		}
	}

	async saveConfig(config: GlobalConfig): Promise<void> {
		const yamlContent = YAML.stringify(config);
		await fs.writeFile(this.configFile, yamlContent, "utf8");
	}

	async setConfigValue(key: string, value: any): Promise<void> {
		const config = await this.getConfig();
		const keys = key.split(".");
		let current: any = config;

		for (let i = 0; i < keys.length - 1; i++) {
			if (!(keys[i] in current)) {
				current[keys[i]] = {};
			}
			current = current[keys[i]];
		}

		current[keys[keys.length - 1]] = value;
		await this.saveConfig(config);
	}

	async getConfigValue(key?: string): Promise<any> {
		const config = await this.getConfig();

		if (!key) {
			return config;
		}

		const keys = key.split(".");
		let current: any = config;

		for (const k of keys) {
			if (current && typeof current === "object" && k in current) {
				current = current[k];
			} else {
				return undefined;
			}
		}

		return current;
	}

	getGlobalPromptsDir(): string {
		return path.join(this.configDir, "prompts");
	}

	getTemplatesDir(): string {
		return path.join(this.configDir, "templates");
	}
}
