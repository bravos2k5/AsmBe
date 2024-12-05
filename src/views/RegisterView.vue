<template>
  <div class="container">
    <div class="auth-form">
      <h2 class="text-center mb-4">Đăng ký</h2>

      <div v-if="alertMessage" class="alert" :class="alertClass" role="alert">
        {{ alertMessage }}
      </div>

      <form @submit.prevent="register">
        <div class="mb-3">
          <label class="form-label">Username</label>
          <input type="text" class="form-control" v-model="registerForm.username" required>
        </div>
        <div class="mb-3">
          <label class="form-label">Tên</label>
          <input type="text" class="form-control" v-model="registerForm.name" required>
        </div>
        <div class="mb-3">
          <label class="form-label">Email</label>
          <input type="email" class="form-control" v-model="registerForm.email" required>
        </div>
        <div class="mb-3">
          <label class="form-label">Mật khẩu</label>
          <input type="password" class="form-control" v-model="registerForm.password" required>
        </div>
        <div class="mb-3">
          <label class="form-label">Nhập lại mật khẩu</label>
          <input type="password" class="form-control" v-model="repassword" required>
        </div>
        <div class="d-grid">
          <button type="submit" class="btn btn-primary">Đăng ký</button>
        </div>
        <p class="text-center mt-3">
          Đã có tài khoản? <router-link to="/login">Đăng nhập</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script>

export default {
  name: 'RegisterView',
  data() {
    return {
      registerForm: {
        username: '',
        name: '',
        email: '',
        password: ''
      },
      repassword: '',
      alertMessage: '',
      alertClass: '',
    }
  },
  methods: {
    async register() {

      if(this.registerForm.password !== this.repassword) {
        this.alertMessage = 'Mật khẩu không trùng khớp';
        this.alertClass = 'alert-danger';
        return;
      }

      try {
        const response = await fetch("http://localhost:1612/api/auth/register", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.registerForm)
        });

        if(response.ok) {
          this.alertMessage = 'Đăng ký thành công';
          this.alertClass = 'success';
          this.registerForm.name = '';
          this.registerForm.password = '';
          this.registerForm.username = '';
          this.registerForm.email = '';
          this.repassword = '';
        }

        if(response.status === 409) {
          this.alertMessage = 'Tên tài khoản đã tồn tại';
          this.alertClass = 'alert-danger';
        }

      } catch {
        this.alertMessage = 'Đăng ký thất bại';
        this.alertClass = 'alert-danger';
      }

    }
  }
}
</script>