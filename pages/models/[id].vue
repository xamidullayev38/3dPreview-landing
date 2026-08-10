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

    <!-- Error State -->
    <div v-else-if="error || !model" class="border border-rose-500/20 bg-rose-500/5 p-12 rounded-2xl text-center">
      <h2 class="text-lg font-bold text-rose-400 mb-1">Model topilmadi</h2>
      <p class="text-zinc-400 text-xs mb-6">Ushbu identifikator bo'yicha model mavjud emas.</p>
      <NuxtLink to="/models" class="px-4 py-2 bg-zinc-800 text-white rounded-lg text-xs font-semibold">
        Modellarga qaytish
      </NuxtLink>
    </div>

    <!-- Model Details Grid -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      <!-- Left: Interactive 3D View Container -->
      <div class="lg:col-span-2 space-y-4">
        <div class="h-[520px] w-full rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 relative">
          <ClientOnly>
            <ThreeViewer :model-url="fullModelUrl" />
          </ClientOnly>
        </div>

        <!-- Controls Legend -->
        <div class="border border-zinc-800 bg-zinc-900/50 p-3.5 rounded-xl flex flex-wrap items-center justify-between text-xs text-zinc-400 gap-4 font-mono">
          <div class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
            <span>Chap Tugma: 360° Rotate</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
            <span>G'ildirak: Zoom</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
            <span>O'ng Tugma: Pan</span>
          </div>
        </div>
      </div>

      <!-- Right: Specs Panel -->
      <div class="border border-zinc-800 bg-[#0d0e12] p-6 rounded-2xl space-y-6">
        <div>
          <div class="flex items-center justify-between gap-3 mb-2">
            <span class="px-2.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px] font-mono font-semibold uppercase">
              3D GLB Model
            </span>
            <span class="text-zinc-500 text-xs font-mono">
              {{ model.createdAt ? new Date(model.createdAt).toLocaleDateString() : 'Noma\'lum' }}
            </span>
          </div>
          <h1 class="text-2xl font-bold text-white tracking-tight">
            {{ model.name }}
          </h1>
        </div>

        <!-- Description -->
        <div class="space-y-2 border-t border-zinc-800/80 pt-4">
          <h3 class="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Tavsif</h3>
          <p class="text-zinc-300 text-xs leading-relaxed">
            {{ model.description || 'Model uchun tavsif kiritilmagan.' }}
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
              {{ model.fileSize ? (model.fileSize / 1024 / 1024).toFixed(2) + ' MB' : 'Standard' }}
            </span>
          </div>
          <div class="flex justify-between py-1 border-b border-zinc-800/50">
            <span class="text-zinc-500">Engine</span>
            <span class="text-zinc-200">Three.js WebGL</span>
          </div>
        </div>

        <!-- Download Action -->
        <div class="pt-3">
          <a 
            :href="fullModelUrl" 
            download
            target="_blank"
            class="w-full py-3 px-4 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
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

const { data: model, pending, error } = await useFetch(`${config.public.apiBase}/api/models/${route.params.id}`, {
  default: () => ({
    id: route.params.id,
    name: 'Sample Cyberpunk Helmet',
    description: 'A futuristic 3D helmet model with metallic reflections and glowing visor.',
    fileUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
    fileSize: 3715124
  })
});

const fullModelUrl = computed(() => {
  if (!model.value || !model.value.fileUrl) return '';
  if (model.value.fileUrl.startsWith('http') || model.value.fileUrl.startsWith('data:')) return model.value.fileUrl;
  return `${config.public.apiBase}${model.value.fileUrl}`;
});
</script>
