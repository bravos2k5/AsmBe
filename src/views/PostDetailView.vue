<template>
  <div class="container mt-4">
    <div class="post-content">
      <h1 class="mb-3">{{ post.title }}</h1>

      <div class="post-meta mb-4">
        <div class="d-flex align-items-center">
          <img :src="post.author.avatar" class="rounded-circle me-2" width="40" height="40">
          <div>
            <div class="author-name">{{ post.author.name }}</div>
            <div class="text-muted">
              <small>{{ post.date }} · 5 phút đọc</small>
            </div>
          </div>
        </div>
      </div>

      <img :src="post.image" class="img-fluid rounded mb-4" :alt="post.title">

      <div class="post-body mb-4">
        {{ post.content }}
      </div>

      <CommentSection :postId="post.id"/>
    </div>
  </div>
</template>

<script>
import CommentSection from "../components/CommentSection.vue";

export default {
  name: 'PostDetailView',
  components: {
    CommentSection
  },
  data() {
    return {
      post: null,
      isLoading: true,
      error: null
    }
  },
  methods: {
    fetchPost() {
      const postId = this.$route.params.id;

      fetch(`http://localhost:1612/api/public/blog/${postId}`)
          .then(async (response) => {
            if (!response.ok) {
              const errorMessage = await response.text();
              throw new Error(errorMessage || 'Failed to fetch post data');
            }
            return response.json();
          })
          .then((data) => {
            this.post = data;
            this.isLoading = false;
          })
          .catch((err) => {
            this.error = err.message;
            this.isLoading = false;
          });
    }
  },
  created() {
    this.fetchPost();
  }
};
</script>



<style scoped>
.post-content {
  max-width: 800px;
  margin: 0 auto;
}

.post-body {
  font-size: 1.1rem;
  line-height: 1.8;
  white-space: pre-line;
}

.author-name {
  font-weight: 500;
}

.post-tags .badge {
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
}

.post-actions .btn {
  padding: 0.5rem 1rem;
}
</style>