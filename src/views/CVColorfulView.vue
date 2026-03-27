<script setup>
import { ref, reactive, computed } from "vue"
import html2pdf from "html2pdf.js"
import { auth } from "../firebase"

const activeTab = ref("infos")
const couleurFond = ref("#0d2137")
const couleurTexte = ref("#ffffff")

const moisNoms = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]
const aujourdhui = new Date()
const anneeActuelle = aujourdhui.getFullYear()

const form = reactive({
  prenom: "",
  nom: "",
  titre: "",
  email: "",
  telephone: "",
  adresse: "",
  site: "",
  photoUrl: "",
  resume: "",
  formations: [{ ecole: "", diplome: "", moisDebut: "", anneeDebut: "", moisFin: "", anneeFin: "" }],
  experiences: [{ entreprise: "", poste: "", description: "", moisDebut: "", anneeDebut: "", moisFin: "", anneeFin: "" }],
  benevoles: [{ organisation: "", role: "", description: "", moisDebut: "", anneeDebut: "", moisFin: "", anneeFin: "" }],
  hardSkills: "",
  softSkills: "",
  langues: "",
  certifications: [{ nom: "", organisme: "", moisDate: "", anneeDate: "" }],
})

const moisOptions = [
  { value: 1, label: "Janvier" }, { value: 2, label: "Février" },
  { value: 3, label: "Mars" }, { value: 4, label: "Avril" },
  { value: 5, label: "Mai" }, { value: 6, label: "Juin" },
  { value: 7, label: "Juillet" }, { value: 8, label: "Août" },
  { value: 9, label: "Septembre" }, { value: 10, label: "Octobre" },
  { value: 11, label: "Novembre" }, { value: 12, label: "Décembre" },
]

const annees = computed(() => {
  const liste = []
  for (let a = anneeActuelle + 2; a >= 1970; a--) {
    liste.push(a)
  }
  return liste
})

const formatPeriode = (moisDebut, anneeDebut, moisFin, anneeFin) => {
  let debut = ""
  if (moisDebut && anneeDebut) {
    debut = moisNoms[moisDebut - 1].substring(0, 3) + " " + anneeDebut
  }

  let fin = ""
  if (!moisFin && !anneeFin) {
    fin = "En cours"
  } else {
    const dateFin = new Date(anneeFin, moisFin - 1)
    if (dateFin > aujourdhui) {
      fin = "Attendu " + moisNoms[moisFin - 1] + " " + anneeFin
    } else {
      fin = moisNoms[moisFin - 1].substring(0, 3) + " " + anneeFin
    }
  }

  if (!debut && fin === "En cours") {
    return ""
  }

  if (!debut) {
    return fin
  }

  return debut + " – " + fin
}

const trierParDate = (liste) => {
  return [...liste].sort((a, b) => {
    const anneeA = a.anneeFin || a.anneeDebut || 0
    const moisA = a.moisFin || a.moisDebut || 1

    const anneeB = b.anneeFin || b.anneeDebut || 0
    const moisB = b.moisFin || b.moisDebut || 1

    const dateA = new Date(anneeA, moisA - 1)
    const dateB = new Date(anneeB, moisB - 1)

    return dateB - dateA
  })
}

const experiencesTries = computed(() => trierParDate(form.experiences))
const formationsTries = computed(() => trierParDate(form.formations))
const benevolesTries = computed(() => trierParDate(form.benevoles))

const enLignes = (texte) => {
  if (!texte) return []
  return texte.split("\n").filter((l) => l.trim())
}

const dateFinInvalide = (element) => {
  if (!element) {
    return false
  }

  if (!element.moisDebut || !element.anneeDebut) {
    return false
  }

  if (!element.moisFin || !element.anneeFin) {
    return false
  }

  const debut = new Date(Number(element.anneeDebut), Number(element.moisDebut) - 1, 1)
  const fin = new Date(Number(element.anneeFin), Number(element.moisFin) - 1, 1)

  if (fin < debut) {
    return true
  }

  return false
}

const aDesDatesInvalides = () => {
  for (let i = 0; i < form.formations.length; i++) {
    if (dateFinInvalide(form.formations[i])) {
      return true
    }
  }

  for (let i = 0; i < form.experiences.length; i++) {
    if (dateFinInvalide(form.experiences[i])) {
      return true
    }
  }

  for (let i = 0; i < form.benevoles.length; i++) {
    if (dateFinInvalide(form.benevoles[i])) {
      return true
    }
  }

  return false
}

