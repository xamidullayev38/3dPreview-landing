<template>
  <div class="relative w-full h-full min-h-[450px] rounded-2xl overflow-hidden border border-zinc-800 bg-[#09090b] flex flex-col justify-center items-center">
    <!-- Canvas Container -->
    <div ref="canvasContainer" class="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing"></div>

    <!-- Loading Spinner Overlay -->
    <div v-if="isLoading" class="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/90 backdrop-blur-sm z-20 transition-opacity duration-300">
      <div class="w-8 h-8 border-2 border-zinc-700 border-t-zinc-200 rounded-full animate-spin mb-3"></div>
      <p class="text-zinc-400 font-medium text-xs">Model yuklanmoqda... {{ loadProgress }}%</p>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/95 z-20 p-6 text-center">
      <div class="w-10 h-10 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mb-3 border border-rose-500/20">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      <p class="text-zinc-300 font-medium text-xs mb-3">{{ errorMessage }}</p>
      <button @click="reloadModel" class="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded-lg border border-zinc-700 transition">
        Qayta urinib ko'rish
      </button>
    </div>

    <!-- Minimalist Toolbar -->
    <div class="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-zinc-900/90 backdrop-blur-md px-3 py-2 rounded-xl flex items-center gap-2 border border-zinc-800 shadow-lg">
      <button 
        @click="toggleAutoRotate" 
        :class="isAutoRotating ? 'text-white bg-zinc-800 border-zinc-700' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'"
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
        :class="isWireframe ? 'text-white bg-zinc-800 border-zinc-700' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'"
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
    required: true
  }
});

const canvasContainer = ref(null);
const isLoading = ref(true);
const loadProgress = ref(0);
const errorMessage = ref('');
const isAutoRotating = ref(true);
const isWireframe = ref(false);

let scene, camera, renderer, controls, loadedModel, animationId;

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
  renderer.toneMappingExposure = 1.1;
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

  // Clean Lighting Setup
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xffffff, 2.2);
  mainLight.position.set(5, 10, 7);
  mainLight.castShadow = true;
  scene.add(mainLight);

  const fillLight = new THREE.DirectionalLight(0xe4e4e7, 1.0);
  fillLight.position.set(-5, 2, -5);
  scene.add(fillLight);

  // Load Model
  loadGLBModel(props.modelUrl);

  // Window Resize
  window.addEventListener('resize', onWindowResize);

  // Animation Loop
  const animate = () => {
    animationId = requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  };
  animate();
};

const loadGLBModel = (url) => {
  isLoading.value = true;
  errorMessage.value = '';
  loadProgress.value = 0;

  const loader = new GLTFLoader();
  loader.load(
    url,
    (gltf) => {
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
      console.error('GLTF loading error:', error);
      isLoading.value = false;
      errorMessage.value = '3D model yuklanmadi.';
    }
  );
};

const toggleAutoRotate = () => {
  isAutoRotating.value = !isAutoRotating.value;
  if (controls) controls.autoRotate = isAutoRotating.value;
};

const toggleWireframe = () => {
  isWireframe.value = !isWireframe.value;
  if (loadedModel) {
    loadedModel.traverse((child) => {
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
  if (controls && loadedModel) {
    const box = new THREE.Box3().setFromObject(loadedModel);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    
    camera.position.set(0, maxDim / 3, maxDim * 1.8);
    controls.target.set(0, 0, 0);
    controls.update();
  }
};

const reloadModel = () => {
  if (props.modelUrl) {
    loadGLBModel(props.modelUrl);
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
  if (newUrl && scene) {
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
