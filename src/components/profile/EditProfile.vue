<template>
<q-layout>
    <q-toolbar class="text-center">
      <q-toolbar-title>
        Edit your profile
      </q-toolbar-title>
    </q-toolbar>
  <form>
    <div class="flex row q-pa-md justify-center">
        <q-field class="col-6 q-mb-md">
          <q-input v-model="$v.profileEdit.nom.$model" placeholder="First name"
            label="Nom"/>
        </q-field>
    </div>
    <div class="flex row q-pa-md justify-center">
        <q-field  class="col-6 q-mb-md">
          <q-input v-model="$v.profileEdit.prenom.$model" placeholder="Last name"
            label="Prénom"/>
        </q-field>
    </div>
    <div class="flex row col-12 justify-start">
      <password id="password1" autocomplete="new-password" v-model="$v.password1.$model" :toggle="true"
        :badge="false" placeholder="Your new password"
        @score="onScoreChange" class="col-6 q-mb-md" />
    </div>
    <div class="flex row col-12 justify-start">
      <password id="password2" autocomplete="new-password" v-model="$v.password2.$model" :toggle="true"
        :badge="false" placeholder="Confirm your password"
        @score="onScoreChange" class="col-6 q-mb-md" />
    </div>
    <div class="flex row q-pa-md justify-center q-gutter-md">
      <q-btn color="negative" label="Cancel" @click="$emit('hide')"/>
      <q-btn color="primary" label="Save" @click="saveChanges"/>
    </div>
  </form>
</q-layout>
</template>

<script>
import { required, sameAs, minLength, maxLength, minValue, integer } from 'vuelidate/lib/validators'
import Password from 'vue-password-strength-meter'
import passwords from './password-settings'

import Vue from 'vue'
import Vuelidate from 'vuelidate'
Vue.use(Vuelidate)

import api from '../../services/api'
import StorageService from '../../services/storage-service'

export default {
  name: 'EditProfile',
  components: {
    Password
  },
  data () {
    let user = StorageService.getUser();
    return {
      user: user,
      profile: null,
      password1: '',
      password2: '',
      passwordScore: 0,
      profileEdit: {
        nom: user.firstName,
        prenom: user.lastName
      }
    }
  },
  validations () {
    const validators = {
      profileEdit: {
        nom: {
          required,
          minLength: minLength(2),
          maxLength: maxLength(20)
        },
        prenom: {
          required,
          minLength: minLength(2),
          maxLength: maxLength(20)
        }
      },
      password1: {},
      password2: {},
      address: {
        minLength: minLength(5)
      },
      phone: {
        minLength: minLength(8),
        integer
      }
    }
    if (this.password1 || this.password2) {
      validators.password1 = {
        minLength: minLength(this.passwordSettings.minLength),
        maxLength: maxLength(this.passwordSettings.maxLength)
      }
      validators.password2 = {
        sameAs: sameAs('password1')
      }
      validators.passwordScore = {
        minValue: minValue(2)
      }
    }
    return validators
  },
  computed: {
    passwordSettings () {
      return passwords.settings()
    },
    passwordPlaceholder () {
      return 'password'
    }
  },
  methods: {
    update (data) {
      api.editUser(data)
        .then((response) => {
          let data = response.data.data;
          StorageService.setUser(data.user);
          location.reload();
        }, () => {
          this.$q.notify({
            color: 'red-7',
            textColor: 'white',
            icon: 'fas fa-check-circle',
            message: 'Error'
          })
        })
    },
    getAlertMessage () {
      if (!this.$v.profileEdit.nom.required) {
        return 'First name is required'
      }
      if (!this.$v.profileEdit.nom.minLength || !this.$v.profileEdit.nom.maxLength) {
        return 'Your first name must be between 2 and 20 caractere long'
      }
      if (!this.$v.profileEdit.prenom.required) {
        return 'last name is required'
      }
      if (!this.$v.profileEdit.prenom.minLength || !this.$v.profileEdit.prenom.maxLength) {
        return 'last name must be between 2 and 20 caractere long'
      }
      if (!this.$v.password1.minLength || !this.$v.password1.maxLength) {
        return `your password must be between ${this.passwordSettings.minLength} and
          ${this.passwordSettings.maxLength} caractere long`
      }
      if (!this.$v.password2.sameAs) {
        return 'Your password don\'t match'
      }
      if (!this.$v.passwordScore.minValue) {
        return 'Please type a more strong password'
      }
      return 'No error'
    },
    prepareDataToSend () {
      let data = {
        firstName: this.profileEdit.nom,
        lastName: this.profileEdit.prenom,
      }
      if (this.password1) {
        data.password = this.password1
      }
      return data
    },
    saveChanges () {
      if (this.$v.$invalid) {
        this.$q.notify({
          color: 'red-7',
          textColor: 'white',
          icon: 'fas fa-check-circle',
          message: this.getAlertMessage()
        })
      } else {
        let data = this.prepareDataToSend()
        this.update(data)
      }
    },
    onScoreChange (score) {
      this.passwordScore = score
    }
  }
}
</script>
