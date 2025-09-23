#!/usr/bin/env node
/**
 * Release Integrity Check
 * Verifies that the current package.json version is mentioned in the CHANGELOG.
 * Warns if the heading still contains 'Pending' when running under a release commit context.
 */
const fs = require('fs');
const path = require('path');

const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf8'));
const changelogPath = path.resolve(__dirname, '../docs/mqtt_schema/CHANGELOG.md');
if (!fs.existsSync(changelogPath)) {
  console.error('[release-check] CHANGELOG missing:', changelogPath);
  process.exit(1);
}
const content = fs.readFileSync(changelogPath, 'utf8');
const version = pkg.version;

// Simple presence test
if (!content.includes(`v${version}`)) {
  console.error(`[release-check] Version v${version} not found in CHANGELOG.`);
  process.exit(1);
}

// Identify most recent heading containing the version
const headingRegex = new RegExp(`^## .*v${version}.*$`, 'm');
const match = content.match(headingRegex);
if (!match) {
  console.error(`[release-check] No heading line found for v${version}. Expected a line starting with '## ' including the version.`);
  process.exit(1);
}

const line = match[0];
const isPending = /Pending/i.test(line);
if (isPending) {
  console.warn(`[release-check] WARNING: v${version} heading still marked Pending. Finalize date before tagging for a polished release.`);
}

console.log(`[release-check] CHANGELOG contains version v${version}.`);
if (isPending) console.log('[release-check] Pending status allowed (non-fatal).');
