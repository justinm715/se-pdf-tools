<template>
  <div>
    <input type="file" @change="onFileChange" />
    <div v-if="thumbnails.length">
      <img
        v-for="(thumbnail, index) in thumbnails"
        :key="index"
        :src="thumbnail"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { ref, watch } from "vue";
import * as pdfjsLib from "pdfjs-dist/build/pdf.js";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "../../node_modules/pdfjs-dist/build/pdf.worker.js";

export default {
  name: "PDFPicker",
  setup() {
    const pdfSrc = ref<string | null>(null);
    const thumbnails = ref<string[]>([]);

    watch(pdfSrc, async (newSrc) => {
      if (newSrc) {
        generateThumbnails(newSrc);
      }
    });

    const onFileChange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        pdfSrc.value = URL.createObjectURL(file);
      }
    };

    const generateThumbnails = async (src: string) => {
      const pdf = await pdfjsLib.getDocument(src).promise;

      thumbnails.value = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.5 }); // Adjust scale as needed
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;

        thumbnails.value.push(canvas.toDataURL());
      }
    };

    return {
      thumbnails,
      onFileChange,
    };
  },
};
</script>
