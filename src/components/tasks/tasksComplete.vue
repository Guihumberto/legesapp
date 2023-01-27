<template>
  <q-list
      separator
      class="q-mt-lg bg-grey-4"
      v-if="tasksComplete.length"
  >
    <q-item-label
      class="text-bold text-subtitle1 bg-green-4 text-white text-center"
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
      >
        <!-- Listagem normal -->
        <q-item-section side top>
          <q-checkbox v-model="task.complete" />
        </q-item-section>

        <q-item-section>
          <q-item-label
            :class="{'text-strike' : task.complete}"
            v-html="$options.filters.searchHighlight(task.title, search)"
          ></q-item-label>
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
</template>

<script>
  import { useTaskStore } from 'stores/TaskStore'
  import mixinHighlightDateFormat from '../../mixins/date-format'
  const task = useTaskStore()

  export default {
    mixins:[mixinHighlightDateFormat],
    computed:{
      tasksComplete(){
        return task.showTaskComplete.sort(this.order)
      },
    },
    methods:{
      updateTask(item){
        item.complete = !item.complete
        this.deleteId = null
        this.editId = null
        task.updateTask(item)
      },
    }
  }
</script>

<style scoped>

</style>
