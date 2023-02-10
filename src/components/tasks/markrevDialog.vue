<template>
  <q-card style="width: 700px; max-width: 80vw;">
    <q-card-section class="bg-grey-8 text-white q-py-sm">
      <div class="row">
        <div class="text-h6">Marcados para Revisão</div>
        <q-space></q-space>
        <q-btn
          icon="close"
          flat
          @click="$emit('closeMarkrev')"
        />
      </div>
    </q-card-section>
    <q-card-section>
      <q-checkbox class="text-talic" v-model="removeAllCheck" label="Remover da lista após adicionados" color="red" dense/>
    </q-card-section>
    <q-card-section>
      <q-list bordered v-for="(item, i) in listTasks" :key="i">
        <q-item clickable v-ripple @click="item.markRev = !item.markRev">
          <q-item-section side>
            <q-checkbox v-model="item.markRev " />
          </q-item-section>
          <q-item-section>
            <q-item-label>
                {{ item.disciplina.name}}
            </q-item-label>
            <q-item-label>
                {{ item.title}}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
    <q-card-actions  align="right">
      <q-btn
        color="green"
        label="Adicionar"
        :disable="!listTasks.filter(x => x.markRev).length"
        @click="addMarkRev()"
      />
    </q-card-actions>
  </q-card>
</template>

<script>
   import { useTaskStore } from 'stores/TaskStore'
   import { userMarkrevStore } from 'stores/MarkRevStore'

   const taskStore = useTaskStore()
   const markrevStore = userMarkrevStore()

  export default {
    data(){
      return{
        list:[],
        removeAllCheck: false
      }
    },
    props:{
      marksrevlist: Array
    },
    computed:{
      listTasks(){
        let list = []
        this.marksrevlist.forEach(x => {
          x.markRev = false
          list.push(x)
        } )
        return list
      }
    },
    methods:{
      addMarkRev(){
        let tasks = this.listTasks.filter(x => x.markRev)
        if(tasks.length){
          tasks.forEach( x =>{
            x.planId = this.$route.params.id
            x.markRev = false
            taskStore.addTask(x)
            if(this.removeAllCheck){
              markrevStore.fbUpdateMarkRev(x)
            }
          })
          this.$emit('closeMarkrev')
        }
      }
    }
  }
</script>

<style scoped>

</style>
