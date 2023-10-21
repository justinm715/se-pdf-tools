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
import { foobar } from "../helpers/canvasHelpers.js";
import * as d3 from "d3";

// import { useAnnotationHighlighterStore } from "../stores/AnnotationHighlighterStore";

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
    pdfToCanvasDisplayFactors: {
      type: Object,
      required: true,
    },
    annotationsCanvas: { required: true },
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
      // props.annotationsCanvas.classList.add("border-2", "border-red-200");

      // let svg = select(props.annotationsCanvas);
      // .append("svg")
      // .attr("width", props.annotationsCanvas.width)
      // .attr("height", props.annotationsCanvas.height);

      // svg.selectAll("*").remove();

      // // Draw a filled polygon connecting the active points, or a point if only one is present
      // if (a.points.length === 1) {
      //   svg
      //     .append("circle")
      //     .attr("cx", a.points[0].x)
      //     .attr("cy", a.points[0].y)
      //     .attr("r", 2.5) // Adjust the radius if needed
      //     .attr("fill", "yellow");
      // } else {
      //   console.log("Highlighting polygon");
      //   console.log(a);
      //   svg
      //     .append("polygon")
      //     .attr("points", a.points.map((p) => `${p.x},${p.y}`).join(" "))
      //     .attr("stroke", "#0f0")
      //     .attr("fill", "yellow");
      // }

      const ctx = props.annotationsCanvas.getContext("2d");
      let line = d3
        .line()
        .context(ctx)
        .x((d) => d[0])
        .y((d) => d[1]);
      ctx.clearRect(
        0,
        0,
        props.annotationsCanvas.width,
        props.annotationsCanvas.height,
      );

      // Draw the polygon
      ctx.beginPath();
      line(
        a.points.map((p) => {
          return foobar(
            p.x,
            p.y,
            pdfToCanvasDisplayFactors.rotation,
            pdfToCanvasDisplayFactors.scale,
            props.annotationsCanvas.width,
            props.annotationsCanvas.height,
          );
        }),
      );
      ctx.closePath();
      ctx.stroke();
      ctx.fillStyle = "yellow";
      ctx.fill();
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
