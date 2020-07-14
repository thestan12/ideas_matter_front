<template>
  <q-layout view="lHh lpr lFf" color="black">
    <q-header elevated class="layout-css">
      <q-toolbar class="q-my-ms">
        <q-btn
          flat
          dense
          round
          @click="clickDrawer"
          aria-label="Menu"
          icon="menu"
        >
        </q-btn>
        <q-toolbar-title @click="goHome" class="title">
          <strong>Ideas Matter</strong>
        </q-toolbar-title>
        <q-btn-toggle
          flat stretch
          toggle-color="white"
          v-model="btnValToolbar"
          push
          :ripple="{ color: 'black' }"
          :options="[
            {label: 'Compte', slot: 'Compte', icon: 'account_circle', value: 'Compte'}
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
    <q-drawer
      side='left'
      v-model="leftDrawerOpen"
      behavior="desktop"
      bordered
      content-class="bg-grey-2"
    >
    <q-list>
      <q-item clickable tag="a" target="" @click="goTo('home');clickDrawer();">
        <q-item-section>
          <div class="q-pa-md">
              <q-item-label><center><font color="black" size="5">All categorys</font></center></q-item-label>
          </div>
        </q-item-section>
      </q-item>
    </q-list>
      <q-list v-for="category in categories" :key="category.id">
        <q-item clickable tag="a" target="" @click="goTo(`home?category=${category.name}`);clickDrawer();">
          <q-item-section avatar>
            <q-icon :name="calculateIcon(category.name)" size="50px"/>
          </q-item-section>
            <q-item-section>
            <div class="q-pa-md">
              <q-item-label>{{category.name}}</q-item-label>
              <q-item-label caption>{{calculateDescription(category.name)}}</q-item-label>
            </div>
            </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<script>
import api from '../services/api'
import { openURL } from 'quasar'
import Inscription from 'src/components/Inscription/Inscription'
import Connexion from 'src/components/Connexion/Connexion'
import LayoutQList from './LayoutQList'

export default {
  name: 'LayoutInconnected',
  components: {
    Inscription,
    Connexion
  },
  data () {
    return {
      btnValToolbar: false,
      showConnexion: false,
      maximizedToggle: true,
      showInscDialog: false,
      leftDrawerOpen: false,
      categories: []
    }
  },
  computed: {

  },
  methods: {
    goTo (href) {
      this.$router.push(href,  () => { })
    },
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
    },
    clickDrawer () {
      console.log('categories =', this.categories);
      this.leftDrawerOpen = !this.leftDrawerOpen
    },
    calculateIcon(name) {
      switch (name) {
        case "Technologie":
          return "android";
          break;
        case "Science":
          return "spa";
          break;
        case "Space":
          return "public";
          break;
        default: return "";
      }
    },
    calculateDescription(name) {
      return "All about " + name;
    }
  },
  computed: {
    leftDrawer: {
      get () {
        return this.leftDrawerOpen || this.mouseOverLeftHandSide
      },
      set (newv) {
        this.leftDrawerOpen = newv
      }
    }
  },
  created() {
    api.fetshCategories()
    .then(response => response.data)
    .then(categories => this.categories = [...categories])
    .catch((err) => {
      console.warn('error fetshing all categories');
    });
  }
}
</script>

<style>
.title {
  cursor: pointer;
}
.layout-css {
  background: #00bf8f;  /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #001510, #00bf8f);  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #001510, #00bf8f); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
</style>
