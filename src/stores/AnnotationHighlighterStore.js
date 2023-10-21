import { defineStore } from "pinia";
import { ref } from "vue";

export const useAnnotationHighlighterStore = defineStore(
  "annotationHighlighter",
  () => {
    const annotation = ref({});

    const setAnnotation = (annotation, pageNumber) => {
      console.log("Setting annotation on page number " + pageNumber + " to ");
      console.log(annotation);
      annotation.value = annotation;
      let pageDiv = document.querySelector(
        "[data-page-number='" + pageNumber + "']",
      );
      pageDiv.classList.add("border-2", "border-red");
    };

    return { annotation, setAnnotation };
  },
);
