<template>
  <q-page class="bg-grey-3">
    <div class="q-pa-md absolute full-width full-height column">
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
          <div class="row items-start q-gutter-md q-mx-auto" style="max-width: 1500px" v-if="plans.length">
            <transition-group
              appear
              enter-active-class="animated fadeIn slower"
              leave-active-class="animated fadeOut slower"
            >
              <q-card
                class="my-card q-mb-md"
                v-for="(item, i) in plans"
                :key="i"
              >
                <q-card-section class="bg-blue-5 text-white q-pb-sm">
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
                        <div class="text-subtitle2 row q-mt-md">
                          <small class="textcaption">Criado em {{ dateFormat(item.dateCreate) }}</small>
                        </div>
                      </template>

                      <template v-else>
                        <div>
                          <q-input
                            label="Título"
                            label-color="orange"
                            dense outlined
                            class="q-mb-sm"
                            color="white"
                            bg-color="white"
                            v-model="plan.title"
                            @keydown.enter="planner.fbUpdatePlan(plan), editId = null, clearPlan()"
                           />
                        </div>
                        <div class="text-subtitle2 row">
                            <q-input
                              label="Concurso"
                              label-color="orange"
                              dense outlined
                              class="q-mb-sm"
                              color="white"
                              bg-color="white"
                              v-model="plan.concurso"
                              @keydown.enter="planner.fbUpdatePlan(plan), editId = null, clearPlan()"
                            />
                        </div>
                      </template>


                    </div>

                    <div class="col-auto">
                      <q-btn color="white" round flat icon="more_vert">
                        <q-menu cover auto-close>
                          <q-list>
                            <q-item clickable @click="editId ? editId = null : editTask(item)">
                              <q-item-section>{{ editId ? 'Cancelar edição' : 'Editar' }}</q-item-section>
                            </q-item>
                            <q-item clickable @click="deleteId ? deleteId = null : deleteId = item.dateCreate, editId = null">
                              <q-item-section>{{deleteId ? 'Cancelar remoção' : 'Apagar'}}</q-item-section>
                            </q-item>
                          </q-list>
                        </q-menu>
                      </q-btn>
                    </div>
                  </div>
                </q-card-section>

                <q-separator color="grey" />

                <q-card-actions v-if="deleteId != item.dateCreate && editId != item.dateCreate">
                    <div>
                      <q-icon name="event" class="q-mr-xs" /><small v-if="item.dateLastAcess">último acesso: <span class="text-italic">{{ dateFormat(item.dateLastAcess) }}</span></small>
                    </div>
                    <q-space />
                    <q-btn outline color="primary" icon="chevron_right" @click="goTo(item)"/>
                </q-card-actions>
                <q-card-actions v-else-if="editId == item.dateCreate">
                  <q-space />
                  <q-btn color="primary" dense label="Editar" @click="planner.fbUpdatePlan(plan), editId = null, clearPlan()" />
                  <q-btn outline="" dense color="grey" label="Cancelar edição" @click="editId = null" />

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
  max-width: 300px;
}


</style>
