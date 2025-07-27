# Contributing to Shido

Thank you for your interest in contributing to Shido! This document provides guidelines and information for contributors.

## Development Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/shido.git
   cd shido
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Build the project**

   ```bash
   npm run build
   ```

4. **Run tests**

   ```bash
   npm test
   ```

5. **Link for local testing**
   ```bash
   npm link
   # Now you can use `shido` command globally for testing
   ```

## Project Structure

```
shido/
├── src/
│   ├── cli.ts          # Command-line interface
│   ├── core.ts         # Main Shido class
│   ├── config.ts       # Configuration management
│   ├── prompts.ts      # Prompt management
│   ├── projects.ts     # Project-specific functionality
│   ├── services.ts     # AI service integrations
│   ├── types.ts        # TypeScript type definitions
│   └── __tests__/      # Test files
├── templates/          # Project templates
├── dist/              # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
└── README.md
```

## Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow existing code formatting and naming conventions
- Use async/await for asynchronous operations
- Add proper error handling with descriptive error messages
- Include JSDoc comments for public methods

### Testing

- Write tests for new functionality using Jest
- Maintain or improve test coverage
- Test both success and error cases
- Mock external dependencies in tests

### Commits

- Use conventional commit messages:
  - `feat:` for new features
  - `fix:` for bug fixes
  - `docs:` for documentation changes
  - `test:` for adding tests
  - `refactor:` for code refactoring
  - `chore:` for maintenance tasks

### Pull Requests

- Create a feature branch for your changes
- Write clear commit messages
- Include tests for new functionality
- Update documentation as needed
- Ensure all tests pass
- Keep PRs focused and reasonably sized

## Adding New Features

### Adding a New AI Service

1. Update the `ServiceConfig` interface in `types.ts`
2. Add service-specific setup logic in `services.ts`
3. Implement the service integration methods
4. Add tests for the new service
5. Update documentation

### Adding New Commands

1. Add the command definition in `cli.ts`
2. Implement the command logic in `core.ts`
3. Add appropriate error handling
4. Write tests for the command
5. Update help text and documentation

### Adding New Templates

1. Create a new YAML file in the `templates/` directory
2. Define prompts, rules, and settings
3. Test the template with `shido init --template <name>`
4. Document the template in README

## Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode during development:

```bash
npm run test:watch
```

Run tests with coverage:

```bash
npm run test:coverage
```

## Building and Publishing

### Local Build

```bash
npm run build
```

### Testing the Package Locally

```bash
# Link for global testing
npm link

# Test commands
shido --help
shido add test --prompt "Test prompt"
shido list

# Unlink when done testing
npm unlink -g shido
```

### Publishing (for maintainers)

```bash
# Ensure tests pass
npm test

# Build the project
npm run build

# Update version
npm version patch  # or minor/major

# Publish to npm
npm publish
```

## Documentation

- Update README.md for user-facing changes
- Update JSDoc comments for API changes
- Add examples for new features
- Update CHANGELOG.md for releases

## Getting Help

- Check existing [issues](https://github.com/yourusername/shido/issues)
- Create a new issue for bugs or feature requests
- Join discussions in [GitHub Discussions](https://github.com/yourusername/shido/discussions)

## Code of Conduct

Please be respectful and constructive in all interactions. We're building this tool together to help developers be more productive with AI coding assistants.

## License

By contributing to Shido, you agree that your contributions will be licensed under the MIT License.
