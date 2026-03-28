<script setup>
import { ref, computed, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useAuthStore } from "@/stores/authStore"
import { useCvStore } from "@/stores/cvStore"
import historiqueVide from "@/assets/images/historique_vide.png"

const router = useRouter()
const authStore = useAuthStore()
const cvStore = useCvStore()

const utilisateurNonConnecte = ref(false)
const imageActive = ref("")

const loading = computed(() => cvStore.loading)
const errorMessage = computed(() => cvStore.error)
const historique = computed(() => cvStore.cvs)
const texteCompteur = computed(() => cvStore.texteCompteur)

const chargerHistorique = async () => {
  utilisateurNonConnecte.value = false
  cvStore.clearMessages()

  await authStore.waitUntilReady()

  if (!authStore.user) {
    utilisateurNonConnecte.value = true
    return
  }

  try {
    await cvStore.fetchCVs(authStore.user.uid)
  } catch (error) {
    console.error("Erreur historique:", error)
  }
}

const ouvrirCV = (cv) => {
  if (!cv || !cv.id || !cv.type) {
    return
  }

  router.push("/generer/" + cv.type + "?id=" + cv.id)
}

const ouvrirApercuGrand = (cv) => {
  if (!cv || !cv.apercuImage) {
    return
  }

  imageActive.value = cv.apercuImage
}

const fermerApercuGrand = () => {
  imageActive.value = ""
}

const supprimerCVItem = async (cv) => {
  if (!cv || !cv.id || !authStore.user) {
    return
  }

  const confirmer = window.confirm("Supprimer ce CV ?")
  if (!confirmer) {
    return
  }

  try {
    await cvStore.deleteCV(authStore.user.uid, cv.id)
  } catch (error) {
    console.error("Erreur suppression:", error)
  }
}

onMounted(() => {
  chargerHistorique()
})
</script>

<template>
  <div class="historique-page">
    <section class="hero-section">
      <h1>Vos Historique de CV</h1>
      <p>{{ texteCompteur }}</p>
      <div class="hero-cut"></div>
    </section>

    <section class="historique-contenu">
      <p v-if="loading" class="info">Chargement en cours...</p>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <div v-if="utilisateurNonConnecte" class="bloc-connexion">
        <p>Consultez votre historique de CV en vous connectant.</p>
        <button class="btn-connexion" @click="router.push('/login')">
          Connectez vous
        </button>
      </div>
      <p v-if="infoMessage" class="info">{{ infoMessage }}</p>

      <div v-if="!loading && !utilisateurNonConnecte && !infoMessage && historique.length === 0" class="etat-vide">
        <img :src="historiqueVide" alt="Historique vide" class="historique-vide-image" />
      </div>

      <div v-if="!loading && historique.length > 0" class="liste-cv">
        <article
          v-for="cv in historique"
          :key="cv.id"
          class="cv-row"
        >
          <div class="cv-preview">
            <img
              v-if="cv.apercuImage"
              :src="cv.apercuImage"
              alt="Apercu du CV"
              class="cv-image"
              @click="ouvrirApercuGrand(cv)"
            />
            <div v-else class="cv-image-placeholder">
              Apercu indisponible
            </div>
          </div>

          <div class="actions-colonne">
            <button
              class="action-btn"
              title="Voir en grand"
              @click="ouvrirApercuGrand(cv)"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 16a1 1 0 0 1-1-1V7.41l-2.29 2.3a1 1 0 0 1-1.42-1.42l4-4a1 1 0 0 1 1.42 0l4 4a1 1 0 1 1-1.42 1.42L13 7.41V15a1 1 0 0 1-1 1z" />
                <path d="M5 19a1 1 0 0 1 0-2h14a1 1 0 0 1 0 2z" />
              </svg>
            </button>

            <button
              class="action-btn"
              title="Modifier"
              @click="ouvrirCV(cv)"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 17.25V21h3.75l11-11-3.75-3.75-11 11zm14.71-9.04a1 1 0 0 0 0-1.42l-1.5-1.5a1 1 0 0 0-1.42 0l-1.17 1.17 3.75 3.75 1.34-1.34z" />
              </svg>
            </button>

            <button
              class="action-btn"
              title="Supprimer"
              @click="supprimerCVItem(cv)"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 7h12l-1 14H7L6 7zm3-3h6l1 2H8l1-2zM4 6h16v2H4z" />
              </svg>
            </button>
          </div>
        </article>
      </div>
    </section>

    <div v-if="imageActive" class="modal-overlay" @click="fermerApercuGrand">
      <div class="modal-content" @click.stop>
        <button class="btn-fermer" @click="fermerApercuGrand">Fermer</button>
        <img :src="imageActive" alt="Apercu grand du CV" class="modal-image" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.historique-page {
  min-height: calc(100vh - 80px);
  background: #dfdfe2;
}

