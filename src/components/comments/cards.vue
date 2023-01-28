<template>
    <q-carousel
        v-model="slide"
        transition-prev="jump-right"
        transition-next="jump-left"
        swipeable
        animated
        control-color="white"
        prev-icon="arrow_left"
        next-icon="arrow_right"
        navigation-icon="radio_button_unchecked"
        navigation
        padding
        arrows
        height="300px"
        class="text-white shadow-1 rounded-borders"
        :class="answerResponse ? 'bg-purple' : 'bg-primary'"
      >
        <q-carousel-slide :name="i" class="column no-wrap" v-for="item, i in comments" :key="i">
          <q-bar>
            <small>
              {{findDisciplina(item.disciplina) }}
            </small>
            <q-space />
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip class="bg-white text-primary">Close</q-tooltip>
            </q-btn>
            <q-btn dense color="grey-7" round flat icon="more_vert">
              <q-menu cover auto-close>
                <q-list>
                  <q-item clickable @click="answerResponse = false">
                    <q-item-section>
                      <div class="row">
                        <span class="">Estilo Normal</span>
                        <q-icon v-if="!answerResponse" size="17px" name="check" class="q-ml-sm" />
                      </div>
                    </q-item-section>
                  </q-item>
                  <q-item clickable @click="answerResponse = true">
                    <q-item-section>
                      <div class="row">
                        <span class="">Estilo Anki</span>
                        <q-icon v-if="answerResponse" size="17px" name="check" class="q-ml-lg" />
                      </div>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </q-bar>
          <transition-group
            appear
            leave-active-class="animated fadeOut slower"
            enter-active-class="animated fadeIn slower"
          >
            <div key="icon" class="row justify-center q-mt-sm">
              <q-icon :name="answerResponse? 'layers' :'style'" size="56px" />
            </div>

            <div key="ans_resp" class="q-mt-md text-center" v-if="!answerResponse">
              <span class="text-bold">{{ item.title }}</span> <br>
              <span class="text-weight-light"> {{ item.text }}</span>
            </div>
            <div key="ansresp" class="q-mt-md text-center" v-else>
              <span class="text-bold">{{ item.title }}</span> <br>
              <transition
              appear
              leave-active-class="animated fadeOut slower"
              enter-active-class="animated fadeIn slower"
              >
                <div v-if="item.dateCreate == responseId" class="text-weight-light"> {{ item.text }}</div>
              </transition>
              <q-btn
                v-if="item.dateCreate != responseId"
                dense
                class="q-mt-md"
                outline
                color="white"
                icon="check"
                label="Ver resposta"
                @click="showResponse(item)" />
            </div>
          </transition-group>
        </q-carousel-slide>
      </q-carousel>
</template>

<script>
import { useTaskStore } from 'stores/TaskStore'
const taskStore = useTaskStore()
export default {
  props:{
    comments: Array
  },
  data () {
    return {
      slide: 0,
      answerResponse: false,
      responseId: null
    }
  },
  computed:{
    disciplinas(){
      return taskStore.readDisciplinas
    },
  },
  methods:{
    findDisciplina(value){
      let idDisciplina = value
      let disciplina = this.disciplinas.find( x => x.id == idDisciplina )
      return disciplina.name
    },
    showResponse(item){
      this.responseId = item.dateCreate
    }
  }
}
</script>

<style scoped>
.q-carousel{
  padding-left: 10px;
  padding-right: 10px;
  width: 310px;
}

</style>
