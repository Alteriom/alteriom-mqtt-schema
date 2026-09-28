import { execFileSync } from 'node:child_process';
import { cpSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

const temporaryDirectories: string[] = [];

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true });
  }
});

describe('release preparation', () => {
  it('updates both package manifests and the schema changelog', () => {
    const repository = mkdtempSync(resolve(tmpdir(), 'mqtt-schema-release-'));
    temporaryDirectories.push(repository);
    mkdirSync(resolve(repository, 'scripts'));
    mkdirSync(resolve(repository, 'docs/mqtt_schema'), { recursive: true });
    cpSync(resolve(process.cwd(), 'scripts/release-prepare.cjs'), resolve(repository, 'scripts/release-prepare.cjs'));
    writeFileSync(resolve(repository, 'package.json'), '{"name":"fixture","version":"0.8.2"}\n');
    writeFileSync(
      resolve(repository, 'package-lock.json'),
      '{"name":"fixture","version":"0.8.2","lockfileVersion":3,"packages":{"":{"name":"fixture","version":"0.8.2"}}}\n'
    );
    writeFileSync(resolve(repository, 'docs/mqtt_schema/CHANGELOG.md'), '# MQTT Schema Artifacts Changelog\n');
    execFileSync('git', ['init', '--initial-branch=main'], { cwd: repository });
    execFileSync('git', ['config', 'user.email', 'release-test@example.com'], { cwd: repository });
    execFileSync('git', ['config', 'user.name', 'Release Test'], { cwd: repository });
    execFileSync('git', ['add', '--', 'package.json', 'package-lock.json', 'scripts/release-prepare.cjs', 'docs/mqtt_schema/CHANGELOG.md'], { cwd: repository });
    execFileSync('git', ['commit', '-m', 'test fixture'], { cwd: repository });

    execFileSync('node', ['scripts/release-prepare.cjs', '--no-build', '0.8.3'], { cwd: repository });

    const packageJson = JSON.parse(readFileSync(resolve(repository, 'package.json'), 'utf8'));
    const packageLock = JSON.parse(readFileSync(resolve(repository, 'package-lock.json'), 'utf8'));
    const changelog = readFileSync(resolve(repository, 'docs/mqtt_schema/CHANGELOG.md'), 'utf8');
    expect(packageJson.version).toBe('0.8.3');
    expect(packageLock.version).toBe('0.8.3');
    expect(packageLock.packages[''].version).toBe('0.8.3');
    expect(changelog).toContain('v0.8.3 - Pending');
  });
});
