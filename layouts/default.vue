<template>
  <div class="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans selection:bg-zinc-800 selection:text-white antialiased">
    <!-- Clean Minimalist Header (shown on subpages) -->
    <header v-if="route.path !== '/'" class="fixed top-0 left-0 right-0 z-50 bg-[#09090b]/80 backdrop-blur-md border-b border-zinc-800/80">
      <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2.5 group">
          <div class="w-7 h-7 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-950 font-bold text-xs tracking-wider">
            3D
          </div>
          <span class="font-bold text-base tracking-tight text-white group-hover:text-zinc-300 transition-colors">3dView</span>
        </NuxtLink>

        <!-- Navigation Links -->
        <div class="hidden md:flex items-center gap-8 text-xs font-medium text-zinc-400">
          <NuxtLink to="/" class="hover:text-white transition-colors" active-class="text-white font-semibold">
            Bosh sahifa
          </NuxtLink>
          <NuxtLink to="/models" class="hover:text-white transition-colors" active-class="text-white font-semibold">
            Modellar Galereyasi
          </NuxtLink>
        </div>

        <!-- Primary Action Button -->
        <div class="flex items-center gap-3">
          <NuxtLink 
            to="/models" 
            class="px-4 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-semibold text-xs transition-colors"
          >
            Modellar
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- Page Content -->
    <main class="flex-grow" :class="route.path !== '/' ? 'pt-16' : ''">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="border-t border-zinc-800/60 bg-[#09090b] py-12 px-6 mt-20 text-xs text-zinc-500">
      <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <span class="font-bold text-zinc-300">3dView</span>
          <span>• Web 3D Model Explorer</span>
        </div>
        <p>© {{ new Date().getFullYear() }} 3dView Platform. Simple, fast & real-time 3D model viewer.</p>
        <div class="flex gap-4">
          <NuxtLink to="/models" class="hover:text-zinc-300 transition">Modellar</NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
const route = useRoute();
</script>
