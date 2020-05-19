<template>
  <div>
    <div v-if="comments.length > 0" v-for="comment in comments" :key="comment.dateCreate">
      <q-card dark bordered class="bg-grey-7">
          <div class="flex row col-12">
            <div class="col-md-1 col-xs-2 col-sm-2 col-lg-1 col-xl-1">
              <q-avatar class="q-ma-lg">
                <img src="https://cdn.quasar.dev/img/boy-avatar.png">
                <q-badge class="q-mb-xl" color="blue" floating>{{(comment.owner) ? comment.owner : 'Anonymous'}}</q-badge>
              </q-avatar>
            </div>
            <div class="col-md-11 col-xs-10 col-sm-10 col-lg-11 col-xl-11">
              {{comment.content}}
            </div>
          </div>
          <q-badge v-if="comment.dateCreate" color="white" floating><font color="black">{{formatDate(comment.dateCreate)}}</font></q-badge>
      </q-card>
      <br>
    </div>
  </div>
</template>

<script>
import { date } from 'quasar'

export default {
  name: 'comments',
  props:["comments"],
  data() {
    return {
      log: console.log
    }
  },
  methods: {
    formatDate(dateOrigin) {
      return date.formatDate(dateOrigin, 'YYYY-MM-DD /dddd');
    }
  },
  computed: {

  },
  mounted() {

  }
}

</script>
