<template>
  <div class="relative w-full h-full overflow-hidden pointer-events-none">
    <canvas ref="canvasRef" class="w-full h-full block" />
    
    <!-- Hairline Grid Overlay on Canvas -->
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#1f212815_1px,transparent_1px),linear-gradient(to_bottom,#1f212815_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';

const canvasRef = ref<HTMLCanvasElement | null>(null);

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let mainMesh: THREE.Mesh;
let wireframeMesh: THREE.LineSegments;
let particles: THREE.Points;
let animationFrameId: number;

let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

const onMouseMove = (e: MouseEvent) => {
  mouseX = (e.clientX - window.innerWidth / 2) * 0.0002;
  mouseY = (e.clientY - window.innerHeight / 2) * 0.0002;
};

const initThree = () => {
  if (!canvasRef.value) return;

  const width = canvasRef.value.clientWidth || window.innerWidth;
  const height = canvasRef.value.clientHeight || window.innerHeight;

  // Scene
  scene = new THREE.Scene();

  // Camera
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.z = 7;

  // Renderer
  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Geometric Monolith Object (Torus Knot with Industrial aesthetic)
  const geometry = new THREE.TorusKnotGeometry(1.6, 0.45, 128, 32, 2, 3);
  
  // Solid Dark Material
  const material = new THREE.MeshStandardMaterial({
    color: 0x0f1013,
    roughness: 0.2,
    metalness: 0.85,
  });
  mainMesh = new THREE.Mesh(geometry, material);
  scene.add(mainMesh);

  // Wireframe Overlay
  const wireGeometry = new THREE.WireframeGeometry(geometry);
  const wireMaterial = new THREE.LineBasicMaterial({
    color: 0x00f0ff,
    transparent: true,
    opacity: 0.25,
  });
  wireframeMesh = new THREE.LineSegments(wireGeometry, wireMaterial);
  scene.add(wireframeMesh);

  // Particle Field
  const particleCount = 200;
  const particleGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 15;
    positions[i + 1] = (Math.random() - 0.5) * 15;
    positions[i + 2] = (Math.random() - 0.5) * 15;
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMaterial = new THREE.PointsMaterial({
    color: 0x52525b,
    size: 0.03,
    transparent: true,
    opacity: 0.6,
  });
  particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0x00f0ff, 3);
  keyLight.position.set(5, 5, 5);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xffffff, 1.5);
  fillLight.position.set(-5, -5, -2);
  scene.add(fillLight);

  const animate = () => {
    animationFrameId = requestAnimationFrame(animate);

    // Smooth inertia tracking
    targetX += (mouseX - targetX) * 0.02;
    targetY += (mouseY - targetY) * 0.02;

    mainMesh.rotation.x += 0.002;
    mainMesh.rotation.y += 0.003;
    mainMesh.rotation.x += targetY * 0.15;
    mainMesh.rotation.y += targetX * 0.15;

    wireframeMesh.rotation.copy(mainMesh.rotation);

    particles.rotation.y += 0.0008;

    renderer.render(scene, camera);
  };

  animate();
};

const handleResize = () => {
  if (!canvasRef.value || !camera || !renderer) return;
  const width = canvasRef.value.clientWidth;
  const height = canvasRef.value.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
};

onMounted(() => {
  initThree();
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('resize', handleResize);
  if (renderer) renderer.dispose();
});
</script>
