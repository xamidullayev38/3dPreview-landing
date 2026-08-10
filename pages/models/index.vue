<template>
  <div class="max-w-6xl mx-auto px-6 py-10">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-zinc-800 pb-8">
      <div>
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400 mb-3">
          3D Model Kolleksiyasi
        </div>
        <h1 class="text-3xl md:text-5xl font-bold text-white tracking-tight">
          Barcha 3D Modellar
        </h1>
        <p class="text-zinc-400 text-sm mt-2">
          Model ustiga bosing va 360-graduslik interaktiv ko'rish oynasiga o'ting.
        </p>
      </div>

      <!-- Search Input -->
      <div class="relative w-full md:w-80">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Model nomini qidirish..." 
          class="w-full px-4 py-2.5 pl-10 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-500 text-xs focus:outline-none focus:border-zinc-600 transition-colors"
        />
        <svg class="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="n in 6" :key="n" class="border border-zinc-800 bg-zinc-900/50 rounded-xl h-72 animate-pulse p-6 flex flex-col justify-between">
        <div class="w-full h-36 bg-zinc-800/60 rounded-lg"></div>
        <div class="space-y-2">
          <div class="h-4 bg-zinc-800 rounded w-3/4"></div>
          <div class="h-3 bg-zinc-800/40 rounded w-full"></div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredModels.length === 0" class="border border-zinc-800 bg-zinc-900/40 p-16 rounded-2xl text-center">
      <div class="w-12 h-12 rounded-xl bg-zinc-800 text-zinc-400 flex items-center justify-center mx-auto mb-4 font-mono font-bold text-xs border border-zinc-700">
        3D
      </div>
      <h3 class="text-lg font-bold text-white mb-1">Modellar topilmadi</h3>
      <p class="text-zinc-400 text-xs mb-6">
        Hozircha hech qanday model mavjud emas yoki qidiruv natijasi bo'sh.
      </p>
      <a href="http://localhost:3001" target="_blank" class="px-4 py-2 bg-zinc-100 text-zinc-950 font-semibold text-xs rounded-lg hover:bg-zinc-200 transition">
        Admin Console orqali yuklash
      </a>
    </div>

    <!-- Models Grid Cards -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <div 
        v-for="model in filteredModels" 
        :key="model.id" 
        class="border border-zinc-800 bg-[#0d0e12] hover:border-zinc-700 rounded-2xl overflow-hidden transition-colors flex flex-col justify-between group"
      >
        <!-- Card 3D Preview Header -->
        <div class="h-44 bg-zinc-950 p-4 relative flex items-center justify-center border-b border-zinc-800/80">
          <div class="w-20 h-20 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
            <svg class="w-8 h-8 text-zinc-400 group-hover:text-zinc-200 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
            </svg>
          </div>
          <span class="absolute top-3 right-3 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400">
            .GLB
          </span>
        </div>

        <!-- Card Body -->
        <div class="p-5 flex-grow flex flex-col justify-between">
          <div>
            <h3 class="text-lg font-bold text-white mb-1.5 group-hover:text-zinc-200 transition-colors">
              {{ model.name }}
            </h3>
            <p class="text-zinc-400 text-xs line-clamp-2 leading-relaxed mb-4">
              {{ model.description || 'Model haqida ma\'lumot kiritilmagan.' }}
            </p>
          </div>

          <div class="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
            <span class="text-[10px] text-zinc-500 font-mono">
              {{ model.fileSize ? (model.fileSize / 1024 / 1024).toFixed(2) + ' MB' : 'GLB Model' }}
            </span>

            <NuxtLink 
              :to="`/models/${model.id}`" 
              class="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs border border-zinc-700 transition flex items-center gap-1"
            >
              360° Ko'rish
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const config = useRuntimeConfig();
const searchQuery = ref('');

const { data: models, pending } = await useFetch(`${config.public.apiBase}/api/models`, {
  default: () => [
    {
      id: 'sample-1',
      name: 'Sample Cyberpunk Helmet',
      description: 'A futuristic 3D helmet model with metallic reflections and glowing visor.',
      fileUrl: '/uploads/sample_helmet.glb',
      fileSize: 2048000
    }
  ]
});

const filteredModels = computed(() => {
  if (!models.value) return [];
  if (!searchQuery.value) return models.value;
  return models.value.filter(m => 
    m.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    (m.description && m.description.toLowerCase().includes(searchQuery.value.toLowerCase()))
  );
});
</script>
