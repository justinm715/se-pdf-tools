<template>
  <div>
    <button
      @click="listAnnotationTypes"
      class="px-4 py-2 font-semibold text-sm bg-cyan-500 text-white rounded shadow-sm mb-2"
    >
      List Annotation Types
    </button>
    <ul v-if="annotationTypes.length" class="mb-2">
      <li v-for="type in annotationTypes" :key="type">{{ type }}</li>
    </ul>
  </div>
</template>

<script lang="ts">
export default {
  name: "AnalyzePage",
  props: {
    annotationData: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      annotationTypes: [],
    };
  },
  methods: {
    listAnnotationTypes() {
      this.annotationTypes = this.annotationData.map((a) => a.annotationType);
    },
  },
};
</script>

<style scoped>
/* You can style your button and list here */
</style>
