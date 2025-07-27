# Shido - System-wide AI Prompts Manager

<div align="center">
  <img src="badge.png" alt="Shido Logo" width="200" height="200">
  
  <p><strong>Unified AI prompt management for GitHub Copilot, Cursor, Claude, Gemini, and more</strong></p>

  [![npm version](https://badge.fury.io/js/shido.svg)](https://badge.fury.io/js/shido)
  [![Build Status](https://github.com/yourusername/shido/workflows/CI/badge.svg)](https://github.com/yourusername/shido/actions)
  [![CodeQL](https://github.com/yourusername/shido/workflows/CodeQL/badge.svg)](https://github.com/yourusername/shido/actions)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
  [![Downloads](https://img.shields.io/npm/dm/shido.svg)](https://www.npmjs.com/package/shido)
  [![GitHub stars](https://img.shields.io/github/stars/yourusername/shido.svg?style=social&label=Star)](https://github.com/yourusername/shido)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

  [Installation](#installation) •
  [Quick Start](#quick-start) •
  [Features](#features) •
  [Documentation](#documentation) •
  [Examples](#examples) •
  [Contributing](#contributing)
</div>

---

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Features](#features)
  - [System-wide Prompt Repository](#system-wide-prompt-repository)
  - [Project-specific Prompt Repository](#project-specific-prompt-repository)
  - [AI Service Integration](#ai-service-integration)
- [Commands](#commands)
  - [Global Prompts](#global-prompts)
  - [Project Management](#project-management)
  - [Configuration](#configuration)
  - [Service Integration](#service-integration)
- [Configuration](#configuration-1)
- [Project Configuration](#project-configuration)
- [AI Tool Integration](#ai-tool-integration)
- [Prompt Templates](#prompt-templates)
- [Examples](#examples-1)
- [Integration Examples](#integration-examples)
- [API](#api)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

---

---

Shido is a powerful npm global package that revolutionizes AI prompt management across all your coding tools. Whether you're using GitHub Copilot, Cursor, Claude Code, Gemini CLI, or any other AI assistant, Shido provides a unified system for managing, organizing, and automatically distributing your prompts.

## Why Shido?

🌍 **Universal Compatibility** - Works with any AI coding assistant  
📁 **Dual Repository System** - Global prompts + project-specific prompts  
🔄 **Automatic Synchronization** - Changes propagate to all AI tools instantly  
🎯 **Format Optimization** - Each tool gets prompts in its preferred format  
🔗 **Seamless Integration** - Symlinks make it transparent to your workflow  
👥 **Team Collaboration** - Easy to share and maintain across teams  

## Demo

<!-- ![Shido Demo](https://github.com/yourusername/shido/raw/main/demo.gif) -->

_Coming soon: Interactive demo showing Shido in action with multiple AI tools_

## Installation

```bash
npm install -g shido
```

## Quick Start

### 1. 🌍 **Global Setup**

```bash
# Install Shido globally
npm install -g shido

# Setup AI service integrations
shido setup
```

### 2. 📝 **Add Global Prompts**

```bash
# Add your first global prompt
shido add "code-review" --prompt "Please review this code for best practices, potential bugs, and improvements" --tags "review,quality"

# Add more prompts
shido add "debug" --prompt "Help me debug this issue: {{issue}}" --tags "debug,help"
```

### 3. 🏗️ **Initialize Project**

```bash
# Navigate to your project
cd your-project

# Initialize with template
shido init --template react

# Or initialize with default settings
shido init
```

### 4. 🚀 **Generate & Link**

```bash
# Generate optimized files for all AI tools
shido generate

# Setup automatic symlinks
shido link --auto

# Now all your AI tools have access to your prompts!
```

### 5. ✨ **Use Your Prompts**

```bash
# Use a prompt with variables
shido use code-review --variables '{"code":"function hello() { return \"world\"; }"}'

# View all available prompts
shido combined --format markdown
```

## Features

### System-wide Prompt Repository

- **Global prompts**: Stored in `~/.shido/config.yaml` and accessible from any directory
- **Automatic combination**: Global and project prompts are automatically combined for AI tools
- **Cross-platform**: Works on macOS, Linux, and Windows

### Project-specific Prompt Repository

- **Project folder**: Stored in `.shido/` directory within each project
- **Auto-generation**: Automatically generates prompt files for different AI tools
- **Symlink integration**: Can create symlinks to AI tool directories for seamless integration

### Global Prompts

- **System-wide availability**: Access your prompts from any directory
- **Tag organization**: Organize prompts with tags for easy filtering
- **Variable substitution**: Use `{{variable}}` syntax for dynamic prompts
- **File-based prompts**: Load prompts from files

### Project-Specific Rules

- **Per-project configuration**: Override global settings per project
- **Project-specific prompts**: Define prompts that only apply to specific projects
- **Custom rules**: Set up automatic prompt suggestions based on project context
- **Template system**: Create reusable project templates

### AI Service Integration

- **Automatic prompt generation**: Creates prompt files in formats optimized for each AI tool
- **Claude**: Direct integration with Claude API and prompt files
- **Gemini**: Google Gemini CLI support with compatible formats
- **GitHub Copilot**: Integration with Copilot workflows and .copilot-prompts.md
- **Cursor**: Direct integration with Cursor editor and .cursorrules
- **Symlink support**: Automatically link project prompts to AI tool directories
- **Extensible**: Easy to add support for new AI services

## Commands

### Global Prompts

```bash
# Add a global prompt
shido add <name> --prompt "Your prompt text"
shido add <name> --file ./prompt.txt --tags "coding,review"

# List all prompts
shido list
shido list --global
shido list --tag coding

# Use a prompt (copies to clipboard)
shido use <name>
shido use <name> --service claude --variables '{"lang":"python"}'

# Edit a prompt
shido edit <name>

# Remove a prompt
shido remove <name>
```

### Project Management

```bash
# Initialize Shido in current project
shido init
shido init --template react

# Add project-specific prompt
shido project add <name> --prompt "Project-specific prompt"

# List project prompts
shido list --project
```

### Configuration

```bash
# Set configuration values
shido config set defaultService claude
shido config set services.claude.apiKey your-api-key

# Get configuration
shido config get
shido config get defaultService
```

### Service Integration

```bash
# Setup AI service integrations
shido setup
shido setup --service claude

# Sync prompts with services
shido sync
shido sync --service gemini

# Generate prompt files for all AI tools
shido generate

# Setup symlinks to AI tool directories
shido link --auto  # Use common paths automatically
shido link --copilot ~/.vscode/copilot-prompts --cursor ~/.cursor/prompts

# View combined prompts (global + project)
shido combined
shido combined --format json
shido combined --format markdown
```

## Configuration

Shido stores its configuration in `~/.shido/config.yaml`:

```yaml
defaultService: claude
services:
  claude:
    enabled: true
    apiKey: your-api-key
    model: claude-3-sonnet
  gemini:
    enabled: true
    apiKey: your-api-key
  copilot:
    enabled: true
  cursor:
    enabled: false
globalPrompts:
  - name: code-review
    content: "Please review this code..."
    tags: ["coding", "review"]
    createdAt: 2024-01-01T00:00:00.000Z
    updatedAt: 2024-01-01T00:00:00.000Z
templates:
  react:
    name: "React Project"
    prompts: [...]
    rules: [...]
```

## Project Configuration

Project-specific settings are stored in `.shido/config.yaml`:

```yaml
name: my-project
prompts:
  - name: debug-component
    content: "Help me debug this React component..."
    tags: ["debug", "react"]
rules:
  - name: auto-suggest-tests
    condition: "file.endsWith('.test.js')"
    action: suggest-prompt
    params:
      prompt: test-helper
settings:
  defaultService: claude
  autoSync: true
  projectDir: ".shido"
  globalPromptsFirst: true
  excludePatterns:
    - node_modules
    - .git
    - dist
integrations:
  autoGenerate: true
  combineGlobal: true
  symlinkPaths:
    copilot: ~/.vscode/copilot-prompts
    cursor: ~/.cursor/prompts
```

### Project Structure

After running `shido init`, your project will have:

```
your-project/
├── .shido/
│   ├── config.yaml           # Project configuration
│   ├── combined-prompts.md   # All prompts in markdown format
│   ├── prompts.json          # All prompts in JSON format
│   ├── copilot/              # GitHub Copilot specific files
│   │   ├── .copilot-prompts.md
│   │   └── individual-prompts/
│   ├── cursor/               # Cursor specific files
│   │   ├── .cursorrules
│   │   └── prompts.json
│   ├── claude/               # Claude specific files
│   │   ├── system-prompts.txt
│   │   └── individual-prompts/
│   └── gemini/               # Gemini specific files
│       ├── prompts.txt
│       └── prompts.json
└── your-source-code/
```

## AI Tool Integration

Shido automatically generates prompt files optimized for different AI coding assistants and can set up symlinks for seamless integration.

### Automatic Integration

When you run `shido generate`, Shido creates optimized prompt files for each AI tool:

- **GitHub Copilot**: `.copilot-prompts.md` and individual `.md` files
- **Cursor**: `.cursorrules` file and `prompts.json`
- **Claude**: System prompts and individual `.txt` files
- **Gemini**: CLI-compatible `prompts.txt` and `prompts.json`

### Symlink Setup

Set up symlinks to automatically sync your prompts with AI tools:

```bash
# Automatic setup using common paths
shido link --auto

# Manual setup for specific tools
shido link --copilot ~/.vscode/copilot-prompts
shido link --cursor ~/.cursor/prompts
shido link --claude ~/.claude/prompts
shido link --gemini ~/.gemini/prompts
```

This creates symlinks from your project's `.shido/` directories to the AI tools' configuration directories, ensuring they always have access to your latest combined prompts.

### Workflow Example

1. Add global prompts: `shido add code-review --prompt "..."`
2. Initialize project: `shido init --template react`
3. Add project prompts: `shido project add debug-component --prompt "..."`
4. Generate AI tool files: `shido generate`
5. Set up symlinks: `shido link --auto`

Now when you use GitHub Copilot, Cursor, Claude, or Gemini in your project, they automatically have access to both your global and project-specific prompts!

## Prompt Templates

Use variables in your prompts for dynamic content:

```bash
shido add translate --prompt "Translate this {{language}} code to {{target}}: {{code}}"

# Use with variables
shido use translate --variables '{"language":"Python","target":"JavaScript","code":"def hello(): print(\"hi\")"}'
```

## Examples

### Code Review Prompt

```bash
shido add code-review --prompt "Please review this code for:
- Best practices and conventions
- Potential bugs or issues
- Performance improvements
- Security considerations
- Readability and maintainability

Code to review: {{code}}"
```

### Bug Fix Prompt

```bash
shido add debug --prompt "I'm experiencing this issue: {{issue}}

Code context: {{code}}

Error message: {{error}}

Please help me identify the root cause and suggest a fix."
```

### Documentation Prompt

```bash
shido add document --prompt "Generate comprehensive documentation for this {{type}}:

{{code}}

Include:
- Purpose and functionality
- Parameters/arguments
- Return values
- Usage examples
- Edge cases or considerations"
```

## Integration Examples

### With Claude

```bash
shido setup --service claude
echo "your code here" | shido use code-review --service claude
```

### With VS Code / Cursor

```bash
# Copy prompt and use in your editor
shido use debug --variables '{"issue":"function not returning expected value"}'
```

### In CI/CD Pipeline

```bash
# Use in automated code review
git diff | shido use code-review --service claude
```

## API

Shido can also be used programmatically:

```javascript
const { ShidoCore } = require("shido");

const shido = new ShidoCore();

// Add a prompt
await shido.addGlobalPrompt("test", {
	prompt: "Test prompt",
	tags: "testing",
});

// Use a prompt
await shido.usePrompt("test", {
	variables: '{"key":"value"}',
});
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/shido.git
cd shido

# Install dependencies
npm install

# Run in development mode
npm run dev

# Run tests
npm test

# Build the project
npm run build
```

### Quick Contribution

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT © [Your Name]

## Support & Community

- 📚 [Documentation](https://github.com/yourusername/shido#readme)
- 🐛 [Issue Tracker](https://github.com/yourusername/shido/issues)
- 💬 [Discussions](https://github.com/yourusername/shido/discussions)
- 🆘 [Stack Overflow](https://stackoverflow.com/questions/tagged/shido)

## Acknowledgments

- Inspired by the amazing AI coding assistant ecosystem
- Thanks to all contributors and the open-source community
- Special thanks to the TypeScript and Node.js teams

---

<div align="center">
  <strong>Made with ❤️ for developers who love AI-assisted coding</strong>
  
  <br>
  
  ⭐ Star us on GitHub — it motivates us a lot!
  
  <br><br>
  
  [![GitHub stars](https://img.shields.io/github/stars/yourusername/shido.svg?style=social&label=Star)](https://github.com/yourusername/shido)
  [![GitHub followers](https://img.shields.io/github/followers/yourusername.svg?style=social&label=Follow)](https://github.com/yourusername)
  [![Twitter Follow](https://img.shields.io/twitter/follow/yourusername.svg?style=social)](https://twitter.com/yourusername)
</div>
