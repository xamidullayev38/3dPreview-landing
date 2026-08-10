<template>
  <div class="relative w-full h-full min-h-[450px] rounded-2xl overflow-hidden border border-zinc-800 bg-[#09090b] flex flex-col justify-center items-center">
    <!-- Canvas Container -->
    <div ref="canvasContainer" class="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing"></div>

    <!-- Loading Spinner Overlay -->
    <div v-if="isLoading" class="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/90 backdrop-blur-sm z-20 transition-opacity duration-300">
      <div class="w-8 h-8 border-2 border-zinc-700 border-t-cyan-400 rounded-full animate-spin mb-3"></div>
      <p class="text-zinc-400 font-medium text-xs font-mono">Loading 3D Asset... {{ loadProgress }}%</p>
    </div>

    <!-- Minimalist Toolbar -->
    <div class="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-zinc-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl flex items-center gap-2 border border-zinc-800 shadow-xl">
      <button 
        @click="toggleAutoRotate" 
        :class="isAutoRotating ? 'text-white bg-zinc-800 border-zinc-700 font-bold' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'"
        class="px-2.5 py-1 rounded-lg text-xs font-medium border border-transparent transition flex items-center gap-1.5"
        title="360° Avto Aylantirish"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
        360°
      </button>

      <div class="w-[1px] h-3.5 bg-zinc-800"></div>

      <button 
        @click="toggleWireframe" 
        :class="isWireframe ? 'text-white bg-zinc-800 border-zinc-700 font-bold' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'"
        class="px-2.5 py-1 rounded-lg text-xs font-medium border border-transparent transition flex items-center gap-1.5"
        title="Karkas rejimi"
      >
        Wireframe
      </button>

      <div class="w-[1px] h-3.5 bg-zinc-800"></div>

      <button 
        @click="resetCamera" 
        class="px-2.5 py-1 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 rounded-lg text-xs font-medium border border-transparent transition flex items-center gap-1.5"
        title="Kamerani nolga tushirish"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
        </svg>
        Reset
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const props = defineProps({
  modelUrl: {
    type: String,
    default: ''
  }
});

const canvasContainer = ref(null);
const isLoading = ref(true);
const loadProgress = ref(0);
const isAutoRotating = ref(true);
const isWireframe = ref(false);

let scene, camera, renderer, controls, loadedModel, animationId;
let proceduralGroup;

const initThree = () => {
  if (!canvasContainer.value) return;

  const width = canvasContainer.value.clientWidth;
  const height = canvasContainer.value.clientHeight;

  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x09090b);

  // Subtle Reference Grid
  const gridHelper = new THREE.GridHelper(20, 20, 0x27272a, 0x18181b);
  gridHelper.position.y = -1;
  scene.add(gridHelper);

  // Camera
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, 2, 5);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  // Clear existing canvas
  canvasContainer.value.innerHTML = '';
  canvasContainer.value.appendChild(renderer.domElement);

  // Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.autoRotate = isAutoRotating.value;
  controls.autoRotateSpeed = 1.8;
  controls.maxPolarAngle = Math.PI / 2 + 0.1;

  // Studio Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xffffff, 2.5);
  mainLight.position.set(5, 10, 7);
  mainLight.castShadow = true;
  scene.add(mainLight);

  const fillLight = new THREE.DirectionalLight(0x00f0ff, 1.8);
  fillLight.position.set(-5, 2, -5);
  scene.add(fillLight);

  // Create Standalone High-Tech Procedural Mesh Model as Default / Fallback
  createProceduralModel();

  // Load GLB Model if URL is valid
  if (props.modelUrl) {
    loadGLBModel(props.modelUrl);
  } else {
    isLoading.value = false;
  }

  window.addEventListener('resize', onWindowResize);

  // Animation Loop
  const animate = () => {
    animationId = requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  };
  animate();
};

