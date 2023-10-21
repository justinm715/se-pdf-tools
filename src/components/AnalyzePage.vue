<template>
  <div>
    <button
      @click="listAnnotations"
      class="px-4 py-2 font-semibold text-sm bg-cyan-500 text-white rounded shadow-sm mb-2"
    >
      List Annotation Types
    </button>
    <ul v-if="annotations.length" class="mb-2">
      <li
        v-for="annotation in annotations"
        :key="annotation"
        class="hover:bg-amber-100"
        @mouseover="highlightAnnotation(annotation)"
      >
        {{ annotation.type }} : {{ annotation.points }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import { useAnnotationHighlighterStore } from "../stores/AnnotationHighlighterStore";

import {
  Point,
  Vector,
  Circle,
  Line,
  Ray,
  Segment,
  Arc,
  Box,
  Polygon,
  Matrix,
  PlanarSet,
} from "@flatten-js/core";

export default {
  name: "AnalyzePage",
  props: {
    annotationData: {
      type: Array,
      required: true,
    },
    pageNumber: {
      type: Number,
      required: true,
    },
    pageContainer: { required: true },
  },
  setup(props) {
    const annotations = ref([]);

    // const annotationHighlighterStore = useAnnotationHighlighterStore();

    const highlightAnnotation = (a) => {
      // annotationHighlighterStore.setAnnotation(a, props.pageNumber);
      // let pageDiv = document.querySelector(
      //   "[data-page-number='" + props.pageNumber + "']",
      // );
      // pageDiv.classList.add("border-2", "border-red-200");
      props.pageContainer.classList.add("border-2", "border-red-200");
    };

    const listAnnotations = () => {
      annotations.value = props.annotationData.map((a) => {
        let r = { type: a.subtype, points: null };
        switch (a.subtype) {
          case "FreeText":
            r.points = [
              { x: a.rect[0], y: a.rect[1] },
              { x: a.rect[2], y: a.rect[3] },
            ];
            break;
          case "Line":
            r.points = [
              { x: a.lineCoordinates[0], y: a.lineCoordinates[1] },
              { x: a.lineCoordinates[2], y: a.lineCoordinates[3] },
            ];
            break;
          case "Square":
            r.points = [
              { x: a.rect[0], y: a.rect[1] },
              { x: a.rect[2], y: a.rect[3] },
            ];
            break;
          case "Circle":
            r.points = [
              { x: a.rect[0], y: a.rect[1] },
              { x: a.rect[2], y: a.rect[3] },
            ];
            break;
          case "Polygon":
          case "PolyLine":
            r.points = a.vertices;
            break;
        }
        return r;
      });
    };

    return {
      annotations,
      listAnnotations,
      highlightAnnotation,
    };
  },
};
</script>

<style scoped>
/* You can style your button and list here */
</style>
