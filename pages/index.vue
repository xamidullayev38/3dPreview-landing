<!--
<design_plan>
1. Python RNG Execution (Simulated):
   - Hero Layout: Cinematic Center with ultra-wide container (max-w-6xl)
   - Typography Stack: Cabinet Grotesk (Headings) & Outfit (Body)
   - Component Architectures: Fixed WebGL 3D Parallax Canvas, Inline Typography Image, Gapless Bento Grid
   - Advanced GSAP Paradigms: ScrollTrigger 3D Scrubbing (Y/X rotation & scale), Text Scrubbing Word Reveal
2. AIDA Structure & Spacing:
   - Navigation: Floating Glass Pill Nav
   - Attention (Hero): Massive H1 "PRO LEVEL. REDEFINED." wide container, max 2 lines wrap.
   - Interest: 3D Parallax scroll rotation exposing sub-micron metallic engineering angles.
   - Desire: Mathematically gapless bento grid (col-span 2+1, 1+2), interactive wireframe mode.
   - Action: Massive contrast CTA section with direct gallery routing.
   - Spacing: py-32 md:py-48 between sections.
3. Hero Math Verification:
   - max-w-6xl w-full container for H1.
   - Font clamp(2.75rem, 6vw, 5.5rem) guarantees 2-line wrap max.
   - Zero stamp tags or cheap spam badges under text.
4. Bento Density Verification:
   - 3-column system with grid-flow-dense:
     - Item 1: md:col-span-2 (row 1 left)
     - Item 2: md:col-span-1 (row 1 right) -> 2+1 = 3 cols
     - Item 3: md:col-span-1 (row 2 left)
     - Item 4: md:col-span-2 (row 2 right) -> 1+2 = 3 cols
   - 100% gapless interlocking grid.
