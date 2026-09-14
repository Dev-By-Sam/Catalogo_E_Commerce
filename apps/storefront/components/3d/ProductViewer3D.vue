<template>
  <div class="relative w-full h-full min-h-[450px] lg:min-h-[600px] bg-industrial-950 flex items-center justify-center select-none overflow-hidden group">
    <!-- Loading Overlay -->
    <div v-if="isLoading && activeMode === '3d'" class="absolute inset-0 z-20 flex flex-col items-center justify-center bg-industrial-950/80 backdrop-blur-sm">
      <div class="w-12 h-12 border-2 border-kinetic-cyan/30 border-t-kinetic-cyan rounded-full animate-spin mb-4"></div>
      <div class="font-mono text-xs tracking-widest text-kinetic-cyan uppercase animate-pulse">
        CARGANDO MODELO 3D...
      </div>
    </div>

    <!-- 3D Canvas Mode -->
    <div v-show="activeMode === '3d'" class="w-full h-full relative">
      <canvas ref="canvasRef" class="w-full h-full block cursor-grab active:cursor-grabbing" :class="{ 'opacity-0': isLoading }" />

      <!-- 3D Controls HUD Overlay -->
      <div class="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-auto">
        <!-- Telemetry readout -->
        <div class="px-2.5 py-1 bg-black/80 hairline-all text-[9px] font-mono tracking-widest text-neutral-400">
          <span class="text-kinetic-cyan">ROTATION:</span> 360° INTERACTIVE • <span class="text-white">DRAG TO ORBIT</span>
        </div>

        <!-- Action Toggles -->
        <div class="flex items-center space-x-2">
          <button
            @click="toggleWireframe"
            class="px-2.5 py-1 text-[10px] font-mono border transition-colors"
            :class="isWireframe ? 'bg-kinetic-cyan text-black border-kinetic-cyan font-bold' : 'bg-black/80 text-neutral-400 border-neutral-800 hover:text-white'"
            data-interactive="true"
            data-tag="TOGGLE_WIREFRAME"
          >
            [WIREFRAME]
          </button>
          <button
            @click="toggleAutoRotate"
            class="px-2.5 py-1 text-[10px] font-mono border transition-colors"
            :class="isAutoRotating ? 'bg-white text-black border-white font-bold' : 'bg-black/80 text-neutral-400 border-neutral-800 hover:text-white'"
            data-interactive="true"
            data-tag="AUTO_ROTATE"
          >
            [360° AUTO]
          </button>
        </div>
      </div>
    </div>

    <!-- 2D High-Res Gallery Mode -->
    <div v-show="activeMode === 'gallery'" class="w-full h-full relative flex items-center justify-center p-8">
      <img
        :src="currentImage"
        :alt="productTitle"
        class="max-h-[80%] max-w-[85%] object-contain filter drop-shadow-2xl transition-transform duration-500 hover:scale-105"
      />

      <!-- Thumbnail Selector -->
      <div v-if="images.length > 1" class="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 bg-black/80 p-2 hairline-all backdrop-blur-sm">
        <button
          v-for="(img, idx) in images"
          :key="idx"
          @click="selectedImageIndex = idx"
          class="w-12 h-12 hairline-all overflow-hidden transition-all"
          :class="selectedImageIndex === idx ? 'border-kinetic-cyan ring-1 ring-kinetic-cyan' : 'opacity-50 hover:opacity-100'"
        >
          <img :src="img.url" :alt="img.alt" class="w-full h-full object-cover" />
        </button>
      </div>
    </div>

    <!-- Mode Switcher (Top Right) -->
    <div v-if="has3D" class="absolute top-6 right-6 z-10 flex space-x-1 bg-black/80 p-1 hairline-all backdrop-blur-sm">
      <button
        @click="activeMode = '3d'"
        class="px-3 py-1 text-[10px] font-mono tracking-widest uppercase transition-colors"
        :class="activeMode === '3d' ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white'"
        data-interactive="true"
        data-tag="MODE_3D"
      >
        VISOR 3D
      </button>
      <button
        @click="activeMode = 'gallery'"
        class="px-3 py-1 text-[10px] font-mono tracking-widest uppercase transition-colors"
        :class="activeMode === 'gallery' ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white'"
        data-interactive="true"
        data-tag="MODE_PHOTO"
      >
        GALERÍA HD
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const props = withDefaults(
  defineProps<{
    modelUrl?: string; // Example: "primitive:smartphone" or "/models/iphone_16/scene.gltf"
    images?: { url: string; alt?: string }[];
    productTitle?: string;
    initialMode?: '3d' | 'gallery';
    has3D?: boolean;
  }>(),
  {
    images: () => [],
    initialMode: '3d',
  },
);

