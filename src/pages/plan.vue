<template>
  <q-page class="bg-grey-3  q-mx-auto" style="max-width: 1800px">
    <div class="q-pa-md absolute full-width full-height column" >
      <template v-if="showMe">
        <h5 class="q-my-md">Planejamento</h5>
        <q-card class="q-pa-md" flat bordered>

          <div class="row">
           <q-input
              outlined
              dense
              v-model="plan.title"
              @keyup.esc="plan.title = ''"
              @keydown.enter.stop="addPlan(plan)"
              label="Plano semanal"
              placeholder="Digite um título para seu plano de estudos. Ex. Semana 01"
              class="col"
              :rules="[val => !!val || 'Campo Obrigatório']"
              clearable
            />
          </div>

        </q-card>
        <q-separator class="q-my-md" />
        <q-scroll-area class="scroll-area-task">
          <div class="row items-start q-gutter-md" v-if="plans.length">
            <transition-group
              appear
              enter-active-class="animated fadeIn slower"
              leave-active-class="animated fadeOut slower"
            >
              <q-card
                class="my-card"
                v-for="(item, i) in plans"
                :key="i"
              >
                <q-card-section class="text-white q-pb-sm" :class="deleteId != item.dateCreate ? 'bg-blue-5' : 'bg-red-4'">
                  <div class="row items-start no-wrap">
                    <div class="col">
                      <template v-if="editId != item.dateCreate">
                        <div
                        class="text-h6"
                        >
                          {{item.title}}
                        </div>
                        <div class="text-subtitle2 row">
                          <span>{{item.concurso}}</span>
                          <q-space />
                          <span>{{ item.dueDate }}</span>
                        </div>
                      </template>

                      <template v-else>
                        <div>
                          <q-input
                            label="Título"
                            label-color="white"
                            dense
                            class="q-mb-sm full-width"
                            color="white"
                            v-model="plan.title"
                            @keydown.enter="planner.fbUpdatePlan(plan), editId = null, clearPlan()"
                           />
                        </div>
                        <div class="text-subtitle2 row">
                            <q-input
                              label="Concurso"
                              label-color="white"
                              dense
                              class="q-mb-sm full-width"
                              color="white"
                              v-model="plan.concurso"
                              @keydown.enter="planner.fbUpdatePlan(plan), editId = null, clearPlan()"
                            />
                        </div>
                      </template>
                    </div>

                    <div class="col-auto" v-if="editId != item.dateCreate && deleteId != item.dateCreate">
                      <q-btn color="white" round flat icon="more_vert">
                        <q-menu cover auto-close>
                          <q-list>
                            <q-item clickable @click="editTask(item)">
                              <q-item-section>Editar</q-item-section>
                            </q-item>
                            <q-item clickable @click="deleteId = item.dateCreate, editId = null">
                              <q-item-section>Apagar</q-item-section>
                            </q-item>
                          </q-list>
                        </q-menu>
                      </q-btn>
                    </div>
                  </div>
                </q-card-section>

                <q-separator color="grey" />

                <q-card-actions
                  v-if="deleteId != item.dateCreate && editId != item.dateCreate"
                  class="q-px-sm"
                >
                    <q-btn round flat dense color="purple" icon="info_outline">
                      <q-menu>
                        <div class="row no-wrap q-pa-md bg-grey-4">
                          <div class="column">
                            <div class="text-h6 q-mb-md">Informações</div>
                            Data da Criação: {{  dateFormat(item.dateCreate)}} <br>
                          <span v-if="item.dateLastAcess"> Último acesso:{{ dateFormat(item.dateLastAcess) }}</span>
                          </div>

                          <q-separator vertical inset class="q-mx-lg" />

                          <div class="column items-center">
                            <div class="text-h6">{{ item.concurso }}</div>
                           <div class="text-subtitle1">{{ item.title }}</div>

                           <q-chip :color="!item.status ? 'orange':'grey'" text-color="white" icon="event">
                            {{!item.status? "Não Iniciado": "Em andamento"}}
                            </q-chip>
                          </div>
                        </div>
                      </q-menu>
                    </q-btn>
                    <q-space />
                    <q-btn dense outline color="primary" icon="chevron_right" @click="goTo(item)"/>
                </q-card-actions>
                <q-card-actions v-else-if="editId == item.dateCreate">
                  <q-space />
                  <q-btn color="primary" dense label="Editar" @click="planner.fbUpdatePlan(plan), editId = null, clearPlan()" />
                  <q-btn outline="" dense color="grey" label="Cancelar" @click="editId = null" />

                </q-card-actions>
                <q-card-actions class="bg-red-5" v-else>
                  <div class="col text-bold text-white" >APAGAR?</div>
                  <q-space></q-space>
                  <q-btn @click="planner.fbDeletePlan(item), deleteId = null" color="white" class="col text-red">Sim</q-btn>
                  <q-btn outline  class="col text-white" @click="deleteId = null">Não</q-btn>
                </q-card-actions>
              </q-card>
            </transition-group>
          </div>
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
              <p class="text-caption text-grey text text-center">Não há planos de estudos cadastrados.</p>
            </div>
          </div>
        </q-scroll-area>
      </template>
      <template v-else>
        <span class="absolute-center">
          <q-spinner
            color="primary"
            size="5em"
          />
        </span>
      </template>
    </div>
  </q-page>
</template>

<script>
  import { usePlanStore } from 'stores/planStore'
  import mixinHighlightDateFormat from '../mixins/date-format'

  const planner = usePlanStore()

  export default {
    mixins:[mixinHighlightDateFormat],
    data(){
      return{
        planner,
        editId: null,
        showInfoPlan: false,
        deleteId: null,
        plan:{
          title: '',
          concurso: 'Geral',
          dueDate: '',
        },
      }
    },
    computed:{
      plans(){
        return planner.readPlans
      },
      showMe(){
        return this.planner.readDowloadComplete
      }
    },
    methods:{
      addPlan(item){
        planner.addPlan(item)
        this.clearPlan()
      },
      editTask(item){
        this.deleteId = null
        this.editId = item.dateCreate
        this.plan = {
          dateCreate: item.dateCreate,
          title: item.title,
          concurso: item.concurso,
          dueDate: item.dueDate,
        }
      },
      clearPlan(){
        this.plan ={
          title: '',
          concurso: 'Geral',
          dueDate: '',
        }
      },
      goTo(item){
        planner.saveDateLastAcess(item)
        this.$router.push(`plan/tasks/${item.dateCreate}`)
      }
    },
  }
</script>

<style scoped>
.scroll-area-task{
  display: flex;
  flex-grow: 1;
}
.my-card{
  width: 100%;
  max-width: 400px;
}


</style>
