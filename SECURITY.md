# Security Policy

## Supported Versions

We support the following versions of Shido with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability in Shido, please report it responsibly:

### Where to Report

- **Email**: security@shido.dev (if available)
- **GitHub**: Create a private security advisory at https://github.com/yourusername/shido/security/advisories
- **Alternative**: Email the maintainer directly

### What to Include

Please include the following information in your security report:

1. **Description** of the vulnerability
2. **Steps to reproduce** the issue
3. **Potential impact** of the vulnerability
4. **Suggested fix** (if you have one)
5. **Your contact information** for follow-up

### Response Timeline

We aim to respond to security reports within:

- **24 hours**: Initial acknowledgment
- **72 hours**: Initial assessment and severity classification
- **1 week**: Plan for fix or mitigation
- **30 days**: Public disclosure (coordinated with reporter)

### Scope

This security policy applies to:

- The main Shido CLI application
- AI tool integrations
- Configuration handling
- File system operations
- Template processing

### Out of Scope

The following are generally out of scope:

- Issues in third-party AI tools themselves
- Social engineering attacks
- Issues requiring physical access to a user's machine
- Issues in dependencies (report to the dependency maintainers)

## Security Best Practices

When using Shido:

1. **Protect API Keys**: Never commit API keys to version control
2. **Review Prompts**: Be cautious with prompts that might contain sensitive information
3. **Symlink Security**: Ensure symlink targets are in safe locations
4. **Template Sources**: Only use templates from trusted sources
5. **Regular Updates**: Keep Shido updated to the latest version

## Known Security Considerations

- **API Keys**: Shido stores AI service API keys in configuration files. Ensure these files have appropriate permissions.
- **Symlinks**: The symlink feature creates symbolic links to AI tool directories. Ensure target directories are secure.
- **Templates**: Project templates are executed during initialization. Only use trusted templates.

## Contact

For security-related questions or concerns, please contact:

- Security Email: security@shido.dev
- Maintainer: [Your Contact Information]

Thank you for helping keep Shido secure!
