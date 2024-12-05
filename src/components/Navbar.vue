<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container">
      <router-link class="navbar-brand" to="/">MyBlog</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Trang chủ</router-link>
          </li>
          <li v-if="isLoggedIn" class="nav-item">
            <router-link class="nav-link" to="/create">Viết blog</router-link>
          </li>
        </ul>
        <ul class="navbar-nav">
          <li v-if="isLoggedIn" class="nav-item">
            <router-link class="nav-link" to="/profile">Tài khoản</router-link>
          </li>
          <li v-if="!isLoggedIn" class="nav-item">
            <router-link class="nav-link" to="/login">Đăng nhập</router-link>
          </li>
          <li v-if="isLoggedIn" class="nav-item">
            <a class="nav-link" href="#" @click.prevent="logout">Đăng xuất</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { getAccessToken, logOut } from "../utils/TokenLib.js";

export default {
  name: "Navbar",
  data() {
    return {
      isLoggedIn: false,
    };
  },
  async mounted() {
    const token = await getAccessToken();
    this.isLoggedIn = token !== null;
  },
  methods: {
    logout() {
      logOut();
      this.isLoggedIn = false;
      window.location.href = '/';
    },
  },
};
</script>