const activeMode = ref<'3d' | 'gallery'>(props.initialMode);
const selectedImageIndex = ref(0);
const isWireframe = ref(false);
const isAutoRotating = ref(true);
const isLoading = ref(false);
const canvasRef = ref<HTMLCanvasElement | null>(null);

const currentImage = computed(() => {
  if (props.images.length > 0 && props.images[selectedImageIndex.value]) {
    return props.images[selectedImageIndex.value].url;
  }
  return 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80';
});

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let productGroup: THREE.Group;
let productWires: THREE.LineSegments[] = [];
let animationFrameId: number;

let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

// Track disposables for memory leak fix
const disposables: any[] = [];

// Base materials for all procedural products
const coreMaterial = new THREE.MeshStandardMaterial({
  color: 0x18191d,
  roughness: 0.15,
  metalness: 0.8,
});

const glassMaterial = new THREE.MeshStandardMaterial({
  color: 0x050505,
  roughness: 0.05,
  metalness: 0.9,
});

const accentMaterial = new THREE.MeshStandardMaterial({
  color: 0x00f0ff,
  emissive: 0x00f0ff,
  emissiveIntensity: 0.5,
});

const accentMaterialOrange = new THREE.MeshStandardMaterial({
  color: 0xff4d00,
  emissive: 0xff4d00,
  emissiveIntensity: 0.5,
});

const wireMaterial = new THREE.LineBasicMaterial({
  color: 0x00f0ff,
  transparent: true,
  opacity: 0.35,
});

disposables.push(coreMaterial, glassMaterial, accentMaterial, accentMaterialOrange, wireMaterial);

// Procedural Builders
const buildSmartphone = () => {
  const group = new THREE.Group();
  const bodyGeo = new THREE.BoxGeometry(1.5, 3.2, 0.2);
  const bodyMesh = new THREE.Mesh(bodyGeo, coreMaterial);
  group.add(bodyMesh);
  disposables.push(bodyGeo);

  const screenGeo = new THREE.PlaneGeometry(1.4, 3.1);
  const screenMesh = new THREE.Mesh(screenGeo, glassMaterial);
  screenMesh.position.z = 0.101;
  group.add(screenMesh);
  disposables.push(screenGeo);

  const camGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.05, 32);
  const camMesh = new THREE.Mesh(camGeo, glassMaterial);
  camMesh.rotation.x = Math.PI / 2;
  camMesh.position.set(-0.4, 1.2, -0.12);
  group.add(camMesh);
  disposables.push(camGeo);

  const ringGeo = new THREE.TorusGeometry(0.22, 0.02, 16, 32);
  const ringMesh = new THREE.Mesh(ringGeo, accentMaterial);
  ringMesh.position.set(-0.4, 1.2, -0.13);
  group.add(ringMesh);
  disposables.push(ringGeo);

  return { group, geos: [bodyGeo] };
};

