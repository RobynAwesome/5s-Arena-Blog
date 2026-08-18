import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

const [
  main,
  focusPage,
  focusView,
  focusLib,
  atmosphere,
  weatherOperations,
  weatherHook,
  organismRoute,
  serverIndex,
  floatingNav,
  pkg,
  tsconfig,
] = await Promise.all([
  read('src/main.jsx'),
  read('src/routes/FocusPostPage.tsx'),
  read('src/components/ArticleFocusView.tsx'),
  read('src/lib/articleFocus.ts'),
  read('src/components/FocusAtmosphere.tsx'),
  read('src/lib/weatherOperations.ts'),
  read('src/hooks/useArenaWeather.ts'),
  read('server/routes/organism.js'),
  read('server/index.js'),
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
assert.match(focusPage, /useArenaWeather/);
assert.match(focusPage, /searchParams\.get\('province'\)/);
assert.match(focusPage, /ArticleFocusView/);
assert.match(focusView, /Focus view/);
assert.match(focusView, /Swipe or use the arrows/);
assert.match(focusView, /Standard/);
assert.match(focusView, /min-h-11/);
assert.match(focusView, /useReducedMotion/);
assert.match(focusView, /weatherContext\?\.operations/);
assert.match(focusView, /data-weather-status/);
assert.match(focusLib, /DOMParser/);
assert.match(focusLib, /MAX_FRAMES = 24/);

// Canonical province/weather truth is consumed rather than re-fetched from a
// second browser-side provider. Unavailable upstream truth stays unavailable.
assert.match(weatherHook, /fivesarena\.locality\.v1/);
assert.match(weatherHook, /\/organism\/weather/);
assert.match(weatherHook, /NEUTRAL_WEATHER_OPERATIONS/);
assert.doesNotMatch(weatherHook, /open-meteo|api\.open-meteo/i);
assert.match(organismRoute, /https:\/\/fivesarena\.com/);
assert.match(organismRoute, /\/api\/organism\/feed\?province=/);
assert.match(organismRoute, /canonical-fivesarena-organism/);
assert.doesNotMatch(organismRoute, /api\.open-meteo/i);
assert.ok(
  serverIndex.indexOf('app.use("/api/organism", organismRoutes)') <
    serverIndex.indexOf('app.use(async (req, res, next)'),
  'Public weather context must not depend on MongoDB middleware.',
);

// Towers weather invariants: storm is a stronger rain operation over the same
// preallocated pool; draw ranges change active counts; snow remembers buildup;
// lightning is a transient light rather than another scene.
assert.match(weatherOperations, /mode: storm \? 'storm' : 'rain'/);
assert.match(weatherOperations, /code === 82 \|\| code === 95 \|\| code === 96 \|\| code === 99/);
assert.match(weatherOperations, /accumulationRate/);
assert.match(atmosphere, /WebGLRenderer/);
assert.match(atmosphere, /maxRain = compact \? 280 : 720/);
assert.match(atmosphere, /maxSnow = compact \? 180 : 460/);
assert.match(atmosphere, /setDrawRange\(0, 0\)/);
assert.match(atmosphere, /rainGeometry\.setDrawRange\(0, rainCount\)/);
assert.match(atmosphere, /snowGeometry\.setDrawRange\(0, snowCount\)/);
assert.match(atmosphere, /snowAccumulation/);
assert.match(atmosphere, /PointLight/);
assert.match(atmosphere, /returnStrokes/);
assert.match(atmosphere, /operations\.mode === 'storm'/);
assert.doesNotMatch(atmosphere, /stormGeometry|stormPoints|new THREE\.Scene\(\).*storm/i);
assert.match(atmosphere, /data-weather-engine="towers-operations"/);

assert.match(floatingNav, /label: "Focus"/);
assert.match(floatingNav, /label: "Standard"/);
assert.match(floatingNav, /\/focus\/\$\{slug\}\$\{contextSuffix\}/);
assert.match(floatingNav, /location\.search/);
assert.match(floatingNav, /RESERVED_ROOTS/);

for (const text of [main, focusPage, focusView, focusLib, floatingNav]) {
  assert.doesNotMatch(text, /A-Reece|Paradise|prediction|rupture|conviction/i);
}

console.log('Article focus + weather operations proof: PASS');
