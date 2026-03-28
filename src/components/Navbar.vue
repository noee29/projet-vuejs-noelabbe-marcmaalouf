<script setup>
import { computed } from "vue"
import { RouterLink, useRoute, useRouter } from "vue-router"
import { useAuthStore } from "@/stores/authStore"

import logo from "@/assets/images/Logo_SmartCV.png"
import authIcon from "@/assets/icons/Icon-auth.png"

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const isGenererActive = computed(() => route.path.startsWith("/generer"))
const isHistoriqueActive = computed(() => route.path.startsWith("/historique"))
const isAuthenticated = computed(() => authStore.isAuthenticated)

const handleLogout = async () => {
  try {
    await authStore.logout()
    router.push("/login")
  } catch (error) {
    console.error("Logout error:", error)
  }
}
</script>

<template>
  <header class="navbar">
    <div class="container">
      <RouterLink to="/" class="logo">
        <img :src="logo" alt="SmartCV logo" />
      </RouterLink>

      <nav class="links">
        <RouterLink to="/" :class="{ active: route.path === '/' }">
          Accueil
        </RouterLink>

        <RouterLink to="/generer" :class="{ active: isGenererActive }">
          Générer
        </RouterLink>

        <RouterLink to="/historique" :class="{ active: isHistoriqueActive }">
          Historique
        </RouterLink>
      </nav>

      <RouterLink v-if="!isAuthenticated" to="/login" class="login-btn">
        <img :src="authIcon" alt="Icône connexion" class="login-icon" />
        <span>Se connecter</span>
      </RouterLink>

      <button v-else class="login-btn logout-btn" @click="handleLogout">
        <img :src="authIcon" alt="Icône déconnexion" class="login-icon" />
        <span>Déconnexion</span>
      </button>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  width: 100%;
  height: 80px;
  background: #0b1c2d;
  display: flex;
  align-items: center;
}

.container {
  width: 100%;
  padding: 0 120px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.logo img {
  height: 82px;
  width: auto;
  object-fit: contain;
  display: block;
}

.links {
  display: flex;
  align-items: center;
  gap: 42px;
}

.links a {
  color: white;
  text-decoration: none;
  font-size: 16px;
  font-weight: 400;
  transition: opacity 0.2s ease;
}

.links a:hover {
  opacity: 0.8;
}

.links a.active {
  font-weight: 700;
}

.login-btn {
  background: white;
  color: #0b1c2d;
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  cursor: pointer;
}

.login-btn:hover {
  background: #f2f6ff;
}

.logout-btn {
  font-family: inherit;
}

.login-icon {
  width: 18px;
  height: 18px;
  object-fit: contain;
  display: block;
}

@media (max-width: 1200px) {
  .container {
    padding: 0 80px;
  }
}

@media (max-width: 900px) {
  .container {
    padding: 0 40px;
  }

  .navbar {
    height: auto;
    padding: 16px 0;
  }

  .links {
    gap: 24px;
  }
}

@media (max-width: 600px) {
  .container {
    flex-direction: column;
    gap: 16px;
    padding: 0 24px;
  }

  .links {
    flex-wrap: wrap;
    justify-content: center;
  }

  .logo img {
    height: 56px;
  }
}
</style>