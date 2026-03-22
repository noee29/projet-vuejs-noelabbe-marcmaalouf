import { createRouter, createWebHistory } from "vue-router"
import { auth } from "../firebase"
import { onAuthStateChanged } from "firebase/auth"

import HomeView from "../views/HomeView.vue"
import Login from "../views/Login.vue"
import SignUp from "../views/SignUp.vue"
import ForgotPassword from "../views/ForgotPassword.vue"
import GenererView from "../views/GenererView.vue"
import CVEditorView from "../views/CVEditorView.vue"
import CVColorfulView from "../views/CVColorfulView.vue"

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
    component: () => import("../views/HistoriqueView.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe()
        resolve(user)
      },
      reject
    )
  })
}

router.beforeEach(async (to, from, next) => {
  const user = await getCurrentUser()

  if (to.meta.guestOnly && user) {
    next("/generer")
    return
  }

  next()
})

export default router