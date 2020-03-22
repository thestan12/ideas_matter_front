<template>
  <q-layout view="lHh lpr lFf">
    <q-header elevated>
      <q-toolbar class="q-my-ms">
        <q-toolbar-title color="red" @click="goHome" class="title">
          <strong>Ideas Matter</strong>
        </q-toolbar-title>
        <q-btn-toggle
          flat stretch
          toggle-color="white"
          push
          :ripple="{ color: 'black' }"
          :options="[
            {label: 'Compte', slot: 'Compte', icon: 'account_circle'}
          ]"
        >
        <template v-slot:Compte>
          <q-menu
          transition-show="flip-right"
          transition-hide="flip-left"
          :content-style="{ backgroundColor: '#eee'}"
          >
          <div class="row no-wrap q-pa-md">
          <div class="column">
            <div class="q-pa-sm">
              <center>
            <q-btn
              color="secondary"
              label="connexion"
              push
              size="md"
              v-close-popup
              @click="showConnexion = true"
            />
            </center>
            </div>
            <div class="q-pa-sm">
              <center>
                <q-btn
                  color="secondary"
                  label="S'inscrire"
                  push
                  size="md"
                  v-close-popup
                  @click="showInscription"
                />
              </center>
            </div>
          </div>
          <q-separator vertical inset class="q-mx-lg" />
          <div class="column items-center">
            <q-avatar size="60px">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png">
            </q-avatar>

            <div class="text-subtitle1 q-mt-md q-mb-xs">Guest</div>
          </div>
        </div>
        </q-menu>
        </template>
      </q-btn-toggle>
      </q-toolbar>
    </q-header>
    <q-dialog
      :maximized="maximizedToggle"
      v-model="showInscDialog"
      transition-show="flip-down"
      transition-hide="flip-up"
      @hide="onDialogHide"
      >
      <inscription/>
    </q-dialog>
    <q-dialog
      medium-width
      v-model="showConnexion"
      transition-show="flip-down"
      transition-hide="flip-up"
      @hide="onDialogHide"
      >
      <connexion/>
    </q-dialog>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<script>
import { openURL } from 'quasar'
import Inscription from 'src/components/Inscription/Inscription'
import Connexion from 'src/components/Connexion/Connexion'
export default {
  name: 'LayoutInconnected',
  components: {
    Inscription,
    Connexion
  },
  data () {
    return {
      showConnexion: false,
      maximizedToggle: true,
      showInscDialog: false
    }
  },
  computed: {

  },
  methods: {
    openURL,
    onDialogHide () {
      // required to be emitted
      // when QDialog emits "hide" event
      this.$emit('hide')
    },
    showInscription () {
      this.showInscDialog = true
    },
    goHome () {
      this.$router.push('/home')
    }
  }
}
</script>

<style>
.title {
  cursor: pointer;
}
</style>
