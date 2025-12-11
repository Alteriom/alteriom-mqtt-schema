# Development Guide

This guide covers the development environment setup, workflow, and best practices for contributing to `@alteriom/mqtt-schema`.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Build System](#build-system)
- [Schema Development](#schema-development)
- [Code Quality Tools](#code-quality-tools)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software

- **Node.js**: >= 16.0.0 (recommended: Node 20 LTS)
- **npm**: >= 8.0.0
- **Git**: Latest stable version
- **Code Editor**: VS Code recommended (with ESLint and Prettier extensions)

### Recommended VS Code Extensions

- ESLint (`dbaeumer.vscode-eslint`)
- Prettier (`esbenp.prettier-vscode`)
- TypeScript Vue Plugin (`Vue.vscode-typescript-vue-plugin`)
- EditorConfig (`editorconfig.editorconfig`)

### System Requirements

- **RAM**: 4GB minimum (8GB recommended for building)
- **Disk Space**: 500MB for dependencies and build artifacts
- **OS**: Linux, macOS, or Windows with WSL2

## Environment Setup

### 1. Fork and Clone

Fork the repository on GitHub and clone your fork:

```bash
git clone https://github.com/YOUR_USERNAME/alteriom-mqtt-schema.git
cd alteriom-mqtt-schema
```

### 2. Install Dependencies

Install all development dependencies:

```bash
npm install
```

This will:
- Install all npm packages from `package.json`
- Set up Husky git hooks for pre-commit checks
- Prepare development tools (ESLint, Prettier, Vitest)

### 3. Initial Build

Verify your environment with an initial build:

```bash
npm run build
```

Expected output:
- `dist/cjs/` directory with CommonJS build
- `dist/esm/` directory with ES module build
- `schemas/` directory with copied schema files

### 4. Verify Setup

Run all tests to verify your setup:

```bash
npm test
```

Expected: All tests pass (82+ tests)

## Project Structure

```
alteriom-mqtt-schema/
├── src/                      # TypeScript source code
│   ├── index.ts             # Main entry point
│   ├── validators.ts        # Ajv validators and classification
│   ├── types.ts             # Type exports
│   └── generated/           # Auto-generated from docs/
│       └── types.ts         # TypeScript types (copied)
│
├── docs/mqtt_schema/        # Authoritative schema definitions
│   ├── *.schema.json       # JSON Schema files
│   ├── types.ts            # TypeScript type definitions
│   ├── fixtures/           # Test message samples
│   └── CHANGELOG.md        # Detailed version history
│
├── scripts/                 # Build and release automation
│   ├── copy-schemas.cjs    # Schema sync to src/
│   ├── post-esm.cjs        # ESM build post-processing
│   ├── release-prepare.cjs # Version bump automation
│   └── verify_all.cjs      # Comprehensive validation
│
├── test/                    # Test suites
│   ├── unit/               # Unit tests
│   ├── integration/        # Integration tests
│   ├── benchmarks/         # Performance benchmarks
│   └── validate-fixtures.cjs # Fixture validation
│
├── dist/                    # Build output (gitignored)
│   ├── cjs/                # CommonJS build
│   └── esm/                # ES module build
│
└── schemas/                 # Published schemas (gitignored, copied)
```

### Key Files

- **`tsconfig.json`**: TypeScript configuration for CommonJS build
- **`tsconfig.esm.json`**: TypeScript configuration for ESM build
- **`vitest.config.mts`**: Test runner configuration
- **`eslint.config.mjs`**: ESLint configuration
- **`.prettierrc.json`**: Prettier code formatting rules
- **`package.json`**: Package manifest and scripts

## Development Workflow

### Daily Development Cycle

1. **Update from main**:
   ```bash
   git checkout main
   git pull upstream main
   ```

2. **Create feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make changes** to source files in `src/` or schemas in `docs/mqtt_schema/`

4. **Run linter** (auto-fix where possible):
   ```bash
   npm run lint:fix
   ```

5. **Run tests**:
   ```bash
   npm test
   ```

6. **Build locally**:
   ```bash
   npm run build
   ```

7. **Verify changes**:
   ```bash
   npm run verify
   ```

8. **Commit changes** (Husky will run pre-commit hooks):
   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

### Branch Naming Conventions

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `test/` - Test improvements
- `refactor/` - Code refactoring
- `chore/` - Build/tooling changes

### Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `test`: Test updates
- `refactor`: Code refactoring
- `chore`: Build/tooling changes
- `perf`: Performance improvements
- `ci`: CI/CD changes

**Examples**:
```bash
feat(validators): add support for new sensor type
fix(schema): correct temperature range validation
docs(readme): update installation instructions
test(fixtures): add edge case for gateway metrics
```

## Build System

### Understanding the Dual-Build System

This package supports both CommonJS (CJS) and ES Modules (ESM) for maximum compatibility.

#### Build Process

1. **Clean**: Remove previous build artifacts
   ```bash
   npm run clean
   ```

2. **Copy Schemas**: Sync schemas from `docs/mqtt_schema/` to `src/`
   ```bash
   npm run prebuild
   ```

3. **Build CJS**: Compile TypeScript with `tsconfig.json`
   ```bash
   npm run build:cjs
   ```

4. **Build ESM**: Compile TypeScript with `tsconfig.esm.json` and post-process
   ```bash
   npm run build:esm
   ```

5. **Full Build**: Run all steps
   ```bash
   npm run build
   ```

#### Build Outputs

**CommonJS (`dist/cjs/`)**:
- `*.js` - JavaScript files
- `*.d.ts` - TypeScript declaration files
- `generated/` - Generated types

**ES Modules (`dist/esm/`)**:
- `*.js` - JavaScript files with `.js` extensions
- `package.json` - Marks directory as ESM (`"type": "module"`)

### Schema Embedding Strategy

Schemas are embedded as JavaScript objects (not loaded at runtime):

1. Schemas live in `docs/mqtt_schema/` (source of truth)
2. `scripts/copy-schemas.cjs` copies them to `src/schemas/`
3. Build generates `src/schema_data.ts` with embedded constants
4. No runtime file I/O required
5. Tree-shakeable when only specific validators imported

### Package Entry Points

The package supports multiple import patterns:

```typescript
// Main exports
import { validators, classifyAndValidate } from '@alteriom/mqtt-schema';

// Validators only
import { validators } from '@alteriom/mqtt-schema/validators';

// Types only
import type { SensorDataMessage } from '@alteriom/mqtt-schema/types';

// Individual schemas
import schema from '@alteriom/mqtt-schema/schemas/sensor_data.schema.json';

// OTA manifest
import manifest from '@alteriom/mqtt-schema/ota-manifest';
```

## Schema Development

### Adding a New Message Type

1. **Create JSON Schema** in `docs/mqtt_schema/`:
   ```bash
   cd docs/mqtt_schema
   touch new_message.schema.json
   ```

2. **Define Schema** (JSON Schema Draft 2020-12):
   ```json
   {
     "$schema": "https://json-schema.org/draft/2020-12/schema",
     "$id": "new_message.schema.json",
     "title": "New Message",
     "description": "Description of new message type",
     "type": "object",
     "properties": {
       "schema_version": { "const": 1 },
       "message_type": { "const": 800 },
       "device_id": { "type": "string" }
     },
     "required": ["schema_version", "message_type", "device_id"],
     "additionalProperties": true
   }
   ```

3. **Update TypeScript Types** in `docs/mqtt_schema/types.ts`:
   ```typescript
   export interface NewMessage extends BaseMessage {
     message_type: 800;
     // Additional properties
   }
   ```

4. **Update Copy Script** in `scripts/copy-schemas.cjs`:
   ```javascript
   const copyList = [
     // ... existing schemas
     'new_message.schema.json',
   ];
   ```

5. **Add Validator** in `src/validators.ts`:
   ```typescript
   // Import schema
   import newMessageSchema from './schemas/new_message.schema.json';
   
   // Add to validator map
   const validators = {
     // ... existing validators
     newMessage: createValidator(newMessageSchema),
   };
   
   // Add type guard
   export function isNewMessage(msg: unknown): msg is NewMessage {
     return validators.newMessage(msg).valid;
   }
   ```

6. **Update Classification** (if message type code included):
   ```typescript
   // In classifyAndValidate function
   case MessageTypeCodes.NEW_MESSAGE:
     return { kind: 'newMessage', result: validators.newMessage(payload) };
   ```

7. **Add Test Fixtures** in `docs/mqtt_schema/fixtures/`:
   ```bash
   touch docs/mqtt_schema/fixtures/new_message_valid.json
   touch docs/mqtt_schema/fixtures/new_message_invalid.json
   ```

8. **Rebuild and Test**:
   ```bash
   npm run build
   npm test
   ```

### Modifying Existing Schemas

⚠️ **Important**: Schema changes must maintain backward compatibility or require a major version bump.

1. **Review Impact**: Identify if change is breaking
2. **Update Schema**: Modify in `docs/mqtt_schema/`
3. **Update Types**: Sync TypeScript types
4. **Update Tests**: Add/modify fixtures
5. **Update CHANGELOG**: Document changes
6. **Rebuild**: `npm run build`
7. **Verify**: `npm run verify`

### Schema Best Practices

- Use `additionalProperties: true` for forward compatibility
- Provide clear descriptions for all properties
- Use `const` for literal values (schema_version, message_type)
- Define sensible numeric ranges with `minimum`/`maximum`
- Use `format` for dates, emails, URIs
- Test edge cases with fixtures

## Code Quality Tools

### Linting

**Run ESLint**:
```bash
npm run lint          # Check for issues
npm run lint:fix      # Auto-fix issues
```

**Configuration**: `eslint.config.mjs`

**Key Rules**:
- TypeScript recommended rules
- Prettier integration
- No explicit `any` types
- Unused variables as warnings

### Formatting

**Run Prettier**:
```bash
npm run format        # Format all files
npm run format:check  # Check formatting
```

**Configuration**: `.prettierrc.json`

**Style**:
- 2 spaces indentation
- Single quotes
- Semicolons required
- 100 character line length
- Trailing commas in ES5

### Git Hooks (Husky)

Pre-commit hooks automatically run:
- ESLint on staged TypeScript files
- Prettier on staged JSON/Markdown files

**Configuration**: `.husky/pre-commit` and `.lintstagedrc.json`

To bypass (not recommended):
```bash
git commit --no-verify -m "message"
```

### Testing

See [TESTING.md](./TESTING.md) for comprehensive testing documentation.

### Verification Suite

Run comprehensive checks before pushing:

```bash
npm run verify
```

This runs:
1. `verify:schemas` - Ensures schemas are in sync
2. `verify:release` - Validates CHANGELOG presence
3. `test` - Runs full test suite

## Troubleshooting

### Build Fails

**Problem**: `tsc` compilation errors

**Solution**:
```bash
# Clean and rebuild
npm run clean
npm run build

# Check TypeScript version
npx tsc --version  # Should be ~5.4.x

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Tests Fail After Schema Changes

**Problem**: Fixtures validation fails

**Solution**:
```bash
# Ensure schemas are copied
npm run prebuild

# Rebuild validators
npm run build

# Check fixture JSON is valid
cat docs/mqtt_schema/fixtures/your_fixture.json | jq .
```

### Linting Errors

**Problem**: ESLint reports errors

**Solution**:
```bash
# Auto-fix most issues
npm run lint:fix

# If persist, check ESLint config
cat eslint.config.mjs

# Update ESLint cache
rm -rf .eslintcache
npm run lint
```

### Import Resolution Issues

**Problem**: TypeScript can't resolve modules

**Solution**:
```bash
# Check tsconfig paths
cat tsconfig.json | jq .compilerOptions.paths

# Verify build output exists
ls -la dist/cjs/
ls -la dist/esm/

# Rebuild
npm run build
```

### Git Hook Failures

**Problem**: Husky pre-commit fails

**Solution**:
```bash
# Check hook configuration
cat .husky/pre-commit
cat .lintstagedrc.json

# Manually run staged checks
npx lint-staged

# Reinstall hooks
npm run prepare
```

### Schema Sync Issues

**Problem**: `verify:schemas` reports differences

**Solution**:
```bash
# Re-sync schemas
npm run prebuild

# Check diff
git diff src/schemas/ docs/mqtt_schema/

# Rebuild
npm run build
```

### Coverage Below Threshold

**Problem**: Test coverage insufficient

**Solution**:
```bash
# Check current coverage
npm run test:coverage

# Review uncovered lines
cat coverage/lcov-report/index.html

# Add tests for uncovered code
# Coverage thresholds: 85% lines, 75% branches, 65% functions
```

## Additional Resources

- [Contributing Guide](./CONTRIBUTING.md) - Contribution guidelines
- [Testing Guide](./TESTING.md) - Testing strategy and procedures
- [README](./README.md) - Package documentation
- [CHANGELOG](./docs/mqtt_schema/CHANGELOG.md) - Version history
- [ROADMAP](./ROADMAP.md) - Future development plans

## Getting Help

- **GitHub Issues**: Report bugs or request features
- **Discussions**: Ask questions or share ideas
- **Pull Requests**: Submit changes for review

---

**Note**: This guide is continuously updated. For the latest version, check the repository.
