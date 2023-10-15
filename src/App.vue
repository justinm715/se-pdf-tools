<template>
  <div class="h-screen flex flex-col flex-grow">
    <!-- Navbar -->
    <div class="bg-blue-600 p-2 shadow-md text-white w-screen">
      <div class="mx-auto">
        <h1 class="text-xl font-semibold">My Vue App</h1>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-grow mx-auto">
      <PDFViewer />
    </div>

    <!-- Footer -->
    <div class="bg-gray-800 p-4 text-center text-white">
      <p>© 2023 My Vue App. All rights reserved.</p>
    </div>
  </div>
</template>

<script setup>
import PDFViewer from "./components/PDFViewer.vue";
</script>

<style scoped>
/* Add any additional styles or override Tailwind styles if needed */
</style>
