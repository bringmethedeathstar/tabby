<template>
  <header
    aria-label="Site Header"
    class="bg-white px-4 pt-4 flex items-center"
  >
    <img class="w-20 h-auto mr-6" :src="brand" />

    <h1 class="text-xl font-semibold w-full py-2">Tabby SEO Tools</h1>
  </header>

  <main class="p-4">
    <RouterView></RouterView>
  </main>
</template>

<script setup lang="ts">
import brand from '../assets/tabby.svg'
</script>

<style scoped></style>