const buildLaptop = () => {
  const group = new THREE.Group();
  const baseGeo = new THREE.BoxGeometry(3.5, 0.15, 2.5);
  const baseMesh = new THREE.Mesh(baseGeo, coreMaterial);
  baseMesh.position.y = -0.075;
  group.add(baseMesh);
  disposables.push(baseGeo);

  const kbGeo = new THREE.PlaneGeometry(3.1, 1.3);
  const kbMesh = new THREE.Mesh(kbGeo, glassMaterial);
  kbMesh.rotation.x = -Math.PI / 2;
  kbMesh.position.set(0, 0.001, -0.4);
  group.add(kbMesh);
  disposables.push(kbGeo);

  const lidGroup = new THREE.Group();
  lidGroup.position.set(0, 0, -1.25);
  lidGroup.rotation.x = -Math.PI / 6;

  const lidGeo = new THREE.BoxGeometry(3.5, 0.1, 2.5);
  const lidMesh = new THREE.Mesh(lidGeo, coreMaterial);
  lidMesh.position.set(0, 1.25, 0);
  lidMesh.rotation.x = Math.PI / 2;
  lidGroup.add(lidMesh);
  disposables.push(lidGeo);

  const screenGeo = new THREE.PlaneGeometry(3.3, 2.3);
  const screenMesh = new THREE.Mesh(screenGeo, glassMaterial);
  screenMesh.position.set(0, 1.25, 0.051);
  screenMesh.rotation.x = Math.PI / 2;
  lidGroup.add(screenMesh);
  disposables.push(screenGeo);

  group.add(lidGroup);
  return { group, geos: [baseGeo, lidGeo] };
};

const buildSmartwatch = () => {
  const group = new THREE.Group();
  const faceGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.3, 64);
  const faceMesh = new THREE.Mesh(faceGeo, coreMaterial);
  faceMesh.rotation.x = Math.PI / 2;
  group.add(faceMesh);
  disposables.push(faceGeo);

  const screenGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.32, 64);
  const screenMesh = new THREE.Mesh(screenGeo, glassMaterial);
  screenMesh.rotation.x = Math.PI / 2;
  group.add(screenMesh);
  disposables.push(screenGeo);

  const ringGeo = new THREE.TorusGeometry(0.81, 0.04, 16, 64);
  const ringMesh = new THREE.Mesh(ringGeo, accentMaterialOrange);
  group.add(ringMesh);
  disposables.push(ringGeo);

  const strapGeo = new THREE.BoxGeometry(0.9, 2.5, 0.1);
  const strapMesh = new THREE.Mesh(strapGeo, coreMaterial);
  strapMesh.position.set(0, 1.2, 0);
  strapMesh.rotation.x = -Math.PI / 12;
  group.add(strapMesh);
  
  const strapMesh2 = new THREE.Mesh(strapGeo, coreMaterial);
  strapMesh2.position.set(0, -1.2, 0);
  strapMesh2.rotation.x = Math.PI / 12;
  group.add(strapMesh2);
  disposables.push(strapGeo);

  return { group, geos: [faceGeo, strapGeo] };
};

const buildHeadphones = () => {
  const group = new THREE.Group();
  const bandGeo = new THREE.TorusGeometry(1.2, 0.15, 16, 64, Math.PI);
  const bandMesh = new THREE.Mesh(bandGeo, coreMaterial);
  group.add(bandMesh);
  disposables.push(bandGeo);

  const cupGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.4, 32);
  const cupL = new THREE.Mesh(cupGeo, coreMaterial);
  cupL.rotation.z = Math.PI / 2;
  cupL.position.set(-1.2, -0.2, 0);
  group.add(cupL);

  const cupR = new THREE.Mesh(cupGeo, coreMaterial);
  cupR.rotation.z = Math.PI / 2;
  cupR.position.set(1.2, -0.2, 0);
  group.add(cupR);
  disposables.push(cupGeo);

  const padGeo = new THREE.TorusGeometry(0.5, 0.2, 16, 32);
  const padL = new THREE.Mesh(padGeo, glassMaterial);
  padL.rotation.y = Math.PI / 2;
  padL.position.set(-1.0, -0.2, 0);
  group.add(padL);

  const padR = new THREE.Mesh(padGeo, glassMaterial);
  padR.rotation.y = Math.PI / 2;
  padR.position.set(1.0, -0.2, 0);
  group.add(padR);
  disposables.push(padGeo);

  const ringGeo = new THREE.TorusGeometry(0.4, 0.02, 16, 32);
  const ringL = new THREE.Mesh(ringGeo, accentMaterial);
  ringL.rotation.y = Math.PI / 2;
  ringL.position.set(-1.42, -0.2, 0);
  group.add(ringL);

  const ringR = new THREE.Mesh(ringGeo, accentMaterial);
  ringR.rotation.y = Math.PI / 2;
  ringR.position.set(1.42, -0.2, 0);
  group.add(ringR);
  disposables.push(ringGeo);

  return { group, geos: [bandGeo, cupGeo] };
};

