<template>
  <q-page>
    <q-chip size="lg" clickable class="q-ma-md" color="secondary" text-color="white" :icon="currentCategoryIcon">
      {{currentCategory}}
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
        <div v-for="link in ideas" :key="link.id">
          <div class="col-xl-2 col-md-4 col-xs-5 q-ml-lg q-pa-xl">
            <q-card>
              <q-item-section class="q-pa-md">
                <font size="5"><strong>{{link.name}}</strong></font>
              </q-item-section>
              <q-separator />
              <q-card-section class="q-pa-md">
                <p>
                  {{link.content}}
                </p>
              </q-card-section>
              <br><br>
              <q-separator/>
              <q-item-section class="q-pa-md">
                <font size="3" color="grey"><strong>Feedbacks</strong></font>
              </q-item-section>
              <q-card-section class="q-pa-md">
                <ideas-comments :comments="comments"/>
              </q-card-section>
              <q-card-actions align="right">
                <q-btn label="Support the idea" color="light-blue" size="md" :disable="!userIsLogged" @click="donationDialog = true"/>
                <q-btn flat round color="grey" icon="thumb_down" @click="nbLike = nbLike - 1"/>
                <q-btn flat round color="grey" icon="thumb_up"  @click="nbLike = nbLike + 1">
                  <q-badge v-if="nbLike === 0" color="blue" floating>{{nbLike}}</q-badge>
                  <q-badge v-if="nbLike > 0" color="green" floating>{{nbLike}}</q-badge>
                  <q-badge v-if="nbLike < 0" color="red" floating>{{nbLike}}</q-badge>
                </q-btn>
                <q-btn flat round color="primary" icon="message" @click="commentDialog = true"/>
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

import api from '../../api/api'
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
      categorie: null,
      fabLeft: true,
      fabCenter: true,
      fabRight: true,
      publishDialog: false,
      ideaName: "",
      categoriesOptions: [
        'Technologie', 'Science', 'Space'
      ],
      editor: 'Describe your idea here',
      ideas: [],
      id: 0,
      nbLike: 0,
      refresh : false,
      userIsLogged: true,
      commentDialog: false,
      comments: [],
      donationDialog: false
    }
  },

  methods: {
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
      console.log('payload =', payload);
      if (payload) {
        this.comments.push({
          "id": this.id,
          "content": payload,
          "person": "Mohamed"
        });
        this.commentDialog = false;
        this.id += 1 ;
      }
    },
    submitIdea() {
      this.ideas.push({
        "id": this.id,
        "content": this.editor,
        "name": this.ideaName,
        "category": this.categorie
      });

      api.sendPost(this.categorie, this.editor).then(response => {
        console.log("response =", response);
      }).catch((err) => {
        console.warn("error while sending the post to the server ", err);
      });

      this.editor="";
      this.ideaName="";
      this.categorie="";
      this.$q.notify({
        message: 'Your idea has been published',
        color: 'green-4',
        textColor: 'white',
        icon: 'done'
      });

    },
    onClick () {
  // console.log('Clicked on a fab action')
    },
    viewMyIdeas() {

    },
    apiLoading () {
      this.internalLoading = true
    },
    finishedApiLoading () {
      this.internalLoading = false
    },
    ideaNameNotValide() {
      for (let i = 0; i < this.ideaName.length; i++) {
        if (this.ideaName.charAt(i).toLowerCase() > 'z' || this.ideaName.charAt(i).toLowerCase() < 'a') {
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
        if (this.ideaName.charAt(i).toLowerCase() > 'z' || this.ideaName.charAt(i).toLowerCase() < 'a') {
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
    currentCategory() {
      if (this.refresh || !this.refresh) {
        console.log('router =', this.$router);
        return (this.$router.history.current.query && this.$router.history.current.query.category) ? this.$router.history.current.query.category : '';
      }
      return '';
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
  watch: {
    $route(to, from) {
      this.refresh = ! this.refresh;
      this.ideas = []
    }
  }
}
</script>
