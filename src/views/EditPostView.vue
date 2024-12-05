<template>
  <div class="container mt-4">
    <h2>Sửa bài viết</h2>

    <div v-if="alertMessage" class="alert" :class="alertClass" role="alert">
      {{ alertMessage }}
    </div>

    <form @submit.prevent="submitPost" class="mt-3">
      <div class="mb-3">
        <label class="form-label">Tiêu đề</label>
        <input type="text" class="form-control" v-model="newPost.title" required/>
      </div>
      <div class="mb-3">
        <label class="form-label">Nội dung</label>
        <textarea
            class="form-control"
            rows="5"
            v-model="newPost.content"
            required
        ></textarea>
      </div>
      <div class="mb-3">
        <label class="form-label">Link ảnh bìa</label>
        <input
            placeholder="URL ảnh"
            type="text"
            class="form-control"
            v-model="newPost.image"
            required
        />
      </div>
      <button type="submit" class="btn btn-primary">Lưu bài viết</button>
    </form>
  </div>
</template>

<script>
import {getAccessToken} from "../utils/TokenLib.js";

export default {
  name: "EditPostView",
  data() {
    return {
      newPost: {
        id: "",
        title: "",
        content: "",
        image: "",
      },
      postId: null,
      accessToken: null,
      alertMessage: '',
      alertClass: '',
    };
  },
  methods: {
    async fetchPostData() {
      try {
        const response = await fetch(`http://localhost:1612/api/public/blog/${this.postId}`);
        if (!response.ok)
          throw new Error("Không thể lấy thông tin bài viết");
        const data = await response.json();
        this.newPost.id = data.id;
        this.newPost.title = data.title;
        this.newPost.content = data.content;
        this.newPost.image = data.image;
        this.postId = data.id;
      } catch (error) {
        console.error(error);
      }
    },
    async submitPost() {
      try {
        const response = await fetch(`http://localhost:1612/api/private/update-blog`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.accessToken}`,
          },
          body: JSON.stringify(this.newPost),
        });
        if (!response.ok) {
          this.alertMessage = response.status || 'Sửa thất bại';
          this.alertClass = 'alert-danger';
          return;
        }
        else {
          this.alertMessage = 'Sửa thành công';
          this.alertClass = 'alert-success';
        }
      } catch (error) {
        console.error(error);
        alert("Có lỗi xảy ra!");
      }
    },
  },
  async created() {
    try {
      this.accessToken = await getAccessToken();
      if (!this.accessToken) {
        window.location.href = "/login";
        return;
      }
      this.postId = this.$route.params.id;
      await this.fetchPostData();
    } catch (error) {
      console.error(error);
      window.location.href = "/login";
    }
  },
};
</script>
