<template>
  <q-page>
    <q-chip size="lg" clickable class="q-ma-md" color="secondary" text-color="white" :icon="currentCategoryIcon">
      {{currentCategoryLabel}}
    </q-chip>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-fab
        icon="edit"
        direction="up"
        color="accent"
      >
        <q-fab-action @click="publishDialog = true;triggerFocus()" color="black" icon="add">
          <q-tooltip anchor="center left" self="center right" :offset="[10, 10]">
            <strong>Publish an idea</strong>
            (<q-icon name="wb_incandescent"/>)
          </q-tooltip>
        </q-fab-action>
        <!-- <q-fab-action @click="onClick" color="primary" icon="mail" /> -->
      </q-fab>
    </q-page-sticky>
    <!-- ideas-display -->
    <div class="flex row">
      <div class="col-md-11">
        <div v-for="idea in ideas" :key="idea.id">
          <div class="col-xl-2 col-md-4 col-xs-5 q-ml-lg q-pa-xl">
            <q-card       class=" text-white"
      style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)">
              <q-item-section class="q-pa-md">
                <font size="5"><strong>{{idea.name}}</strong></font>
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
                <q-btn label="Support the idea" color="light-blue" size="md" :disable="!userIsLogged" @click="donationDialog = true"/>
                <q-btn flat round color="grey" icon="thumb_down" @click="dislikePost(idea.id)"/>
                <q-btn flat round color="grey" icon="thumb_up"  @click="likePost(idea.id)">
                  <q-badge v-if="idea.likes === 0" color="blue" floating>{{idea.likes}}</q-badge>
                  <q-badge v-if="idea.likes > 0" color="green" floating>{{idea.likes}}</q-badge>
                  <q-badge v-if="idea.likes < 0" color="red" floating>{{idea.likes}}</q-badge>
                </q-btn>
                <q-btn flat round color="white" icon="add_comment" @click="commentDialog = true; currentIdeaId = idea.id">
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
    <!-- End ideas-display -->

    <!-- idea-publisher -->
    <q-dialog
      v-model="publishDialog"
    >
      <q-card style="width: 700px; max-width: 80vw;">
        <q-item>
            <q-item-section class="q-pa-md">
              <center><font size="5"><strong>Your Idea</strong></font></center>
            </q-item-section>
         </q-item>
         <q-separator />
        <q-card-section>
          <div class="text-h6"></div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="flex row">
            <div class="col-md-6 col-sm-12 col-xs-12 col-lg-4 col-xl-4">
              <q-input ref="ideaName" standout="bg-teal text-white" v-model="ideaName" label="Idea name" />
            </div>
            <div class="col-md-6 col-lg-8 col-xl-8">
              &nbsp;
            </div>
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="flex row">
            <div class="col-md-6 col-sm-12 col-xs-12 col-lg-4 col-xl-4">
              <q-select standout="bg-teal text-white" v-model="categorie" :options="categoriesOptions" label="Category"/>
            </div>
            <div class="col-md-6 col-lg-8 col-xl-8">
              &nbsp;
            </div>
          </div>
        </q-card-section>
        <br>
        <q-card-section class="q-pt-none">
          Your idea description
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-editor
            v-model="editor"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" color="red" v-close-popup />
          <q-btn :disable="ideaName.length < 4 || ideaNameNotValide() || categorie === null || editor.length < 100"  flat label="Publish" color = "green" @click="submitIdea" v-close-popup>
            <q-tooltip v-if="ideaName.length < 4 || ideaNameNotValide() || categorie === null || editor.length < 100">
              {{indiceSubmit}}
            </q-tooltip>
          </q-btn>
        </q-card-actions>

      </q-card>
    </q-dialog>
    <!-- fin-idea-publisher -->

    <comments-creator :commentDialog="commentDialog" @submited="submitComment"/>

    <donation :donationDialog="donationDialogC" @submitDonation="submitDonation"/>

  </q-page>
</template>
<script>

