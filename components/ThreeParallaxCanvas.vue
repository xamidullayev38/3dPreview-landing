<template>
  <div class="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
    <!-- Ultra-Futuristic Deep Quantum Ambient Glow -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-gradient-to-tr from-cyan-500/20 via-indigo-600/15 to-rose-500/15 rounded-full blur-[170px] pointer-events-none"></div>

    <!-- WebGL Canvas Container -->
    <div ref="canvasContainer" class="w-full h-full"></div>

    <!-- Live Status Pill Overlay -->
    <div v-if="isLoading" class="absolute bottom-6 right-6 px-4 py-2 rounded-full bg-zinc-950/90 border border-cyan-500/40 backdrop-blur-md text-[11px] font-mono text-cyan-300 flex items-center gap-2.5 transition-opacity duration-500 shadow-xl shadow-cyan-500/10">
      <div class="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></div>
      Rendering Quantum Core 3D... {{ loadProgress }}%
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const props = defineProps({
  modelUrl: {
    type: String,
    default: ''
  },
  rotationX: {
    type: Number,
    default: 0
  },
  rotationY: {
    type: Number,
    default: 0
  },
  rotationZ: {
    type: Number,
    default: 0
  },
  scale: {
    type: Number,
    default: 1
  },
  positionY: {
    type: Number,
    default: 0
  },
  positionX: {
    type: Number,
    default: 0
  },
  wireframe: {
    type: Boolean,
    default: false
  }
});

const canvasContainer = ref(null);
const isLoading = ref(true);
const loadProgress = ref(0);

let scene, camera, renderer, modelGroup, loadedModel, animationId;
let fallbackGadgetGroup;
let innerOrbitRing, middleOrbitRing, coreCrystalMesh, particleSystem;

// Initialize Three.js Scene
const initThree = () => {
  if (!canvasContainer.value) return;

  const width = window.innerWidth;
  const height = window.innerHeight;

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, 0, 7.5);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.4;

  canvasContainer.value.appendChild(renderer.domElement);

  // Group container for scroll animations
  modelGroup = new THREE.Group();
  scene.add(modelGroup);

  // --- STUDIO LIGHTING SETUP ---
  // Key Bright Silver Studio Light
  const keyLight = new THREE.DirectionalLight(0xffffff, 4.0);
  keyLight.position.set(6, 10, 8);
  scene.add(keyLight);

  // Cyan Electric Rim Light
  const cyanRimLight = new THREE.DirectionalLight(0x00f0ff, 3.5);
  cyanRimLight.position.set(-8, 4, -6);
  scene.add(cyanRimLight);

  // Magenta / Purple Ambient Back Light
  const magentaBackLight = new THREE.DirectionalLight(0xe11d48, 2.8);
  magentaBackLight.position.set(5, -6, -4);
  scene.add(magentaBackLight);

  // Soft Ambient Fill
  const ambientLight = new THREE.AmbientLight(0x18181b, 1.8);
  scene.add(ambientLight);

  // Glowing Core Point Light
  const coreLight = new THREE.PointLight(0x00f0ff, 6.0, 15);
  coreLight.position.set(0, 0, 0);
  scene.add(coreLight);

  // Build Mind-Blowing Quantum Kinetic Energy Core 3D Model
  createQuantumEnergyCore();

  // Try loading GLB model if provided
  if (props.modelUrl) {
    loadModel(props.modelUrl);
  } else {
    isLoading.value = false;
  }

  window.addEventListener('resize', onResize);

  const animate = () => {
    animationId = requestAnimationFrame(animate);

    // Continuous micro-rotation for floating kinetic rings
    if (innerOrbitRing) innerOrbitRing.rotation.z += 0.015;
    if (middleOrbitRing) middleOrbitRing.rotation.x += 0.01;
    if (coreCrystalMesh) coreCrystalMesh.rotation.y += 0.02;
    if (particleSystem) particleSystem.rotation.y += 0.003;

    // Smooth rotational updates based on props from GSAP ScrollTrigger
    if (modelGroup) {
      modelGroup.rotation.x = props.rotationX;
      modelGroup.rotation.y = props.rotationY;
      modelGroup.rotation.z = props.rotationZ;
      modelGroup.scale.set(props.scale, props.scale, props.scale);
      modelGroup.position.y = props.positionY;
      modelGroup.position.x = props.positionX;
    }

    renderer.render(scene, camera);
  };
  animate();
};

