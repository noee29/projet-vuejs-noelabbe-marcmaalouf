import { createRouter, createWebHistory } from "vue-router"
import { useAuthStore } from "@/stores/authStore"

import HomeView from "../views/HomeView.vue"
import Login from "../views/Login.vue"
import SignUp from "../views/SignUp.vue"
import ForgotPassword from "../views/ForgotPassword.vue"
import GenererView from "../views/GenererView.vue"
import CVEditorView from "../views/CVEditorView.vue"
import CVColorfulView from "../views/CVColorfulView.vue"
import HistoriqueView from "../views/HistoriqueView.vue"
import NotFoundView from "../views/NotFoundView.vue"

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: { guestOnly: true },
  },
  {
    path: "/signup",
    name: "signup",
    component: SignUp,
    meta: { guestOnly: true },
  },
  {
    path: "/forgot-password",
    name: "forgot-password",
    component: ForgotPassword,
    meta: { guestOnly: true },
  },
  {
    path: "/generer",
    name: "generer",
    component: GenererView,
  },
  {
    path: "/generer/ats",
    name: "cv-ats",
    component: CVEditorView,
  },
  {
    path: "/generer/colorful",
    name: "cv-colorful",
    component: CVColorfulView,
  },
  {
    path: "/historique",
    name: "historique",
    component: HistoriqueView,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: NotFoundView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  await authStore.waitUntilReady()

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return "/generer"
  }

  return true
})

export default router