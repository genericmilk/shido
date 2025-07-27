# Complete Workflow Example

This example demonstrates the enhanced Shido workflow with system-wide + project-specific prompt repositories and AI tool integration.

## Setup Global Prompts (System-wide)

```bash
# Install Shido globally
npm install -g shido

# Setup AI service integrations
shido setup

# Add some global prompts that you'll use across all projects
shido add code-review --prompt "Please review this code for:
- Best practices and conventions
- Potential bugs or issues
- Performance improvements
- Security considerations
- Readability and maintainability

Code to review: {{code}}" --tags "review,quality"

shido add debug --prompt "I'm experiencing this issue: {{issue}}

Code context: {{code}}

Error message (if any): {{error}}

Expected behavior: {{expected}}
Actual behavior: {{actual}}

Please help me identify the root cause and suggest a fix." --tags "debug,help"

shido add document --prompt "Generate comprehensive documentation for this {{type}}:

{{code}}

Include:
- Purpose and functionality
- Parameters/arguments with types
- Return values
- Usage examples
- Edge cases or considerations" --tags "documentation"
```

## Initialize a Project

```bash
# Navigate to your project
cd my-react-app

# Initialize Shido with React template
shido init --template react

# This creates:
# .shido/
# ├── config.yaml           # Project configuration
# ├── copilot/              # GitHub Copilot files
# ├── cursor/               # Cursor files
# ├── claude/               # Claude files
# └── gemini/               # Gemini files
```

## Add Project-Specific Prompts

```bash
# Add prompts specific to this React project
shido project add fix-component --prompt "Help me fix this React component:

Component: {{component}}
Issue: {{issue}}
Error: {{error}}

Focus on:
- React-specific patterns and hooks
- State management issues
- Props and rendering problems
- Performance optimizations" --tags "react,fix"

shido project add test-component --prompt "Generate comprehensive tests for this React component:

{{component}}

Include:
- Rendering tests
- Props testing
- Event handling tests
- State changes
- Edge cases
- Accessibility tests

Use React Testing Library and Jest." --tags "react,testing"
```

## Generate AI Tool Files

```bash
# Generate optimized prompt files for all AI tools
shido generate

# This creates files like:
# .shido/copilot/.copilot-prompts.md
# .shido/cursor/.cursorrules
# .shido/claude/system-prompts.txt
# .shido/gemini/prompts.txt
# Plus individual prompt files for each tool
```

## Setup Symlinks (Optional but Recommended)

```bash
# Setup symlinks to common AI tool directories
shido link --auto

# Or manually specify paths
shido link --copilot ~/.vscode/copilot-prompts --cursor ~/.cursor/prompts

# This creates symlinks so AI tools automatically see your combined prompts
```

## Using the Prompts

### View Combined Prompts

```bash
# See all available prompts (global + project)
shido combined

# Export in different formats
shido combined --format json > my-prompts.json
shido combined --format markdown > my-prompts.md
```

### Use Prompts with Variables

```bash
# Use a global prompt
shido use code-review --variables '{"code":"function MyComponent() { return <div>Hi</div>; }"}'

# Use a project-specific prompt
shido use fix-component --variables '{"component":"MyButton","issue":"not responding to clicks","error":"onClick handler not firing"}'
```

### Direct AI Tool Integration

With symlinks set up, your AI tools automatically have access to all prompts:

**GitHub Copilot**: Reads from `.copilot-prompts.md`
**Cursor**: Uses `.cursorrules` for system prompts and `prompts.json` for available prompts
**Claude**: Accesses individual `.txt` files and `system-prompts.txt`
**Gemini CLI**: Uses `prompts.txt` and `prompts.json`

## Project Structure After Setup

```
my-react-app/
├── .shido/
│   ├── config.yaml                    # Project configuration
│   ├── combined-prompts.md            # All prompts in markdown
│   ├── prompts.json                   # All prompts in JSON
│   ├── copilot/
│   │   ├── .copilot-prompts.md        # GitHub Copilot format
│   │   ├── code-review.md             # Individual prompts
│   │   ├── debug.md
│   │   ├── fix-component.md
│   │   └── test-component.md
│   ├── cursor/
│   │   ├── .cursorrules               # Cursor system rules
│   │   └── prompts.json               # Cursor prompt library
│   ├── claude/
│   │   ├── system-prompts.txt         # System/context prompts
│   │   ├── code-review.txt            # Individual prompts
│   │   ├── debug.txt
│   │   ├── fix-component.txt
│   │   └── test-component.txt
│   └── gemini/
│       ├── prompts.txt                # Gemini CLI format
│       └── prompts.json               # Structured format
├── src/
│   ├── components/
│   └── ...
└── package.json
```

## Benefits

1. **Consistent prompts**: Same prompts available across all AI tools
2. **Global + Project**: Global prompts (code-review, debug) + project-specific (fix-component, test-component)
3. **Automatic updates**: When you add/modify prompts, AI tool files are regenerated
4. **Tool optimization**: Each AI tool gets prompts in its preferred format
5. **Seamless workflow**: No need to manually copy prompts between tools

## Advanced Usage

### Auto-regeneration

Enable automatic prompt file regeneration when prompts change:

```yaml
# In .shido/config.yaml
integrations:
  autoGenerate: true
  combineGlobal: true
```

### Custom Symlink Paths

```bash
# Setup custom symlink paths for team workflows
shido link --copilot /shared/team/copilot-prompts --cursor /shared/team/cursor-prompts
```

### Template Creation

Create reusable templates for different project types:

```bash
# Export current project as template
shido template create react-advanced --from-project

# Use in new projects
shido init --template react-advanced
```

This workflow ensures that every developer on your team, regardless of which AI coding assistant they prefer, has access to the same high-quality, context-aware prompts!
