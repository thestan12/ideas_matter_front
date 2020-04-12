<template>
  <q-layout view="lhh LpR lff">
    <q-header elevated class="bg-blue-6">
      <q-toolbar>
        <q-toolbar-title @click="goHome" class="title">
          <strong>Ideas matter</strong>
        </q-toolbar-title>
        <q-space/>
      </q-toolbar>
    </q-header>
  </q-layout>
</template>
<script>

export default {
  name: 'layoutConnected',
  components: {

  },
  data () {
    return {

    }
  },
  computed: {

  },
  mounted () {

  },
  methods: {

  }
}
</script>

<style>
.title {
  cursor: pointer;
}
</style>
