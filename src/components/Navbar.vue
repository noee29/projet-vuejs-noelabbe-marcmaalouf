<script setup>
import { RouterLink, useRoute } from "vue-router"
import logo from "@/assets/images/Logo_SmartCV.png"
import authIcon from "@/assets/icons/Icon-auth.png"

const route = useRoute()
</script>

<template>
  <header class="navbar">
    <div class="container">
      <RouterLink to="/" class="logo">
        <img :src="logo" alt="SmartCV logo"/>
      </RouterLink>

      <nav class="links">
        <RouterLink to="/" :class="{ active: route.path === '/' }">
          Accueil
        </RouterLink>

        <a href="#">Générer</a>
        <a href="#">Historique</a>
      </nav>

      <RouterLink to="/login" class="login-btn">
        <img :src="authIcon" alt="Icône connexion" class="login-icon" />
        <span>Se connecter</span>
      </RouterLink>
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
}

.login-btn:hover {
  background: #F2F6FF;
}

.login-icon {
  width: 18px;
  height: 18px;
  object-fit: contain;
  display: block;
}

/* Laptop */
@media (max-width: 1200px) {
  .container {
    padding: 0 80px;
  }
}

/* Tablet */
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

/* Mobile */
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