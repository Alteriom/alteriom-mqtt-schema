---
name: Bug Report
about: Report a bug or unexpected behavior
title: '[BUG] '
labels: bug
assignees: ''
---

## Bug Description

A clear and concise description of what the bug is.

## Steps to Reproduce

1. Install package version '...'
2. Use the following code: '...'
3. Observe error: '...'

## Expected Behavior

A clear description of what you expected to happen.

## Actual Behavior

What actually happened instead.

## Code Example

```typescript
// Minimal reproducible example
import { validators } from '@alteriom/mqtt-schema';

const payload = {
  // Your test payload
};

const result = validators.sensorData(payload);
console.log(result);
```

## Environment

- **Package Version**: [e.g., 0.7.2]
- **Node.js Version**: [e.g., 20.10.0]
- **npm Version**: [e.g., 10.2.0]
- **Operating System**: [e.g., Ubuntu 22.04, macOS 14, Windows 11]
- **Module System**: [e.g., CommonJS, ESM]

## Error Messages

```
Paste any error messages or stack traces here
```

## Additional Context

Add any other context about the problem here:
- Related schemas or message types
- Build configuration
- Other packages that might be involved

## Possible Solution

If you have ideas on how to fix the issue, please share them here.

## Checklist

- [ ] I have searched existing issues to avoid duplicates
- [ ] I have tested with the latest version
- [ ] I can reproduce this issue consistently
- [ ] I have provided a minimal reproducible example
