<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <div class="text-center mb-3">
              <img
                  :src="user.avatar || '//assets/avatar.jpg'"
                  class="rounded-circle"
                  width="150"
                  height="150"
              />
            </div>
            <h5 class="card-title text-center">{{ user.name }}</h5>
            <p class="text-muted text-center">@{{ user.username }}</p>
            <div class="d-grid">
              <button
                  @click="editProfile"
                  class="btn btn-outline-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#editProfileModal"
              >
                Chỉnh sửa thông tin
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-8">
        <h4>Bài viết của tôi</h4>
        <div class="list-group">
          <a
              href="#"
              class="list-group-item list-group-item-action"
              v-for="post in userPosts"
              :key="post.id"
          >
            <div class="d-flex w-100 justify-content-between">
              <h5 class="mb-1">{{ post.title }}</h5>
              <small>{{ post.date }}</small>
            </div>
            <div>
              <router-link
                  :to="`/edit-post/${post.id}`"
                  class="btn btn-sm btn-outline-primary me-2"
              >
                Sửa
              </router-link>
              <button
                  class="btn btn-sm btn-outline-danger"
                  @click="deletePost(post.id)"
              >
                Xóa
              </button>
            </div>
            <p class="mb-1">{{ post.excerpt }}</p>
          </a>
        </div>
      </div>
    </div>

    <div
        class="modal fade"
        id="editProfileModal"
        tabindex="-1"
        aria-labelledby="editProfileModalLabel"
        aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editProfileModalLabel">
              Chỉnh sửa thông tin cá nhân
            </h5>
            <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveProfile">
              <div class="mb-3">
                <label for="username" class="form-label">Tên tài khoản</label>
                <input
                    v-model="editedUser.username"
                    type="text"
                    class="form-control"
                    id="username"
                    readonly
                />
              </div>
              <div class="mb-3">
                <label for="name" class="form-label">Họ và Tên</label>
                <input
                    v-model="editedUser.name"
                    type="text"
                    class="form-control"
                    id="name"
                    required
                />
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input
                    v-model="editedUser.email"
                    type="email"
                    class="form-control"
                    id="email"
                />
              </div>
              <div class="mb-3">
                <label for="avatar" class="form-label">Avatar URL</label>
                <input
                    v-model="editedUser.avatar"
                    type="text"
                    class="form-control"
                    id="avatar"
                />
              </div>
              <button type="submit" class="btn btn-primary">Lưu</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {getAccessToken} from "../utils/TokenLib.js";

export default {
  name: "ProfileView",
  data() {
    return {
      user: {},
      editedUser: {},
      userPosts: [],
      accessToken: null,
    };
  },
  methods: {
    editProfile() {
      this.editedUser = {...this.user};
    },
    async saveProfile() {
      if (!this.accessToken) {
        console.error("Missing access token!");
        return;
      }

      try {
        const response = await fetch("http://localhost:1612/api/users/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.accessToken}`,
          },
          body: JSON.stringify(this.editedUser),
        });

        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(errorMessage || "Failed to update profile");
        }

        this.user = await response.json();
        alert("Thông tin cá nhân đã được cập nhật!");
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    },
    async fetchUserInfo() {
      if (!this.accessToken) {
        console.error("Missing access token!");
        return;
      }

      try {
        const response = await fetch("http://localhost:1612/api/users/get", {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user info");
        }

        this.user = await response.json();
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    },
    async fetchUserPosts() {
      if (!this.accessToken) {
        console.error("Missing access token!");
        return;
      }

      try {
        const response = await fetch("http://localhost:1612/api/private/myblogs", {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user posts");
        }

        this.userPosts = await response.json();
      } catch (error) {
        console.error("Error fetching user posts:", error);
      }
    },
    async deletePost(postId) {
      if(confirm("Bạn có muốn xóa bài viết này không ?")) {
        const response = await (fetch(`http://localhost:1612/api/private/delete-blog/${postId}`,{
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          }
        }));
        if(response.ok) {
          let index = this.userPosts.findIndex(post => post.id === postId);
          if(index !== -1) {
            this.userPosts.splice(index,1);
          }
        }
      }
    }
  },
  async created() {
    try {
      this.accessToken = await getAccessToken();
      if (!this.accessToken) {
        console.warn("Access token is missing. Redirecting to login...");
        window.location.href = "/login";
        return;
      }

      await this.fetchUserInfo();
      await this.fetchUserPosts();
    } catch (error) {
      console.error("Error during initialization:", error);
      window.location.href = "/login";
    }
  },
};
</script>


<style>
.text-center img {
  object-fit: cover;
}
</style>
