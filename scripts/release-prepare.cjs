#!/usr/bin/env node
/**
 * release-prepare.cjs
 * Convenience script to:
 * 1. Ensure git working tree is clean
 * 2. Parse desired semver bump or explicit version
 * 3. Update package.json version
 * 4. (Optional) Regenerate build artifacts (skip with --no-build)
 * 5. Auto-insert CHANGELOG placeholder section if missing
 * 6. Remind user to tag + publish steps
 *
 * Usage:
 *   node scripts/release-prepare.cjs --help
 *   npm run release:prepare -- patch
 *   npm run release:prepare -- minor
 *   npm run release:prepare -- major
 *   npm run release:prepare -- 0.2.0
 */

const fs = require('fs');
const path = require('path');
const cp = require('child_process');

function run(cmd) {
  return cp.execSync(cmd, { stdio: 'pipe' }).toString().trim();
}

function fail(msg) {
  console.error('\n[release:prepare] ERROR:', msg);
  process.exit(1);
}

function info(msg) {
  console.log('[release:prepare]', msg);
}

function parseArgs() {
  const raw = process.argv.slice(2);
  const flags = new Set(raw.filter(a => a.startsWith('--')));
  const positional = raw.filter(a => !a.startsWith('--') && a !== '--');
  if (flags.has('--help') || positional.length === 0) {
    console.log(`\nUsage: npm run release:prepare -- [options] <bump|version>\n\nBump values: patch | minor | major | <explicit-version>\n\nOptions:\n  --no-build     Skip running the build after version bump\n  --dry          Parse + display new version only (no file changes)\n  --help         Show this help\n\nExamples:\n  npm run release:prepare -- patch\n  npm run release:prepare -- --no-build minor\n  npm run release:prepare -- 0.1.2\n  npm run release:prepare -- --dry patch\n`);
    process.exit(0);
  }
  if (positional.length > 1) fail('Provide exactly one bump argument.');
  return { bumpArg: positional[0], flags };
}

function ensureCleanGit() {
  const status = run('git status --porcelain');
  if (status) {
    console.error(status);
    fail('Git working tree not clean. Commit or stash changes first.');
  }
  info('Git working tree is clean.');
}

function bumpVersion(current, bump) {
  if (/^\d+\.\d+\.\d+$/.test(bump)) return bump; // explicit
  const [maj, min, pat] = current.split('.').map(n => parseInt(n, 10));
  switch (bump) {
    case 'patch': return `${maj}.${min}.${pat + 1}`;
    case 'minor': return `${maj}.${min + 1}.0`;
    case 'major': return `${maj + 1}.0.0`;
    default: fail(`Unrecognized bump argument: ${bump}`);
  }
}

function updatePackageJson(newVersion) {
  const pkgPath = path.resolve(__dirname, '../package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const oldVersion = pkg.version;
  if (oldVersion === newVersion) fail(`New version equals current version (${oldVersion}).`);
  pkg.version = newVersion;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  info(`package.json version updated: ${oldVersion} -> ${newVersion}`);
}

function runBuild() {
  info('Running build...');
  run('npm run build');
  info('Build complete.');
}

function ensureChangelogSection(newVersion) {
  const changelogPath = path.resolve(__dirname, '../../../docs/mqtt_schema/CHANGELOG.md');
  if (!fs.existsSync(changelogPath)) {
    info('CHANGELOG not found, skipping placeholder insertion.');
    return;
  }
  const content = fs.readFileSync(changelogPath, 'utf8');
  if (content.includes(`v${newVersion}`) || content.includes(newVersion)) {
    info('CHANGELOG already references new version.');
    return;
  }
  const lines = content.split(/\r?\n/);
  const headerIndex = lines.findIndex(l => /^#\s+MQTT Schema Artifacts Changelog/i.test(l.trim()));
  const insertAt = headerIndex >= 0 ? headerIndex + 1 : 0;
  const date = new Date().toISOString().slice(0,10);
  const placeholder = [``, `## ${date} (v${newVersion} - Pending)`, `- _Add change notes here_`, ``];
  lines.splice(insertAt, 0, ...placeholder);
  fs.writeFileSync(changelogPath, lines.join('\n'));
  info('Inserted CHANGELOG placeholder section.');
}

function gitAddHint(newVersion) {
  console.log(`\nNext steps:\n  1. Update CHANGELOG at docs/mqtt_schema/CHANGELOG.md if not already.\n  2. Review diff: git diff\n  3. Commit: git commit -am "release: mqtt-schema v${newVersion}"\n  4. Tag:    git tag -a mqtt-schema-v${newVersion} -m "@alteriom/mqtt-schema v${newVersion}"\n  5. Push:   git push origin main --tags\n  6. Publish: npm publish --access public\n  7. Verify on npm + run sandbox install test.\n`);
}

(function main() {
  const { bumpArg, flags } = parseArgs();
  ensureCleanGit();
  const pkgPath = path.resolve(__dirname, '../package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const newVersion = bumpVersion(pkg.version, bumpArg);
  if (flags.has('--dry')) {
    console.log(`Dry run: current=${pkg.version} next=${newVersion}`);
    return;
  }
  updatePackageJson(newVersion);
  ensureChangelogSection(newVersion);
  if (!flags.has('--no-build')) {
    runBuild();
  } else {
    info('Skipping build due to --no-build flag.');
  }
  gitAddHint(newVersion);
})();
