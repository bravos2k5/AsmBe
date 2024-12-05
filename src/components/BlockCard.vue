<template>
  <div class="card blog-card h-100">
    <img :src="post.image" class="card-img-top" :alt="post.title">
    <div class="card-body">
      <h5 class="card-title">{{ post.title }}</h5>
      <p class="card-text">{{ post.excerpt }}</p>
      <router-link :to="{ name: 'post-detail', params: { id: post.id }}" class="btn btn-primary">
        Đọc thêm
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BlogCard',
  props: {
    post: {
      type: Object,
      required: true
    }
  }
}
</script>