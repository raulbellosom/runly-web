import { test, expect } from 'vitest';
import { validateTarget, deployPlan, deploy, rollback, MARKER, checkTargetState, pruneReleases } from './deploy-static.mjs';

const BUILD = ['dist/index.html', 'dist/modulos/index.html', 'dist/en/modulos/index.html', 'dist/sitemap-index.xml', 'dist/robots.txt'].map((p) => p.replace(/\//g, '\\'));
// In-memory filesystem keyed by POSIX path; build files are checked with resolve() (OS path).
function fakeFs({ target = '/var/www/runly.mx', entries = [MARKER, 'index.html'], releases = [], built = true } = {}) {
  const dirs = new Map([[target, [...entries]], [`${target}.releases`, [...releases]]]);
  const files = new Set();
  return {
    dirs, files,
    existsSync: (path) => dirs.has(path) || files.has(path) || (built && (BUILD.some((b) => String(path).endsWith(b)) || /dist[\\/]/.test(String(path)) && BUILD.some((b) => String(path).replace(/\//g, '\\').endsWith(b)))) || (/\/(index\.html|modulos\/index\.html|en\/modulos\/index\.html|sitemap-index\.xml|robots\.txt)$/.test(path) && String(path).startsWith(target)),
    lstatSync: (path) => ({ isSymbolicLink: () => false, isDirectory: () => dirs.has(path) }),
    readdirSync: (path) => dirs.get(path) ?? [],
    mkdirSync: (path) => { if (!dirs.has(path)) dirs.set(path, []); },
    writeFileSync: (path) => files.add(path),
    rmSync: (path) => { const [parent, name] = [path.slice(0, path.lastIndexOf('/')), path.slice(path.lastIndexOf('/') + 1)]; dirs.set(parent, (dirs.get(parent) ?? []).filter((n) => n !== name)); },
  };
}
const runner = (failOn = null, stdout = '') => { const calls = []; return { calls, run: (command, args) => { calls.push([command, ...args]); return { status: failOn && args.includes(failOn) ? 1 : 0, stdout: args.includes('--dry-run') ? stdout : '' }; } }; };

test('target guardrails: explicit, absolute, normalized, not broad, not overlapping the build', () => {
  for (const [target, code] of [[undefined, 'TARGET_REQUIRED'], ['', 'TARGET_REQUIRED'], ['/', 'TARGET_TOO_BROAD'], ['var/www/runly.mx', 'TARGET_MUST_BE_ABSOLUTE'], ['/var/www', 'TARGET_TOO_BROAD'], ['/srv', 'TARGET_TOO_BROAD'], ['/var/www/../../etc/x', 'TARGET_NOT_NORMALIZED'], ['/var/www/runly mx', 'TARGET_MUST_BE_ABSOLUTE'], ['/opt/runly-web/dist', 'TARGET_OVERLAPS_SOURCE']])
    expect(() => validateTarget(target, '/opt/runly-web/dist'), String(target)).toThrow(code);
  expect(validateTarget('/var/www/runly.mx/')).toBe('/var/www/runly.mx');
});

test('rsync never deletes outside the target and protects the marker; releases live outside the target', () => {
  const plan = deployPlan({ target: '/var/www/runly.mx', owner: 'www-data:www-data', stamp: 's1' });
  expect(plan.apply).toEqual(['rsync', ['-a', '--delete-after', '--filter', `P ${MARKER}`, '--chown=www-data:www-data', 'dist/', '/var/www/runly.mx/']]);
  expect(plan.dryRun[1]).toContain('--dry-run');
  expect(plan.release).toBe('/var/www/runly.mx.releases/s1');
  expect(plan.release.startsWith('/var/www/runly.mx/')).toBe(false);
  expect(() => deployPlan({ target: '/var/www/runly.mx', owner: 'root;rm -rf /' })).toThrow('OWNER_INVALID');
});

test('unmanaged non-empty targets are refused; an empty target is a first deploy', () => {
  expect(() => checkTargetState('/var/www/runly.mx', fakeFs({ entries: ['something-else'] }))).toThrow('TARGET_NOT_MANAGED');
  expect(checkTargetState('/var/www/runly.mx', fakeFs({ entries: [] })).firstDeploy).toBe(true);
});

test('deploy order: build, check, dry-run, backup, apply, health; --dry-run stops before changes', async () => {
  const fs = fakeFs(), r = runner(null, '*deleting   modulos/custom.old/index.html\n>f+++++++++ index.html\n');
  const preview = await deploy({ target: '/var/www/runly.mx', dryRun: true, run: r.run, fsOps: fs, stamp: 's1' });
  expect([preview.dryRun, preview.deletions, r.calls.map((c) => c[0])]).toEqual([true, 1, ['pnpm', 'rsync']]);
  const done = await deploy({ target: '/var/www/runly.mx', run: r.run, fsOps: fs, stamp: 's2' });
  expect(done.log).toEqual(['build', 'build_checked', 'dry_run', 'backup', 'apply', 'marker', 'healthy']);
  expect(done.release).toBe('/var/www/runly.mx.releases/s2');
});

test('a failed build or a failed health check never leaves a broken site', async () => {
  await expect(deploy({ target: '/var/www/runly.mx', run: runner('build').run, fsOps: fakeFs(), stamp: 's1' })).rejects.toThrow('BUILD_FAILED');
  const r = runner();
  const error = await deploy({ target: '/var/www/runly.mx', run: r.run, fsOps: fakeFs(), stamp: 's3', healthUrl: 'https://runly.mx', fetchImpl: async () => ({ status: 502 }) }).catch((e) => e);
  expect(error.code).toBe('HEALTH_CHECK_FAILED');
  expect(error.log).toContain('restored_previous_release');
  expect(r.calls.at(-1).slice(-2)).toEqual(['/var/www/runly.mx.releases/s3/', '/var/www/runly.mx/']);
});

test('rollback restores the newest release; old releases are pruned', () => {
  const fs = fakeFs({ releases: ['2026-10-01', '2026-10-09', '2026-10-05'] }), r = runner();
  expect(rollback({ target: '/var/www/runly.mx', run: r.run, fsOps: fs }).restored).toBe('/var/www/runly.mx.releases/2026-10-09');
  expect(() => rollback({ target: '/var/www/runly.mx', run: r.run, fsOps: fakeFs() })).toThrow('NO_RELEASE_TO_RESTORE');
  expect(pruneReleases('/var/www/runly.mx.releases', 1, fs)).toEqual(['2026-10-05', '2026-10-01']);
});
