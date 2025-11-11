# Contributing to @alteriom/mqtt-schema

Thank you for your interest in contributing to the Alteriom MQTT Schema package! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Submitting Changes](#submitting-changes)
- [Release Process](#release-process)

## Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please be respectful and professional in all interactions.

## Getting Started

### Prerequisites

- Node.js >= 16.0.0
- npm >= 8.0.0
- Git

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/alteriom-mqtt-schema.git
   cd alteriom-mqtt-schema
   ```

### Install Dependencies

```bash
npm install
```

### Build the Project

```bash
npm run build
```

### Run Tests

```bash
npm test
npm run verify
```

## Development Workflow

### 1. Create a Branch

Create a feature branch from `main`:

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `test/` - Test improvements
- `refactor/` - Code refactoring

### 2. Make Changes

- Write clear, concise commit messages
- Keep commits focused and atomic
- Update documentation as needed
- Add tests for new features

### 3. Code Quality Checks

Before committing, ensure code quality:

```bash
# Run linter
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Check code formatting
npm run format:check

# Format code automatically
npm run format

# Run all tests
npm test

# Run comprehensive verification
npm run verify
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: add new feature description"
```

Commit message format:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `test:` - Test updates
- `refactor:` - Code refactoring
- `chore:` - Build/tooling changes

## Coding Standards

### TypeScript Style Guide

- Use TypeScript for all new code
- Follow the existing code style
- Use explicit types where helpful
- Prefer interfaces over type aliases for objects
- Use `const` for immutable values
- Use meaningful variable and function names

### ESLint Configuration

The project uses ESLint with TypeScript support. Configuration is in `eslint.config.mjs`.

Key rules:
- Prettier for consistent formatting
- TypeScript recommended rules
- No explicit `any` types (use sparingly)
- Warn on unused variables

### Code Formatting

The project uses Prettier for consistent code formatting:
- 2 spaces for indentation
- Single quotes for strings
- Semicolons required
- 100 character line length
- Trailing commas in ES5

## Testing Guidelines

### Test Structure

Tests are located in the `test/` directory:
- `validate-fixtures.cjs` - Main fixture validation
- Fixtures in `docs/mqtt_schema/fixtures/`

### Adding Tests

When adding new features:

1. Add test fixtures in `docs/mqtt_schema/fixtures/`
2. Create both valid and invalid examples
3. Update fixture validation if needed
4. Ensure tests pass for both CJS and ESM builds

### Running Tests

```bash
# Run all tests
npm test

# Run OTA manifest validation
npm run test:ota

# Run schema verification
npm run verify:schemas

# Run comprehensive verification
npm run verify:all
```

## Schema Changes

### Adding New Message Types

1. Add schema JSON in `docs/mqtt_schema/`
2. Update `scripts/copy-schemas.cjs` with new schema
3. Add TypeScript types in `docs/mqtt_schema/types.ts`
4. Add validator in `src/validators.ts`
5. Update classification logic if needed
6. Add test fixtures
7. Update documentation

### Modifying Existing Schemas

⚠️ **Breaking changes require major version bump**

1. Review backward compatibility impact
2. Update schema in `docs/mqtt_schema/`
3. Update TypeScript types
4. Update tests and fixtures
5. Document changes in CHANGELOG
6. Update migration guide if needed

### Schema Guidelines

- Always use JSON Schema Draft 2020-12
- Keep schemas backward compatible when possible
- Use `additionalProperties: true` for forward compatibility
- Document all properties with descriptions
- Provide examples in schema or fixtures
- Validate schemas compile successfully

## Submitting Changes

### Pull Request Process

1. **Update Documentation**
   - Update README.md if needed
   - Update CHANGELOG.md with your changes
   - Update relevant documentation files

2. **Ensure Quality**
   ```bash
   npm run lint
   npm test
   npm run verify
   ```

3. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create Pull Request**
   - Go to the repository on GitHub
   - Click "New Pull Request"
   - Select your branch
   - Fill out the PR template
   - Link related issues

5. **Address Review Feedback**
   - Respond to reviewer comments
   - Make requested changes
   - Push updates to your branch
   - Request re-review when ready

### Pull Request Guidelines

- **Title**: Clear, descriptive title
- **Description**: Explain what and why
- **Testing**: Describe how you tested changes
- **Breaking Changes**: Clearly document any breaking changes
- **Documentation**: Include documentation updates
- **Linked Issues**: Reference related issues

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] All tests pass
- [ ] Linting passes
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] No breaking changes (or documented if unavoidable)
- [ ] Test coverage adequate
- [ ] Commit messages follow conventions

## Release Process

Releases are managed by maintainers. See [PUBLISH_CHECKLIST.md](./PUBLISH_CHECKLIST.md) for details.

### Version Bumping

- **Patch** (x.x.X): Bug fixes, documentation, tooling
- **Minor** (x.X.x): New features, backward compatible
- **Major** (X.x.x): Breaking changes

### Release Notes

Major releases should include:
- Summary of changes
- Migration guide for breaking changes
- Deprecation notices
- Known issues

## Additional Resources

### Documentation

- [README.md](./README.md) - Package overview
- [PUBLISH_CHECKLIST.md](./PUBLISH_CHECKLIST.md) - Release process
- [CHANGELOG.md](./CHANGELOG.md) - Version history (see also [docs/mqtt_schema/CHANGELOG.md](./docs/mqtt_schema/CHANGELOG.md) for detailed changelog)
- [docs/PAINLESSMESH_INTEGRATION.md](./docs/PAINLESSMESH_INTEGRATION.md) - Mesh integration guide

### Support

- GitHub Issues: [Report bugs or request features](https://github.com/Alteriom/alteriom-mqtt-schema/issues)
- GitHub Discussions: [Ask questions and discuss ideas](https://github.com/Alteriom/alteriom-mqtt-schema/discussions)

### License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to @alteriom/mqtt-schema! 🎉
