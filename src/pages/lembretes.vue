<template>
  <q-page class="relative-position">
    <q-scroll-area class="absolute full-width full-height">
      <div class="q-py-lg q-px-md row items-end q-col-gutter-md">
        <div class="col">
          <q-input
            bottom-slots
            class="textRev"
            v-model="textRev"
            placeholder="Lembrete de revisão"
            counter
            maxlength="280"
            autogrow
            clearable
          >
              <template v-slot:before>
                <q-avatar>
                  <q-icon name="account_circle" size="lg"/>
                </q-avatar>
              </template>
          </q-input>
        </div>
        <div class="col col-shrink">
          <q-btn
            class="q-mb-md"
            :disable="!textRev"
            unelevated
            rounded no-caps
            color="primary"
            label="Salvar"
            @click="addNewCommentRev()"
          />
        </div>
      </div>
      <q-separator
        class="separator"
        size="10px"
        color="grey-2"
      />
      <q-list separator>
        <transition-group
          appear
          enter-active-class="animated fadeIn slower"
          leave-active-class="animated fadeOut slower"
        >
          <q-item
            class="comment q-py-md"
            v-for="(item) in revCommentsList"
            :key="item.id"
          >
            <q-item-section avatar top>
              <q-avatar size="xl" color="primary text-white">
                <span>{{ firtsLetters(item.idDisciplina) }}</span>
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-subtitle1">
                <strong>{{ item.title }}</strong>
                <span class="q-ml-sm text-grey-7">
                  {{ item.idDisciplina }}
                  <br class="lt-md">&bull;
                  {{ relativeDate(item.date) }}
                </span>
              </q-item-label>
              <q-item-label class="revContent text-body1">
                {{ item.comment }}
              </q-item-label>

              <div class="row justify-end q-mt-sm">
                <q-btn
                  color="grey"
                  icon="far fa-comment"
                  size="sm"
                  flat round
                />
                <q-btn
                  :color="item.favorite ? 'amber' : 'grey'"
                  :icon="item.favorite ? 'fas fa-star':'far fa-star'"
                  @click="toggleLiked(item)"
                  size="sm"
                  flat round
                />
                <q-btn
                  color="grey"
                  icon="fas fa-trash"
                  size="sm"
                  flat round
                  @click="removeComment(item)"
                />
              </div>
            </q-item-section>
          </q-item>
        </transition-group>
      </q-list>
    </q-scroll-area>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { formatDistance } from 'date-fns'
import { db } from 'src/boot/firebase'

export default defineComponent({
  name: 'PageHome',
  data(){
    return{
      textRev: null,
      revCommentsList:[
      ]
    }
  },
  methods:{
    addNewCommentRev(){
      let revNewComment = {
        idDisciplina: "Direito Algum",
        title: "Principio",
        comment:this.textRev,
        favorite: false,
        date: Date.now()
      }

      db.collection('revcomments').add(revNewComment).then(function(docRef) {
        console.log('Document written with ID: ', docRef.id)
      }).catch(function(error) {
        console.error('Error adding document: ', error)
      })

      this.textRev = null
    },
    firtsLetters(item){
      let lettrs = []
      item.split(" ").forEach( x => {
        lettrs.push(x.substr(0, 1))
      })
      return lettrs.join('')
    },
    relativeDate(value){
      return formatDistance(value, new Date())
    },
    removeComment(item){
      db.collection('revcomments').doc(item.id).delete().then(function() {
        console.log('Document successfully deleted!');
      }).catch(function(error) {
        console.error('Error removing document: ', error);
      })
    },
    toggleLiked(item) {
      db.collection('revcomments').doc(item.id).update({
        favorite: !item.favorite
      })
      .then(function() {
        console.log('Document successfully updated!')
      })
      .catch(function(error) {
        // The document probably doesn't exist.
        console.error('Error updating document: ', error)
      })
    }
  },
  mounted(){
    db.collection('revcomments').onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        let commentChange = change.doc.data()
        commentChange.id = change.doc.id
        if(change.type === 'added'){
          this.revCommentsList.unshift(commentChange)
        }
        if(change.type === 'modified'){
          let index = this.revCommentsList.findIndex(item => item.id == commentChange.id)
          Object.assign(this.revCommentsList[index], commentChange)
        }
        if(change.type === 'removed'){
          let index = this.revCommentsList.findIndex(item => item.id == commentChange.id)
          this.revCommentsList.splice(index, 1)
        }
      })
    })
  }
})
</script>

<style lang="scss">
.textRev textarea{
  font-size: 19px;
  line-height: 1.4 !important;
}
.separator{
  border-top: 1px solid;
  border-bottom: 1px solid;
  border-color: $grey-4;
}
.revContent {
  white-space: pre-line;
}
.comment:not(:first-child){
  border-top: 1px solid rgba(0, 0, 0, 0.12)
}
</style>
