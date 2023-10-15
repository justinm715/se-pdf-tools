<template>
  <div>
    <input type="file" @change="loadPDF" />
    <div ref="pdfContainer" class="pdf-container grid grid-cols-2 gap-2"></div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from "vue";
import * as pdfjsLib from "pdfjs-dist/build/pdf.js";
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "../../node_modules/pdfjs-dist/build/pdf.worker.js";

export default {
  name: "PdfViewer",
  setup() {
    const pdfContainer = ref<HTMLDivElement | null>(null);
    let pdf = null;

    const loadPDF = (event: Event) => {
      const file = (event.target as HTMLInputElement)?.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const typedArray = new Uint8Array(e.target?.result as ArrayBuffer);
          pdf = await pdfjsLib.getDocument(typedArray).promise;
          renderAllPages();
        };
        reader.readAsArrayBuffer(file);
      }
    };

    const renderAllPages = async () => {
      if (pdf && pdfContainer.value) {
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1 });

          // Create a div to contain both the PDF page and annotations
          // const pageContainer = document.createElement("div");
          // pageContainer.classList.add(
          //   "page-container",
          //   "mb-4",
          //   "flex",
          //   "flex-col",
          // );
          // pdfContainer.value.appendChild(pageContainer);

          // // Display the page number
          // const pageLabel = document.createElement("div");
          // pageLabel.classList.add("font-bold", "mb-2");
          // pageLabel.textContent = `Page ${i}`;
          // pageContainer.appendChild(pageLabel);

          // Create a canvas for rendering the PDF page
          const pageContainer = document.createElement("div");
          pageContainer.classList.add("border", "border-slate-500");
          const canvas = document.createElement("canvas");
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          pageContainer.appendChild(canvas);
          pdfContainer.value.appendChild(pageContainer);

          const context = canvas.getContext("2d");
          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          };

          // Render the PDF page onto the canvas
          await page.render(renderContext).promise;

          // Get annotations for the page
          const annotations = await page.getAnnotations();

          // Create a div for annotations
          const annotationDiv = document.createElement("div");
          annotationDiv.classList.add("border", "border-rose-500");
          annotationDiv.classList.add("annotation-container", "break-words");
          pdfContainer.value.appendChild(annotationDiv);

          // Display annotations
          annotations.forEach((annotation) => {
            const annotationItem = document.createElement("div");
            annotationItem.classList.add("annotation-item", "mb-2", "text-xs");
            annotationItem.textContent = `Annotation: ${JSON.stringify(
              annotation,
            )}`;
            annotationDiv.appendChild(annotationItem);
          });
        }
      }
    };

    return {
      pdfContainer,
      loadPDF,
    };
  },
};
</script>

<style scoped>
.pdf-container {
  max-height: 800px;
  overflow-y: scroll;
}

.page-container {
  margin-right: 20px; /* Add spacing between pages */
}

.annotation-container {
  border-top: 1px solid #ddd;
}

.annotation-item {
  margin-bottom: 10px;
}
</style>
