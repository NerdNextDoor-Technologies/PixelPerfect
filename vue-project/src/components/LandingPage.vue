<template>
    <div>
      <h1>Welcome to the Landing Page</h1>
      <button @click="navigate('hello-world')">Go to Hello World</button>
      <button @click="navigate('hello-earth')">Go to Hello Earth</button>
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
  