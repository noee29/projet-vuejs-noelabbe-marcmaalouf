import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '../views/Login.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/login', component: Login }
]

export default createRouter({
  history: createWebHistory(),
  routes
})