const buildKeyboard = () => {
  const group = new THREE.Group();
  const baseGeo = new THREE.BoxGeometry(3.8, 0.2, 1.4);
  const baseMesh = new THREE.Mesh(baseGeo, coreMaterial);
  group.add(baseMesh);
  disposables.push(baseGeo);

  const keyGeo = new THREE.BoxGeometry(0.2, 0.15, 0.2);
  disposables.push(keyGeo);
  
  for (let x = -1.7; x <= 1.7; x += 0.25) {
    for (let z = -0.5; z <= 0.5; z += 0.25) {
      const isAccent = Math.random() > 0.95;
      const keyMesh = new THREE.Mesh(keyGeo, isAccent ? accentMaterial : glassMaterial);
      keyMesh.position.set(x, 0.15, z);
      group.add(keyMesh);
    }
  }

  const glowGeo = new THREE.PlaneGeometry(3.6, 1.2);
  const glowMesh = new THREE.Mesh(glowGeo, accentMaterial);
  glowMesh.rotation.x = Math.PI / 2;
  glowMesh.position.y = -0.11;
  group.add(glowMesh);
  disposables.push(glowGeo);

  return { group, geos: [baseGeo] };
};

const buildCharger = () => {
  const group = new THREE.Group();
  const brickGeo = new THREE.BoxGeometry(1.2, 1.5, 0.8);
  const brickMesh = new THREE.Mesh(brickGeo, coreMaterial);
  group.add(brickMesh);
  disposables.push(brickGeo);

  const prongGeo = new THREE.BoxGeometry(0.05, 0.4, 0.2);
  const prong1 = new THREE.Mesh(prongGeo, glassMaterial);
  prong1.position.set(-0.2, 0.9, 0);
  group.add(prong1);

  const prong2 = new THREE.Mesh(prongGeo, glassMaterial);
  prong2.position.set(0.2, 0.9, 0);
  group.add(prong2);
  disposables.push(prongGeo);

  const portGeo = new THREE.BoxGeometry(0.4, 0.1, 0.05);
  const port1 = new THREE.Mesh(portGeo, accentMaterialOrange);
  port1.position.set(0, -0.5, 0.41);
  group.add(port1);

  const port2 = new THREE.Mesh(portGeo, accentMaterialOrange);
  port2.position.set(0, -0.2, 0.41);
  group.add(port2);
  disposables.push(portGeo);

  return { group, geos: [brickGeo] };
};

const buildDefault = () => {
  const group = new THREE.Group();
  const bodyGeo = new THREE.CylinderGeometry(1.0, 1.0, 0.6, 64);
  const bodyMesh = new THREE.Mesh(bodyGeo, coreMaterial);
  group.add(bodyMesh);
  disposables.push(bodyGeo);

  const ringGeo = new THREE.TorusGeometry(1.02, 0.04, 16, 100);
  const ringMesh = new THREE.Mesh(ringGeo, accentMaterial);
  ringMesh.rotation.x = Math.PI / 2;
  group.add(ringMesh);
  disposables.push(ringGeo);

  return { group, geos: [bodyGeo] };
};

