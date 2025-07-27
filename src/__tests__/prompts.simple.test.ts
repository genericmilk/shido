import { PromptManager } from "../prompts";
import { ConfigManager } from "../config";

// Simple unit tests without complex mocking
describe("PromptManager", () => {
	let promptManager: PromptManager;
	let configManager: ConfigManager;

	beforeEach(() => {
		configManager = new ConfigManager();
		promptManager = new PromptManager(configManager);
	});

	describe("processPromptVariables", () => {
		it("should replace variables in prompt content", () => {
			const content = "Hello {{name}}, welcome to {{app}}!";
			const variables = { name: "John", app: "Shido" };

			const result = promptManager.processPromptVariables(content, variables);

			expect(result).toBe("Hello John, welcome to Shido!");
		});

		it("should handle multiple occurrences of same variable", () => {
			const content = "{{greeting}} {{name}}, {{greeting}} again!";
			const variables = { greeting: "Hello", name: "World" };

			const result = promptManager.processPromptVariables(content, variables);

			expect(result).toBe("Hello World, Hello again!");
		});

		it("should return original content when no variables provided", () => {
			const content = "Hello {{name}}!";

			const result = promptManager.processPromptVariables(content);

			expect(result).toBe("Hello {{name}}!");
		});
	});

	describe("filterPromptsByTag", () => {
		const testPrompts = [
			{
				name: "prompt1",
				content: "Content 1",
				tags: ["react", "frontend"],
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				name: "prompt2",
				content: "Content 2",
				tags: ["nodejs", "backend"],
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				name: "prompt3",
				content: "Content 3",
				tags: ["react", "testing"],
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		];

		it("should filter prompts by tag", () => {
			const result = promptManager.filterPromptsByTag(testPrompts, "react");

			expect(result).toHaveLength(2);
			expect(result[0].name).toBe("prompt1");
			expect(result[1].name).toBe("prompt3");
		});

		it("should return empty array when no prompts match tag", () => {
			const result = promptManager.filterPromptsByTag(
				testPrompts,
				"nonexistent"
			);

			expect(result).toHaveLength(0);
		});

		it("should be case sensitive", () => {
			const result = promptManager.filterPromptsByTag(testPrompts, "React");

			expect(result).toHaveLength(0);
		});
	});
});
