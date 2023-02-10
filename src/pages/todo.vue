<template>
  <q-page class="bg-grey-3">
    <div class="q-pa-md absolute full-width full-height column">
      <div>
        <q-btn class="q-px-none" flat color="primary" icon="chevron_left" label="voltar" to="/plan" />
      </div>
      <searchBar @search="search = $event" />

      <q-separator class="q-my-md"  v-if="tasks.length"/>

      <!-- sort by -->
      <div
        v-if="tasks.length || tasksComplete.length"
        class="row"
      >
        <q-select
          filled
          v-model="orderBy"
          class="col"
          :options="options"
          option-label="name"
          option-value="value"
          label="Organizado por" dense
        />

        <q-space />
        <q-btn
          flat
          color="primary"
          icon="update"
          title="Adicionar itens marcados para revisao"
          no-caps
          @click="showMarkRev = true"
          :disable="!listMarkRev.length"
        />
      </div>

      <q-separator class="q-my-md"></q-separator>

      <q-scroll-area class="scroll-area-task">
        <!-- lista pendente -->
        <q-list
          bordered
          separator
          v-if="tasks.length"
        >
          <q-item-label
            header
            class="text-bold text-subtitle1 bg-orange-4 text-white text-center"
          >
          Tarefas
          </q-item-label>
          <transition-group
              appear
              enter-active-class="animated fadeIn slower"
              leave-active-class="animated fadeInOut slower"
           >

            <q-item
              v-for="(task, i) in tasks" :key="i"
              @click="updateTask(task)"
              clickable
              v-ripple
              :class="deleteId == task.id ? 'bg-red-3' : task.complete ? 'bg-green-1': 'bg-orange-1'"
            >
              <!-- delete -->
              <q-item-section v-if="deleteId == task.id">
                Tem certeza que deseja apagar esta tarefa?
              </q-item-section>

              <q-item-section side v-if="deleteId == task.id">
                <div class="row">
                  <q-btn
                    dense color="red"
                    @click.stop="deleteTask({id:task.id, planId: task.planId})"
                  >Excluir</q-btn>
                  <q-btn
                    dense
                    class="q-ml-sm"
                    flat
                    @click.stop="deleteId = null"
                  >Cancelar</q-btn>
                </div>
              </q-item-section>


              <!-- Listagem normal -->
              <q-item-section
                v-if="deleteId != task.id"
                side top>
                <q-checkbox v-model="task.complete" />
              </q-item-section>
              <q-item-section
                v-if="deleteId != task.id"
              >
              <q-item-label>
                {{ task.disciplina.name}}
              </q-item-label>
              <q-item-label
                caption
                :class="{'text-strike' : task.complete}"
                v-html="$options.filters.searchHighlight(task.title, search)"
              />

              </q-item-section>
              <!-- date -->
              <q-item-section
                v-if="deleteId != task.id"
                side
                center
                class="gt-sm"
              >
                <div class="row">

                  <div class="column justify-center">
                    <q-item-label
                      class="row justify-end"
                      caption
                    >
                      <small>{{ dateFormat(task.dueDate) }}</small>
                    </q-item-label>
                  </div>
                  <div class="column justify-center">
                    <q-icon color="grey-6" name="event" size="16px" class="q-ml-xs" />
                  </div>
                </div>
              </q-item-section>

               <!-- btn comment e more options -->
               <q-item-section
                side
                center
                v-if="deleteId != task.id"
              >
                <div>
                  <q-btn
                    icon="sticky_note_2"
                    flat
                    round
                    dense
                    color="grey-6"
                    @click.stop="setDataComment(task)"
                  />

                  <q-btn color="grey-7" round flat icon="more_vert" @click.stop="editId = null">
                    <q-menu cover auto-close>
                      <q-list separator>
                        <q-item clickable  @click.stop="editDialogOpen(task)">
                          <q-item-section avatar>
                            <q-icon name="edit" color="grey" />
                          </q-item-section>
                          <q-item-section>Editar</q-item-section>
                        </q-item>
                        <q-item clickable @click.stop="deleteId = task.id, editId = null">
                          <q-item-section avatar>
                            <q-icon name="delete"  color="grey"  />
                          </q-item-section>
                          <q-item-section>Excluir</q-item-section>
                        </q-item>
                        <q-item clickable @click="markRevEdit(task)">
                          <q-item-section avatar>
                            <q-icon :name="task.isRev ? 'check' : 'close'"  color="grey"  />
                          </q-item-section>
                          <q-item-section>Revisão</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-btn>
                </div>

              </q-item-section>

              <!-- tela de edição -->
              <q-dialog
                v-model="edit"
                persistent
              >
                <q-card style="width: 700px; max-width: 80vw;">
                  <q-card-section class="bg-primary text-white q-py-sm">
                    <div class="row">
                      <div class="text-h6">Editar</div>
                      <q-space></q-space>
                      <q-btn
                        icon="close"
                        flat
                        @click="editClear()"
                      />
                    </div>
                  </q-card-section>

                  <q-card-section class="q-pt-none">
                    <q-form class="q-pa-md" @submit.prevent="editTask(taskModel)">
                      <q-select
                        v-model="taskModel.disciplina"
                        :options="disciplinas"
                        option-label="name"
                        option-value="id"
                        label="Disciplina"
                        outlined dense
                        :rules="[val => !!val || 'Campo Obrigatório']"
                      />
                      <q-input
                        label="Tarefa"
                        class="q-mt-sm"
                        outlined dense
                        v-model="taskModel.title"
                        :rules="[val => !!val || 'Campo Obrigatório']"
                      />
                      <q-input
                        label="Descrição"
                        class="q-mt-sm"
                        outlined dense
                        v-model="taskModel.description"
                        autogrow
                        maxlength="280"
                        counter clearable
                        placeholder="Descrição da tarefa"
                      />
                      <q-card bordered class="q-pa-sm" flat>
                        <span class="q-mb-sm">Tipo de Estudo</span>
                        <q-option-group
                          :options="typesStudy"
                          type="radio"
                          v-model="taskModel.typeStudy"
                        />
                      </q-card>
                      <q-checkbox
                      dense
                        class="q-mt-md"
                        v-model="taskModel.markRev"
                        label="Marcar para revisão"
                      />
                      <div class="row q-mt-md">
                        <q-space></q-space>
                        <q-btn flat label="Cancelar" @click="editClear()" />
                        <q-btn
                          color="primary"
                          type="submit"
                        >
                          Editar
                        </q-btn>
                      </div>
                    </q-form>
                  </q-card-section>
                </q-card>
              </q-dialog>

              <!-- tela de comentarios -->
              <q-dialog
                v-model="showComments"
                persistent
                maximized
                transition-show="slide-up"
                transition-hide="slide-down"
              >
                <commentDialog :setComment="setComment"/>
              </q-dialog>

            </q-item>
          </transition-group>
        </q-list>

        <avisos
          v-else
          :text="task.searchTask ? 'Não foram encontradas tarefas para o termo buscado' : 'Não há tarefas pendentes'"
          :bgColor="task.searchTask ? 'bg-red-2' : 'bg-blue-2'"
          :icon="task.searchTask ? 'do_disturb_alt' : 'check'"
          class="sobrepor"
        />

        <!-- lista complçeted -->
        <q-list
          separator
          :class="{ 'q-mt-lg' : !setting.readSettings.showTaskOneList }"
          v-if="tasksComplete.length"
        >
          <q-item-label
            class="text-bold text-subtitle1 bg-green-4 text-white text-center"
            v-if="!setting.readSettings.showTaskOneList"
            header
          >Concluídas</q-item-label>
          <transition-group
              appear
              enter-active-class="animated fadeIn slower"
              leave-active-class="animated fadeOut slower"
           >

            <q-item
              v-for="(task, i) in tasksComplete" :key="i"
              @click="updateTask(task)"
              v-ripple
              clickable
              class=" bg-grey-4"
            >
              <!-- Listagem normal -->
              <q-item-section side top>
                <q-checkbox v-model="task.complete" />
              </q-item-section>

              <q-item-section>
                <q-item-label
                  :class="{'text-strike' : task.complete}"
                  v-html="$options.filters.searchHighlight(task.title, search)"
                >
                </q-item-label>
                <q-item-label caption>
                  {{ task.description}}
                </q-item-label>
              </q-item-section>


              <q-item-section
                side
                center
                class="gt-sm"
              >
                <div class="row">

                  <div class="column justify-center">
                    <q-item-label
                      class="row justify-end"
                      caption
                    >
                      <small>{{ dateFormat(task.dueDate) }}</small>
                    </q-item-label>
                  </div>
                  <div class="column justify-center">
                    <q-icon color="grey-6" name="event" size="16px" class="q-ml-xs" />
                  </div>
                </div>
              </q-item-section>


            </q-item>
          </transition-group>
        </q-list>
      </q-scroll-area>

      <div v-if="!tasks.length && !tasksComplete.length">
        <div class="absolute-center">
          <q-icon
            size="80px"
            name="do_disturb_alt"
            color="grey-5"
            class="absolute-center"
            style="z-index: -1"
          />
        </div>
      </div>

      <!-- tela de add Task  -->
      <q-dialog
        v-model="showAddTask"
      >
        <q-card style="width: 700px; max-width: 80vw;">
          <q-card-section class="bg-green text-white q-py-sm">
            <div class="row">
              <div class="text-h6">Adicionar nova tarefa</div>
              <q-space></q-space>
              <q-btn
                icon="close"
                flat
                @click="showAddTask = false"
              />
            </div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-form class="q-pa-md" @submit.prevent.stop="addTask(taskModel)">
              <div class="row">
                <q-select
                  class="col"
                  v-model="taskModel.disciplina"
                  :options="disciplinas"
                  option-label="name"
                  option-value="id"
                  label="Disciplina"
                  outlined dense
                  :rules="[val => !!val || 'Campo Obrigatório']"
                  v-if="!addDisciplina"
                />
                <q-input
                  class="col"
                  dense v-else
                  type="text"
                  label="Disciplina"
                  :rules="[val => !!val || 'Campo Obrigatório']"
                  autofocus
                  placeholder="Digite o nome da disciplina"
                  clearable
                  v-model="disciplinaName"
                />
                <q-icon size="lg" name="save" color="green"  v-if="addDisciplina" @click="insertDisciplinaList(disciplinaName)" />
                <q-icon @click="addDisciplina = !addDisciplina" size="lg" :color="addDisciplina ? 'red' : 'primary'" :name=" addDisciplina ? 'do_disturb_on' : 'control_point'" title="adicionar disciplina" />
              </div>
              <q-input
                outlined dense
                v-model="taskModel.title"
                @keyup.esc="taskModel.title = ''"
                label="Tarefa"
                placeholder="Digite um título para sua tarefa ex. atos administrativos"
                class="col q-mr-sm q-mt-sm"
                :rules="[val => !!val || 'Campo Obrigatório']"
                clearable
              />
              <q-input
                label="Descrição"
                class="q-mt-sm"
                outlined dense
                v-model="taskModel.description"
                autogrow
                maxlength="280"
                counter clearable
                placeholder="Descrição da tarefa"
              />
              <q-card bordered class="q-pa-sm" flat>
                <span class="q-mb-sm">Tipo de Estudo</span>
                <q-option-group
                  :options="typesStudy"
                  type="radio"
                  v-model="taskModel.typeStudy"
                />
              </q-card>
              <q-checkbox
               dense
                class="q-mt-md"
                v-model="taskModel.markRev"
                label="Marcar para revisão"
              />
              <div class="row q-mt-md">
                <q-space></q-space>
                <q-btn
                  color="green"
                  type="submit"
                >
                  Salvar
                </q-btn>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>

      <q-dialog v-model="showMarkRev">
        <markrevDialog :marksrevlist="listMarkRev" @closeMarkrev="showMarkRev = false"/>
      </q-dialog>

      <!-- btn add task -->
      <div class="absolute-bottom text-center q-mb-sm no-pointer-events">
        <q-btn
          class="all-pointer-events"
          round color="green" icon="add" size="18px" @click="showAddTask = !showAddTask" />
      </div>
    </div>
  </q-page>
