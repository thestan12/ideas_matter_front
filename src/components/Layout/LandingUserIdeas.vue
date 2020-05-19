<template>
  <q-page>
    <q-chip size="lg" clickable class="q-ma-md" color="secondary" text-color="white" icon="wb_incandescent">
      My ideas
    </q-chip>
    <!-- ideas-display -->
    <div class="flex row">
      <div class="col-md-11">
        <div v-for="idea in ideas" :key="idea.id">
          <div class="col-xl-2 col-md-4 col-xs-5 q-ml-lg q-pa-xl">
            <q-card class=" text-white" style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)">
              <q-item-section class="q-pa-md">
                <font size="5">
                  <strong>
                    <p>
                      {{idea.name}}
                      <q-badge v-if="idea.category" color="black" floating>{{idea.category}}</q-badge>
                    </p>
                </strong></font>
              </q-item-section>
              <q-separator />
              <q-card-section class="q-pa-md">
                <p>
                  {{idea.content}}
                </p>
              </q-card-section>
              <br><br>
              <q-separator/>
              <q-item-section class="q-pa-md">
                <q-expansion-item
                  class="shadow-1 overflow-hidden"
                  style="border-radius: 30px"
                  icon="comment"
                  :label="'Feedbacks <' + idea.comments.length+'>'"
                  header-class="bg-secondary text-white"
                  expand-icon-class="text-white"
                >
                  <ideas-comments :comments="idea.comments"/>
               </q-expansion-item>
              </q-item-section>

              <q-card-actions align="right">
                <q-btn label="Support the idea" color="light-blue" size="md" disable/>
                <q-btn flat round color="grey" icon="thumb_down" disable/>
                <q-btn flat round color="grey" icon="thumb_up"  disable>
                  <q-badge v-if="idea.likes === 0" color="blue" floating>{{idea.likes}}</q-badge>
                  <q-badge v-if="idea.likes > 0" color="green" floating>{{idea.likes}}</q-badge>
                  <q-badge v-if="idea.likes < 0" color="red" floating>{{idea.likes}}</q-badge>
                </q-btn>
                <q-btn flat round color="white" icon="add_comment" disable>
                  <q-tooltip>
                    Add a comment
                  </q-tooltip>
                </q-btn>
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </div>

      <div class="col-md-1">
        &nbsp;
      </div>
    </div>

    <div v-if="noResult">
      <br><br><br><br><br>
      <center>
        <q-icon name="far fa-grin-beam-sweat" size="100px" color="primary"/>
      </center>
      <br>
      <center>
        <font size="5"><strong>No posts assigned to you was found :(</strong></font>
        <br><br>
        <q-btn color="primary" label="I am in, i want to create my first idea" @click="goHome"/>
      </center>
      <br>
    </div>
  </q-page>
</template>
<script>

import api from '../../services/api'
import StorageService from '../../services/storage-service'
import ideasComments from '../Comments/comments'
import commentsCreator from '../Comments/commentCreator'
import donation from '../Donation/donate'
export default {
  name: 'Landing',
  components: {
    ideasComments,
    commentsCreator,
    donation
  },
  // props: ['shortcuts'],

  data () {
    return {
      currentIdeaId: -1, // which idea the user gonna comment
      currentCategory: "My posts",
      editor: 'Describe your idea here',
      ideas: [],
      id: 0,
      stillLooking: true
    }
  },

  methods: {
    goHome() {
      this.$router.push('/home');
    },
    fetshMyPosts() {
      let vm = this;
      if (StorageService.getUser().id) {
        api.loading("Chargement en cours");
        api.getPostsOfCurrentUser(StorageService.getUser().id).then(response => {
          vm.ideas = [];
          console.log('response =', response);
          for(let div of response.data) {
            console.log('div.comments =', div.comments);
            vm.ideas.push({
              "id": div.idPost,
              "content": div.content,
              "name": (div && div.name) ? div.name : 'No name found',
              "category": div.subject,
              "comments": div.comments,
              "likes": div.likes,
              "userEmail": div.userEmail
            });
          }
          this.stillLooking = false;
          api.finishedLoading();
        }).catch((err) => {
          this.stillLooking = false;
          console.warn("can't fetch posts from dataBase ", err);
          api.finishedLoading();
          this.$q.notify({
            message: 'An error has occurred, can\'t connect to the backEnd side',
            color: 'red-7',
            textColor: 'white',
            icon: 'warning'
          });
        });
      } else {
        this.stillLooking = false;
      }
    }
  },
  computed: {
    noResult() {
      if (this.stillLooking) {
        return false;
      }
      return this.ideas.length === 0;
    }
  },
  mounted() {
  },
  created() {
    this.fetshMyPosts();
  },
  watch: {

  }
}
</script>
