# Testing Guide

This guide covers the testing strategy, procedures, and best practices for `@alteriom/mqtt-schema`.

## Table of Contents

- [Testing Philosophy](#testing-philosophy)
- [Test Structure](#test-structure)
- [Running Tests](#running-tests)
- [Test Coverage](#test-coverage)
- [Writing Tests](#writing-tests)
- [Fixture-Based Testing](#fixture-based-testing)
- [Performance Testing](#performance-testing)
- [Continuous Integration](#continuous-integration)

## Testing Philosophy

### Goals

1. **Correctness**: Ensure validators correctly accept valid messages and reject invalid ones
2. **Compatibility**: Verify both CJS and ESM builds work identically
3. **Performance**: Maintain fast validation (< 1ms per message)
4. **Regression Prevention**: Catch breaking changes early

### Testing Pyramid

```
       /\
      /  \     Integration Tests (13 tests)
     /____\    Dual-build, HTTP transport
    /      \   
   /        \  Unit Tests (56 tests)
  /__________\ Validators, Classification
 /            \
/______________\ Fixture Tests (98+ fixtures)
                 Real-world message samples
```

## Test Structure

### Directory Layout

```
test/
├── unit/                          # Unit tests (Vitest)
│   ├── classification.test.ts     # Message classification logic
│   └── validators.test.ts         # Individual validator functions
│
├── integration/                   # Integration tests
│   ├── dual-build.test.ts         # CJS/ESM compatibility
│   └── http-transport.test.ts     # HTTP metadata validation
│
├── benchmarks/                    # Performance benchmarks
│   ├── classification.bench.ts    # Classification speed tests
│   └── validation.bench.ts        # Validator performance
│
├── artifacts/                     # Test outputs (gitignored)
│
└── validate-fixtures.cjs          # Fixture validation runner
```

### Test Categories

1. **Unit Tests**: Fast, isolated tests of individual functions
2. **Integration Tests**: Tests across module boundaries
3. **Fixture Tests**: Schema validation against real message samples
4. **Benchmark Tests**: Performance measurement and regression detection

## Running Tests

### Quick Commands

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run fixture validation only
npm run test:fixtures

# Run with coverage
npm run test:coverage

# Run benchmarks
npm run bench

# Watch mode (during development)
npm run test:unit:watch

# UI mode (interactive)
npm run test:unit:ui
```

### Detailed Test Execution

#### Unit Tests (Vitest)

```bash
npm run test:unit
```

**What it tests**:
- Validator function behavior
- Type guard functions
- Classification logic with message type codes
- Heuristic classification fallback
- Error message formatting

**Expected output**:
```
✓ test/unit/classification.test.ts (28 tests)
✓ test/unit/validators.test.ts (28 tests)
✓ test/integration/http-transport.test.ts (13 tests)
✓ test/integration/dual-build.test.ts (13 tests)

Test Files  4 passed (4)
     Tests  82 passed (82)
```

#### Fixture Tests

```bash
npm run test:fixtures
```

**What it tests**:
- All fixtures in `docs/mqtt_schema/fixtures/`
- Both valid and invalid message examples
- CJS and ESM build compatibility
- Schema enforcement across all message types

**Expected output**:
```
Testing CommonJS build...
✓ sensor_data_valid.json
✓ gateway_metrics_valid.json
...
✓ All 49 CJS fixtures passed

Testing ESM build...
✓ sensor_data_valid.json
✓ gateway_metrics_valid.json
...
✓ All 49 ESM fixtures passed

Total: 98 fixture tests passed
```

#### OTA Manifest Validation

```bash
npm run test:ota
```

**What it tests**:
- OTA manifest schema validation
- Semantic versioning format
- Update channel constraints
- File integrity metadata

#### Verification Suite

```bash
npm run verify
```

**What it runs**:
1. `verify:schemas` - Schema sync check
2. `verify:release` - CHANGELOG validation
3. `test` - Full test suite

Use before committing or pushing.

### Watch Mode

For active development:

```bash
npm run test:unit:watch
```

**Features**:
- Re-runs tests on file changes
- Runs only affected tests
- Interactive filtering
- Fast feedback loop

**Usage**:
- Press `a` to run all tests
- Press `f` to run only failed tests
- Press `p` to filter by filename
- Press `t` to filter by test name
- Press `q` to quit

## Test Coverage

### Current Coverage

**Coverage Targets** (configured in `vitest.config.mts`):
- **Statements**: 85%
- **Branches**: 75%
- **Functions**: 65%
- **Lines**: 85%

**Actual Coverage** (as of v0.8.1):
- **Statements**: ~81%
- **Branches**: ~60%
- **Functions**: ~55%
- **Lines**: ~82%

### Viewing Coverage Reports

Generate coverage report:

```bash
npm run test:coverage
```

**Output**:
- Console summary
- `coverage/` directory with HTML report
- `coverage/lcov.info` for CI tools

**View HTML report**:
```bash
# Open in browser
open coverage/lcov-report/index.html

# Or use a local server
npx http-server coverage/lcov-report
```

### Coverage by Module

| Module | Statements | Branches | Functions | Lines |
|--------|-----------|----------|-----------|-------|
| `validators.ts` | 81% | 60% | 55% | 82% |
| `index.ts` | 0% | 0% | 0% | 0% |
| `types.ts` | 0% | 0% | 0% | 0% |

**Note**: `index.ts` and `types.ts` are re-export modules (not testable with current setup).

### Improving Coverage

Focus areas for coverage improvement:

1. **Validators**: Test edge cases and error paths
2. **Classification**: Test all heuristic branches
3. **Type Guards**: Verify behavior with malformed input
4. **Error Handling**: Test validation error messages

## Writing Tests

### Unit Test Example

**File**: `test/unit/validators.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { validators } from '../../src/validators';

describe('Validator: sensorData', () => {
  it('should validate valid sensor data', () => {
    const payload = {
      schema_version: 1,
      message_type: 200,
      device_id: 'SN001',
      device_type: 'sensor',
      timestamp: new Date().toISOString(),
      firmware_version: 'SN 2.1.5',
      sensors: {
        temperature: { value: 22.5, unit: 'C' }
      }
    };
    
    const result = validators.sensorData(payload);
    expect(result.valid).toBe(true);
    expect(result.errors).toBeUndefined();
  });
  
  it('should reject sensor data with missing required field', () => {
    const payload = {
      schema_version: 1,
      message_type: 200,
      device_id: 'SN001',
      // Missing device_type
      timestamp: new Date().toISOString(),
      firmware_version: 'SN 2.1.5'
    };
    
    const result = validators.sensorData(payload);
    expect(result.valid).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.errors?.[0]).toContain('device_type');
  });
});
```

### Integration Test Example

**File**: `test/integration/dual-build.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

describe('Dual Build Compatibility', () => {
  it('should export validators from CJS build', async () => {
    const { stdout } = await execAsync(
      `node -e "const {validators} = require('./dist/cjs/index.js'); console.log(typeof validators.sensorData)"`
    );
    expect(stdout.trim()).toBe('function');
  });
  
  it('should export validators from ESM build', async () => {
    const { stdout } = await execAsync(
      `node --input-type=module -e "import {validators} from './dist/esm/index.js'; console.log(typeof validators.sensorData)"`
    );
    expect(stdout.trim()).toBe('function');
  });
});
```

### Test Best Practices

1. **Descriptive Names**: Use clear, specific test names
2. **Arrange-Act-Assert**: Structure tests consistently
3. **Single Assertion**: Test one thing per test (when practical)
4. **Avoid Hard-Coding**: Use constants for message type codes
5. **Test Edge Cases**: Invalid input, boundary values, null/undefined
6. **Fast Tests**: Keep unit tests under 10ms each

## Fixture-Based Testing

### Fixture Directory Structure

```
docs/mqtt_schema/fixtures/
├── sensor_data_valid.json           # Valid sensor data
├── sensor_data_invalid.json         # Invalid sensor data
├── gateway_metrics_valid.json       # Valid gateway metrics
├── firmware_status_ota_valid.json   # OTA update status
├── bridge_status_valid.json         # Bridge management
└── ...                              # 49+ fixtures
```

### Creating Fixtures

1. **Create JSON file** in `docs/mqtt_schema/fixtures/`:
   ```bash
   touch docs/mqtt_schema/fixtures/new_message_valid.json
   ```

2. **Define message structure**:
   ```json
   {
     "schema_version": 1,
     "message_type": 200,
     "device_id": "TEST001",
     "device_type": "sensor",
     "timestamp": "2025-01-01T00:00:00.000Z",
     "firmware_version": "SN 2.1.5",
     "sensors": {
       "temperature": {
         "value": 22.5,
         "unit": "C"
       }
     }
   }
   ```

3. **Test fixture**:
   ```bash
   npm run test:fixtures
   ```

### Fixture Naming Convention

- `<message_type>_valid.json` - Valid message
- `<message_type>_invalid.json` - Invalid message
- `<message_type>_<variant>.json` - Specific variant

**Examples**:
- `sensor_data_valid.json`
- `sensor_data_minimal.json`
- `gateway_metrics_full.json`
- `bridge_coordination_roundrobin.json`

### Fixture Validation Process

The `validate-fixtures.cjs` script:

1. Loads all fixtures from `docs/mqtt_schema/fixtures/`
2. Detects message type from filename or content
3. Validates against appropriate schema
4. Tests both CJS and ESM builds
5. Reports validation errors with JSON Pointer paths

## Performance Testing

### Running Benchmarks

```bash
# Run all benchmarks
npm run bench

# Classification only
npm run bench:classification

# Validation only
npm run bench:validation
```

### Benchmark Results

**Classification Performance** (with message_type):
- Average: < 0.01ms per message (O(1) lookup)
- 100x faster than heuristic classification

**Validation Performance**:
- Simple messages: < 0.1ms
- Complex messages: < 0.5ms
- OTA manifest: < 1ms

### Performance Targets

- **Classification**: < 0.1ms per message
- **Validation**: < 1ms per message
- **Batch Processing**: > 1000 messages/second

### Writing Benchmarks

**File**: `test/benchmarks/validation.bench.ts`

```typescript
import { Bench } from 'tinybench';
import { validators } from '../../src/validators';

const bench = new Bench();

const sampleMessage = {
  schema_version: 1,
  message_type: 200,
  device_id: 'SN001',
  device_type: 'sensor',
  timestamp: new Date().toISOString(),
  firmware_version: 'SN 2.1.5',
  sensors: {
    temperature: { value: 22.5, unit: 'C' }
  }
};

bench
  .add('validate sensor data', () => {
    validators.sensorData(sampleMessage);
  })
  .run()
  .then(() => {
    console.table(bench.table());
  });
```

## Continuous Integration

### GitHub Actions Workflows

#### Test Workflow

**File**: `.github/workflows/test.yml`

**Triggers**:
- Push to `main` branch
- Pull request to `main`
- Manual workflow dispatch

**Steps**:
1. Checkout code
2. Setup Node.js (matrix: 18, 20, 22)
3. Install dependencies
4. Run linter
5. Run build
6. Run tests
7. Upload coverage

#### Schema Verification

**File**: `.github/workflows/schema-verify.yml`

**Purpose**: Ensure schema sync integrity

**Runs**:
- `npm run verify:schemas`
- Fails if schemas are out of sync

#### OTA Manifest Validation

**File**: `.github/workflows/validate-ota-manifest.yml`

**Purpose**: Validate OTA manifest schema

**Runs**:
- `npm run test:ota`
- Validates OTA manifest structure

### CI Requirements

For pull requests to be merged:

- ✅ All tests must pass
- ✅ Linter must pass
- ✅ Build must succeed
- ✅ Coverage must meet thresholds (or have justification)
- ✅ Schema verification must pass

### Local Pre-Push Checks

Run before pushing:

```bash
# Full verification
npm run verify

# If passing, safe to push
git push
```

## Test Maintenance

### When to Update Tests

- **New Features**: Add tests for new validators or message types
- **Bug Fixes**: Add regression test before fixing
- **Refactoring**: Ensure tests still pass
- **Schema Changes**: Update fixtures and validation tests

### Test Cleanup

Remove obsolete tests when:
- Features are removed (after deprecation period)
- Message types are sunset
- Tests are superseded by better coverage

### Fixture Maintenance

Keep fixtures up-to-date:
- Update when schemas change
- Add new variants for edge cases
- Remove fixtures for deprecated message types
- Ensure fixtures represent real-world usage

## Troubleshooting Tests

### Common Test Failures

#### "Cannot find module" errors

**Cause**: Build artifacts missing

**Solution**:
```bash
npm run build
npm test
```

#### Fixture validation fails

**Cause**: Schema changes not synced

**Solution**:
```bash
npm run prebuild
npm run build
npm run test:fixtures
```

#### Coverage below threshold

**Cause**: New code added without tests

**Solution**:
```bash
npm run test:coverage
# Review uncovered lines
# Add tests for uncovered code
```

#### ESM/CJS compatibility issues

**Cause**: Build configuration mismatch

**Solution**:
```bash
npm run clean
npm run build
npm test
```

### Getting Help

- Check existing test files for examples
- Review [DEVELOPMENT.md](./DEVELOPMENT.md) for build setup
- Open an issue if tests are unclear or failing unexpectedly

## Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [JSON Schema Validation](https://json-schema.org/)
- [Ajv Documentation](https://ajv.js.org/)
- [Contributing Guide](./CONTRIBUTING.md)

---

**Note**: This guide is continuously updated. For the latest version, check the repository.