</template>

<script>
  import { useTaskStore } from 'stores/TaskStore'
  import { useSettingStore } from 'stores/SettingsStore'
  import { userMarkrevStore } from 'stores/MarkRevStore'

  import mixinHighlightDateFormat from '../mixins/date-format'
  import avisos from '../components/tasks/avisos.vue'
  import searchBar from '../components/tasks/searchBar.vue'
  import commentDialog from '../components/comments/dialog.vue'
  import markrevDialog from '../components/tasks/markrevDialog.vue'

  const task = useTaskStore()
  const setting = useSettingStore()
  const markrevStore = userMarkrevStore()

  export default {
    mixins:[mixinHighlightDateFormat],
    data(){
      return{
        planId: this.$route.params.id,
        addDisciplina: false,
        disciplinaName: null,
        showAddTask: false,
        showComments: false,
        showMarkRev: false,
        setComment: {},
        taskModel:{
          planId: this.$route.params.id,
          title: null,
          description: "",
          complete: false,
          dueDate: Date.now(),
          disciplina: null,
          isRev: false,
          markRev: false,
          typeStudy: 0
        },
        typesStudy: [
          { label: 'Outros', value: 0, color: 'red' },
          { label: 'PDF/Leitura', value: 1, color: 'green' },
          { label: 'Vídeo/Audio', value: 2, color: 'green' },
          { label: 'Questões', value: 3, color: 'green' }
        ],
        deleteId: null,
        edit: false,
        editId: null,
        task: task,
        reverse: false,
        orderBy: 'title',
        model: null,
        options: [
          {
            name: 'Título da tarefa',
            value: 'title'
          },
          {
            name: 'Data da inclusão',
            value: 'dueDate'
          },
          {
            name: 'Disciplina',
            value: 'disciplina'
          }
        ],
        search: 'oi',
        setting
      }
    },
    computed:{
      tasks(){
        return task.showTask.sort(this.order).filter( x => x.planId == this.planId)
      },
      tasksComplete(){
        return task.showTaskComplete.sort(this.order).filter( x => x.planId == this.planId)
      },
      taskEditSelect(){
        let task = this.tasks.filter(x => x.id == this.editId)
        return task[0]
      },
      disciplinas(){
        return task.readDisciplinas
      },
      listMarkRev(){
        return markrevStore.readMarkRevList
      }
    },
    methods:{
      addTask(item){
        task.addTask(item)
        this.deleteId = null
        this.editId = null

        if(item.markRev){
          markrevStore.addMarkRev(item)
        }

        this.clearTask()
        this.showAddTask = false
      },
      updateTask(item){
        item.complete = !item.complete
        this.deleteId = null
        this.editId = null
        task.fbUpdateTask(item)
      },
      markRevEdit(item){
        item.isRev = !item.isRev
        task.fbUpdateTask(item)
        if(item.isRev){
          markrevStore.addMarkRev(item)
        } else {
          markrevStore.fbDeleteMarkRev(item)
        }
      },
      deleteTask(item){
        task.fbDeleteTask(item)
        this.deleteId = null
        this.editId = null
      },
      editDialogOpen(item){
        this.edit = true
        this.editId = item.id
        this.deleteId = null
        this.taskModel ={
          id: item.id,
          planId: item.planId,
          title: item.title,
          description: item.description,
          complete: false,
          dueDate: item.dueDate,
          disciplina: item.disciplina,
          dateCreate: item.dateCreate,
          typeStudy: item.typeStudy,
          isRev: item.isRev,
          markRev: item.markRev,
        }
      },
      editTask(item){
        task.fbUpdateTask(item)
        this.clearTask()
        this.edit = false
      },
      editClear(){
        this.clearTask()
        this.edit = false
      },
      clearTask(){
        this.taskModel = {
          planId: this.$route.params.id,
          title: null,
          description: "",
          complete: false,
          dueDate: Date.now(),
          disciplina: null,
          disciplina: null,
          isRev: false,
          markRev: false,
          typeStudy: 0
        }
      },
      setDataComment(item){
        this.showComments = true
        this.setComment = item
      },
      insertDisciplinaList(item){
        this.taskModel.disciplina = {id: this.disciplinas.length++, name: item}

        this.disciplinaName = null
        this.addDisciplina = false
      }
    },
    components:{
      avisos,
      searchBar,
      commentDialog,
      markrevDialog
    },
    created() {
      task.cargaTasks(this.$route.params.id)
    },
  }
</script>

<style scoped>
.scroll-area-task{
  display: flex;
  flex-grow: 1;
}
.sobrepor{
  z-index: 4;
}
</style>
