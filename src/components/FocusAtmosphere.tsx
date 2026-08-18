import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  NEUTRAL_WEATHER_OPERATIONS,
  type WeatherOperations,
} from '@/lib/weatherOperations';

type FocusAtmosphereProps = {
  accent?: string;
  progress: number;
  weather?: WeatherOperations;
};

type RuntimeState = {
  accent: string;
  progress: number;
  weather: WeatherOperations;
};

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

export default function FocusAtmosphere({
  accent = '#22c55e',
  progress,
  weather = NEUTRAL_WEATHER_OPERATIONS,
}: FocusAtmosphereProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const runtimeRef = useRef<RuntimeState>({ accent, progress, weather });

  useEffect(() => {
    runtimeRef.current = { accent, progress, weather };
  }, [accent, progress, weather]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const width = mount.clientWidth || window.innerWidth;
    const height = mount.clientHeight || window.innerHeight;
    const compact = width < 520;
    const maxRain = compact ? 280 : 720;
    const maxSnow = compact ? 180 : 460;
    const ambientCount = compact ? 72 : 150;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, compact ? 1.15 : 1.45));
    renderer.setSize(width, height, false);
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.setAttribute('aria-hidden', 'true');
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x071018, weather.fogDensity);

    const camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 100);
    camera.position.z = 7;

    // Reused mutable colour target: no Color allocation in the render loop.
    const accentTarget = new THREE.Color(accent);

    const root = new THREE.Group();
    scene.add(root);

    const hemisphere = new THREE.HemisphereLight(0xdbeafe, 0x071018, 0.72);
    scene.add(hemisphere);

    const keyLight = new THREE.DirectionalLight(accentTarget.clone(), 0.58);
    keyLight.position.set(2.5, 4, 5);
    scene.add(keyLight);

    const lightning = new THREE.PointLight(0xdbeafe, 0, 20, 1.6);
    lightning.position.set(1.5, 4.5, 4);
    scene.add(lightning);

    // Quiet ambient layer keeps Focus visually alive without pretending it is weather.
    const ambientPositions = new Float32Array(ambientCount * 3);
    for (let index = 0; index < ambientCount; index += 1) {
      const stride = index * 3;
      ambientPositions[stride] = (Math.random() - 0.5) * 11;
      ambientPositions[stride + 1] = (Math.random() - 0.5) * 8;
      ambientPositions[stride + 2] = (Math.random() - 0.5) * 7;
    }
    const ambientGeometry = new THREE.BufferGeometry();
    ambientGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(ambientPositions, 3),
    );
    const ambientMaterial = new THREE.PointsMaterial({
      color: accentTarget.clone(),
      size: compact ? 0.04 : 0.032,
      transparent: true,
      opacity: 0.12,
      depthWrite: false,
    });
    const ambientPoints = new THREE.Points(ambientGeometry, ambientMaterial);
    root.add(ambientPoints);

    // Towers invariant: allocate precipitation pools once, then expose only the
    // active slice through setDrawRange. Weather transitions never rebuild them.
    const rainPositions = new Float32Array(maxRain * 3);
    const rainDepth = new Float32Array(maxRain);
    const resetRain = (index: number, top = false) => {
      const stride = index * 3;
      rainPositions[stride] = (Math.random() - 0.5) * 11;
      rainPositions[stride + 1] = top ? 4 + Math.random() * 3 : (Math.random() - 0.5) * 9;
      rainPositions[stride + 2] = (Math.random() - 0.5) * 6;
      rainDepth[index] = 0.7 + Math.random() * 0.65;
    };
    for (let index = 0; index < maxRain; index += 1) resetRain(index);

    const rainGeometry = new THREE.BufferGeometry();
    const rainPositionAttribute = new THREE.BufferAttribute(rainPositions, 3);
    rainPositionAttribute.setUsage(THREE.DynamicDrawUsage);
    rainGeometry.setAttribute('position', rainPositionAttribute);
    rainGeometry.setDrawRange(0, 0);
    const rainMaterial = new THREE.PointsMaterial({
      color: 0xb9dcff,
      size: compact ? 0.032 : 0.025,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    const rainPoints = new THREE.Points(rainGeometry, rainMaterial);
    scene.add(rainPoints);

    const snowPositions = new Float32Array(maxSnow * 3);
    const snowPhase = new Float32Array(maxSnow);
    const resetSnow = (index: number, top = false) => {
      const stride = index * 3;
      snowPositions[stride] = (Math.random() - 0.5) * 10;
      snowPositions[stride + 1] = top ? 4 + Math.random() * 3 : (Math.random() - 0.5) * 9;
      snowPositions[stride + 2] = (Math.random() - 0.5) * 5;
      snowPhase[index] = Math.random() * Math.PI * 2;
    };
    for (let index = 0; index < maxSnow; index += 1) resetSnow(index);

    const snowGeometry = new THREE.BufferGeometry();
    const snowPositionAttribute = new THREE.BufferAttribute(snowPositions, 3);
    snowPositionAttribute.setUsage(THREE.DynamicDrawUsage);
    snowGeometry.setAttribute('position', snowPositionAttribute);
    snowGeometry.setDrawRange(0, 0);
    const snowMaterial = new THREE.PointsMaterial({
      color: 0xf3f8ff,
      size: compact ? 0.07 : 0.055,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    const snowPoints = new THREE.Points(snowGeometry, snowMaterial);
    scene.add(snowPoints);

    // Accumulation persists for the lifetime of the scene when snowfall stops,
    // matching Towers' memory-of-weather behavior rather than snapping to zero.
    const accumulationMaterial = new THREE.MeshBasicMaterial({
      color: 0xf3f8ff,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    const accumulation = new THREE.Mesh(
      new THREE.PlaneGeometry(14, 2.4),
      accumulationMaterial,
    );
    accumulation.position.set(0, -3.8, -1.8);
    scene.add(accumulation);

    const ringMaterial = new THREE.MeshBasicMaterial({
      color: accentTarget.clone(),
      transparent: true,
      opacity: 0.07,
      depthWrite: false,
    });
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.7, 0.012, 8, 96),
      ringMaterial,
    );
    ring.rotation.x = Math.PI * 0.61;
    ring.rotation.y = Math.PI * 0.2;
    root.add(ring);

    let raf = 0;
    let lastFrame = 0;
    let snowAccumulation = 0;
    let lightningEnergy = 0;
    let returnStrokes = 0;
    let nextLightningAt = performance.now() + 2500 + Math.random() * 3500;
    const targetFrameMs = compact ? 1000 / 24 : 1000 / 36;

    const render = (time: number) => {
      raf = window.requestAnimationFrame(render);
      if (document.hidden || time - lastFrame < targetFrameMs) return;

      const deltaSeconds = Math.min(0.05, Math.max(0.001, (time - lastFrame) / 1000));
      lastFrame = time;

      const state = runtimeRef.current;
      const operations = state.weather;
      const rainCount = Math.floor(maxRain * clamp01(operations.rainIntensity));
      const snowCount = Math.floor(maxSnow * clamp01(operations.snowIntensity));
      accentTarget.set(state.accent);

      rainGeometry.setDrawRange(0, rainCount);
      snowGeometry.setDrawRange(0, snowCount);
      rainMaterial.opacity = 0.22 + operations.rainIntensity * 0.5;
      snowMaterial.opacity = 0.36 + operations.snowIntensity * 0.52;

      ambientMaterial.color.lerp(accentTarget, 0.08);
      ringMaterial.color.lerp(accentTarget, 0.08);
      keyLight.color.lerp(accentTarget, 0.06);
      ambientMaterial.opacity =
        0.07 + clamp01(state.progress) * 0.08 + operations.lightLevel * 0.025;
      ringMaterial.opacity = 0.04 + clamp01(state.progress) * 0.05;

      const targetFog = operations.fogDensity;
      if (scene.fog instanceof THREE.FogExp2) {
        scene.fog.density += (targetFog - scene.fog.density) * 0.08;
      }
      hemisphere.intensity +=
        (0.34 + operations.lightLevel * 0.48 - hemisphere.intensity) * 0.08;
      keyLight.intensity +=
        (0.18 + operations.lightLevel * 0.52 - keyLight.intensity) * 0.08;

      // Rain: one pool for drizzle, rain and storm. Storm only increases the
      // operational parameters; it does not instantiate another particle system.
      if (rainCount > 0) {
        const fallSpeed = 4.2 + operations.rainIntensity * 7.8;
        const swayStrength = operations.windStrength * (operations.mode === 'storm' ? 1.5 : 0.85);
        for (let index = 0; index < rainCount; index += 1) {
          const stride = index * 3;
          rainPositions[stride + 1] -= fallSpeed * rainDepth[index] * deltaSeconds;
          rainPositions[stride] +=
            Math.sin(time * 0.0015 + index * 0.37) * swayStrength * deltaSeconds;
          if (operations.mode === 'storm') {
            rainPositions[stride] += (Math.random() - 0.5) * 0.018;
          }
          if (rainPositions[stride + 1] < -4.7) resetRain(index, true);
        }
        rainPositionAttribute.needsUpdate = true;
      }

      if (snowCount > 0) {
        const fallSpeed = 0.72 + operations.snowIntensity * 0.95;
        for (let index = 0; index < snowCount; index += 1) {
          const stride = index * 3;
          snowPositions[stride + 1] -= fallSpeed * deltaSeconds;
          snowPositions[stride] +=
            Math.sin(time * 0.00075 + snowPhase[index]) *
            (0.16 + operations.windStrength * 0.36) *
            deltaSeconds;
          if (snowPositions[stride + 1] < -4.6) resetSnow(index, true);
        }
        snowPositionAttribute.needsUpdate = true;
        snowAccumulation = Math.min(
          1,
          snowAccumulation + operations.accumulationRate * deltaSeconds,
        );
      }
      accumulationMaterial.opacity +=
        (snowAccumulation * 0.2 - accumulationMaterial.opacity) * 0.04;

      // Towers-style lightning: independent transient light with occasional
      // return strokes. It is enabled only by storm operations.
      if (operations.lightning && time >= nextLightningAt) {
        lightningEnergy = 1;
        returnStrokes = 1 + Math.floor(Math.random() * 3);
        lightning.position.x = (Math.random() - 0.5) * 7;
        lightning.position.y = 2.5 + Math.random() * 3;
        nextLightningAt = time + 3000 + Math.random() * 8000;
      }

      if (!operations.lightning) {
        lightningEnergy = 0;
        returnStrokes = 0;
      } else if (lightningEnergy > 0) {
        lightningEnergy *= Math.pow(0.035, deltaSeconds);
        if (lightningEnergy < 0.12 && returnStrokes > 0) {
          returnStrokes -= 1;
          lightningEnergy = 0.5 + Math.random() * 0.35;
        }
      }
      lightning.intensity = lightningEnergy * 5.5;

      const speed = 0.00004 + clamp01(state.progress) * 0.000035;
      root.rotation.y = time * speed;
      ring.rotation.z = time * speed * 0.65;
      ambientPoints.rotation.x = Math.sin(time * 0.00012) * 0.06;

      renderer.render(scene, camera);
    };

    raf = window.requestAnimationFrame(render);

    const resize = () => {
      const nextWidth = mount.clientWidth || window.innerWidth;
      const nextHeight = mount.clientHeight || window.innerHeight;
      const nextCompact = nextWidth < 520;
      camera.aspect = nextWidth / nextHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio || 1, nextCompact ? 1.15 : 1.45),
      );
      renderer.setSize(nextWidth, nextHeight, false);
    };

    window.addEventListener('resize', resize, { passive: true });

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      ambientGeometry.dispose();
      ambientMaterial.dispose();
      rainGeometry.dispose();
      rainMaterial.dispose();
      snowGeometry.dispose();
      snowMaterial.dispose();
      accumulation.geometry.dispose();
      accumulationMaterial.dispose();
      ring.geometry.dispose();
      ringMaterial.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="pointer-events-none absolute inset-0"
      aria-hidden="true"
      data-weather-engine="towers-operations"
    />
  );
}
