<template>
  <q-page>
    <div  class="col-12 flex row justify-center shortcuts">
        <h1>Home page</h1>
    </div>
  </q-page>
</template>
<script>

// import api from '../../api/api'

export default {
  name: 'Landing',
  components: {

  },
  // props: ['shortcuts'],

  data () {
    return {

    }
  },

  methods: {
    apiLoading () {
      this.internalLoading = true
    },
    finishedApiLoading () {
      this.internalLoading = false
    }
  }
}
</script>
