<template>
  <div>
    <input type="file" @change="loadPDF" />
    <div ref="pdfViewer" class="pdf-viewer"></div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import WebViewer from "@pdftron/webviewer";

export default {
  name: "PDFExpress",
  setup() {
    const pdfViewer = ref(null);
    let instance = null;

    const loadPDF = (event) => {
      const file = event.target.files[0];
      if (file) {
        WebViewer(
          {
            path: "/lib",
            initialDoc: file,
          },
          pdfViewer.value
        ).then((webViewerInstance) => {
          instance = webViewerInstance;
        });
      }
    };

    onMounted(() => {
      if (pdfViewer.value) {
        pdfViewer.value.style.height = "800px"; // Adjust as necessary
      }
    });

    return {
      pdfViewer,
      loadPDF,
    };
  },
};
</script>

<style scoped>
.pdf-viewer {
  max-height: 800px; /* Adjust as necessary */
  overflow-y: scroll;
}
</style>
