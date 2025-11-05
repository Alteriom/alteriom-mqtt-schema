# Security Policy

## Supported Versions

We actively support the following versions with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 0.7.x   | :white_check_mark: |
| 0.6.x   | :white_check_mark: |
| < 0.6   | :x:                |

## Reporting a Vulnerability

We take the security of @alteriom/mqtt-schema seriously. If you discover a security vulnerability, please follow these steps:

### 1. Do Not Disclose Publicly

Please do not create a public GitHub issue for security vulnerabilities. Public disclosure before a fix is available could put users at risk.

### 2. Report Privately

Send a detailed report to the maintainers via:
- GitHub Security Advisories (preferred)
- Email: [INSERT SECURITY EMAIL]

### 3. Include Details

Your report should include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Any suggested fixes (optional)
- Your contact information

### 4. Response Timeline

- **Acknowledgment**: Within 48 hours
- **Initial Assessment**: Within 1 week
- **Fix Development**: Depends on severity (critical issues prioritized)
- **Public Disclosure**: After fix is released and users have time to upgrade

## Security Best Practices

### For Users of This Package

1. **Keep Up to Date**
   - Regularly update to the latest version
   - Subscribe to release notifications
   - Review CHANGELOG.md for security fixes

2. **Validate Input**
   - Always validate untrusted input before processing
   - Use the provided validators
   - Handle validation errors appropriately

3. **Dependency Management**
   - Regularly audit dependencies: `npm audit`
   - Update dependencies when security patches are available
   - Use lock files (package-lock.json)

4. **OTA Security** (if using OTA features)
   - Always verify firmware signatures
   - Use HTTPS for firmware downloads
   - Implement rollback capabilities
   - Monitor OTA failures

### Schema Validation Security

This package provides schema validation but does not guarantee:
- Input sanitization
- SQL injection prevention
- XSS prevention
- Authorization/authentication

**You are responsible for:**
- Sanitizing validated data before use
- Implementing proper authentication
- Following security best practices in your application
- Rate limiting and DoS prevention

## Known Security Considerations

### 1. Ajv Dependency

This package uses Ajv for JSON Schema validation. Keep Ajv updated to receive security patches.

### 2. Embedded Schemas

Schemas are embedded in the package at build time. No runtime file I/O occurs, reducing attack surface.

### 3. Additional Properties

Schemas use `additionalProperties: true` for forward compatibility. Unknown properties are preserved but not validated.

**Implication**: Your application should handle or filter unknown properties as needed.

### 4. Regular Expressions

Some schemas use regex patterns for validation. These are designed to prevent ReDoS attacks, but always:
- Implement timeouts for validation
- Monitor validation performance
- Report suspicious patterns

## Security Updates

Security updates are released as:
- **Critical**: Immediate patch release
- **High**: Patch release within 1 week
- **Medium**: Included in next minor release
- **Low**: Included in next release

Security fixes are clearly marked in CHANGELOG.md with:
```markdown
### Security
- [CRITICAL/HIGH/MEDIUM/LOW] Description of fix
```

## Security Disclosure Policy

When a security issue is fixed:

1. **Private Fix**: Develop and test fix privately
2. **Advisory Creation**: Create GitHub Security Advisory
3. **Patch Release**: Publish patched version
4. **Disclosure**: Public disclosure 7-14 days after release
5. **CVE**: Request CVE if appropriate

## Third-Party Security Research

We welcome security research on this package. If you're conducting security research:

1. Follow responsible disclosure principles
2. Do not access data that doesn't belong to you
3. Do not perform destructive testing
4. Report findings privately before public disclosure

## Acknowledgments

We appreciate the security community's efforts in making this package safer. Contributors who report valid security issues may be acknowledged in release notes (with permission).

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [npm Security Best Practices](https://docs.npmjs.com/packages-and-modules/securing-your-code)

## Questions?

For security-related questions that don't involve reporting a vulnerability:
- Open a GitHub Discussion
- Review existing security documentation
- Check the FAQ in README.md

---

**Last Updated**: 2025-11-04
**Version**: 1.0