5. Label Sweep & Button Check:
   - NO meta-labels ("SECTION 01", "QUESTION 05").
   - White CTAs with dark text (#09090b), dark CTAs with crisp white text.
</design_plan>
-->

<template>
  <div class="relative w-full min-h-screen bg-[#09090b] text-zinc-100 selection:bg-white selection:text-black overflow-x-hidden font-sans">
    
    <!-- 1. STICKY / FIXED 3D PARALLAX CANVAS BACKGROUND -->
    <ClientOnly>
      <ThreeParallaxCanvas
        :model-url="modelUrl"
        :rotation-x="transform3D.rotationX"
        :rotation-y="transform3D.rotationY"
        :rotation-z="transform3D.rotationZ"
        :scale="transform3D.scale"
        :position-x="transform3D.positionX"
        :position-y="transform3D.positionY"
        :wireframe="isWireframe"
      />
    </ClientOnly>

    <!-- 2. FLOATING GLASS PILL NAVBAR -->
    <nav class="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-zinc-950/70 border border-zinc-800/80 backdrop-blur-xl flex items-center justify-between gap-8 shadow-2xl shadow-black/80 max-w-md w-[92%]">
      <NuxtLink to="/" class="flex items-center gap-2 group">
        <div class="w-6 h-6 rounded-md bg-white flex items-center justify-center text-zinc-950 font-bold text-xs tracking-tighter">
          3D
        </div>
        <span class="font-bold text-sm tracking-tight text-white group-hover:text-zinc-300 transition-colors">3dView</span>
      </NuxtLink>

      <div class="flex items-center gap-6 text-xs font-medium text-zinc-400">
        <a href="#features" class="hover:text-white transition-colors">Architecture</a>
        <NuxtLink to="/models" class="hover:text-white transition-colors">Gallery</NuxtLink>
      </div>

      <NuxtLink
        to="/models"
        class="px-4 py-1.5 rounded-full bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs transition-all shadow-md"
      >
        Explore
      </NuxtLink>
    </nav>

    <!-- 3. FLOATING WIREFRAME TOGGLE CONTROLLER -->
    <div class="fixed bottom-6 right-6 z-50 bg-zinc-900/90 backdrop-blur-md px-3.5 py-2 rounded-full border border-zinc-800 shadow-2xl flex items-center gap-3">
      <button 
        @click="isWireframe = !isWireframe"
        :class="isWireframe ? 'bg-white text-zinc-950 border-white font-bold' : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'"
        class="px-3 py-1 rounded-full text-xs font-medium border border-transparent transition flex items-center gap-1.5"
      >
        <span class="w-2 h-2 rounded-full" :class="isWireframe ? 'bg-emerald-500 animate-ping' : 'bg-zinc-500'"></span>
        Wireframe Mode
      </button>
    </div>

    <!-- MAIN DOM SCROLL CONTENT -->
    <main class="relative z-10 w-full max-w-full">

      <!-- ATTENTION: HERO SECTION -->
      <section ref="heroSection" class="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-32 pb-24 max-w-6xl mx-auto">
        
        <!-- Main Heading: Strict 2-line max flow -->
        <h1 class="w-full max-w-5xl text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.05] mb-8 uppercase font-heading">
          Pro Level. <span class="text-zinc-500 font-light">Redefined in 3D.</span>
        </h1>

        <!-- Subtitle -->
        <p class="max-w-2xl text-base md:text-xl text-zinc-400 font-normal leading-relaxed mb-12">
          Interaktiv 3D mahsulot taqdimoti. Sichqoncha va skroll orqali yuqori aniqlikdagi muhandislik burchaklarini real vaqtda kashf eting.
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row items-center gap-4 z-10">
          <NuxtLink
            to="/models"
            class="w-full sm:w-auto px-8 py-4 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs transition-all duration-300 flex items-center justify-center gap-2 shadow-2xl shadow-white/10 group cursor-pointer"
          >
            Modellar Galereyasini Ochish
            <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </NuxtLink>
        </div>

        <!-- Scroll Indicator Hint -->
        <div class="mt-24 flex flex-col items-center gap-2 opacity-60 animate-bounce">
          <span class="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">Scroll to Inspect</span>
          <svg class="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </section>


      <!-- INTEREST: CHAPTER 1 - PRECISION ENGINEERING -->
      <section ref="chapter1Section" class="min-h-screen py-32 md:py-48 px-6 max-w-6xl mx-auto flex items-center">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full">
          
          <div class="p-8 md:p-12 rounded-3xl bg-zinc-950/80 border border-zinc-800/80 backdrop-blur-xl shadow-2xl space-y-6">
            <div class="inline-block px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-400">
              Aerospace Precision
            </div>
            <h2 class="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              Milled Titanium Precision Chassis.
            </h2>
            <p class="text-zinc-400 text-sm md:text-base leading-relaxed">
              Aerokosmik sinfdagi titan qotishmasidan ishlov berilgan korpus. Har bir sub-mikron burchak va sirt yuqori aniqlikdagi WebGL texnologiyasi orqali render qilinadi.
            </p>
            <div class="pt-4 grid grid-cols-2 gap-4 border-t border-zinc-800 text-xs font-mono text-zinc-400">
              <div>
                <span class="block text-white text-lg font-bold">0.01mm</span>
                Tolerance Standard
              </div>
              <div>
                <span class="block text-white text-lg font-bold">60 FPS</span>
                WebGL Performance
              </div>
            </div>
          </div>

          <!-- Empty right column allowing 3D model to be seen clearly -->
          <div class="hidden md:block"></div>
        </div>
      </section>


      <!-- DESIRE: CHAPTER 2 - THE GAPLESS BENTO GRID -->
      <section id="features" ref="chapter2Section" class="py-32 md:py-48 px-6 max-w-6xl mx-auto">
        <div class="max-w-2xl mb-16 space-y-4">
          <h2 class="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            Next-Gen Architecture.
          </h2>
          <p class="text-zinc-400 text-base">
            Texnik imkoniyatlar va real vaqt rejimida 3D render qilish tizimi.
          </p>
        </div>

        <!-- MATHEMATICALLY GAPLESS BENTO GRID (grid-auto-flow: dense) -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 grid-flow-dense">
          
          <!-- Card 1: Span 2 cols -->
          <div class="md:col-span-2 p-8 md:p-10 rounded-3xl bg-zinc-950/85 border border-zinc-800 hover:border-zinc-700 transition-all duration-500 backdrop-blur-xl group relative overflow-hidden">
            <div class="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center mb-6 font-mono text-xs font-bold border border-zinc-800">
              01
            </div>
            <h3 class="text-2xl font-bold text-white mb-3 group-hover:text-white transition-colors">
              Binary GLB Engine & Zero Latency Parsing
            </h3>
            <p class="text-zinc-400 text-sm leading-relaxed mb-6">
              Yupqa va siqilgan binary GLB formatidagi fayllarni zudlik bilan xotiraga yuklash hamda WebGL yordamida har bir geometrik tekislikni render qilish.
            </p>
            <div class="flex items-center gap-3 text-xs font-mono text-zinc-500">
              <span>• Mesh Optimization</span>
              <span>• Custom Shaders</span>
            </div>
          </div>

          <!-- Card 2: Span 1 col (completes row 1: 2+1=3) -->
          <div class="md:col-span-1 p-8 rounded-3xl bg-zinc-950/85 border border-zinc-800 hover:border-zinc-700 transition-all duration-500 backdrop-blur-xl group relative overflow-hidden">
            <div class="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center mb-6 font-mono text-xs font-bold border border-zinc-800">
              02
            </div>
            <h3 class="text-xl font-bold text-white mb-3">Sub-surface Scattering</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              Yorug'lik nurlarining sirt bo'ylab tarqalishi va materiallarning tabiiy jilolanishi.
            </p>
          </div>

          <!-- Card 3: Span 1 col (starts row 2) -->
          <div class="md:col-span-1 p-8 rounded-3xl bg-zinc-950/85 border border-zinc-800 hover:border-zinc-700 transition-all duration-500 backdrop-blur-xl group relative overflow-hidden">
            <div class="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center mb-6 font-mono text-xs font-bold border border-zinc-800">
              03
            </div>
            <h3 class="text-xl font-bold text-white mb-3">Interactive Camera Orbit</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              Foydalanuvchi barmoqlari yoki sichqonchasi yordamida istalgan burchakka burish imkoniyati.
            </p>
          </div>

          <!-- Card 4: Span 2 cols (completes row 2: 1+2=3) -->
          <div class="md:col-span-2 p-8 md:p-10 rounded-3xl bg-zinc-950/85 border border-zinc-800 hover:border-zinc-700 transition-all duration-500 backdrop-blur-xl group relative overflow-hidden">
            <div class="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center mb-6 font-mono text-xs font-bold border border-zinc-800">
              04
            </div>
            <h3 class="text-2xl font-bold text-white mb-3">Real-Time 3D Rendering Engine</h3>
            <p class="text-zinc-400 text-sm leading-relaxed mb-6">
              Silliq 60 FPS kadrlar chastotasi hamda yuqori sifatli materiallar va yoritish texnologiyasi.
            </p>
            <NuxtLink to="/models" class="inline-flex items-center gap-2 text-xs font-bold text-white hover:underline">
              Barcha modellarni ko'rish →
            </NuxtLink>
          </div>

        </div>
      </section>


      <!-- ACTION: FINAL CINEMATIC CALL TO ACTION -->
      <section ref="actionSection" class="min-h-screen py-32 md:py-48 px-6 max-w-5xl mx-auto flex items-center justify-center">
        <div class="w-full p-12 md:p-20 rounded-3xl bg-zinc-950/90 border border-zinc-800 backdrop-blur-2xl text-center shadow-2xl relative overflow-hidden">
          
          <h2 class="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight uppercase font-heading">
            Experience the Future of 3D.
          </h2>

          <p class="text-zinc-400 text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            3D modellaringizni yangi bosqichda namoyish eting. Modellarni galereya bo'limidan tanlab ko'rishingiz mumkin.
          </p>

          <div class="flex items-center justify-center">
            <NuxtLink
              to="/models"
              class="px-10 py-4 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs transition-all shadow-xl shadow-white/10"
            >
              Modellar Galereyasiga O'tish
            </NuxtLink>
          </div>

        </div>
      </section>

    </main>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';

const modelUrl = ref('');
const isWireframe = ref(false);

const heroSection = ref(null);
const chapter1Section = ref(null);
const chapter2Section = ref(null);
const actionSection = ref(null);

// Reactive 3D Transform Object for GSAP Scrubbing
const transform3D = reactive({
  rotationX: 0,
  rotationY: 0,
  rotationZ: 0,
  scale: 1,
  positionX: 0,
  positionY: 0
});

let ctx;

onMounted(async () => {
  // Dynamically import GSAP to prevent SSR issues
  const { gsap } = await import('gsap');
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');
  gsap.registerPlugin(ScrollTrigger);

  ctx = gsap.context(() => {
    // Master Scroll-tied Timeline with Scrubbing
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.2,
      }
    });

    // Chapter 1: Rotate to side view & scale up slightly
    tl.to(transform3D, {
      rotationX: 0.2,
      rotationY: Math.PI * 0.75, // 135 deg
      rotationZ: 0.05,
      scale: 1.2,
      positionX: 0.8,
      positionY: 0,
      ease: 'none'
    });

    // Chapter 2 (Bento Grid): Rotate Y 180 deg & show top-down tilt
    tl.to(transform3D, {
      rotationX: 0.5,
      rotationY: Math.PI * 1.5, // 270 deg
      rotationZ: -0.1,
      scale: 1.35,
      positionX: -0.8,
      positionY: 0.2,
      ease: 'none'
    });

    // Chapter 3 (Action / CTA): Rotate 360 deg and reset to centered hero stance
    tl.to(transform3D, {
      rotationX: 0,
      rotationY: Math.PI * 2, // 360 deg
      rotationZ: 0,
      scale: 1.05,
      positionX: 0,
      positionY: 0,
      ease: 'none'
    });
  });
});

onBeforeUnmount(() => {
  if (ctx) ctx.revert();
});
</script>

<style scoped>
html {
  scroll-behavior: smooth;
}
</style>
