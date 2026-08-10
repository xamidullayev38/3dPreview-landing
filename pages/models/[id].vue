<template>
  <div class="max-w-6xl mx-auto px-6 py-10">
    <!-- Navigation Back Button -->
    <div class="mb-6">
      <NuxtLink 
        to="/models" 
        class="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Galereyaga qaytish
      </NuxtLink>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="border border-zinc-800 bg-zinc-900/50 p-12 rounded-2xl text-center animate-pulse">
      <div class="w-8 h-8 border-2 border-zinc-700 border-t-zinc-200 rounded-full animate-spin mx-auto mb-3"></div>
      <p class="text-zinc-400 font-medium text-xs">Model ma'lumotlari yuklanmoqda...</p>
    </div>

    <!-- Model Details Grid -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      <!-- Left: Interactive 3D View Container -->
      <div class="lg:col-span-2 space-y-4">
        <div class="h-[520px] w-full rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 relative shadow-2xl">
          <ClientOnly>
            <ThreeViewer :model-url="fullModelUrl" />
          </ClientOnly>
        </div>

        <!-- Controls Legend -->
        <div class="border border-zinc-800 bg-zinc-900/50 p-3.5 rounded-xl flex flex-wrap items-center justify-between text-xs text-zinc-400 gap-4 font-mono">
          <div class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>Sichqoncha: 360° Orbit Rotation</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
            <span>G'ildirak: Zoom In / Out</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
            <span>O'ng Tugma: Pan Move</span>
          </div>
        </div>
      </div>

      <!-- Right: Specs Panel -->
      <div class="border border-zinc-800 bg-[#0d0e12] p-6 rounded-2xl space-y-6 shadow-xl">
        <div>
          <div class="flex items-center justify-between gap-3 mb-2">
            <span class="px-2.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-cyan-400 text-[10px] font-mono font-semibold uppercase">
              3D GLB Model
            </span>
            <span class="text-zinc-500 text-xs font-mono">
              {{ activeModel.createdAt ? new Date(activeModel.createdAt).toLocaleDateString() : 'Real-Time' }}
            </span>
          </div>
          <h1 class="text-2xl font-bold text-white tracking-tight">
            {{ activeModel.name }}
          </h1>
        </div>

        <!-- Description -->
        <div class="space-y-2 border-t border-zinc-800/80 pt-4">
          <h3 class="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Tavsif</h3>
          <p class="text-zinc-300 text-xs leading-relaxed">
            {{ activeModel.description || 'Interaktiv 3D model. 360 burchak ostida ko\'rishingiz mumkin.' }}
          </p>
        </div>

        <!-- Specs -->
        <div class="space-y-2.5 border-t border-zinc-800/80 pt-4 text-xs font-mono">
          <h3 class="font-semibold text-zinc-400 uppercase tracking-wider mb-2 font-sans">Texnik Xususiyatlar</h3>
          
          <div class="flex justify-between py-1 border-b border-zinc-800/50">
            <span class="text-zinc-500">Format</span>
            <span class="text-zinc-200">.GLB (Binary GLTF)</span>
          </div>
          <div class="flex justify-between py-1 border-b border-zinc-800/50">
            <span class="text-zinc-500">Hajmi</span>
            <span class="text-zinc-200">
              {{ activeModel.fileSize ? (activeModel.fileSize / 1024 / 1024).toFixed(2) + ' MB' : '3.72 MB' }}
            </span>
          </div>
          <div class="flex justify-between py-1 border-b border-zinc-800/50">
            <span class="text-zinc-500">Engine</span>
            <span class="text-zinc-200">Three.js WebGL</span>
          </div>
        </div>

        <!-- Download / Action Button -->
        <div class="pt-3">
          <a 
            v-if="fullModelUrl && fullModelUrl.startsWith('http')"
            :href="fullModelUrl" 
            download
            target="_blank"
            class="w-full py-3 px-4 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
            .GLB Faylini Yuklab Olish
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const route = useRoute();
const config = useRuntimeConfig();

// Predefined sample models fallback registry
const sampleModelsMap = {
  'sample-1': {
    id: 'sample-1',
    name: 'Sample Cyberpunk Helmet',
    description: 'Futuristik 3D kaskad va metalli renderlangan vizor bilan jihozlangan model.',
    fileUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
    fileSize: 3715124
  },
  'sample-2': {
    id: 'sample-2',
    name: 'Quantum Kinetic Core',
    description: 'Yuqori aniqlikdagi kinetik halqalar va nur sochuvchi yadro kristalli.',
    fileUrl: '',
    fileSize: 2415120
  }
};

const { data: apiModel, pending } = await useFetch(`${config.public.apiBase}/api/models/${route.params.id}`, {
  key: `model-${route.params.id}`,
  lazy: true
});

const activeModel = computed(() => {
  if (apiModel.value && apiModel.value.name) return apiModel.value;
  return sampleModelsMap[route.params.id] || {
    id: route.params.id,
    name: 'Sample Cyberpunk Helmet',
    description: 'Futuristik 3D kaskad va metalli renderlangan vizor bilan jihozlangan model.',
    fileUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
    fileSize: 3715124
  };
});

const fullModelUrl = computed(() => {
  if (!activeModel.value || !activeModel.value.fileUrl) return '';
  if (activeModel.value.fileUrl.startsWith('http') || activeModel.value.fileUrl.startsWith('data:')) return activeModel.value.fileUrl;
  return `${config.public.apiBase}${activeModel.value.fileUrl}`;
});
</script>
