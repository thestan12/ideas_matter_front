<template>
  <div class="bg-indigo-1">
    <landing-user-ideas/>
    <!--<Publicity/>-->
  </div>
</template>

<script>
import LandingUserIdeas from 'src/components/Layout/LandingUserIdeas'
//  import Publicity from 'src/components/publicity/Publicity'
export default {
  name: 'Home',
  components: {
    LandingUserIdeas
    //  Publicity
  },
  data () {
    return {
    }
  },
  computed: {
  },
  methods: {

  }
}
</script>
