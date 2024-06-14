<template>
    <div>
      <h1>About Page</h1>
      <button @click="navigateToHome">Go to Home</button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'About',
    methods: {
      navigateToHome() {
        this.$router.push({ name: 'Home' });
      }
    }
  };
  </script>
  
  <style scoped>
  button {
    padding: 10px 20px;
    margin-top: 20px;
  }
  </style>
  