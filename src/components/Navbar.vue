<template>
  <nav class="navbar">
    <div class="nav-left">
      <img :src="logo" alt="SmartCV Logo" />
    </div>

    <div class="nav-center">
      <a href="#">Accueil</a>
      <a href="#">Générer</a>
      <a href="#">Historique</a>
    </div>

    <div class="nav-right">
      <button class="login-btn">Log In</button>
    </div>
  </nav>
</template>

<script setup>
import logo from "@/assets/images/Logo_SmartCV.png"
</script>

<style scoped>
.navbar {
  background-color: #0B1C2D;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  color: white;
  height: 80px;
  min-height: 80px;
  max-height: 80px;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 100%;
}

.nav-left img {
  height: 60px;
  max-height: 60px;
  object-fit: contain;
}

.brand {
  font-weight: bold;
  font-size: 16px;
}

.nav-center a {
  margin: 0 20px;
  color: white;
  text-decoration: none;
  font-size: 14px;
}

.nav-center a:hover {
  text-decoration: underline;
}

.login-btn {
  background-color: #FFFFFF;
  color: #0B1C2D;
  border: none;
  padding: 6px 14px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.login-btn:hover {
  opacity: 0.8;
}
</style>