// Main Initialization
const initViewer = () => {
  if (!canvasRef.value) return;

  const width = canvasRef.value.clientWidth || 500;
  const height = canvasRef.value.clientHeight || 500;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
  camera.position.set(0, 0, 6);

  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  const url = props.modelUrl || '';
  
  if (url.startsWith('primitive:')) {
    // Legacy procedural builder
    const primitiveType = url.split(':')[1] || 'default';
    
    let buildResult;
    switch (primitiveType) {
      case 'smartphone': buildResult = buildSmartphone(); break;
      case 'laptop': buildResult = buildLaptop(); break;
      case 'smartwatch': buildResult = buildSmartwatch(); break;
      case 'earbuds':
      case 'headphones': buildResult = buildHeadphones(); break;
      case 'keyboard': 
      case 'mouse': buildResult = buildKeyboard(); break;
      case 'charger':
      case 'powerbank': buildResult = buildCharger(); break;
      default: buildResult = buildDefault(); break;
    }

    productGroup = buildResult.group;
    
    // Apply wireframes dynamically to returned core geometries
    buildResult.geos.forEach(geo => {
      const wireGeo = new THREE.WireframeGeometry(geo);
      const wireMesh = new THREE.LineSegments(wireGeo, wireMaterial);
      wireMesh.visible = isWireframe.value;
      productGroup.add(wireMesh);
      productWires.push(wireMesh);
      disposables.push(wireGeo);
    });

    scene.add(productGroup);
    setupSceneAndAnimate();
  } else if (url.endsWith('.gltf') || url.endsWith('.glb')) {
    // Real 3D Model Loader
    isLoading.value = true;
    const loader = new GLTFLoader();
    loader.load(url, (gltf) => {
      productGroup = new THREE.Group();
      
      const model = gltf.scene;
      
      // Auto-scale and center the loaded model
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      
      const maxDim = Math.max(size.x, size.y, size.z);
      const targetSize = 3.0; // Fit within a radius of ~3
      if (maxDim > 0) {
        model.scale.setScalar(targetSize / maxDim);
      }
      
      model.position.sub(center.multiplyScalar(targetSize / maxDim)); // Center it
      
      // Ensure material properties look good (fallback if materials are broken)
      model.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          // You could optionally apply custom materials here
          // Or add wireframes for loaded models
          const wireGeo = new THREE.WireframeGeometry(mesh.geometry);
          const wireMesh = new THREE.LineSegments(wireGeo, wireMaterial);
          wireMesh.visible = isWireframe.value;
          
          // Try to maintain original transforms for wireframe
          wireMesh.position.copy(mesh.position);
          wireMesh.rotation.copy(mesh.rotation);
          wireMesh.scale.copy(mesh.scale);
          
          // Note: adding wireframes to complex GLTFs can be very heavy,
          // so we add them carefully or you might skip this for heavy models.
          mesh.add(wireMesh);
          productWires.push(wireMesh);
          disposables.push(wireGeo);
        }
      });
      
      productGroup.add(model);
      scene.add(productGroup);
      
      isLoading.value = false;
      setupSceneAndAnimate();
    }, undefined, (error) => {
      console.error('Error loading 3D model:', error);
      isLoading.value = false;
      // Fallback to default
      const res = buildDefault();
      productGroup = res.group;
      scene.add(productGroup);
      setupSceneAndAnimate();
    });
  } else {
    // Empty or unknown
    const res = buildDefault();
    productGroup = res.group;
    scene.add(productGroup);
    setupSceneAndAnimate();
  }
};

const setupSceneAndAnimate = () => {
  // Lights
  const ambient = new THREE.AmbientLight(0xffffff, 1.2);
  scene.add(ambient);

  const mainLight = new THREE.DirectionalLight(0xffffff, 3.0);
  mainLight.position.set(5, 8, 5);
  scene.add(mainLight);

  const blueRimLight = new THREE.DirectionalLight(0x00f0ff, 2.5);
  blueRimLight.position.set(-5, -2, -3);
  scene.add(blueRimLight);
  
  const orangeRimLight = new THREE.DirectionalLight(0xff4d00, 1.5);
  orangeRimLight.position.set(5, -2, -3);
  scene.add(orangeRimLight);
  
  disposables.push(ambient, mainLight, blueRimLight, orangeRimLight);

  // Event Listeners
  const canvas = canvasRef.value;
  if (canvas) {
    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('wheel', onWheel, { passive: false });

    (canvas as any)._handlers = { onMouseDown, onMouseMove, onTouchStart, onTouchMove, onWheel, group: productGroup };
  }

  const animate = () => {
    animationFrameId = requestAnimationFrame(animate);

    if (isAutoRotating.value && !isDragging && productGroup) {
      productGroup.rotation.y += 0.005;
      // Slight vertical floating animation
      productGroup.position.y = Math.sin(Date.now() * 0.001) * 0.1;
    }

    renderer.render(scene, camera);
  };

  animate();
};

