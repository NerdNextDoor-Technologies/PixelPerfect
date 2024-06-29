<template>
    <div>
      <h1>Welcome to the Landing Page</h1>
      <button @click="navigate('ImageConverter')">Go to ImageConverter</button>
      <button @click="navigate('PdfConverter')">Go to PdfConverter</button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'LandingPage',
    methods: {
      navigate(route) {
        this.$router.push({ name: route });
      }
    }
  }
  </script>
  