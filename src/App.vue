<template>
  <div id="app">
    <Navbar />
    <router-view></router-view>
  </div>
</template>

<script>

import Navbar from "./components/Navbar.vue";

export default {
  name: 'App',
  components: {
    Navbar
  }
}
</script>

<style>
@import 'bootstrap/dist/css/bootstrap.min.css';

.blog-card {
  transition: transform 0.2s;
}
.blog-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
.auth-form {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}
</style>