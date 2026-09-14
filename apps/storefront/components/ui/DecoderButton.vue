<template>
  <component
    :is="to ? NuxtLink : 'button'"
    :to="to"
    :type="to ? undefined : type"
    :disabled="disabled || loading"
    :data-interactive="true"
    :data-tag="tag || text"
    @mouseenter="onHover"
    class="relative inline-flex items-center justify-center font-mono uppercase tracking-widest text-xs transition-all duration-200 select-none group"
    :class="[
      variantClasses,
      sizeClasses,
      disabled || loading ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
    ]"
    @click="$emit('click', $event)"
  >
    <!-- Hairline Corner Accents -->
    <span
      v-if="showCorners"
      class="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-current transition-all duration-300 group-hover:w-full group-hover:h-full"
    />
    <span
      v-if="showCorners"
      class="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-current transition-all duration-300 group-hover:w-full group-hover:h-full"
    />

    <span v-if="loading" class="mr-2 inline-block animate-spin">⟳</span>
    <span v-else-if="$slots.icon" class="mr-2 inline-flex items-center">
      <slot name="icon" />
    </span>

    <span ref="textRef" class="relative z-10">{{ displayedText }}</span>

    <span v-if="$slots.append" class="ml-2 inline-flex items-center">
      <slot name="append" />
    </span>
  </component>
</template>

<script setup lang="ts">
import { ref, computed, watch, resolveComponent } from 'vue';
import { useTextScramble } from '~/composables/useTextScramble';

const NuxtLink = resolveComponent('NuxtLink');

const props = withDefaults(
  defineProps<{
    text: string;
    to?: string;
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'secondary' | 'outline' | 'whatsapp' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    tag?: string;
    showCorners?: boolean;
  }>(),
  {
    type: 'button',
    variant: 'primary',
    size: 'md',
    disabled: false,
    loading: false,
    showCorners: true,
  },
);

defineEmits(['click']);

const textRef = ref<HTMLElement | null>(null);
const displayedText = ref(props.text);
const { scramble } = useTextScramble();

watch(
  () => props.text,
  (newVal) => {
    displayedText.value = newVal;
  },
);

const onHover = () => {
  if (textRef.value && !props.disabled && !props.loading) {
    scramble(textRef.value, props.text, 20);
  }
};

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-white text-black hover:bg-kinetic-cyan hover:text-black border border-white hover:border-kinetic-cyan';
    case 'secondary':
      return 'bg-industrial-900 text-white hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-600';
    case 'outline':
      return 'bg-transparent text-white border border-neutral-800 hover:border-kinetic-cyan hover:text-kinetic-cyan';
    case 'whatsapp':
      return 'bg-[#25D366] text-black font-semibold hover:bg-[#1ebd5a] border border-[#25D366]';
    case 'danger':
      return 'bg-red-950/40 text-red-400 border border-red-800/80 hover:bg-red-900/60 hover:text-red-200';
    default:
      return 'bg-white text-black';
  }
});

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'px-3 py-1.5 text-[10px]';
    case 'lg':
      return 'px-8 py-4 text-sm font-bold tracking-widest';
    case 'md':
    default:
      return 'px-5 py-2.5 text-xs';
  }
});
</script>
