<template>
  <div class="h-screen flex flex-col">
    <!-- Navbar -->
    <div class="bg-blue-600 p-4 shadow-md text-white">
      <div class="container mx-auto">
        <h1 class="text-xl font-semibold">My Vue App</h1>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-grow container mx-auto py-8">
      <h2 class="text-3xl font-bold mb-4">PDFUploader.vue</h2>
      <PDFUploader />
      <hr class="my-6" />
      <h2 class="text-3xl font-bold mb-4">PDFViewer.vue</h2>
      <PDFViewer />
      <hr class="my-6" />
      <h2 class="text-3xl font-bold mb-4">PDFLib.vue</h2>
      <PDFLib />
    </div>

    <!-- Footer -->
    <div class="bg-gray-800 p-4 text-center text-white">
      <p>© 2023 My Vue App. All rights reserved.</p>
    </div>
  </div>
</template>

<script setup>
import PDFUploader from "./components/PDFUploader.vue";
import PDFViewer from "./components/PDFViewer.vue";
import PDFLib from "./components/PDFLib.vue";
</script>

<style scoped>
/* Add any additional styles or override Tailwind styles if needed */
</style>
