import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import CreatePostView from '../views/CreatePostView.vue';
import ProfileView from '../views/ProfileView.vue';
import LoginView from '../views/LoginView.vue';
import PostDetailView from '../views/PostDetailView.vue';
import RegisterView from "../views/RegisterView.vue";
import EditPostView from "../views/EditPostView.vue";
import { getAccessToken } from "../utils/TokenLib.js";

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView
    },
    {
        path: '/create',
        name: 'create',
        component: CreatePostView,
        meta: { requiresAuth: true }
    },
    {
        path: '/profile',
        name: 'profile',
        component: ProfileView,
        meta: { requiresAuth: true }
    },
    {
        path: '/login',
        name: 'login',
        component: LoginView
    },
    {
        path: '/register',
        name: 'register',
        component: RegisterView
    },
    {
        path: '/post/:id',
        name: 'post-detail',
        component: PostDetailView
    },
    {
        path: "/edit-post/:id",
        name: "EditPost",
        component: EditPostView,
        meta: { requiresAuth: true }
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});


router.beforeEach(async (to, from, next) => {
    if (to.meta.requiresAuth) {
        try {
            const accessToken = await getAccessToken();
            if (accessToken) {
                next();
            } else {
                next('/login');
            }
        } catch (error) {
            console.error("Error checking token:", error);
            next('/login');
        }
    } else {
        next();
    }
});

export default router;
