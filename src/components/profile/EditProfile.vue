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
          <q-input v-model="profileEdit.nom" placeholder="First name"
            label="Nom"/>
        </q-field>
    </div>
    <div class="flex row q-pa-md justify-center">
        <q-field  class="col-6 q-mb-md">
          <q-input v-model="profileEdit.prenom" placeholder="Last name"
            label="Prénom"/>
        </q-field>
    </div>
    <div class="flex row q-pa-md justify-center">
      <q-input
      class="col-6 q-mb-md"
      v-model="profileEdit.email"
      label="Your e-mail *"
      lazy-rules
      :rules="[ val => val && checkFormula(val, 'mail') || 'Adresse mail non valide']"
      type="email"
      />
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
import Password from 'vue-password-strength-meter'
import passwords from './password-settings'

import Vue from 'vue'

import api from '../../services/api'
import StorageService from '../../services/storage-service'
import FormCheck from '../Inscription/FormCheck'

export default {
  name: 'EditProfile',
  components: {
    Password,
    FormCheck
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
        prenom: user.lastName,
        email: StorageService.getUser().email
      }
    }
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
    checkFormula (val , from) {
      if (from === 'mail') {
        return FormCheck.checkMail(val)
      }
      return false
    },
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
    prepareDataToSend () {
      let data = {
        idUser: StorageService.getUser().idUser,
        firstName: this.profileEdit.nom,
        lastName: this.profileEdit.prenom,
        email: this.profileEdit.email
      }
      if (this.password1) {
        data.password = this.password1
      }
      return data
    },
    saveChanges () {
      let data = this.prepareDataToSend()
      this.update(data)
      if (this.password1 === this.password2 && this.password1 !== '') {
        let vm = this;
        api.updatePassword(vm.password1)
          .then(response => {
            console.log('response password =', response);
          }).catch((err)=> {
            vm.$q.notify({
              message: 'Ooola, something went wrong :D',
              color: 'red-7',
              textColor: 'white',
              icon: 'warning'
            });
          });
      }
    },
    update(data) {
      let vm = this;
      api.updateUser(data).then(response => {
        console.log('response =', response);
        vm.profileEdit.nom = data.firstName;
        vm.profileEdit.prenom = data.lastName;
        vm.profileEdit.email = data.email;
        StorageService.setUser(response.data);
        vm.$q.notify({
          message: 'vos informations sont mises à jour',
          color: 'green-7',
          textColor: 'white',
          icon: 'done'
        });
        this.$emit('hide');
      }).catch((err) => {
        vm.$q.notify({
          message: 'Ooola, something went wrong :D',
          color: 'red-7',
          textColor: 'white',
          icon: 'warning'
        });
      });
    },
    onScoreChange (score) {
      this.passwordScore = score
    }
  }
}
</script>
