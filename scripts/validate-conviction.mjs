import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

const [data, page, atmosphere, main, pkg, tsconfig] = await Promise.all([
  read('src/data/convictionStories.ts'),
  read('src/routes/ConvictionPage.tsx'),
  read('src/components/ConvictionAtmosphere.tsx'),
  read('src/main.jsx'),
  read('package.json'),
  read('tsconfig.json'),
]);

const packageJson = JSON.parse(pkg);
const tsConfig = JSON.parse(tsconfig);

assert.equal(packageJson.devDependencies.typescript, '^7.0.2');
assert.equal(packageJson.dependencies.three, '^0.184.0');
assert.equal(tsConfig.compilerOptions.strict, true);
assert.equal(tsConfig.compilerOptions.allowJs, true);
assert.equal(tsConfig.compilerOptions.noEmit, true);

assert.match(main, /ConvictionPage/);
assert.match(main, /path:\s*["']\/conviction["']/);
assert.ok(
  main.indexOf('path: "/conviction"') < main.indexOf('path: "/:slug"'),
  'Conviction route must be registered before the catch-all post slug.',
);

for (const year of ['2016', '2017', '2020', '2021', '2023', '2024', '2025', '2026']) {
  assert.match(data, new RegExp(`year: ['\"]${year}['\"]`));
}

for (const phase of ['prediction', 'rupture', 'pressure', 'recovery', 'proof']) {
  assert.match(data, new RegExp(`phase: ['\"]${phase}['\"]`));
}

assert.match(data, /sourceHref/);
assert.match(data, /father’s death put him in a dark place/);
assert.match(data, /Bojack/);
assert.match(page, /Conviction stream/);
assert.match(page, /Active evidence state/);
assert.match(page, /Source receipt/);
assert.match(page, /Prediction is interesting\. Receipts make it conviction\./);
assert.match(atmosphere, /prefers-reduced-motion: reduce/);
assert.match(atmosphere, /WebGLRenderer/);
assert.match(atmosphere, /targetFrameMs/);

console.log('Conviction editorial proof: PASS');
