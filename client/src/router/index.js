import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'

const routes = [
    {
        path: '/',
        name: 'Login',
        component: LoginView,
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: DashboardView,
    },
    {
        path: '/privacy',
        name: 'Privacy',
        beforeEnter() {
            window.location.href = '/privacy.html'
        }
    },
    {
        path: '/terms',
        name: 'Terms',
        beforeEnter() {
            window.location.href = '/terms.html'
        }
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
        return { top: 0 }
    },
})

export default router
