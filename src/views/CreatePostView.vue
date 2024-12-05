<template>
  <div class="container mt-4">
    <h2>Viết blog mới</h2>
    <form @submit.prevent="submitPost" class="mt-3">
      <div class="mb-3">
        <label class="form-label">Tiêu đề</label>
        <input type="text" class="form-control" v-model="newPost.title" required>
      </div>
      <div class="mb-3">
        <label class="form-label">Nội dung</label>
        <textarea class="form-control" rows="5" v-model="newPost.content" required></textarea>
      </div>
      <div class="mb-3">
        <label class="form-label">Link ảnh bìa</label>
        <input placeholder="URL ảnh" type="text" class="form-control" v-model="newPost.image" required>
      </div>
      <button type="submit" class="btn btn-primary">Đăng bài</button>
    </form>
  </div>
</template>

<script>
import {getAccessToken} from "../utils/TokenLib.js";

export default {
  name: 'CreatePostView',
  data() {
    return {
      newPost: {
        title: '',
        content: '',
        image: ''
      },
      accessToken: null,
    }
  },
  methods: {
    async submitPost() {
      const response = await fetch("http://localhost:1612/api/private/create-blog", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.accessToken}`
        },
        body: JSON.stringify(this.newPost)
      });
      if(!response.ok) {
        throw new Error('Lỗi fetch');
      }
      else {
        window.location.href = '/';
      }
    },
  },
  async created() {
    try {
      this.accessToken = await getAccessToken();
      if (!this.accessToken) {
        window.location.href = "/login";
      }
    } catch (error) {
      console.error(error);
      window.location.href = "/login";
    }
  },
}
</script>