<template>
  <div class="container">
    <div class="auth-form">
      <h2 class="text-center mb-4">Đăng nhập</h2>

      <div v-if="alertMessage" class="alert" :class="alertClass" role="alert">
        {{ alertMessage }}
      </div>

      <form @submit.prevent="login">
        <div class="mb-3">
          <label class="form-label">Username</label>
          <input type="text" class="form-control" v-model="loginForm.username" required>
        </div>
        <div class="mb-3">
          <label class="form-label">Mật khẩu</label>
          <input type="password" class="form-control" v-model="loginForm.password" required>
        </div>
        <div class="d-grid">
          <button type="submit" class="btn btn-primary">Đăng nhập</button>
        </div>
        <p class="text-center mt-3">
          Chưa có tài khoản?
          <router-link to="/register">Đăng ký</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script>

import {setAccessToken, setRefreshToken} from "../utils/TokenLib.js";

export default {
  name: 'LoginView',
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
      },
      alertMessage: '',
      alertClass: '',
    };
  },
  methods: {
    async login() {
      try {
        // Gửi yêu cầu đăng nhập tới server
        const response = await fetch('http://localhost:1612/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.loginForm),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.userInfo == null) {
            this.alertMessage = data.message || 'Đăng nhập thất bại';
            this.alertClass = 'alert-danger';
            return;
          }
          setAccessToken(data.accessToken);
          setRefreshToken(data.refreshToken);
          window.location.href = '/';
        } else {
          this.alertMessage = 'Có lỗi xảy ra. Vui lòng thử lại.';
          this.alertClass = 'alert-danger';
        }
      } catch (error) {
        this.alertMessage = 'Có lỗi xảy ra. Vui lòng thử lại.';
        this.alertClass = 'alert-danger';
      }
    },
  },
};
</script>
