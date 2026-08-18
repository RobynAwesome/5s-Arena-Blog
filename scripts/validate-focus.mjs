import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

const [main, focusPage, focusView, focusLib, atmosphere, floatingNav, pkg, tsconfig] = await Promise.all([
  read('src/main.jsx'),
  read('src/routes/FocusPostPage.tsx'),
  read('src/components/ArticleFocusView.tsx'),
  read('src/lib/articleFocus.ts'),
  read('src/components/FocusAtmosphere.tsx'),
  read('src/components/FloatingNavDropdown.jsx'),
  read('package.json'),
  read('tsconfig.json'),
]);

const packageJson = JSON.parse(pkg);
const tsConfig = JSON.parse(tsconfig);

assert.equal(packageJson.devDependencies.typescript, '^7.0.2');
assert.equal(packageJson.devDependencies.vite, '^8.1.5');
assert.equal(packageJson.dependencies.three, '^0.184.0');
assert.equal(tsConfig.compilerOptions.strict, true);
assert.equal(tsConfig.compilerOptions.allowJs, true);
assert.equal(tsConfig.compilerOptions.noEmit, true);
assert.ok(!('baseUrl' in tsConfig.compilerOptions));

assert.match(main, /FocusPostPage/);
assert.match(main, /path:\s*["']\/focus\/:slug["']/);
assert.ok(
  main.indexOf('path: "/focus/:slug"') < main.indexOf('path: "/:slug"'),
  'Focus route must be registered before the catch-all article slug.',
);
assert.doesNotMatch(main, /ConvictionPage|\/conviction/);

assert.match(focusPage, /getPostBySlug/);
assert.match(focusPage, /ArticleFocusView/);
assert.match(focusView, /Focus view/);
assert.match(focusView, /Swipe or use the arrows/);
assert.match(focusView, /Standard/);
assert.match(focusView, /min-h-11/);
assert.match(focusView, /useReducedMotion/);
assert.match(focusLib, /DOMParser/);
assert.match(focusLib, /MAX_FRAMES = 24/);
assert.match(atmosphere, /prefers-reduced-motion: reduce/);
assert.match(atmosphere, /WebGLRenderer/);
assert.match(atmosphere, /compact \? 120 : 240/);

assert.match(floatingNav, /label: "Focus"/);
assert.match(floatingNav, /label: "Standard"/);
assert.match(floatingNav, /\/focus\/\$\{slug\}/);
assert.match(floatingNav, /RESERVED_ROOTS/);

for (const text of [main, focusPage, focusView, focusLib, atmosphere, floatingNav]) {
  assert.doesNotMatch(text, /A-Reece|Paradise|prediction|rupture|conviction/i);
}

console.log('Article focus proof: PASS');