const onMouseDown = (e: MouseEvent) => {
  isDragging = true;
  previousMousePosition = { x: e.clientX, y: e.clientY };
};

const onMouseUp = () => {
  isDragging = false;
};

const onMouseMove = (e: MouseEvent) => {
  if (!isDragging || !canvasRef.value) return;
  const group = (canvasRef.value as any)._handlers?.group;
  if (!group) return;
  
  const deltaX = e.clientX - previousMousePosition.x;
  const deltaY = e.clientY - previousMousePosition.y;

  group.rotation.y += deltaX * 0.01;
  group.rotation.x += deltaY * 0.01;
  previousMousePosition = { x: e.clientX, y: e.clientY };
};

const onTouchStart = (e: TouchEvent) => {
  if (e.touches.length === 1) {
    isDragging = true;
    previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }
};

const onTouchEnd = () => {
  isDragging = false;
};

const onTouchMove = (e: TouchEvent) => {
  if (!isDragging || e.touches.length !== 1 || !canvasRef.value) return;
  const group = (canvasRef.value as any)._handlers?.group;
  if (!group) return;
  
  const deltaX = e.touches[0].clientX - previousMousePosition.x;
  const deltaY = e.touches[0].clientY - previousMousePosition.y;

  group.rotation.y += deltaX * 0.01;
  group.rotation.x += deltaY * 0.01;
  previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
};

const onWheel = (e: WheelEvent) => {
  e.preventDefault();
  if (camera) {
    camera.position.z = Math.max(2.0, Math.min(15, camera.position.z + e.deltaY * 0.005));
  }
};

const toggleWireframe = () => {
  isWireframe.value = !isWireframe.value;
  productWires.forEach(wire => {
    wire.visible = isWireframe.value;
  });
};

const toggleAutoRotate = () => {
  isAutoRotating.value = !isAutoRotating.value;
};

const handleResize = () => {
  if (!canvasRef.value || !camera || !renderer) return;
  const width = canvasRef.value.clientWidth;
  const height = canvasRef.value.clientHeight;
  if (width === 0 || height === 0) return; // Ignore if hidden
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
};

const cleanupScene = () => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  
  if (canvasRef.value) {
    const handlers = (canvasRef.value as any)._handlers;
    if (handlers) {
      canvasRef.value.removeEventListener('mousedown', handlers.onMouseDown);
      canvasRef.value.removeEventListener('mousemove', handlers.onMouseMove);
      canvasRef.value.removeEventListener('touchstart', handlers.onTouchStart);
      canvasRef.value.removeEventListener('touchmove', handlers.onTouchMove);
      canvasRef.value.removeEventListener('wheel', handlers.onWheel);
    }
  }

  disposables.forEach((item) => {
    if (item && typeof item.dispose === 'function') {
      item.dispose();
    }
  });

  if (scene) {
    scene.clear();
  }

  if (renderer) {
    renderer.dispose();
    renderer.forceContextLoss();
  }
};

onMounted(() => {
  initViewer();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('mouseup', onMouseUp);
  window.removeEventListener('touchend', onTouchEnd);
  cleanupScene();
});

watch(
  () => props.modelUrl,
  (newUrl) => {
    if (newUrl) {
      cleanupScene();
      initViewer();
    }
  }
);

watch(
  () => props.initialMode,
  (mode) => {
    activeMode.value = mode;
  }
);

watch(
  () => activeMode.value,
  (mode) => {
    if (mode === '3d') {
      setTimeout(handleResize, 50);
    }
  },
);
</script>
