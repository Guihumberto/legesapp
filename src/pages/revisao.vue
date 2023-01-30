<template>
  <q-page class="relative-position q-mx-auto" style="max-width: 1880px">
    <q-scroll-area class="absolute full-width full-height">

      <!-- <q-separator
        class="separator"
        size="10px"
        color="grey-2"
      /> -->

      <!-- listagem de comentarios -->
      <q-list separator v-if="commentList.length" bordered>
        <transition-group
          appear
          enter-active-class="animated fadeIn slower"
          leave-active-class="animated fadeOut slower"
        >
          <q-item
            class="comment q-py-md"
            v-for="(item, i) in commentListFilter"
            :key="i"
            clickable
            v-ripple
            @click="cardCall(i)"
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

              <q-item-label><small>
                Assunto: {{ item.subject }}</small>
              </q-item-label>

              <q-item-label class="revContent text-body1">
                {{ item.text }}
              </q-item-label>

              <div class="row justify-between q-mt-sm">
                <div v-if="item.tofile">
                  <q-btn outline color="grey" label="Arquivada" size="sm" />
                  <q-btn
                    flat
                    color="green-4"
                    icon="drive_folder_upload"
                    title="Desarquivar"
                    dense
                    no-caps
                    @click="toFileComment(item, false)"
                    />

                </div>
                <div v-else></div>
                <div>
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
                    :disable="item.tofile"
                    flat round
                    title="arquivar"
                    @click="toFileComment(item, true)"
                  />
                  <q-btn
                    :color="item.favorite ? 'amber' : 'grey'"
                    :icon="item.favorite ? 'fas fa-star':'far fa-star'"
                    @click="favoriteItem(item)"
                    size="sm"
                    flat round
                  />
                </div>
              </div>
            </q-item-section>

          </q-item>
        </transition-group>
        <q-item v-if="!commentListFilter.length && commentList.length" class="bg-red-3 text-white">
          <q-item-section>
            <q-item-label class="text-subtitle1">
              Existem cards de revisao arquivados!!
            </q-item-label>
            <q-item-label class="text-caption">
              Marque a caixa de "incluir arquivadas", no botao de filtro abaixo, para mostrar no painel.
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      <div class="bg-red-2" v-else rounded>
        <div class="absolute-center">
          <q-icon
            size="80px"
            name="do_disturb_alt"
            color="red-3"
            class="absolute-center"
            style="z-index: -1"
          />
          <br>
          <p class="text-caption text-grey text text-center">Não há lembretes de revisao cadastrados.</p>
        </div>
      </div>
    </q-scroll-area>
    <q-dialog v-model="cardsAR">
      <q-card>
        <cards :comments="commentListFilter" :cardSelect="cardSelect" />
      </q-card>
    </q-dialog>
    <q-dialog v-model="showAddFastRev" persistent>
      <addFastRev @close="showAddFastRev = false" />
    </q-dialog>

    <q-dialog v-model="showFilters" position="bottom">
      <q-card style="width: 350px">
        <q-linear-progress :value="1" color="pink" />

        <q-card-section class="row items-center no-wrap">
           <!-- filtros -->
        <div class="q-pa-md">
          <q-item-label class="text-overline q-pb-sm">Filtros</q-item-label>
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
          </div>

        </div>
        </q-card-section>
      </q-card>
    </q-dialog>

     <!-- btn add task and filters -->
    <div class="absolute-bottom text-center q-mb-sm no-pointer-events">
      <ballon
        class="all-pointer-events"
        @closeTipsBallon="noMoreTips()"
        v-if="tipsBallon"
      />
      <q-fab @click="ballonTips = false" color="purple" icon="keyboard_arrow_up" class="all-pointer-events" direction="up">
          <q-fab-action
            class="all-pointer-events"
            round color="green" icon="add" size="18px" @click="showAddFastRev = true" />
          <q-fab-action
            class="all-pointer-events q-ml-sm"
            :disable="!commentList.length"
            round color="grey" :icon="commentList.length ? 'filter_alt' : 'filter_alt_off'" size="18px" @click="showFilters = true" />
      </q-fab>
    </div>


    <!-- toogle cadrs -->
    <div class="absolute-top-right text-center q-mb-sm no-pointer-events q-pa-xs bg-grey-4" v-if="commentListFilter.length">
        <q-toggle
              v-model="cardsAR"
              class="all-pointer-events"
              color="green"
              label="Cards"
              :disable="!commentListFilter.length"
            />
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import cards from 'components/comments/cards.vue'
import ballon from 'components/tutorial/dialogs/reviBtn.vue'
import addFastRev from 'components/comments/addFastRev.vue'
import mixinHighlightDateFormat from '../mixins/date-format'
import { useCommentsStore } from 'stores/CommentsStore'
const commentStore = useCommentsStore()
import { useSettingStore } from 'stores/SettingsStore'
const settings = useSettingStore()


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
      showFilters: false,
      toFile: false,
      cardSelect: null
    }
  },
  components:{
    cards,
    addFastRev,
    ballon
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
    },
    tipsBallon(){
      return settings.readSettings.tutorial.rev
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
    toFileComment(item, value){
      item.tofile = value
      commentStore.fbUpdatePlan(item)
    },
    noMoreTips(){
      settings.setTipsRev(false)
    },
    cardCall(item){
      this.cardSelect = item
      this.cardsAR = true
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