const utilisateurEstConnecte = () => {
  if (!auth.currentUser) {
    return false
  }

  return true
}

const onPhotoChange = (event) => {
  const fichier = event.target.files[0]
  if (!fichier) return
  const reader = new FileReader()
  reader.onload = (e) => { form.photoUrl = e.target.result }
  reader.readAsDataURL(fichier)
}

const ajouterFormation = () => {
  form.formations.push({ ecole: "", diplome: "", moisDebut: "", anneeDebut: "", moisFin: "", anneeFin: "" })
}
const supprimerFormation = (i) => {
  form.formations.splice(i, 1)
}

const ajouterExperience = () => {
  form.experiences.push({ entreprise: "", poste: "", description: "", moisDebut: "", anneeDebut: "", moisFin: "", anneeFin: "" })
}
const supprimerExperience = (i) => {
  form.experiences.splice(i, 1)
}

const ajouterBenevole = () => {
  form.benevoles.push({ organisation: "", role: "", description: "", moisDebut: "", anneeDebut: "", moisFin: "", anneeFin: "" })
}
const supprimerBenevole = (i) => {
  form.benevoles.splice(i, 1)
}

const ajouterCertification = () => {
  form.certifications.push({ nom: "", organisme: "", moisDate: "", anneeDate: "" })
}
const supprimerCertification = (i) => {
  form.certifications.splice(i, 1)
}

