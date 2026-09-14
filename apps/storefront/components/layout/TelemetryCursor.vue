<template>
  <ClientOnly>
    <div
      v-if="isEnabled"
      class="fixed inset-0 pointer-events-none z-[9999] overflow-hidden hidden lg:block"
    >
      <!-- X Coordinate Hairline -->
      <div
        class="absolute left-0 right-0 h-[1px] bg-neutral-800/60 transition-transform duration-75 ease-out"
        :style="{ transform: `translateY(${y}px)` }"
      />
      <!-- Y Coordinate Hairline -->
      <div
        class="absolute top-0 bottom-0 w-[1px] bg-neutral-800/60 transition-transform duration-75 ease-out"
        :style="{ transform: `translateX(${x}px)` }"
      />

      <!-- Crosshair Center Reticle -->
      <div
        class="absolute -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ease-out flex items-center justify-center pointer-events-none"
        :style="{ left: `${x}px`, top: `${y}px` }"
      >
        <div
          class="w-5 h-5 rounded-full border border-kinetic-cyan/80 transition-all duration-200"
          :class="{ 'scale-150 bg-kinetic-cyan/10 border-white': isHoveringInteractive }"
        />
        <div class="absolute w-1 h-1 bg-kinetic-cyan rounded-full" />
        
        <!-- Live Telemetry Readout Pill -->
        <div
          class="absolute left-6 top-6 bg-industrial-950/90 border border-neutral-800 px-2 py-0.5 text-[9px] font-mono tracking-widest text-neutral-400 backdrop-blur-sm whitespace-nowrap"
        >
          <span class="text-kinetic-cyan">X:</span>{{ String(Math.round(x)).padStart(4, '0') }} 
          <span class="text-kinetic-cyan ml-1">Y:</span>{{ String(Math.round(y)).padStart(4, '0') }}
          <span v-if="hoverTag" class="text-white ml-2 uppercase text-[8px] bg-neutral-800 px-1 py-0.2">
            {{ hoverTag }}
          </span>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const isEnabled = ref(true);
const x = ref(0);
const y = ref(0);
const isHoveringInteractive = ref(false);
const hoverTag = ref('');

const updatePosition = (e: MouseEvent) => {
  x.value = e.clientX;
  y.value = e.clientY;

  const target = e.target as HTMLElement | null;
  if (target) {
    const interactive = target.closest('button, a, input, select, textarea, [data-interactive]');
    if (interactive) {
      isHoveringInteractive.value = true;
      hoverTag.value = interactive.getAttribute('data-tag') || interactive.tagName.toLowerCase();
    } else {
      isHoveringInteractive.value = false;
      hoverTag.value = '';
    }
  }
};

onMounted(() => {
  if (window.innerWidth >= 1024) {
    document.body.classList.add('custom-cursor-active');
    window.addEventListener('mousemove', updatePosition);
  }
});

onUnmounted(() => {
  document.body.classList.remove('custom-cursor-active');
  window.removeEventListener('mousemove', updatePosition);
});
</script>
