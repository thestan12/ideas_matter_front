<template>
  <div>
    <!-- <div @load="log("pokemon")" v-if="comments.length > 0" v-for="comment in comments" :key="commentIndexForColor">
      <q-card dark bordered :class="commentIndexForColor % 2 === 0 ? 'bg-grey-9' : 'bg-grey-7'">
          <div class="flex row col-12">
            <div class="col-md-1 col-xs-2 col-sm-2 col-lg-1 col-xl-1">
              <q-avatar class="q-ma-lg">
                <img src="https://cdn.quasar.dev/img/boy-avatar.png">
                <q-badge class="q-mb-xl" color="blue" floating>Guest</q-badge>
              </q-avatar>
            </div>
            <div class="col-md-11 col-xs-10 col-sm-10 col-lg-11 col-xl-11">
              {{comment.content}}
            </div>
            {{incrementCommentIndex()}}
          </div>
      </q-card>
      <br>
    </div> -->
  </div>
</template>

<script>
export default {
  name: 'comments',
  props:["comments"],
  data() {
    return {
      log: console.log,
      commentIndexForColor: 0
    }
  },
  methods: {
    incrementCommentIndex() {
      this.commentIndexForColor += 1;
    }
  },
  computed: {

  },
  mounted() {

  }
}

</script>
