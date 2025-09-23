#!/usr/bin/env node
/**
 * Wiki Generator
 * Produces markdown pages suitable for pushing to the repository's GitHub Wiki.
 * Output directory: wiki_build/
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const docsDir = path.join(root, 'docs', 'mqtt_schema');
const outDir = path.join(root, 'wiki_build');
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

function read(p){
  try { return fs.readFileSync(p, 'utf8'); } catch { return ''; }
}

// Collect pieces
const changelog = read(path.join(docsDir, 'CHANGELOG.md'));
const validationRules = read(path.join(docsDir, 'validation_rules.md'));
const readme = read(path.join(root, 'README.md'));

// Derive schema table from README Provided Schemas section
function extractSection(md, heading){
  const lines = md.split(/\r?\n/);
  const startIdx = lines.findIndex(l => l.trim().toLowerCase() === heading.toLowerCase());
  if (startIdx === -1) return '';
  let buf = [];
  for (let i = startIdx+1; i < lines.length; i++) {
    if (/^## /i.test(lines[i])) break; // next top-level heading
    buf.push(lines[i]);
  }
  return buf.join('\n').trim();
}

const providedSchemas = extractSection(readme, '## Provided Schemas (v1)');
const classificationHeuristics = extractSection(readme, '### Classification Heuristics (Simplified)');

// Home page
const home = `# Alteriom MQTT Schema

This wiki is generated from the source repository docs. Do not edit pages here directly; update repository files instead and re-run the wiki sync workflow.

## Contents

- [[Schemas]]
- [[Classification]]
- [[Validation Rules]]
- [[Changelog]]
- [[Release Process]]
- [[Development]]

Generated: ${new Date().toISOString()}
`;

// Schemas page
const schemasPage = `# Schemas

Source of truth JSON Schema files live under 
\`docs/mqtt_schema/*.schema.json\`.

${providedSchemas || 'Schema table not extracted.'}

`;

// Classification page
const classificationPage = `# Classification

Automatic heuristic classification picks a validator in priority order.

${classificationHeuristics}

Excerpt of implementation (see \`src/validators.ts\`):

\`\`\`ts
${read(path.join(root, 'src', 'validators.ts')).split('\n').filter(l => l.includes('classifyAndValidate') || l.includes('if (data.metrics') || l.includes('progress_pct') || l.includes('fallback')).join('\n')}\n// (truncated for brevity)
\`\`\`
`;

// Validation Rules page
const rulesPage = validationRules.replace(/^# Validation Rules.*$/m, '# Validation Rules');

// Changelog page (keep as-is with top header adjusted)
const changelogPage = changelog.replace(/^# MQTT Schema Artifacts Changelog/, '# Changelog');

// Release Process: extract from PUBLISH_CHECKLIST.md
const publishChecklist = read(path.join(root, 'PUBLISH_CHECKLIST.md'));
const releasePage = `# Release Process\n\nThis is a rendered form of the publish checklist. Always verify in main branch for latest authoritative version.\n\n${publishChecklist}`;

// Development page: reuse README intro & build/test sections
function extractMulti(md, headings){
  return headings.map(h => extractSection(md, h)).filter(Boolean).join('\n\n');
}
const devSections = extractMulti(readme, ['## Installation','## Quick Start','### Embedded Schemas','## Versioning Policy']);
const developmentPage = `# Development\n\n${devSections}`;

const files = [
  ['Home.md', home],
  ['Schemas.md', schemasPage],
  ['Classification.md', schemasPage && classificationPage],
  ['Validation Rules.md', rulesPage],
  ['Changelog.md', changelogPage],
  ['Release Process.md', releasePage],
  ['Development.md', developmentPage]
];

for (const [fname, content] of files) {
  if (!content) continue;
  fs.writeFileSync(path.join(outDir, fname), content.trim() + '\n');
}

console.log('Wiki pages generated at', outDir, 'files:', fs.readdirSync(outDir));