const telechargerPDF = async () => {
  if (!utilisateurEstConnecte()) {
    alert("Vous devez etre connecté pour telecharger votre CV en PDF.")
    return
  }

  if (aDesDatesInvalides()) {
    alert("La date de fin ne peut pas etre avant la date de debut.")
    return
  }

  const element = document.getElementById("cv-colorful-export")
  if (!element) return

  const options = {
    margin: 0,
    filename: `CV_${form.prenom || "prenom"}_${form.nom || "nom"}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    },
    pagebreak: { mode: ["css", "legacy"] },
  }

  await html2pdf().set(options).from(element).save()
}
</script>

<template>
  <div class="editor-page">
    <div class="editor-layout">

      <aside class="form-side">
        <div class="tab-bar">
          <button class="tab-btn" :class="{ active: activeTab === 'infos' }" @click="activeTab = 'infos'">Infos</button>
          <button class="tab-btn" :class="{ active: activeTab === 'formation' }" @click="activeTab = 'formation'">Formation</button>
          <button class="tab-btn" :class="{ active: activeTab === 'experience' }" @click="activeTab = 'experience'">Expérience</button>
          <button class="tab-btn" :class="{ active: activeTab === 'competences' }" @click="activeTab = 'competences'">Compétences</button>
          <button class="tab-btn" :class="{ active: activeTab === 'benevole' }" @click="activeTab = 'benevole'">Bénévolat</button>
        </div>

        <div class="form-body">

          <div v-if="activeTab === 'infos'" class="form-section">
            <div class="field-row">
              <div class="field">
                <label>Couleur de fond</label>
                <div class="color-picker-row">
                  <input type="color" v-model="couleurFond" class="input-color" />
                  <span class="color-value">{{ couleurFond }}</span>
                </div>
              </div>
              <div class="field">
                <label>Couleur du texte</label>
                <div class="color-picker-row">
                  <input type="color" v-model="couleurTexte" class="input-color" />
                  <span class="color-value">{{ couleurTexte }}</span>
                </div>
              </div>
            </div>

            <div class="field">
              <label>Photo (obligatoire)</label>
              <input type="file" accept="image/*" @change="onPhotoChange" />
              <div v-if="!form.photoUrl" class="photo-hint">Aucune photo sélectionnée</div>
            </div>

            <div class="field-row">
              <div class="field">
                <label>Prénom</label>
                <input v-model="form.prenom" placeholder="Sarah" />
              </div>
              <div class="field">
                <label>Nom</label>
                <input v-model="form.nom" placeholder="Mitchell" />
              </div>
            </div>

            <div class="field">
              <label>Titre professionnel</label>
              <input v-model="form.titre" placeholder="Senior Product Manager" />
            </div>

            <div class="field">
              <label>Email</label>
              <input v-model="form.email" type="email" placeholder="sarah@example.com" />
            </div>

            <div class="field">
              <label>Téléphone</label>
              <input v-model="form.telephone" placeholder="+33 6 00 00 00 00" />
            </div>

            <div class="field">
              <label>Adresse</label>
              <input v-model="form.adresse" placeholder="Paris, France" />
            </div>

            <div class="field">
              <label>Site / Portfolio</label>
              <input v-model="form.site" placeholder="monsite.fr" />
            </div>

            <div class="field">
              <label>Résumé professionnel</label>
              <textarea v-model="form.resume" rows="5" placeholder="Décrivez votre profil..."></textarea>
            </div>
          </div>

          <div v-if="activeTab === 'formation'" class="form-section">
            <div v-for="(edu, i) in form.formations" :key="i" class="repeater-block">
              <div class="repeater-header">
                <span>Formation {{ i + 1 }}</span>
                <button v-if="form.formations.length > 1" class="btn-supprimer" @click="supprimerFormation(i)">Supprimer</button>
              </div>
              <div class="field">
                <label>Diplôme</label>
                <input v-model="edu.diplome" placeholder="MSc Product Management" />
              </div>
              <div class="field">
                <label>École</label>
                <input v-model="edu.ecole" placeholder="London School of Economics" />
              </div>
              <div class="periode-label">Début</div>
              <div class="field-row">
                <div class="field">
                  <label>Mois</label>
                  <select v-model="edu.moisDebut">
                    <option value="">--</option>
                    <option v-for="m in moisOptions" :key="m.value" :value="m.value">{{ m.label }}</option>
                  </select>
                </div>
                <div class="field">
                  <label>Année</label>
                  <select v-model="edu.anneeDebut">
                    <option value="">--</option>
                    <option v-for="a in annees" :key="a" :value="a">{{ a }}</option>
                  </select>
                </div>
              </div>
              <div class="periode-label">Fin <span class="periode-hint">(vide = en cours)</span></div>
              <div class="field-row">
                <div class="field">
                  <label>Mois</label>
                  <select v-model="edu.moisFin">
                    <option value="">--</option>
                    <option v-for="m in moisOptions" :key="m.value" :value="m.value">{{ m.label }}</option>
                  </select>
                </div>
                <div class="field">
                  <label>Année</label>
                  <select v-model="edu.anneeFin">
                    <option value="">--</option>
                    <option v-for="a in annees" :key="a" :value="a">{{ a }}</option>
                  </select>
                </div>
              </div>
              <p v-if="dateFinInvalide(edu)" class="date-error">
                La date de fin ne peut pas etre avant la date de debut.
              </p>
            </div>
            <button class="btn-ajouter" @click="ajouterFormation">+ Ajouter une formation</button>
          </div>

          <div v-if="activeTab === 'experience'" class="form-section">
            <div v-for="(exp, i) in form.experiences" :key="i" class="repeater-block">
              <div class="repeater-header">
                <span>Expérience {{ i + 1 }}</span>
                <button v-if="form.experiences.length > 1" class="btn-supprimer" @click="supprimerExperience(i)">Supprimer</button>
              </div>
              <div class="field-row">
                <div class="field">
                  <label>Poste</label>
                  <input v-model="exp.poste" placeholder="Senior Product Manager" />
                </div>
                <div class="field">
                  <label>Entreprise</label>
                  <input v-model="exp.entreprise" placeholder="Northbridge Systems" />
                </div>
              </div>
              <div class="field">
                <label>Description (une ligne = un bullet)</label>
                <textarea v-model="exp.description" rows="4" placeholder="Développé une API REST...&#10;Réduit le temps de chargement de 40%"></textarea>
              </div>
              <div class="periode-label">Début</div>
              <div class="field-row">
                <div class="field">
                  <label>Mois</label>
                  <select v-model="exp.moisDebut">
                    <option value="">--</option>
                    <option v-for="m in moisOptions" :key="m.value" :value="m.value">{{ m.label }}</option>
                  </select>
                </div>
                <div class="field">
                  <label>Année</label>
                  <select v-model="exp.anneeDebut">
                    <option value="">--</option>
                    <option v-for="a in annees" :key="a" :value="a">{{ a }}</option>
                  </select>
                </div>
              </div>
              <div class="periode-label">Fin <span class="periode-hint">(vide = en cours)</span></div>
              <div class="field-row">
                <div class="field">
                  <label>Mois</label>
                  <select v-model="exp.moisFin">
                    <option value="">--</option>
                    <option v-for="m in moisOptions" :key="m.value" :value="m.value">{{ m.label }}</option>
                  </select>
                </div>
                <div class="field">
                  <label>Année</label>
                  <select v-model="exp.anneeFin">
                    <option value="">--</option>
                    <option v-for="a in annees" :key="a" :value="a">{{ a }}</option>
                  </select>
                </div>
              </div>
              <p v-if="dateFinInvalide(exp)" class="date-error">
                La date de fin ne peut pas etre avant la date de debut.
              </p>
            </div>
            <button class="btn-ajouter" @click="ajouterExperience">+ Ajouter une expérience</button>
          </div>

          <div v-if="activeTab === 'competences'" class="form-section">
            <div class="field">
              <label>Hard Skills (une ligne = un bullet)</label>
              <textarea v-model="form.hardSkills" rows="5" placeholder="Vue.js&#10;Python&#10;Docker"></textarea>
            </div>
            <div class="field">
              <label>Soft Skills (une ligne = un bullet)</label>
              <textarea v-model="form.softSkills" rows="4" placeholder="Travail en équipe&#10;Gestion du temps"></textarea>
            </div>
            <div class="field">
              <label>Langues (une ligne = un bullet)</label>
              <textarea v-model="form.langues" rows="3" placeholder="Français (natif)&#10;Anglais (courant)"></textarea>
            </div>
            <div class="separateur">Certifications</div>
            <div v-for="(cert, i) in form.certifications" :key="i" class="repeater-block">
              <div class="repeater-header">
                <span>Certification {{ i + 1 }}</span>
                <button v-if="form.certifications.length > 1" class="btn-supprimer" @click="supprimerCertification(i)">Supprimer</button>
              </div>
              <div class="field">
                <label>Nom</label>
                <input v-model="cert.nom" placeholder="AWS Certified Developer" />
              </div>
              <div class="field">
                <label>Organisme</label>
                <input v-model="cert.organisme" placeholder="Amazon Web Services" />
              </div>
              <div class="field-row">
                <div class="field">
                  <label>Mois</label>
                  <select v-model="cert.moisDate">
                    <option value="">--</option>
                    <option v-for="m in moisOptions" :key="m.value" :value="m.value">{{ m.label }}</option>
                  </select>
                </div>
                <div class="field">
                  <label>Année</label>
                  <select v-model="cert.anneeDate">
                    <option value="">--</option>
                    <option v-for="a in annees" :key="a" :value="a">{{ a }}</option>
                  </select>
                </div>
              </div>
            </div>
            <button class="btn-ajouter" @click="ajouterCertification">+ Ajouter une certification</button>
          </div>

          <div v-if="activeTab === 'benevole'" class="form-section">
            <div v-for="(ben, i) in form.benevoles" :key="i" class="repeater-block">
              <div class="repeater-header">
                <span>Bénévolat {{ i + 1 }}</span>
                <button v-if="form.benevoles.length > 1" class="btn-supprimer" @click="supprimerBenevole(i)">Supprimer</button>
              </div>
              <div class="field-row">
                <div class="field">
                  <label>Organisation</label>
                  <input v-model="ben.organisation" placeholder="Croix-Rouge" />
                </div>
                <div class="field">
                  <label>Rôle</label>
                  <input v-model="ben.role" placeholder="Bénévole terrain" />
                </div>
              </div>
              <div class="field">
                <label>Description (une ligne = un bullet)</label>
                <textarea v-model="ben.description" rows="3" placeholder="Distribution de repas&#10;Accompagnement des familles"></textarea>
              </div>
              <div class="periode-label">Début</div>
              <div class="field-row">
                <div class="field">
                  <label>Mois</label>
                  <select v-model="ben.moisDebut">
                    <option value="">--</option>
                    <option v-for="m in moisOptions" :key="m.value" :value="m.value">{{ m.label }}</option>
                  </select>
                </div>
                <div class="field">
                  <label>Année</label>
                  <select v-model="ben.anneeDebut">
                    <option value="">--</option>
                    <option v-for="a in annees" :key="a" :value="a">{{ a }}</option>
                  </select>
                </div>
              </div>
              <div class="periode-label">Fin <span class="periode-hint">(vide = en cours)</span></div>
              <div class="field-row">
                <div class="field">
                  <label>Mois</label>
                  <select v-model="ben.moisFin">
                    <option value="">--</option>
                    <option v-for="m in moisOptions" :key="m.value" :value="m.value">{{ m.label }}</option>
                  </select>
                </div>
                <div class="field">
                  <label>Année</label>
                  <select v-model="ben.anneeFin">
                    <option value="">--</option>
                    <option v-for="a in annees" :key="a" :value="a">{{ a }}</option>
                  </select>
                </div>
              </div>
              <p v-if="dateFinInvalide(ben)" class="date-error">
                La date de fin ne peut pas etre avant la date de debut.
              </p>
            </div>
            <button class="btn-ajouter" @click="ajouterBenevole">+ Ajouter un bénévolat</button>
          </div>

        </div>

        <div class="form-footer">
          <button class="btn-download" @click="telechargerPDF">Télécharger PDF</button>
        </div>
      </aside>

      <main class="preview-side">
        <div id="cv-colorful-export" class="cv-page" :style="{ '--couleur-fond': couleurFond, '--couleur-texte': couleurTexte }">

          <div class="cv-colonne-gauche">

            <div class="cv-photo-wrapper">
              <img v-if="form.photoUrl" :src="form.photoUrl" class="cv-photo" alt="Photo" />
              <div v-else class="cv-photo-vide">Photo</div>
            </div>

            <div class="cv-sidebar-section">
              <h3 class="cv-sidebar-titre">CONTACT</h3>
              <div v-if="form.email" class="cv-sidebar-info">{{ form.email }}</div>
              <div v-if="form.telephone" class="cv-sidebar-info">{{ form.telephone }}</div>
              <div v-if="form.adresse" class="cv-sidebar-info">{{ form.adresse }}</div>
              <div v-if="form.site" class="cv-sidebar-info">{{ form.site }}</div>
            </div>

            <div v-if="formationsTries[0] && (formationsTries[0].ecole || formationsTries[0].diplome)" class="cv-sidebar-section">
              <h3 class="cv-sidebar-titre">FORMATION</h3>
              <div v-for="(edu, i) in formationsTries" :key="i" class="cv-sidebar-edu">
                <div class="cv-sidebar-edu-diplome">{{ edu.diplome }}</div>
                <div class="cv-sidebar-edu-ecole">{{ edu.ecole }}</div>
                <div class="cv-sidebar-edu-periode">{{ formatPeriode(edu.moisDebut, edu.anneeDebut, edu.moisFin, edu.anneeFin) }}</div>
              </div>
            </div>

            <div v-if="form.hardSkills" class="cv-sidebar-section">
              <h3 class="cv-sidebar-titre">HARD SKILLS</h3>
              <ul class="cv-sidebar-liste">
                <li v-for="(ligne, i) in enLignes(form.hardSkills)" :key="i">{{ ligne }}</li>
              </ul>
            </div>

            <div v-if="form.softSkills" class="cv-sidebar-section">
              <h3 class="cv-sidebar-titre">SOFT SKILLS</h3>
              <ul class="cv-sidebar-liste">
                <li v-for="(ligne, i) in enLignes(form.softSkills)" :key="i">{{ ligne }}</li>
              </ul>
            </div>

            <div v-if="form.langues" class="cv-sidebar-section">
              <h3 class="cv-sidebar-titre">LANGUES</h3>
              <ul class="cv-sidebar-liste">
                <li v-for="(ligne, i) in enLignes(form.langues)" :key="i">{{ ligne }}</li>
              </ul>
            </div>

          </div>

          <div class="cv-colonne-droite">

            <div class="cv-entete">
              <h1 class="cv-nom">{{ form.prenom }} {{ form.nom }}</h1>
              <p v-if="form.titre" class="cv-sous-titre">{{ form.titre }}</p>
            </div>

            <div v-if="form.resume" class="cv-section">
              <h2 class="cv-section-titre">RÉSUMÉ PROFESSIONNEL</h2>
              <p class="cv-texte">{{ form.resume }}</p>
            </div>

            <div v-if="experiencesTries[0] && (experiencesTries[0].entreprise || experiencesTries[0].poste)" class="cv-section">
              <h2 class="cv-section-titre">EXPÉRIENCE PROFESSIONNELLE</h2>
              <div v-for="(exp, i) in experiencesTries" :key="i">
                <div v-if="exp.entreprise || exp.poste" class="cv-bloc">
                  <strong class="cv-poste">{{ exp.poste }}</strong>
                  <span class="cv-info">{{ exp.entreprise }} · {{ formatPeriode(exp.moisDebut, exp.anneeDebut, exp.moisFin, exp.anneeFin) }}</span>
                  <ul v-if="exp.description" class="cv-liste">
                    <li v-for="(ligne, j) in enLignes(exp.description)" :key="j">{{ ligne }}</li>
                  </ul>
                </div>
              </div>
            </div>

            <div v-if="form.certifications[0] && form.certifications[0].nom" class="cv-section">
              <h2 class="cv-section-titre">CERTIFICATIONS</h2>
              <ul class="cv-liste">
                <li v-for="(cert, i) in form.certifications" :key="i">
                  {{ cert.nom }}
                  <span v-if="cert.organisme"> – {{ cert.organisme }}</span>
                  <span v-if="cert.moisDate && cert.anneeDate"> ({{ moisNoms[cert.moisDate - 1] }} {{ cert.anneeDate }})</span>
                </li>
              </ul>
            </div>

            <div v-if="benevolesTries[0] && (benevolesTries[0].organisation || benevolesTries[0].role)" class="cv-section">
              <h2 class="cv-section-titre">BÉNÉVOLAT</h2>
              <div v-for="(ben, i) in benevolesTries" :key="i">
                <div v-if="ben.organisation || ben.role" class="cv-bloc">
                  <strong class="cv-poste">{{ ben.role }}</strong>
                  <span class="cv-info">{{ ben.organisation }} · {{ formatPeriode(ben.moisDebut, ben.anneeDebut, ben.moisFin, ben.anneeFin) }}</span>
                  <ul v-if="ben.description" class="cv-liste">
                    <li v-for="(ligne, j) in enLignes(ben.description)" :key="j">{{ ligne }}</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>

    </div>
  </div>
</template>

<style scoped>
.editor-page {
  min-height: calc(100vh - 80px);
  background: #f3f3f3;
}

.editor-layout {
  display: flex;
  height: calc(100vh - 80px);
}

/* Formulaire */

.form-side {
  width: 420px;
  min-width: 420px;
  background: white;
  border-right: 1px solid #d8d8d8;
  display: flex;
  flex-direction: column;
}

.tab-bar {
  display: flex;
  border-bottom: 1px solid #d8d8d8;
  flex-shrink: 0;
  overflow-x: auto;
}

.tab-btn {
  flex: 1;
  padding: 12px 4px;
  border: none;
  background: none;
  font-size: 11px;
  font-weight: 600;
  color: #9b9b9b;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  white-space: nowrap;
}

.tab-btn:hover { color: #0b1c2d; }
.tab-btn.active { color: #2f89e5; border-bottom-color: #2f89e5; }

.form-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px 18px;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.field label {
  font-size: 12px;
  font-weight: 600;
  color: #333;
}

.field input,
.field textarea,
.field select {
  width: 100%;
  border: 1px solid #d8d8d8;
  border-radius: 6px;
  padding: 8px 10px;
  font-size: 13px;
  color: #333;
  background: #fffdfb;
  outline: none;
  resize: vertical;
  font-family: inherit;
}

.field input:focus,
.field textarea:focus,
.field select:focus { border-color: #2f89e5; }
.field input::placeholder,
.field textarea::placeholder { color: #9b9b9b; }

.color-picker-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.input-color {
  width: 48px;
  height: 36px;
  padding: 2px;
  border-radius: 6px;
  border: 1px solid #d8d8d8;
  cursor: pointer;
}

.color-value {
  font-size: 12px;
  color: #555;
}

.photo-hint {
  font-size: 11px;
  color: #9b9b9b;
}

.field-row { display: flex; gap: 10px; }
.field-row .field { flex: 1; }

.periode-label {
  font-size: 12px;
  font-weight: 600;
  color: #555;
  margin-bottom: -6px;
}

.periode-hint {
  font-size: 11px;
  font-weight: 400;
  color: #9b9b9b;
}

.date-error {
  margin-top: -2px;
  font-size: 12px;
  color: #d12b2b;
  font-weight: 600;
}

.repeater-block {
  border: 1px solid #d8d8d8;
  border-radius: 10px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.repeater-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  font-weight: 600;
  color: #333;
}

.btn-supprimer {
  background: none;
  border: none;
  font-size: 12px;
  color: #e05a5a;
  cursor: pointer;
  font-weight: 600;
}

.btn-ajouter {
  padding: 10px;
  border: 1px dashed #aaa;
  border-radius: 8px;
  background: none;
  color: #2f89e5;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
}

.separateur {
  font-size: 13px;
  font-weight: 700;
  color: #333;
  border-top: 1px solid #e8e8e8;
  padding-top: 12px;
}

.form-footer {
  padding: 14px 18px;
  border-top: 1px solid #d8d8d8;
  flex-shrink: 0;
}

.btn-download {
  width: 100%;
  height: 42px;
  background: #0b1c2d;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
}

.btn-download:hover { background: #122a44; }

/* Aperçu CV */

.preview-side {
  flex: 1;
  overflow-y: auto;
  padding: 30px;
  display: flex;
  justify-content: center;
  background: #f3f3f3;
}

.cv-page {
  display: flex;
  box-sizing: border-box;
  width: 210mm;
  min-height: 297mm;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.15);
  font-family: Arial, sans-serif;
  font-size: 12px;
}

.cv-colonne-gauche {
  width: 36%;
  min-width: 36%;
  background-color: var(--couleur-fond);
  padding: 24px 18px;
}

.cv-photo-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.cv-photo {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(255, 255, 255, 0.3);
}

.cv-photo-vide {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: var(--couleur-texte);
  border: 2px dashed rgba(255, 255, 255, 0.3);
}

.cv-sidebar-section {
  margin-bottom: 18px;
}

.cv-sidebar-titre {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--couleur-texte);
  margin-bottom: 8px;
  padding-bottom: 4px;
  border-bottom: 1px solid var(--couleur-texte);
}

.cv-sidebar-info {
  font-size: 11px;
  color: var(--couleur-texte);
  margin-bottom: 5px;
  line-height: 1.4;
  word-break: break-all;
}

.cv-sidebar-edu {
  margin-bottom: 10px;
}

.cv-sidebar-edu-diplome {
  font-size: 11px;
  font-weight: 700;
  color: var(--couleur-texte);
  line-height: 1.4;
}

.cv-sidebar-edu-ecole {
  font-size: 11px;
  color: var(--couleur-texte);
}

.cv-sidebar-edu-periode {
  font-size: 10px;
  color: var(--couleur-texte);
  margin-top: 2px;
}

.cv-sidebar-liste {
  padding-left: 14px;
  margin: 0;
}

.cv-sidebar-liste li {
  font-size: 11px;
  color: var(--couleur-texte);
  margin-bottom: 4px;
  line-height: 1.4;
}

/* Colonne droite */

.cv-colonne-droite {
  flex: 1;
  background: white;
  padding: 24px 22px;
}

.cv-entete {
  margin-bottom: 14px;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--couleur-fond);
}

.cv-nom {
  font-size: 22px;
  font-weight: 700;
  color: #000;
  margin-bottom: 3px;
}

.cv-sous-titre {
  font-size: 12px;
  color: #555;
}

.cv-section {
  margin-bottom: 12px;
}

.cv-section-titre {
  font-size: 12px;
  font-weight: 700;
  color: var(--couleur-fond);
  letter-spacing: 0.06em;
  margin-bottom: 6px;
  padding-bottom: 3px;
  border-bottom: 1px solid #e0e0e0;
}

.cv-texte {
  font-size: 11.5px;
  color: #333;
  line-height: 1.6;
}

.cv-bloc {
  margin-bottom: 10px;
}

.cv-poste {
  font-size: 12px;
  font-weight: 700;
  color: #000;
  display: block;
}

.cv-info {
  font-size: 11px;
  color: #666;
  display: block;
  margin-bottom: 3px;
}

.cv-liste {
  padding-left: 16px;
  margin-top: 4px;
}

.cv-liste li {
  font-size: 11.5px;
  color: #333;
  margin-bottom: 2px;
  line-height: 1.5;
}

@media (max-width: 900px) {
  .editor-layout { flex-direction: column; height: auto; }
  .form-side { width: 100%; min-width: 0; border-right: none; border-bottom: 1px solid #d8d8d8; }
  .preview-side { padding: 20px; }
  .cv-page { width: 100%; flex-direction: column; }
  .cv-colonne-gauche { width: 100%; }
}

@media print {
  body * { visibility: hidden; }
  #cv-colorful-export, #cv-colorful-export * { visibility: visible; }
  #cv-colorful-export { position: absolute; top: 0; left: 0; width: 100%; display: flex; }
  .cv-colonne-gauche { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
}
</style>