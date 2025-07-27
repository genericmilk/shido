# Example Prompts for Shido

This directory contains example prompts that you can add to your Shido collection.

## Code Review Prompts

### General Code Review

```bash
shido add code-review --prompt "Please review this code for:
- Best practices and conventions
- Potential bugs or issues
- Performance improvements
- Security considerations
- Readability and maintainability

Code to review: {{code}}"
```

### Security-Focused Review

```bash
shido add security-review --prompt "Please perform a security review of this code:

{{code}}

Focus on:
- Input validation and sanitization
- Authentication and authorization issues
- SQL injection vulnerabilities
- XSS vulnerabilities
- Sensitive data exposure
- Secure coding practices"
```

## Debugging Prompts

### General Debugging

```bash
shido add debug --prompt "I'm experiencing this issue: {{issue}}

Code context: {{code}}

Error message (if any): {{error}}

Expected behavior: {{expected}}
Actual behavior: {{actual}}

Please help me identify the root cause and suggest a fix."
```

### Performance Debugging

```bash
shido add debug-performance --prompt "I'm having performance issues with this code:

{{code}}

Performance problems observed:
{{problems}}

Please help me identify bottlenecks and suggest optimizations."
```

## Documentation Prompts

### Function Documentation

```bash
shido add document-function --prompt "Generate comprehensive documentation for this function:

{{code}}

Include:
- Purpose and functionality
- Parameters with types and descriptions
- Return value with type and description
- Usage examples
- Edge cases or considerations
- Time/space complexity (if applicable)"
```

### API Documentation

```bash
shido add document-api --prompt "Generate API documentation for this endpoint:

Method: {{method}}
Path: {{path}}
Code: {{code}}

Include:
- Description of what the endpoint does
- Request parameters and body schema
- Response format and status codes
- Authentication requirements
- Usage examples
- Error handling"
```

## Testing Prompts

### Unit Test Generation

```bash
shido add generate-tests --prompt "Generate comprehensive unit tests for this {{language}} code:

{{code}}

Please include:
- Happy path test cases
- Edge case testing
- Error condition testing
- Mock setup if needed
- Test descriptions that clearly explain what's being tested

Use {{framework}} testing framework."
```

### Test Review

```bash
shido add review-tests --prompt "Please review these tests for completeness and quality:

{{tests}}

Code being tested:
{{code}}

Check for:
- Test coverage completeness
- Edge cases that might be missing
- Test clarity and maintainability
- Proper mocking and setup
- Performance of test execution"
```

## Refactoring Prompts

### Code Refactoring

```bash
shido add refactor --prompt "Please help me refactor this code to improve:

{{code}}

Improvement goals:
- {{goals}}

Please provide:
- Refactored code with explanations
- Benefits of the changes
- Any potential risks or considerations
- Step-by-step refactoring approach if complex"
```

### Extract Function/Class

```bash
shido add extract-function --prompt "Please help me extract reusable functions or classes from this code:

{{code}}

Look for:
- Repeated code patterns
- Single responsibility violations
- Opportunities for better abstraction
- Improved testability

Provide the extracted code with clear interfaces."
```

## Language-Specific Prompts

### JavaScript/TypeScript

```bash
shido add js-modernize --prompt "Please modernize this JavaScript code to use current best practices:

{{code}}

Update to use:
- Modern ES6+ features
- TypeScript if beneficial
- Better error handling
- Improved async patterns
- Current coding conventions"
```

### Python

```bash
shido add python-optimize --prompt "Please optimize this Python code for better performance and readability:

{{code}}

Focus on:
- Pythonic coding patterns
- Performance optimizations
- Memory efficiency
- Code readability
- Type hints (if missing)
- Error handling improvements"
```

## Project-Specific Examples

### React Component Review

```bash
shido add react-review --prompt "Please review this React component:

{{component}}

Check for:
- React best practices and patterns
- Performance optimizations (useMemo, useCallback, etc.)
- Accessibility considerations
- Props validation
- State management efficiency
- Hook usage patterns
- Testing recommendations"
```

### Database Query Optimization

```bash
shido add db-optimize --prompt "Please optimize this database query:

Query: {{query}}
Database: {{database}}
Performance issues: {{issues}}

Suggestions needed for:
- Query performance optimization
- Index recommendations
- Query rewriting
- Schema improvements
- Best practices for this database type"
```

## Usage Examples

After adding these prompts, you can use them like:

```bash
# Use with variables
shido use code-review --variables '{"code":"function hello() { console.log(\"Hi\"); }"}'

# For specific services
shido use debug --service claude --variables '{"issue":"function not working","code":"..."}'

# Simple usage (will prompt for variables)
shido use document-function
```

## Tips for Creating Your Own Prompts

1. **Be Specific**: Include clear instructions about what you want
2. **Use Variables**: Make prompts reusable with `{{variable}}` syntax
3. **Structure Output**: Request specific format or structure
4. **Add Context**: Include relevant background information
5. **Tag Appropriately**: Use tags for easy filtering and organization

```bash
# Example of a well-structured prompt
shido add my-prompt \
  --prompt "Clear instruction with {{variable1}} and {{variable2}}" \
  --tags "category,language,purpose"
```
