import { useEffect, useRef } from 'react';
import * as THREE from 'three';

type FocusAtmosphereProps = {
  accent?: string;
  progress: number;
};

export default function FocusAtmosphere({
  accent = '#22c55e',
  progress,
}: FocusAtmosphereProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    const width = mount.clientWidth || window.innerWidth;
    const height = mount.clientHeight || window.innerHeight;
    const compact = width < 520;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, compact ? 1.2 : 1.5));
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

    const count = compact ? 120 : 240;
    const positions = new Float32Array(count * 3);

    for (let index = 0; index < count; index += 1) {
      const stride = index * 3;
      const radius = 1.2 + Math.random() * 5.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[stride] = radius * Math.sin(phi) * Math.cos(theta);
      positions[stride + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.72;
      positions[stride + 2] = radius * Math.cos(phi);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: new THREE.Color(accent),
      size: compact ? 0.045 : 0.035,
      transparent: true,
      opacity: 0.16 + Math.min(1, Math.max(0, progress)) * 0.16,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    root.add(points);

    const ringMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(accent),
      transparent: true,
      opacity: 0.08,
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
    const targetFrameMs = compact ? 1000 / 24 : 1000 / 36;

    const render = (time: number) => {
      raf = window.requestAnimationFrame(render);
      if (document.hidden || time - lastFrame < targetFrameMs) return;
      lastFrame = time;

      const speed = 0.000045 + progress * 0.000035;
      root.rotation.y = time * speed;
      ring.rotation.z = time * speed * 0.65;
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
      geometry.dispose();
      material.dispose();
      ring.geometry.dispose();
      ringMaterial.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [accent, progress]);

  return <div ref={mountRef} className="pointer-events-none absolute inset-0" aria-hidden="true" />;
}
