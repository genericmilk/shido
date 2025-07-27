# Changelog

All notable changes to Shido will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Enhanced README with badges, table of contents, and improved documentation
- GitHub Actions workflows for CI/CD, security scanning, and releases
- Issue templates for bug reports, feature requests, and AI tool integrations
- Security policy and guidelines
- Pull request template
- Improved npm scripts for development and testing

## [1.1.0] - 2024-07-27

### Added

- **MAJOR**: System-wide + project-specific prompt repositories
- **MAJOR**: Enhanced project structure with `.shido/` directory
- **MAJOR**: Automatic AI tool integration and file generation
- **MAJOR**: Symlink support for seamless AI tool integration
- New CLI commands:
  - `shido generate` - Generate prompt files for all AI tools
  - `shido link` - Setup symlinks to AI tool directories
  - `shido combined` - View combined global + project prompts
- AI tool specific file generation:
  - GitHub Copilot: `.copilot-prompts.md` and individual `.md` files
  - Cursor: `.cursorrules` and `prompts.json`
  - Claude: `system-prompts.txt` and individual `.txt` files
  - Gemini: `prompts.txt` and `prompts.json`
- Project configuration enhancements with integration settings
- Comprehensive workflow documentation and examples

### Changed

- Project configuration moved from `.shido.yaml` to `.shido/config.yaml`
- Enhanced `shido init` to create complete `.shido/` directory structure
- Updated project templates with integration configurations
- Improved error handling and user experience

### Technical

- Added `PromptIntegration` class for AI tool management
- Enhanced `ProjectManager` for `.shido/` directory structure
- Updated TypeScript types for new configuration options
- Comprehensive test coverage maintained

## [1.0.0] - 2024-07-27

### Added

- Initial release of Shido
- Global prompt management system
- Project-specific prompt configuration
- AI service integrations:
  - Claude API integration
  - Gemini CLI support
  - GitHub Copilot integration
  - Cursor editor support
- Command-line interface with comprehensive commands:
  - `shido add` - Add global/project prompts
  - `shido list` - List and filter prompts
  - `shido use` - Use prompts with variable substitution
  - `shido edit` - Edit existing prompts
  - `shido remove` - Remove prompts
  - `shido init` - Initialize project with Shido
  - `shido config` - Manage configuration
  - `shido setup` - Setup AI service integrations
  - `shido sync` - Sync prompts with AI services
- Variable substitution system with `{{variable}}` syntax
- Tag-based prompt organization and filtering
- Project template system with built-in templates:
  - React project template
  - Node.js/Backend template
- YAML-based configuration system
- Comprehensive test suite
- TypeScript support throughout
- Cross-platform compatibility (macOS, Linux, Windows)

### Features

- **Global Prompts**: Store and access prompts system-wide from any directory
- **Project Rules**: Define per-project prompt rules and auto-suggestions
- **Template System**: Create and reuse project templates
- **Service Integration**: Direct integration with popular AI coding assistants
- **Variable Processing**: Dynamic prompt content with variable substitution
- **Tag Organization**: Organize and filter prompts using tags
- **Configuration Management**: Flexible YAML-based configuration
- **Interactive Setup**: Guided setup process for AI services
- **Cross-platform**: Works on macOS, Linux, and Windows

### Documentation

- Comprehensive README with usage examples
- API documentation for programmatic usage
- Template examples for common project types
- Installation script for easy setup
- MIT license for open-source usage
