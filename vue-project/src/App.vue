<template> 
  <div id="app"> 
    <div id="nav"> 
      <router-link to="/">Home</router-link> | 
      <router-link to="/about">About</router-link> | 
      added a new route to our app.vue file// 
       <router-link to="/profile">Profile</router-link> 
    </div> 
    <router-view/> 
  </div> 
</template>