<template>
  <div>
    <input type="file" @change="onFileChange" />

    <div ref="pdfContainer" class="pdf-container"></div>

    <div
      v-for="(pageData, index) in pdfPagesData"
      :key="index"
      class="page-row"
    >
      <!-- Metadata and Annotations -->
      <div class="page-metadata">
        <strong>Page {{ pageData.pageNumber }}:</strong>
        <ul>
          <li>
            <strong>Viewport Scale:</strong> {{ pageData.viewport.scale }}
          </li>
          <li>
            <strong>Viewport Rotation:</strong> {{ pageData.viewport.rotation }}
          </li>
          <li>
            <strong>Viewport Width:</strong> {{ pageData.viewport.width }}
          </li>
          <li>
            <strong>Viewport Height:</strong> {{ pageData.viewport.height }}
          </li>
          <li v-for="item in pageData.items" :key="item.id">
            <strong>{{ item.type }}:</strong> {{ item.data }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from "vue";
import * as pdfjsLib from "pdfjs-dist/build/pdf.js";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "../../node_modules/pdfjs-dist/build/pdf.worker.js";

export default {
  name: "PDFPicker",
  setup() {
    const pdfPagesData = ref<Array<any>>([]);
    const pdfContainer = ref<HTMLDivElement | null>(null);
    let pdf = null;

    const onFileChange = async (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // process pdf annotations
        const pdfSrc = URL.createObjectURL(file);
        await processPDF(pdfSrc);
        // render pdf
        const reader = new FileReader();
        reader.onload = async (e) => {
          const typedArray = new Uint8Array(e.target?.result as ArrayBuffer);
          pdf = await pdfjsLib.getDocument(typedArray).promise;
          renderAllPages();
        };
        reader.readAsArrayBuffer(file);
      }
    };

    const processPDF = async (src: string) => {
      const pdf = await pdfjsLib.getDocument(src).promise;

      const pagesData = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1 });

        // Create a canvas for rendering the PDF page
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const pdfData = await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;

        const annotations = await page.getAnnotations();

        pagesData.push({
          pageNumber: i,
          pdfCanvas: canvas, // Store the canvas element for rendering
          items: annotations.map((item) => ({
            id: item.id,
            type: "Annotation",
            data: item,
          })),
          viewport: {
            scale: viewport.scale,
            rotation: viewport.rotation,
            width: viewport.width,
            height: viewport.height,
          },
        });
      }

      pdfPagesData.value = pagesData;
    };

    // // Automatically render the PDF pages after the component is mounted
    // onMounted(() => {
    //   renderPDFPages();
    // });

    // const renderPDFPages = () => {
    //   pdfPagesData.value.forEach((pageData) => {
    //     if (pageData.pdfCanvas) {
    //       const canvasContainer = pageData.pdfCanvas.parentElement;
    //       if (canvasContainer) {
    //         canvasContainer.appendChild(pageData.pdfCanvas);
    //       }
    //     }
    //   });
    // };

    const renderAllPages = async () => {
      console.log("Rendering all pages");
      if (pdf && pdfContainer.value) {
        for (let i = 1; i <= pdf.numPages; i++) {
          const canvas = document.createElement("canvas");
          pdfContainer.value.appendChild(canvas);
          await renderPage(i, canvas);
        }
      }
    };

    const renderPage = async (num: number, canvas: HTMLCanvasElement) => {
      const page = await pdf.getPage(num);
      const viewport = page.getViewport({ scale: 1.5 });
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      page.render(renderContext);
    };

    return {
      pdfPagesData,
      onFileChange,
    };
  },
};
</script>

<style scoped>
.page-row {
  display: flex;
  border-bottom: 1px solid #eee;
  padding: 10px 0;
}

.page-pdf {
  flex: 1;
  padding: 10px;
  overflow: hidden; /* Add this to hide any overflow from the canvas */
}

.page-metadata {
  flex: 2;
  padding: 10px;
  overflow-y: auto;
  max-height: 300px;
}
</style>
