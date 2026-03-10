<template>
  <div class="page">
    <Navbar />

    <div class="content">
      <div class="card">
        <h1>Bienvenue sur SmartCV</h1>
        <p>
          Créez rapidement un CV moderne et professionnel grâce à notre générateur de CV.
        </p>
        <button class="create-btn" @click="generateCV">Générer un CV</button>
      </div>
    </div>

  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const generateCV = () => {
  router.push('/generate')
}
</script>

<style scoped>

.page {
  background-color: #E5E5E5;
  min-height: 100vh;
  font-family: Arial, sans-serif;
}

.content {
  display: flex;
  justify-content: center;
  margin-top: 60px;
}

.card {
  background-color: #D9DEE7;
  width: 700px;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.card h1 {
  margin-bottom: 20px;
  color: #0B1C2D;
}

.card p {
  margin-bottom: 15px;
  font-size: 14px;
  color: #333;
}

.card ul {
  margin-left: 20px;
  margin-bottom: 20px;
  font-size: 14px;
}

.card li {
  margin-bottom: 8px;
}

.create-btn {
  background-color: #0B1C2D;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.3s;
}

.create-btn:hover {
  background-color: #0f2844;
}

</style>