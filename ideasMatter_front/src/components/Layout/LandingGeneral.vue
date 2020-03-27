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
        <q-fab-action @click="publishDialog = true" color="black" icon="add">
          <q-tooltip anchor="center left" self="center right" :offset="[10, 10]">
            <strong>Publish an idea</strong>
            (<q-icon name="wb_incandescent"/>)
          </q-tooltip>
        </q-fab-action>
        <!-- <q-fab-action @click="onClick" color="primary" icon="mail" /> -->
      </q-fab>
    </q-page-sticky>
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
                <div v-if="comments.length > 0" v-for="comment in comments" :key="link.id">
                  <q-card dark bordered class="bg-grey-9 my-card">
                      <q-avatar class="q-ma-lg">
                        <img src="https://cdn.quasar.dev/img/boy-avatar.png">
                        <q-badge class="q-mb-xl" color="blue" floating>{{comment.person}}</q-badge>
                      </q-avatar>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      {{comment.content}}
                  </q-card>
                  <br>
                </div>
              </q-card-section>
              <q-card-actions align="right">
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
              <q-input standout="bg-teal text-white" v-model="ideaName" label="Idea name" />
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

    <!-- dialog feedback -->
    <q-dialog
      v-model="commentDialog"
    >
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Your feedBack</div>
        </q-card-section>
        <q-separator />

        <q-card-section class="q-pt-none">
          <q-editor
            v-model="editorComment"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" color="red" v-close-popup />
          <q-btn :disable="editorComment.length < 10 || this.editorComment === 'Type your comment here !'"  flat label="Validate" color = "green" @click="submitComment" v-close-popup>
            <q-tooltip v-if="editorComment.length < 10">
              You need to develop more you comment :)
            </q-tooltip>
          </q-btn>

        </q-card-actions>
      </q-card>
    </q-dialog>

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
      commentDialog: false,
      editorComment: "Type your comment here !",
      comments: [],
      refresh : false
    }
  },

  methods: {
    submitIdea() {
      this.ideas.push({
        "id": this.id,
        "content": this.editor,
        "name": this.ideaName,
        "category": this.categorie
      });
      this.editor="";
      this.ideaName="";
      this.categorie="";
      this.$q.notify({
        message: 'Your idea has been published',
        color: 'green-4',
        textColor: 'white',
        icon: 'done'
      })
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
    submitComment() {
      this.comments.push({
        "id": this.id,
        "content": this.editorComment,
        "person": "Mohamed"
      });
      this.editorComment = "Type your comment here !";
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
