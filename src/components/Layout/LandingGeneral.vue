<template>
  <q-page class="background-landing">
    <q-chip size="lg" clickable class="q-ma-md" color="secondary" text-color="white" :icon="currentCategoryIcon">
      {{currentCategoryLabel}}
    </q-chip>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-fab
        icon="edit"
        direction="up"
        color="accent"
      >
        <q-fab-action @click="handlePublishIdea" color="black" icon="add">
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
            <q-card class="text-white card-color">
              <q-item-section class="q-pa-md">
                <font size="5">
                  <strong>
                    <p>
                      {{idea.subject}}
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
                <q-chip size="lg" clickable class="q-ma-md" color="secondary" text-color="white" icon="local_atm">
                  funds collected : {{getAmountId(idea.id)}} $
                </q-chip>
                <q-btn label="Support the idea" color="light-blue" size="md" @click="triggerDonationDialog(); donnationId = idea.id"/>
                <q-btn flat round color="grey" icon="thumb_down" @click="dislikePost(idea.id)"/>
                <q-btn flat round color="grey" icon="thumb_up"  @click="likePost(idea.id)">
                  <q-badge v-if="idea.likesCount === 0" color="blue" floating>{{idea.likesCount}}</q-badge>
                  <q-badge v-if="idea.likesCount > 0" color="green" floating>{{idea.likesCount}}</q-badge>
                  <q-badge v-if="idea.likesCount < 0" color="red" floating>{{idea.likesCount}}</q-badge>
                </q-btn>
                <q-btn flat round color="white" icon="add_comment" @click="triggerCommentDialog(idea.id)">
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

    <!-- in case there's 0 ideas -->
    <div v-if="noResult">
      <br><br><br><br><br>
      <center>
        <q-icon name="far fa-grin-beam-sweat" size="100px" color="white"/>
      </center>
      <br>
      <center>
        <font size="5" color="white"><strong>No posts found for {{currentCategory}}</strong></font>
      </center>
      <br>
    </div>
    <!--  -->

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

    <donation :donationDialog="donationDialogC" :donnationId="donnationId" @submitDonation="submitDonation"/>

    <q-dialog
      v-model="alertLoging"
    >
      <q-card style="width: 300px">
        <q-card-section>
          <div class="text-h6">Ooolaa&nbsp;&nbsp;&nbsp;D:</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          You need to login in first !!
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="OK" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="alterLike"
    >
      <q-card style="width: 300px">
        <q-card-section>
          <div class="text-h6">Ooolaa &nbsp;&nbsp;&nbsp;D:</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          You have already liked this idea !!
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="OK" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog
      v-model="alterDislike"
    >
      <q-card style="width: 300px">
        <q-card-section>
          <div class="text-h6">Ooolaa &nbsp;&nbsp;&nbsp;D:</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          You have already dislked this idea !!
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="OK" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
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
      alertLoging: false,
      alterLike: false,
      alterDislike: false,
      currentIdeaId: -1, // which idea the user gonna comment
      categorie: null,
      currentCategory: "All Categories",
      publishDialog: false,
      ideaName: "",
      categoriesOptions: [
      ],
      editor: 'Describe your idea here',
      ideas: [],
      id: 0,
      nbLike: 0,
      commentDialog: false,
      comments: [],
      donationDialog: false,
      stillLooking: true,
      donnationId: -1,
      totalAmount: []
    }
  },

  methods: {
    triggerCommentDialog(id) {
      if (!this.userIsLogged) {
        this.alertLoging = true;
        return ;
      }
      this.commentDialog = true;
      this.currentIdeaId = id;
    },
    triggerDonationDialog() {
      if (!this.userIsLogged) {
        this.alertLoging = true;
        return ;
      }
      this.donationDialog = true;
    },
    handlePublishIdea() {
      if (!this.userIsLogged) {
        this.alertLoging = true;
        return ;
      }
      this.publishDialog = true;
      this.triggerFocus();
    },
    dislikePost(id) {
      if (!this.userIsLogged) {
        this.alertLoging = true;
        return ;
      }
      if (StorageService.getUser() && StorageService.getUser().idUser) {
      let vm = this;
        api.dislikePost(id).then(response => {
          console.log('response disliking post=', response);
          if (response.data === true) {
            vm.ideas.find(div => div.id === id).likesCount = vm.ideas.find(div => div.id === id).likesCount - 1;
            vm.alterDislike = false;
          } else {
            console.log('returning false');
            vm.alterDislike = true;
          }
        }).catch((err) => {
          console.warn("error while disliking post with id =", id, ", the error is  ",err);
        });
      }
    },
    likePost(id) {
      if (!this.userIsLogged) {
        this.alertLoging = true;
        return ;
      }
      let vm = this;
      if (StorageService.getUser() && StorageService.getUser().idUser) {
        api.likePost(id).then(response => {
          // console.log('response liking post=', response);
          if (response.data === true) {
            vm.ideas.find(div => div.id === id).likesCount = vm.ideas.find(div => div.id === id).likesCount + 1;
            vm.alterLike = false;
          } else {
            vm.alterLike = true;
          }
        }).catch((err) => {
          console.warn("error while liking post with id =", id, ", the error is  ",err);
        });
      }
    },
    getAmountId(id) {
      const findPost = this.totalAmount.find(t => t.id === id);
      if (!findPost) {
        return 0;
      }
      return findPost.amount;
    },
    submitDonation(payload) {
      // console.log('donation submited successfuly');
      if (payload && payload.id) {
          console.log('post donation id =', payload.id);
          if (!this.totalAmount.find(t => t.id === payload.id)) {
            this.totalAmount.push({
              amount: payload.amount,
              id: payload.id
            });
          } else {
            const modified = this.totalAmount.find(t => t.id === payload.id);
            modified.amount += payload.amount;
          }
      }
      this.donationDialog = false;
    },
    triggerFocus() {
      let vm = this;
      setTimeout(function () {
        vm.$refs.ideaName.focus();
      }, 100);
    },
    submitComment(payload) {
      // console.log('payload =', payload,"     currentIdeaId =", this.currentIdeaId);
      let vm = this;
      vm.commentDialog = false;
      if (payload && vm.currentIdeaId !== -1) {
        let mail = (StorageService.getUser() && StorageService.getUser().email) ? StorageService.getUser().email : 'Anonymous e-mail';
        let lastName = (StorageService.getUser() && StorageService.getUser().lastName) ? StorageService.getUser().lastName : 'Anonymous person';
        api.commentPost(vm.currentIdeaId, payload).then(response => {
          // console.log('response =', response);
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
      api.loading("Chargement en cours");
      let mail = (StorageService.getUser() && StorageService.getUser().email) ? StorageService.getUser().email : 'Anonymous e-mail';
      api.sendPost(this.categorie, this.editor, this.ideaName).then(response => {
        // console.log("response =", response);
        vm.ideas.push({
          "id": response.data.idPost,
          "content": response.data.content,
          "subject": (response.data.subject) ? response.data.subject : 'No subject found' ,
          "category": response.data.category,
          "comments": [],
          "likesCount": 0,
          "userEmail": response.data.userEmail
        });
        api.finishedLoading();
      }).catch((err) => {
        console.warn("error while sending the post to the server ", err);
        api.finishedLoading();
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
    },
    fetshPostOfAllCategorys() {
      let vm = this;
      api.loading("Chargement en cours");
      api.getPosts().then(response => {
        vm.ideas = [];
        console.log('response all categories =', response);
        for(let div of response.data) {
          // console.log('div.comments =', div.comments);
          vm.ideas.push({
            "id": div.idPost,
            "content": div.content,
            "subject": (div && div.subject) ? div.subject : 'No subject found',
            "category": div.category,
            "comments": div.comments,
            "likesCount": div.likesCount,
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
    },
    fetshCategories() {
      api.fetshCategories()
      .then(response => response.data)
      .then(categories => this.categoriesOptions = [...categories.map(div => div.name)])
      .catch((err) => {
        console.warn('error fetshing all categories');
      });
    }
  },
  computed: {
    noResult() {
      if (this.stillLooking) {
        return false;
      }
      return this.ideas.length === 0;
    },
    userIsLogged() {
      return StorageService.getUser() && StorageService.getUser() !== null;
    },
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
      // console.log('res =', this.currentCategory);
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
      // console.log('dans le donnation dialog computed', this.donationDialog);
      return this.donationDialog;
    }
  },
  mounted() {
    if (this.$router.history.current.query && this.$router.history.current.query.publish) {
      this.publishDialog = true;
    }
  },
  created() {
    this.fetshPostOfAllCategorys();
    this.fetshCategories();
  },
  watch: {
    $route(to, from) {
      let vm = this;
      if (this.$router.history.current.query && this.$router.history.current.query.category) {
        this.currentCategory = this.$router.history.current.query.category;
        api.loading("Chargement en cours");
        api.findPostByCategory(vm.currentCategory).then(response => {
          // console.log('response of current category ', response);
          vm.ideas = [];
          for(let div of response.data) {
            vm.ideas.push({
              "id": div.idPost,
              "content": div.content,
              "subject": (div && div.subject) ? div.subject : 'No subject found',
              "category": div.category,
              "comments": div.comments,
              "likesCount": div.likesCount,
              "userEmail": div.userEmail
            });
          }
          api.finishedLoading();
        }).catch((err) => {
          console.warn("can't fetch posts from dataBase ", err);
          api.finishedLoading();
          this.$q.notify({
            message: 'An error has occurred while fetching post of ' + vm.currentCategory,
            color: 'red-7',
            textColor: 'white',
            icon: 'warning'
          });
        });
      } else {
        this.currentCategory = "All Categories";
        vm.fetshPostOfAllCategorys();
      }
    }
  }
}
</script>
<style scoped>
  .background-landing {
    background: #F0C27B;  /* fallback for old browsers */
    background: -webkit-linear-gradient(to right, #4B1248, #F0C27B);  /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to right, #4B1248, #F0C27B); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  }
  .card-color {
    background: #00bf8f;  /* fallback for old browsers */
    background: -webkit-linear-gradient(to right, #001510, #00bf8f);  /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to right, #001510, #00bf8f); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  }
</style>
