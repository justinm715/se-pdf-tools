<template>
  <div class="py-2 container">
    <input type="file" @change="loadPDF" />
    <div ref="pdfContainer" class="pdf-container grid grid-cols-2 gap-0">
      <div id="pdfPagesColumn"></div>
      <div id="annotationsColumn">
        <div
          v-for="annotations in allAnnotations"
          :key="annotations.pageNum"
          class="annotation-container h-[80vh] overflow-y-scroll"
        >
          <div
            v-for="annotation in annotations.data"
            :key="annotation.id"
            class="annotation-item text-xs"
          >
            Annotation: {{ annotation }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import * as pdfjsLib from "pdfjs-dist/build/pdf.js";
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "../../node_modules/pdfjs-dist/build/pdf.worker.js";

export default {
  name: "PdfViewer",
  setup() {
    const pdfContainer = ref<HTMLDivElement | null>(null);

    const allAnnotations = ref<Array<{ pageNum: number; data: any[] }>>([]);

    const loadPDF = (event: Event) => {
      const file = (event.target as HTMLInputElement)?.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const typedArray = new Uint8Array(e.target?.result as ArrayBuffer);
          const pdf = await pdfjsLib.getDocument(typedArray).promise;
          renderAllPages(pdf);
        };
        reader.readAsArrayBuffer(file);
      }
    };

    const renderAllPages = async (pdf: any) => {
      if (pdf && pdfContainer.value) {
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 0.5 });

          // Create a canvas for rendering the PDF page
          const pageContainer = document.createElement("div");
          pageContainer.classList.add(
            "border-0",
            "border-slate-500",
            "h-[80vh]",
            "overflow-auto",
          );
          const canvas = document.createElement("canvas");
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          pageContainer.appendChild(canvas);
          const pdfPagesColumn = document.getElementById("pdfPagesColumn");
          pdfPagesColumn.appendChild(pageContainer);

          const context = canvas.getContext("2d");
          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          };

          await page.render(renderContext);

          // Get annotations for the page
          const annotations = await page.getAnnotations();
          allAnnotations.value.push({ pageNum: i, data: annotations });
        }
      }
    };

    return {
      pdfContainer,
      loadPDF,
      allAnnotations,
    };
  },
};
</script>

<style scoped>
.pdf-container {
  /* max-height: 800px;
  overflow-y: scroll; */
}

.annotation-container {
  border-top: 1px solid #ddd;
  margin-right: 20px;
}

.annotation-item {
  margin-bottom: 10px;
}
</style>
