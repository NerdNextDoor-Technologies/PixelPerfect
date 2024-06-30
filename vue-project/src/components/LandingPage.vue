<template>
  <div class="landing-page">
    <header class="navbar">
      <a href="#" class="navbar-brand">ConvertEase</a>
      <nav class="navbar-nav">
        <button class="nav-item nav-link" @click="navigate('ImageConverter')">Image Converter</button>
        <button class="nav-item nav-link" @click="navigate('PdfConverter')">PDF Converter</button>
      </nav>
    </header>

    <main id="app">
      <section class="intro">
        <h1>Convert your files with ease</h1>
      </section>
    </main>

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



<style>
body {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0;
  font-family: Arial, sans-serif;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background-color: #007bff;
  padding: 10px 20px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-brand {
  color: white;
  text-decoration: none;
  font-size: 24px;
  font-weight: bold;
}

.navbar-nav {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin-left: 20px;
}

.nav-link {
  color: white;
  text-decoration: none;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 16px;
}

.nav-link:hover {
  text-decoration: underline;
}

#app {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 20px 20px;
  background-color: white;
  width: 100%;
  max-width: 800px;
  box-sizing: border-box;
}

.intro {
  text-align: center;
}

.intro h1 {
  margin-bottom: 20px;
}




</style>

