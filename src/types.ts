export interface PromptTemplate {
	name: string;
	content: string;
	tags: string[];
	variables?: Record<string, string>;
	service?: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface ProjectConfig {
	name: string;
	prompts: PromptTemplate[];
	rules: ProjectRule[];
	settings: ProjectSettings;
	integrations?: ProjectIntegrations;
}

export interface ProjectIntegrations {
	symlinkPaths?: {
		copilot?: string;
		cursor?: string;
		claude?: string;
		gemini?: string;
	};
	autoGenerate?: boolean;
	combineGlobal?: boolean;
}

export interface ProjectRule {
	name: string;
	condition: string;
	action: string;
	params?: Record<string, any>;
}

export interface ProjectSettings {
	defaultService?: string;
	autoSync?: boolean;
	templatePath?: string;
	excludePatterns?: string[];
	projectDir?: string;
	globalPromptsFirst?: boolean;
}

export interface GlobalConfig {
	defaultService: string;
	services: ServiceConfig;
	globalPrompts: PromptTemplate[];
	templates: Record<string, ProjectConfig>;
}

export interface ServiceConfig {
	claude?: {
		enabled: boolean;
		apiKey?: string;
		model?: string;
	};
	gemini?: {
		enabled: boolean;
		apiKey?: string;
		model?: string;
	};
	copilot?: {
		enabled: boolean;
	};
	cursor?: {
		enabled: boolean;
	};
}

export interface AddPromptOptions {
	prompt?: string;
	file?: string;
	tags?: string;
}

export interface ListPromptsOptions {
	global?: boolean;
	project?: boolean;
	tag?: string;
}

export interface UsePromptOptions {
	service?: string;
	variables?: string;
}
