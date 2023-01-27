<template>
  <q-page class="relative-position q-mx-auto" style="max-width: 1880px">
    <q-scroll-area class="absolute full-width full-height">
      <!-- filtros -->
      <div class="q-pa-md">
        <div class="row justify-between">
          <q-select
            class="col q-mb-sm" dense
            v-model="searchDisciplina"
            :options="filterDisicplinas"
            option-label="name"
            option-value="id"
            label="Disciplina"
            filled
          />
          <q-btn
            class="q-ml-sm"
            dense
            color="grey"
            :icon="reverse ? 'keyboard_double_arrow_up' : 'keyboard_double_arrow_down'"
            @click="reverse = !reverse"
          />
        </div>
        <div class="row justify-between">
          <q-checkbox
             v-model="searcMarkFav"
             label="Apenas marcadas como favoritas"
           />
           <q-checkbox
             v-model="toFile"
             label="Incluir as arquivadas"
           />
           <q-toggle
             v-model="cardsAR"
             color="green"
             label="Cards"
             :disable="!commentListFilter.length"
           />
        </div>

      </div>
      <q-separator
        class="separator"
        size="10px"
        color="grey-2"
      />

      <!-- listagem de comentarios -->
      <q-list separator v-if="commentList.length">
        <transition-group
          appear
          enter-active-class="animated fadeIn slower"
          leave-active-class="animated fadeOut slower"
        >
          <q-item
            class="comment q-py-md"
            v-for="(item, i) in commentListFilter"
            :key="i"
          >
            <q-item-section avatar top>
              <q-avatar size="xl" :color="item.disciplina == 99 ? 'red' : 'primary'" class="text-white">
                <span>{{ firtsLetters(item.disciplina) }}</span>
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-subtitle1">
                <strong>{{ item.title }}</strong>
                <small class="q-ml-sm text-grey-7">
                 {{ dateFormat(item.dateCreate) }}
                </small>
              </q-item-label>
              <q-item-label><small>Assunto: {{ item.subject }}</small></q-item-label>
              <q-item-label class="revContent text-body1">
                {{ item.text }}
              </q-item-label>

              <div class="row justify-end q-mt-sm">
                <q-btn
                  color="grey"
                  icon="edit"
                  size="sm"
                  flat round
                />
                <q-btn
                  color="grey"
                  icon="save_alt"
                  size="sm"
                  flat round
                  title="arquivar"
                  @click="toFileComment(item)"
                />
                <q-btn
                  :color="item.favorite ? 'amber' : 'grey'"
                  :icon="item.favorite ? 'fas fa-star':'far fa-star'"
                  @click="favoriteItem(item)"
                  size="sm"
                  flat round
                />
              </div>
            </q-item-section>

          </q-item>
        </transition-group>
      </q-list>
      <q-banner class="bg-red-2" v-else rounded>
        <template v-slot:avatar>
          <q-icon name="do_disturb_alt" color="red" />
        </template>
          <span class="text-h6">Não há lembretes de revisao cadastrados.</span>
      </q-banner>
    </q-scroll-area>
    <q-dialog v-model="cardsAR" persistent>
      <q-card>
        <cards :comments="commentListFilter" />
      </q-card>
    </q-dialog>
    <q-dialog v-model="showAddFastRev" persistent>
      <addFastRev @close="showAddFastRev = false" />
    </q-dialog>
    <!-- btn add task -->
    <div class="absolute-bottom text-center q-mb-sm no-pointer-events">
        <q-btn
          class="all-pointer-events"
          round color="green" icon="add" size="18px" @click="showAddFastRev = true" />
      </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import cards from 'components/comments/cards.vue'
import addFastRev from 'components/comments/addFastRev.vue'
import mixinHighlightDateFormat from '../mixins/date-format'
import { useCommentsStore } from 'stores/CommentsStore'
const commentStore = useCommentsStore()

import { useTaskStore } from 'stores/TaskStore'
const taskStore = useTaskStore()

export default defineComponent({
  name: 'PageRev',
  mixins:[mixinHighlightDateFormat],
  data(){
    return{
      revCommentsList:[
      ],
      searchDisciplina: {id:0, name: "Todas"},
      searcMarkFav: false,
      reverse: false,
      cardsAR: false,
      showAddFastRev: false,
      toFile: false
    }
  },
  components:{
    cards,
    addFastRev
  },
  computed:{
    commentList(){
      return commentStore.readComments
    },
    commentListFilter(){

      let list = this.commentList

      if(!this.toFile){
        list = list.filter( x => !x.tofile)
      }


      if(this.searcMarkFav){
        list = list.filter(x => x.favorite)
      }

      if(this.searchDisciplina.id){
        list = list.filter(x => x.disciplina == this.searchDisciplina.id)
      }

      return list
    },
    disciplinas(){
      return taskStore.readDisciplinas
    },
    filterDisicplinas(){
      let list = this.commentList.map(x => x.disciplina)
      list = [...new Set(list)];

      let disciplinas = [
        {id: 0, name: "Todas"}
      ]


      this.disciplinas.forEach(x => {
        list.forEach(y => {
          if(x.id == y){
            disciplinas.push(x)
          }
        })
      })

      return disciplinas
    }
  },
  methods:{
    findDisciplina(value){
      let idDisciplina = value
      let disciplina = this.disciplinas.find( x => x.id == idDisciplina )
      return disciplina
    },
    firtsLetters(item){
      let disciplina = this.findDisciplina(item)

      let lettrs = []
      disciplina.name.split(" ").forEach( x => {
        lettrs.push(x.substr(0, 1))
      })
      return lettrs.join('').toUpperCase()
    },
    favoriteItem(item){
      item.favorite = !item.favorite
      commentStore.fbUpdatePlan(item)
    },
    toFileComment(item){
      item.tofile = true
      commentStore.fbUpdatePlan(item)
    }
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
