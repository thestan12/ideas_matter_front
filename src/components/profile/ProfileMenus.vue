<template>
  <q-menu>
    <div class="row no-wrap q-pa-md">
      <div class="column">
        <q-list>
          <q-item>
            <q-item-section>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-btn flat dense unelevated @click="editProfile = true" color="black" label="Settings" no-caps/>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <q-separator vertical inset class="q-mx-md" />
      <div class="column items-center">
        <q-avatar size="72px">
          <img :src="user.avatar ? user.avatar : 'https://cdn.quasar.dev/img/boy-avatar.png'"
            @error="$event.target.src = 'https://cdn.quasar.dev/img/boy-avatar.png'">
        </q-avatar>
        <div class="text-subtitle1 q-mt-md q-mb-xs">{{user.lastName}}</div>
        <q-btn
          color="red-7"
          label="Logout"
          push
          size="sm"
          v-close-popup
          @click="logout"
        />
      </div>
    </div>
    <q-dialog v-model="editProfile" content-classes="editprofile-content">
        <q-card style="width: 700px; max-width: 80vw;">
          <q-card-section class="row items-center justify-between">
            <edit-profile @hide="editProfile = false" />
          </q-card-section>
        </q-card>
    </q-dialog>
  </q-menu>
</template>
<script>
import StorageService from '../../services/storage-service'
import api from '../../services/api'
import EditProfile from './EditProfile'

export default {
  name: 'ProfileMenus',
  components: {
    EditProfile
  },
  data () {
    return {
      editProfile: false,
      user: StorageService.getUser()
    }
  },
  computed: {
  },
  methods: {
    logout () {
      StorageService.removeToken();
      StorageService.removeUser();
      location.href = 'home';
    },
    GoToCoin () {

    }
  }
}
</script>

<style lang="stylus">
.editprofile-content
  min-width: 600px
  min-height: 550px
  max-width: 800px
  max-height: 550px
</style>
