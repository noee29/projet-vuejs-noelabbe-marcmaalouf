<script setup>
import { RouterView } from "vue-router"
import Navbar from "./components/Navbar.vue"
</script>

<template>
  <div class="app-shell">
    <Navbar />
    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html,
body,
#app {
  min-height: 100%;
  font-family: Arial, Helvetica, sans-serif;
  background: #f4f4f4;
}

a {
  text-decoration: none;
}

button,
input {
  font: inherit;
}

.app-shell {
  min-height: 100vh;
}

.app-main {
  min-height: calc(100vh - 65px);
}
</style>