// Create a High-Tech 3D Cyberpunk Visor & Core model as instant fallback
const createProceduralModel = () => {
  proceduralGroup = new THREE.Group();

  const chromeMat = new THREE.MeshPhysicalMaterial({
    color: 0xe2e8f0,
    metalness: 0.95,
    roughness: 0.1,
    clearcoat: 1.0,
    reflectivity: 1.0
  });

  const cyanEmissive = new THREE.MeshStandardMaterial({
    color: 0x00f0ff,
    emissive: 0x00f0ff,
    emissiveIntensity: 0.8,
    metalness: 0.8
  });

  const bodyGeo = new THREE.TorusGeometry(1.2, 0.28, 32, 100);
  const bodyMesh = new THREE.Mesh(bodyGeo, chromeMat);
  proceduralGroup.add(bodyMesh);

  const lensGeo = new THREE.CylinderGeometry(1.0, 1.0, 0.15, 64);
  const lensMat = new THREE.MeshPhysicalMaterial({
    color: 0x38bdf8,
    transmission: 0.9,
    transparent: true,
    opacity: 0.85,
    roughness: 0.05
  });
  const lensMesh = new THREE.Mesh(lensGeo, lensMat);
  lensMesh.rotation.x = Math.PI / 2;
  proceduralGroup.add(lensMesh);

  const coreGeo = new THREE.SphereGeometry(0.35, 32, 32);
  const coreMesh = new THREE.Mesh(coreGeo, cyanEmissive);
  proceduralGroup.add(coreMesh);

  scene.add(proceduralGroup);
};

const loadGLBModel = (url) => {
  if (!url) {
    isLoading.value = false;
    return;
  }

  isLoading.value = true;
  loadProgress.value = 0;

  const loader = new GLTFLoader();
  loader.load(
    url,
    (gltf) => {
      if (proceduralGroup) scene.remove(proceduralGroup);
      if (loadedModel) scene.remove(loadedModel);
      loadedModel = gltf.scene;

      const box = new THREE.Box3().setFromObject(loadedModel);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());

      loadedModel.position.sub(center);

      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = camera.fov * (Math.PI / 180);
      let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * 1.5;
      cameraZ = Math.max(cameraZ, 3);

      camera.position.set(0, maxDim / 3, cameraZ);
      camera.lookAt(0, 0, 0);
      controls.target.set(0, 0, 0);
      controls.update();

      loadedModel.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      scene.add(loadedModel);
      isLoading.value = false;
    },
    (xhr) => {
      if (xhr.lengthComputable) {
        loadProgress.value = Math.round((xhr.loaded / xhr.total) * 100);
      }
    },
    (error) => {
      console.warn('GLB load error, using procedural 3D model fallback:', error);
      isLoading.value = false;
    }
  );
};

const toggleAutoRotate = () => {
  isAutoRotating.value = !isAutoRotating.value;
  if (controls) controls.autoRotate = isAutoRotating.value;
};

const toggleWireframe = () => {
  isWireframe.value = !isWireframe.value;
  const target = loadedModel || proceduralGroup;
  if (target) {
    target.traverse((child) => {
      if (child.isMesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((mat) => (mat.wireframe = isWireframe.value));
        } else {
          child.material.wireframe = isWireframe.value;
        }
      }
    });
  }
};

const resetCamera = () => {
  if (controls) {
    const target = loadedModel || proceduralGroup;
    if (target) {
      const box = new THREE.Box3().setFromObject(target);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      
      camera.position.set(0, maxDim / 3, Math.max(maxDim * 1.8, 4));
      controls.target.set(0, 0, 0);
      controls.update();
    }
  }
};

const onWindowResize = () => {
  if (!canvasContainer.value || !camera || !renderer) return;
  const width = canvasContainer.value.clientWidth;
  const height = canvasContainer.value.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
};

watch(() => props.modelUrl, (newUrl) => {
  if (scene) {
    loadGLBModel(newUrl);
  }
});

onMounted(() => {
  initThree();
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', onWindowResize);
  if (animationId) cancelAnimationFrame(animationId);
  if (renderer) renderer.dispose();
});
</script>
