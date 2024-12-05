<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-md-4 mb-4" v-for="post in posts" :key="post.id">
        <BlogCard :post="post" />
      </div>
    </div>
  </div>
</template>

<script>
import BlogCard from '../components/BlockCard.vue'

export default {
  name: 'HomeView',
  components: {
    BlogCard
  },
  data() {
    return {
      posts: null,
    }
  },
  methods: {
    fetchPost() {
      fetch(`http://localhost:1612/api/public/blogs`)
          .then(async (response) => {
            if (!response.ok) {
              const errorMessage = await response.text();
              throw new Error(errorMessage || 'Failed to fetch post data');
            }
            return response.json();
          })
          .then((data) => {
            this.posts = data;
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
}
</script>