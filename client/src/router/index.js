import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import PrivacyPolicyView from '../views/PrivacyPolicyView.vue'
import TermsOfServiceView from '../views/TermsOfServiceView.vue'

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
        name: 'PrivacyPolicy',
        component: PrivacyPolicyView,
    },
    {
        path: '/terms',
        name: 'TermsOfService',
        component: TermsOfServiceView,
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
