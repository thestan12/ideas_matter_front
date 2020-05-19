<template>
  <q-layout view="lhh LpR lff">
    <q-header elevated>
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
          <strong>Ideas matter</strong>
        </q-toolbar-title>
        <q-space/>
        <q-btn
          label="Profile"
          icon="perm_identity"
          flat dense
        >
          <profile-menus />
       </q-btn>
      </q-toolbar>
    </q-header>
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
        <q-item clickable tag="a" target="" @click="goTo('home?category=Technology'); clickDrawer()">
          <q-item-section avatar>
            <q-icon name="android" size="50px"/>
          </q-item-section>
            <q-item-section>
              <div class="q-pa-md">
                  <q-item-label>Technology</q-item-label>
                  <q-item-label caption>All about technology</q-item-label>
              </div>
            </q-item-section>
        </q-item>
        <q-item clickable tag="a" target="" @click="goTo('home?category=Science'); clickDrawer()">
          <q-item-section avatar>
            <q-icon name="spa" size="50px"/>
          </q-item-section>
            <q-item-section>
            <div class="q-pa-md">
              <q-item-label>Science</q-item-label>
              <q-item-label caption>All about science</q-item-label>
            </div>
            </q-item-section>
        </q-item>
        <q-item clickable tag="a" target="" @click="goTo('home?category=Space'); clickDrawer()">
          <q-item-section avatar>
            <q-icon name="public" size="50px"/>
          </q-item-section>
            <q-item-section>
            <div class="q-pa-md">
              <q-item-label>Space</q-item-label>
              <q-item-label caption>All about space</q-item-label>
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
import StorageService from '../services/storage-service'
import ProfileMenus from 'src/components/profile/ProfileMenus'

export default {
  name: 'layoutConnected',
  components: {
    ProfileMenus
  },
  data () {
    return {
      leftDrawerOpen: false
    }
  },
  computed: {

  },
  mounted () {
    if (StorageService.getFirstConnection() && StorageService.getFirstConnection() === "true") {
      let lastName = (StorageService.getUser() && StorageService.getUser().lastName) ? StorageService.getUser().lastName : '';
      this.$q.notify({
        color: 'green-7',
        textColor: 'white',
        icon: 'fas fa-check-circle',
        message: 'Weclome ' + lastName + ' :)'
      });
      StorageService.setFirstConnection(false);
    }

  },
  methods: {
    goHome () {
      this.$router.push('/home')
    },
    clickDrawer () {
      this.leftDrawerOpen = !this.leftDrawerOpen
    },
    goTo (href) {
      console.log('dans le goTo');
      this.$router.push(href,  () => { })
    }
  }
}
</script>

<style>
.title {
  cursor: pointer;
}
</style>
