<template>
    <q-card class="text-black">
      <q-bar>
          <div class="text-h4">
            Ideas Matter inscription
          </div>
          <q-space/>
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
            </q-btn>
      </q-bar>
    <br><br><br><br>
    <q-stepper
      v-model="step"
      ref="stepper"
      color="primary"
      animated
    >
    <q-step
      :name="1"
      title="Nom et prènom"
      icon="account_circle"
      :done="step > 1"
    >
    <div class="q-pa-md">
      <div class="q-gutter-md" style="max-width: 300px">
        <q-form
          class="q-gutter-md"
        >
          <q-input
            v-model="nom"
            label="First name *"
            lazy-rules
            :rules="[ val => checkFormula(val, 'nom') || 'Veuillez entrer votre vraie nom']"
          />
          <q-input
            v-model="prenom"
            label="Last name *"
            lazy-rules
            :rules="[ val => val && checkFormula(val, 'prenom') || 'Veuillez entrer votre vraie prènom']"
          />
          <div class="q-pa-md">
            <div class="q-gutter-lg" style="max-width: 300px">
              <q-btn label="Continue" color="primary" v-if="nom !== null && prenom !== null && checkFormula(nom, 'nom') && checkFormula(prenom, 'prenom') " @click="$refs.stepper.next()"/>
            </div>
          </div>
        </q-form>
      </div>
    </div>
  </q-step>
  <q-step
    :name="2"
    title="Coordonnés"
    icon="email"
    :done="step > 2"
  >
    <div class="q-pa-md">
      <div class="q-gutter-md" style="max-width: 300px">
        <q-form
          class="q-gutter-md"
        >
          <q-input
          v-model="email"
          label="Your e-mail *"
          lazy-rules
          :rules="[ val => val && checkFormula(val, 'mail') || 'Adresse mail non valide']"
          type="email"
          />
          <div class="q-pa-md">
            <div class="q-gutter-lg" style="max-width: 300px">
              <q-btn label="Continue"  color="primary" v-if="email !== null && checkFormula(email, 'mail')" @click="$refs.stepper.next()"/>
            </div>
          </div>
        </q-form>
      </div>
    </div>
  </q-step>
  <q-step
    :name="3"
    title="Your password"
    icon="security"
    :done="step > 3"
    >
    <div class="q-pa-md">
      <div class="q-gutter-md" style="max-width: 300px">
        <q-form
          class="q-gutter-md"
        >
        <q-input
            v-model="psw"
            filled
            :type="isPwdFirstMdp ? 'password' : 'text'"
            placeholder="Your password"
            :rules="[ val => val && checkMdpStrength(val) || 'Votre mot de passe doit avoir au moins six charactères avec des majuscules et des chiffres']"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwdFirstMdp ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwdFirstMdp = !isPwdFirstMdp"
              />
            </template>
          </q-input>
          <br>
          <q-input
              v-model="confirmPsw"
              filled
              :type="isPwdSecondMdp ? 'password' : 'text'"
              placeholder="Confirm your password"
              :rules="[ val => val && checkMdpMatch(val, psw) || 'Les mots de passe saisis ne sont pas identiques']"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwdSecondMdp ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwdSecondMdp = !isPwdSecondMdp"
              />
            </template>
          </q-input>
          <div class="q-pa-md">
            <div class="q-gutter-lg" style="max-width: 300px">
              <q-btn label="Finish" color="primary" v-if="psw !== null && confirmPsw != null && psw.length > 6 && psw === confirmPsw" @click="onSubmit" v-close-popup/>
            </div>
          </div>
        </q-form>
      </div>
    </div>
  </q-step>
</q-stepper>
</q-card>
</template>
<script>
/* eslint-disable */
import { openURL } from 'quasar'
import Password from 'vue-password-strength-meter'
import FormCheck from './FormCheck'
import api from '../../services/api'
export default {
  name: 'Inscription',
  components: {
    Password
  },
  data () {
    return {
      isPwdFirstMdp: true,
      isPwdSecondMdp: true,
      step: 1,
      nom: null,
      prenom: null,
      email: null,
      tel: null,
      psw: null,
      confirmPsw: null,
      adresse_livrasion: null,
      passwordScore: 0
    }
  },
  methods: {
    openURL,
    checkMdpMatch (val1, val2) {
      return FormCheck.checkMdpMatch(val1, val2)
    },
    checkMdpStrength (val) {
    return FormCheck.checkMdp(val)
    },
    checkFormula (val , from) {
      if (from === 'nom' || from === 'prenom') {
        return FormCheck.checkNameSurname(val)
      } else if (from === 'mail') {
        return FormCheck.checkMail(val)
      }else if (from === 'phone') {
        return FormCheck.checkPhoneNumber(val)
      }
      return false
    },
    onSubmit () {
      console.log('nom =', this.nom, ', prenom =',this.prenom,' email =', this.email, ', psw =', this.psw);
      api.createUser(this.nom, this.prenom, this.email, this.psw).then(() => {
        this.$q.notify({
          color: 'green-7',
          textColor: 'white',
          icon: 'fas fa-check-circle',
          message: 'Inscription reussite, vous pouvez se connecter avec votre compte'
        })
      }, (error) => {
          let message = error.response.status !== 403 ? 'Error'
          : 'Il existe un utilisateur utilisant l\'adresse email fournit'
          this.$q.notify({
            color: 'red-7',
            textColor: 'white',
            icon: 'fas fa-check-circle',
            message: message
          });
        })
    }
  }
}
</script>
