# 🔧 ShidoAI CLI Tools Integration Fix

## ✅ Issue Fixed

The `shido setup` command was incorrectly treating **Claude Code CLI** and **Gemini CLI** as API services requiring API keys, when they are actually standalone CLI tools that handle their own authentication.

## 🛠️ Changes Made

### 1. Updated Service Setup Logic (`src/services.ts`)

**Before**: Asked for API keys and model configurations

```typescript
// Old approach - asking for API keys
{
  type: "input",
  name: "apiKey",
  message: "Claude API key (optional):",
  // ...
}
```

**After**: Detects if CLI tools are installed and configures accordingly

```typescript
// New approach - check if CLI tool is installed
try {
	const { execSync } = require("child_process");
	execSync("claude --version", { stdio: "ignore" });
	// Tool is installed, configure it
} catch (error) {
	// Tool not found, show installation instructions
}
```

### 2. Updated TypeScript Types (`src/types.ts`)

**Removed** API key and model fields from ServiceConfig for Claude and Gemini:

```typescript
// Before
claude?: {
  enabled: boolean;
  apiKey?: string;    // ❌ Removed
  model?: string;     // ❌ Removed
};

// After
claude?: {
  enabled: boolean;   // ✅ Only needed field
};
```

### 3. Enhanced Setup Experience

- **Claude Code CLI**:
  - Detects if `@anthropic-ai/claude-code` is installed
  - Shows installation command: `npm install -g @anthropic-ai/claude-code`
  - Notes that authentication is handled by the CLI itself
- **Gemini CLI**:
  - Detects if `@google/gemini-cli` is installed
  - Shows multiple installation options: npm or Homebrew
  - Notes that authentication is handled by the CLI itself

### 4. Updated Documentation

**README.md**:

- Added optional AI CLI tools installation section
- Updated AI Service Integration descriptions
- Clarified that these are official CLI tools from Google and Anthropic

**Examples**:

- Updated complete-workflow.md with CLI installation steps
- Added context about tool detection

## 🎯 How It Works Now

### Setup Process

1. User runs `shido setup`
2. Selects "Claude Code CLI" or "Gemini CLI"
3. Shido checks if the CLI tool is installed:
   - ✅ **If installed**: Configures integration, notes authentication is handled by CLI
   - ❌ **If not installed**: Shows installation command, disables integration

### CLI Tool Integration

- **Claude Code CLI** (`claude` command): Generates `.txt` files in `.shido/claude/`
- **Gemini CLI** (`gemini` command): Generates `prompts.txt` and JSON files in `.shido/gemini/`
- Both tools handle their own authentication (OAuth, API keys, etc.)
- Shido just generates prompt files in formats these tools can use

## 🚀 User Experience Improvement

**Before**: Confusing setup asking for API keys that weren't needed

**After**: Clear setup that:

1. Detects what's actually installed
2. Provides installation commands for missing tools
3. Explains that authentication is handled by each CLI tool
4. Focuses on prompt file generation and organization

## ✅ Verification

- ✅ Build successful: `npm run build`
- ✅ All tests passing: 15 passed, 1 skipped
- ✅ TypeScript compilation clean
- ✅ CLI tools properly detected
- ✅ Documentation updated

## 🎉 Result

ShidoAI now correctly integrates with the official CLI tools:

- [Claude Code CLI](https://github.com/anthropics/claude-code) by Anthropic
- [Gemini CLI](https://github.com/google-gemini/gemini-cli) by Google

Users get a seamless experience where Shido generates optimized prompt files and the CLI tools handle their own authentication and execution.
