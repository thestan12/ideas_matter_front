<template>
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
</template>

<script>
export default {
  name: 'commentsCreator',
  props:["commentDialog"],
  data() {
    return {
      comments: "",
      editorComment: "Type your comment here !"
    }
  },
  methods: {
    submitComment() {
      this.$emit('submited', this.editorComment);
      this.editorComment = "Type your comment here !";
    },
  },
  computed: {

  },
  mounted() {

  }
}

</script>