import api from '../../services/api'
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
      categorie: null,
      currentCategory: "All Categories",
      publishDialog: false,
      ideaName: "",
      categoriesOptions: [
        'Technologie', 'Science', 'Space'
      ],
      editor: 'Describe your idea here',
      ideas: [],
      id: 0,
      nbLike: 0,
      userIsLogged: true,
      commentDialog: false,
      comments: [],
      donationDialog: false
    }
  },

  methods: {
    dislikePost(id) {

    },
    likePost(id) {
      let vm = this;
      api.likePost(id).then(response => {
        console.log('response =', response);
        vm.ideas.find(div => div.id === id).likes = vm.ideas.find(div => div.id === id).likes + 1;
      }).catch((err) => {
        console.warn("error while liking post with id =", id, ", the error is  ",err);
      })
    },
    submitDonation(payload) {
      console.log('donation submited successfuly');
      this.donationDialog = false;
    },
    triggerFocus() {
      let vm = this;
      setTimeout(function () {
        vm.$refs.ideaName.focus();
      }, 100);
    },
    submitComment(payload) {
      console.log('payload =', payload,"     currentIdeaId =", this.currentIdeaId);
      let vm = this;
      if (payload && vm.currentIdeaId !== -1) {
        api.commentPost(vm.currentIdeaId, payload).then(response => {
          console.log('response =', response);
          vm.ideas.find(div => div.id === vm.currentIdeaId).comments = response.data.comments;
        }).catch((err) => {
          console.warn('err =', err);
        });

        vm.commentDialog = false;
        vm.$q.notify({
          message: 'Your feedBack has been published',
          color: 'green-7',
          textColor: 'white',
          icon: 'done'
        });
      }
    },
    submitIdea() {
      let vm = this;
      api.sendPost(this.categorie, this.editor).then(response => {
        console.log("response =", response);
        vm.ideas.push({
          "id": response.data.idPost,
          "content": response.data.content,
          "name": response.data.subject,
          "category": "none"
        });
      }).catch((err) => {
        console.warn("error while sending the post to the server ", err);
      });

      this.editor="";
      this.ideaName="";
      this.categorie="";
      this.$q.notify({
        message: 'Your idea has been published',
        color: 'green-7',
        textColor: 'white',
        icon: 'done'
      });

    },
    onClick () {
  // console.log('Clicked on a fab action')
    },
    viewMyIdeas() {

    },
    ideaNameNotValide() {
      for (let i = 0; i < this.ideaName.length; i++) {
        if ((this.ideaName.charAt(i).toLowerCase() > 'z' || this.ideaName.charAt(i).toLowerCase() < 'a')  && (this.ideaName.charAt(i) !== ' ')) {
          return true;
        }
      }
      return false;
    }
  },
  computed: {
    indiceSubmit() {
      if (!this.ideaName) {
        return "The idea name should not be empty"
      }

      if (this.ideaName.length < 4) {
        return "The length of the idea name should be superior of 4 chars"
      }
      for (var i = 0; i < this.ideaName.length; i++) {
        if ((this.ideaName.charAt(i).toLowerCase() > 'z' || this.ideaName.charAt(i).toLowerCase() < 'a') && (this.ideaName.charAt(i) !== ' ')) {
          return "The ideaName should contain only alphabetic letters";
        }
      }

      if (this.categorie === null || !this.categorie) {
        return "The categorie should not be empty";
      }

      if(this.editor.length < 100) {
        return "Your idea is not enought developped";
      }

    },
    currentCategoryLabel() {
      return this.currentCategory;
    },
    currentCategoryIcon() {
      console.log('res =', this.currentCategory);
      if (!this.currentCategory) return '';

      if (this.currentCategory === 'Technology') {
        return 'android'
      }

      if (this.currentCategory === 'Space') {
        return 'public'
      }

      if (this.currentCategory === 'Science') {
        return 'spa';
      }
    },
    donationDialogC() {
      console.log('dans le donnation dialog computed', this.donationDialog);
      return this.donationDialog;
    }
  },
  mounted() {
    // this.ideas.push({
    //   "id": 0,
    //   "content": "Le contenu de l'idée, Le contenu de l'idée, Le contenu de l'idée, Le contenu de l'idée, Le contenu de l'idée, Le contenu de l'idée, Le contenu de l'idée, Le contenu de l'idée, Le contenu de l'idée, Le contenu de l'idée, Le contenu de l'idée,",
    //   "name": "The best idea ever",
    //   "category": "none"
    // })
  },
  created() {
    let vm = this;
    // api.loading();
    api.getPosts().then(response => {
      response.data.forEach((div) => {
        vm.ideas.push({
          "id": div.idPost,
          "content": div.content,
          "name": div.subject,
          "category": "none",
          "comments": div.comments,
          "likes": div.likes
        });
      });
      // api.finishedLoading();
    }).catch((err) => {
      console.warn("can't fetch posts from dataBase ", err);
      // api.finishedLoading();
      this.$q.notify({
        message: 'An error has occurred, can\'t connect to the backEnd side',
        color: 'red-7',
        textColor: 'white',
        icon: 'warning'
      });
    });
  },
  watch: {
    $route(to, from) {
      if (this.$router.history.current.query && this.$router.history.current.query.category) {
        this.currentCategory = this.$router.history.current.query.category;
      } else {
        this.currentCategory = "All Categories";
      }
      // this.ideas = []
    }
  }
}
</script>
