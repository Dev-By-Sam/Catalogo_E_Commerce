<template>
  <div class="min-h-screen bg-[#080809] text-[#e8eaed] flex flex-col font-sans selection:bg-kinetic-cyan selection:text-black">
    <!-- Navbar -->
    <Navbar />

    <!-- Crosshair Telemetry Cursor (Desktop) -->
    <TelemetryCursor />

    <!-- Slide-over Digital Ticket Cart Drawer -->
    <CartDrawer />

    <!-- Main Dynamic Route View -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Swiss Editorial Footer -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Navbar from '~/components/layout/Navbar.vue';
import TelemetryCursor from '~/components/layout/TelemetryCursor.vue';
import CartDrawer from '~/components/layout/CartDrawer.vue';
import Footer from '~/components/layout/Footer.vue';
</script>
