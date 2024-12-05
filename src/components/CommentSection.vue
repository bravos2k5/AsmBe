<template>
  <div class="comments-section mt-5">

    <div class="comment-form mb-4">
      <h4>Bình luận</h4>
      <form @submit.prevent="submitComment">
        <div class="mb-3">
          <textarea
              class="form-control"
              v-model="newComment"
              rows="3"
              placeholder="Viết bình luận của bạn..."
              required
          ></textarea>
        </div>
        <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
          <span v-if="isSubmitting" class="spinner-border spinner-border-sm" role="status"></span>
          Gửi bình luận
        </button>
        <br>
      </form>
    </div>

    <div class="comments-list">
      <div v-if="isLoading" class="text-center my-3">
        <span class="spinner-border text-primary" role="status"></span>
        <span>Đang tải bình luận...</span>
      </div>
      <div v-if="!isLoading && comments.length === 0" class="text-muted">
        Chưa có bình luận nào.
      </div>
      <div v-for="comment in comments" :key="comment.id" class="comment-item mb-3">
        <div class="d-flex">
          <img :src="comment.avatar" class="rounded-circle me-2" width="40" height="40">
          <div class="flex-grow-1">
            <div class="comment-header">
              <strong>{{ comment.name }}</strong>
              <small class="text-muted ms-2">{{ comment.commentDate }}</small>
            </div>
            <p class="mb-1">{{ comment.content }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {getAccessToken} from "../utils/TokenLib.js";

export default {
  name: 'CommentSection',
  props: {
    postId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      newComment: '',
      comments: [],
      isLoading: false,
      isSubmitting: false,
      accessToken: null,
    };
  },
  methods: {
    async fetchComments() {
      this.isLoading = true;
      try {
        const response = await fetch(`http://localhost:1612/api/public/comments/${this.postId}`);
        if (!response.ok) throw new Error('Không thể tải bình luận');
        this.comments = await response.json();
      } catch (error) {
        console.error(error);
        alert('Lỗi khi tải bình luận!');
      } finally {
        this.isLoading = false;
      }
    },
    async submitComment() {
      if (this.newComment.trim()) {

        let comment = {
          blogId: this.postId,
          content: this.newComment.trim()
        }

        this.isSubmitting = true;
        try {
          const response = await fetch(`http://localhost:1612/api/private/comment`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.accessToken}`
            },
            body: JSON.stringify(comment)
          });
          if (!response.ok) throw new Error('Không thể gửi bình luận');
          const newComment = await response.json();
          this.comments.unshift(newComment);
          this.newComment = '';
        } catch (error) {
          console.error(error);
          alert('Lỗi khi gửi bình luận!');
        } finally {
          this.isSubmitting = false;
        }
      }
    }
  },
  async created() {

    await this.fetchComments();

    try {
      this.accessToken = await getAccessToken();
      if (!this.accessToken) {
        window.location.href = "/login";
      }
    } catch (error) {
      console.error(error);
      window.location.href = "/login";
    }
  }
};
</script>
<style scoped>
.comment-item {
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
}
.comment-actions button {
  background: none;
  border: none;
  padding: 0;
}
.comment-actions button:hover {
  color: #0056b3;
}
.spinner-border {
  width: 1rem;
  height: 1rem;
}
</style>