.hero-section {
  position: relative;
  background: #2f89e5;
  text-align: center;
  padding: 44px 20px 130px;
  overflow: hidden;
}

.hero-section h1 {
  color: #ffffff;
  font-size: 50px;
  line-height: 1.1;
  font-weight: 700;
  margin-bottom: 10px;
}

.hero-section p {
  color: rgba(255, 255, 255, 0.95);
  font-size: 35px;
  font-weight: 500;
}

.hero-cut {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 150px;
  background: #dfdfe2;
  clip-path: polygon(0 100%, 100% 26%, 100% 100%);
}

.historique-contenu {
  position: relative;
  z-index: 1;
  margin-top: -26px;
  padding: 0 24px 60px;
}

.bloc-connexion {
  max-width: 980px;
  margin: 0 auto 20px;
  background: #ffffff;
  border: 2px solid #2f89e5;
  border-radius: 14px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  padding: 22px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.bloc-connexion p {
  margin: 0;
  color: #0f172a;
  font-size: 20px;
  font-weight: 700;
}

.btn-connexion {
  height: 44px;
  padding: 0 18px;
  border: none;
  border-radius: 8px;
  background: #0b1c2d;
  color: #ffffff;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
}

.btn-connexion:hover {
  background: #143554;
}

.etat-vide {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 24px;
}

.historique-vide-image {
  width: min(760px, 90vw);
  height: auto;
  display: block;
}

.liste-cv {
  max-width: 980px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 36px;
}

.cv-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 22px;
}

.cv-preview {
  width: min(470px, calc(100vw - 120px));
  background: #ffffff;
  border-radius: 4px;
  padding: 8px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
}

.cv-image {
  width: 100%;
  height: auto;
  max-height: 640px;
  object-fit: contain;
  display: block;
  cursor: pointer;
}

.cv-image-placeholder {
  min-height: 560px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 16px;
}

.actions-colonne {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-btn {
  width: 46px;
  height: 46px;
  border-radius: 999px;
  border: 0;
  background: #edf2fa;
  box-shadow: 0 2px 7px rgba(0, 0, 0, 0.22);
  color: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.15s ease, background-color 0.15s ease;
}

.action-btn:hover {
  transform: translateY(-1px);
  background: #e2e8f0;
}

.action-btn svg {
  width: 22px;
  height: 22px;
  fill: currentColor;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

.modal-content {
  width: 100%;
  max-width: 1000px;
  max-height: 95vh;
  background: #ffffff;
  border-radius: 10px;
  padding: 12px;
  display: flex;
  flex-direction: column;
}

.btn-fermer {
  align-self: flex-end;
  margin-bottom: 10px;
  border: none;
  border-radius: 6px;
  background: #0b1c2d;
  color: #ffffff;
  font-size: 14px;
  padding: 8px 12px;
  cursor: pointer;
}

.btn-fermer:hover {
  background: #143554;
}

.modal-image {
  width: 100%;
  max-height: calc(95vh - 60px);
  object-fit: contain;
  border-radius: 8px;
}

.error {
  max-width: 980px;
  margin: 0 auto 16px;
  font-size: 15px;
  color: #d52b2b;
  font-weight: 600;
}

.info {
  max-width: 980px;
  margin: 0 auto 16px;
  font-size: 15px;
  color: #1e293b;
}

@media (max-width: 900px) {
  .hero-section {
    padding-top: 36px;
    padding-bottom: 120px;
  }

  .hero-section h1 {
    font-size: 38px;
  }

  .hero-section p {
    font-size: 27px;
  }

  .cv-row {
    gap: 16px;
  }

  .cv-image-placeholder {
    min-height: 420px;
  }
}

@media (max-width: 600px) {
  .hero-section {
    padding-top: 30px;
    padding-bottom: 106px;
  }

  .hero-section h1 {
    font-size: 30px;
  }

  .hero-section p {
    font-size: 22px;
  }

  .hero-cut {
    height: 118px;
  }

  .historique-contenu {
    padding: 0 14px 40px;
  }

  .bloc-connexion {
    flex-direction: column;
    align-items: stretch;
  }

  .bloc-connexion p {
    text-align: center;
    font-size: 18px;
  }

  .btn-connexion {
    width: 100%;
  }

  .cv-row {
    flex-direction: column;
  }

  .cv-preview {
    width: 100%;
  }

  .actions-colonne {
    flex-direction: row;
  }

  .cv-image-placeholder {
    min-height: 320px;
  }
}
</style>