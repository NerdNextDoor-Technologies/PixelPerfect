<template>
  <div id="app">
    <header>
      <h1>Welcome to PixelPerfect</h1>
    </header>
    <main>
      <div v-if="!selectedFileType">
        <h2>Select File Type to Convert</h2>
        <button @click="selectFileType('image')">Image</button>
        <!-- Additional file type options can be added here -->
      </div>
      <div v-else>
        <ImageConverter v-if="selectedFileType === 'image'" />
        <!-- Additional file type components can be added here -->
      </div>
    </main>
  </div>
</template>

<script>
import ImageConverter from './components/ImageConverter.vue';
// Import other file type components as needed

export default {
  components: {
    ImageConverter,
    // Other components can be declared here
  },
  data() {
    return {
      selectedFileType: '',
    };
  },
  methods: {
    selectFileType(fileType) {
      this.selectedFileType = fileType;
    },
  },
};
</script>

<style>
/* Add your global styles here */
#app {
  text-align: center;
}
button {
  margin: 10px;
  padding: 10px 20px;
  font-size: 16px;
}
</style>
