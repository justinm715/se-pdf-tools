<template>
  <div>
    <input type="file" @change="loadPDF" />
    <div ref="pdfContainer" class="pdf-container"></div>
  </div>
</template>

<script>
import { ref } from "vue";
import { PDFDocument } from "pdf-lib";

export default {
  name: "PDFLib",
  setup() {
    const pdfContainer = ref(null);
    let pdfDoc = null;

    const loadPDF = async (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const uint8Array = new Uint8Array(e.target.result);
          pdfDoc = await PDFDocument.load(uint8Array);
          renderAllPages();
        };
        reader.readAsArrayBuffer(file);
      }
    };

    const renderAllPages = async () => {
      if (pdfDoc && pdfContainer.value) {
        pdfContainer.value.innerHTML = ""; // Clear previous pages

        for (let i = 0; i < pdfDoc.getPageCount(); i++) {
          const page = pdfDoc.getPage(i);
          const { width, height } = page.getSize();
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          pdfContainer.value.appendChild(canvas);

          const context = canvas.getContext("2d");
          // const viewport = page.getViewport({ scale: 1.0 }); // Adjust scale as needed
          // const transform = viewport.transform;

          context.save();
          // context.transform(...transform);
          // await page.render({ canvasContext: context, viewport: viewport });
          await page.render({ canvasContext: context });
          context.restore();

          // You can use the canvas as needed (e.g., display or save)
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
  max-height: 800px; /* Adjust as necessary */
  overflow-y: scroll;
}
</style>
