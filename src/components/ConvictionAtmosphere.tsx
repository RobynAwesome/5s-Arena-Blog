import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export type ConvictionSceneState = {
  energy: number;
  density: number;
  drift: number;
};

type ConvictionAtmosphereProps = {
  state: ConvictionSceneState;
  phase: string;
};

function phaseColor(phase: string) {
  switch (phase) {
    case 'rupture':
      return new THREE.Color('#ef4444');
    case 'pressure':
      return new THREE.Color('#64748b');
    case 'recovery':
      return new THREE.Color('#22c55e');
    case 'proof':
      return new THREE.Color('#facc15');
    default:
      return new THREE.Color('#f8fafc');
  }
}

export default function ConvictionAtmosphere({
  state,
  phase,
}: ConvictionAtmosphereProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    const width = mount.clientWidth || window.innerWidth;
    const height = mount.clientHeight || window.innerHeight;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(width, height, false);
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.setAttribute('aria-hidden', 'true');
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 100);
    camera.position.z = 7;

    const root = new THREE.Group();
    scene.add(root);

    const count = Math.max(90, Math.round(360 * Math.min(1, Math.max(0.2, state.density))));
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let index = 0; index < count; index += 1) {
      const stride = index * 3;
      const radius = 1.5 + Math.random() * 5.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[stride] = radius * Math.sin(phi) * Math.cos(theta);
      positions[stride + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.8;
      positions[stride + 2] = radius * Math.cos(phi);
      sizes[index] = 0.6 + Math.random() * 1.4;
    }

    const pointsGeometry = new THREE.BufferGeometry();
    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pointsGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const pointsMaterial = new THREE.PointsMaterial({
      color: phaseColor(phase),
      size: 0.035 + state.energy * 0.035,
      transparent: true,
      opacity: 0.18 + state.energy * 0.3,
      depthWrite: false,
    });

    const points = new THREE.Points(pointsGeometry, pointsMaterial);
    root.add(points);

    const ringGeometry = new THREE.TorusGeometry(1.85, 0.012, 8, 120);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: phaseColor(phase),
      transparent: true,
      opacity: 0.13 + state.energy * 0.12,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI * 0.62;
    ring.rotation.y = Math.PI * 0.17;
    root.add(ring);

    const innerRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.05, 0.008, 8, 100),
      ringMaterial.clone(),
    );
    innerRing.rotation.x = Math.PI * 0.42;
    innerRing.rotation.z = Math.PI * 0.27;
    root.add(innerRing);

    let raf = 0;
    let lastFrame = 0;
    const targetFrameMs = width < 520 ? 1000 / 30 : 1000 / 45;

    const render = (time: number) => {
      raf = window.requestAnimationFrame(render);
      if (document.hidden || time - lastFrame < targetFrameMs) return;
      lastFrame = time;

      const speed = 0.00008 + state.energy * 0.00011;
      root.rotation.y = time * speed * Math.sign(state.drift || 1);
      ring.rotation.z = time * speed * 0.52;
      innerRing.rotation.y = -time * speed * 0.38;
      points.rotation.x = Math.sin(time * 0.00015) * 0.12;
      renderer.render(scene, camera);
    };

    raf = window.requestAnimationFrame(render);

    const resize = () => {
      const nextWidth = mount.clientWidth || window.innerWidth;
      const nextHeight = mount.clientHeight || window.innerHeight;
      camera.aspect = nextWidth / nextHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(nextWidth, nextHeight, false);
    };

    window.addEventListener('resize', resize, { passive: true });

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      pointsGeometry.dispose();
      pointsMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      innerRing.geometry.dispose();
      (innerRing.material as THREE.Material).dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [phase, state.density, state.drift, state.energy]);

  return (
    <div
      ref={mountRef}
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    />
  );
}