// Create a High-End Quantum Kinetic Energy Core & Orbital Reactor
const createQuantumEnergyCore = () => {
  fallbackGadgetGroup = new THREE.Group();

  // Materials
  const silverChromeMat = new THREE.MeshPhysicalMaterial({
    color: 0xf1f5f9, // Sterling Silver
    metalness: 0.98,
    roughness: 0.06,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    reflectivity: 1.0
  });

  const cyanEmissiveMat = new THREE.MeshStandardMaterial({
    color: 0x00f0ff,
    emissive: 0x00f0ff,
    emissiveIntensity: 1.0,
    metalness: 0.9,
    roughness: 0.1
  });

  const roseEmissiveMat = new THREE.MeshStandardMaterial({
    color: 0xf43f5e,
    emissive: 0xf43f5e,
    emissiveIntensity: 1.0,
    metalness: 0.9,
    roughness: 0.1
  });

  const crystalCoreMat = new THREE.MeshPhysicalMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 0.5,
    transmission: 0.9,
    transparent: true,
    opacity: 0.85,
    roughness: 0.02,
    ior: 1.8,
    reflectivity: 1.0
  });

  // 1. OUTER HEAVY SILVER CHASSIS RING
  const outerRingGeo = new THREE.TorusGeometry(1.9, 0.22, 32, 100);
  const outerRing = new THREE.Mesh(outerRingGeo, silverChromeMat);
  fallbackGadgetGroup.add(outerRing);

  // Outer Ring Cyan Energy Emitters (4 Quadrant Accents)
  const emitterGeo = new THREE.BoxGeometry(0.3, 0.48, 0.48);
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2;
    const emitter = new THREE.Mesh(emitterGeo, cyanEmissiveMat);
    emitter.position.set(Math.cos(angle) * 1.9, Math.sin(angle) * 1.9, 0);
    emitter.rotation.z = angle;
    fallbackGadgetGroup.add(emitter);
  }

  // 2. MIDDLE KINETIC ORBIT RING (Rotates on X axis)
  const midRingGeo = new THREE.TorusGeometry(1.4, 0.08, 24, 80);
  middleOrbitRing = new THREE.Mesh(midRingGeo, silverChromeMat);
  fallbackGadgetGroup.add(middleOrbitRing);

  // 3. INNER NEON CYBER ORBIT RING (Rotates on Z axis)
  const innerRingGeo = new THREE.TorusGeometry(1.0, 0.05, 24, 80);
  innerOrbitRing = new THREE.Mesh(innerRingGeo, roseEmissiveMat);
  fallbackGadgetGroup.add(innerOrbitRing);

  // 4. FLOATING QUANTUM CRYSTAL CORE (Center Diamond)
  const crystalGeo = new THREE.OctahedronGeometry(0.6, 2);
  coreCrystalMesh = new THREE.Mesh(crystalGeo, crystalCoreMat);
  fallbackGadgetGroup.add(coreCrystalMesh);

  // 5. FLOATING ENERGY SPARK PARTICLES
  const particleCount = 120;
  const particleGeo = new THREE.BufferGeometry();
  const particlePos = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    const radius = 1.2 + Math.random() * 1.5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    particlePos[i] = radius * Math.sin(phi) * Math.cos(theta);
    particlePos[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
    particlePos[i + 2] = radius * Math.cos(phi);
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0x38bdf8,
    size: 0.04,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });

  particleSystem = new THREE.Points(particleGeo, particleMat);
  fallbackGadgetGroup.add(particleSystem);

  modelGroup.add(fallbackGadgetGroup);
};

// Load custom GLB file and apply Sterling Silver & Fantasy Lighting highlights
const loadModel = (url) => {
  isLoading.value = true;
  const loader = new GLTFLoader();
  loader.load(
    url,
    (gltf) => {
      if (fallbackGadgetGroup) {
        modelGroup.remove(fallbackGadgetGroup);
      }
      if (loadedModel) {
        modelGroup.remove(loadedModel);
      }
      loadedModel = gltf.scene;

      const box = new THREE.Box3().setFromObject(loadedModel);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());

      loadedModel.position.sub(center);

      const maxDim = Math.max(size.x, size.y, size.z);
      const scaleFactor = 2.8 / maxDim;
      loadedModel.scale.set(scaleFactor, scaleFactor, scaleFactor);

      loadedModel.traverse((child) => {
        if (child.isMesh && child.material) {
          child.castShadow = true;
          child.receiveShadow = true;

          if (child.material.isMeshStandardMaterial || child.material.isMeshPhysicalMaterial) {
            child.material.roughness = Math.min(child.material.roughness, 0.25);
            child.material.metalness = Math.max(child.material.metalness, 0.75);
            child.material.needsUpdate = true;
          }
        }
      });

      modelGroup.add(loadedModel);
      isLoading.value = false;
    },
    (xhr) => {
      if (xhr.lengthComputable) {
        loadProgress.value = Math.round((xhr.loaded / xhr.total) * 100);
      }
    },
    (error) => {
      console.warn('GLB load fallback to Quantum Core 3D model:', error.message);
      isLoading.value = false;
    }
  );
};

// Wireframe toggle update
watch(() => props.wireframe, (val) => {
  const target = loadedModel || fallbackGadgetGroup;
  if (target) {
    target.traverse((child) => {
      if (child.isMesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => (m.wireframe = val));
        } else {
          child.material.wireframe = val;
        }
      }
    });
  }
});

const onResize = () => {
  if (!canvasContainer.value || !camera || !renderer) return;
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
};

onMounted(() => {
  initThree();
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize);
  if (animationId) cancelAnimationFrame(animationId);
  if (renderer) renderer.dispose();
});
</script>
