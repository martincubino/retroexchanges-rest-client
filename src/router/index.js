import Vue from 'vue'
import VueRouter from 'vue-router'
import MainView from '../views/MainView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: MainView
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/login',
    name: 'login',
    
    component: () => import(/* webpackChunkName: "login" */ '../views/LoginView.vue')
  },
  {
    path: '/profile',
    name: 'profile',
    
    component: () => import(/* webpackChunkName: "profile" */ '../views/ProfileView.vue')
  },
  {
    path: '/logout',
    name: 'logout',
    component: () => import(/* webpackChunkName: "logout" */ '../views/LogoutView.vue')
  },
  {
    path: '/category',
    name: 'category',
    component: () => import(/* webpackChunkName: "category" */ '../views/CategoryView.vue')
  },
  {
    path: '/productDetail',
    name: 'productDetail',
    component: () => import(/* webpackChunkName: "category" */ '../views/ProductDetailView.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
