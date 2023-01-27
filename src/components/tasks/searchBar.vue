<template>
  <div class="q-mb-sm">
    <q-input
      outlined
      @keyup.esc="search = ''"
      v-model="search"
      @keyup="$emit('search', this.search)"
      label="Buscar"
      clearable dense
    >
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
    </q-input>
  </div>
</template>

<script>
   import { useTaskStore } from 'stores/TaskStore'
   const task = useTaskStore()
  export default {
    computed:{
      search:{
        get(){
          return task.searchTask
        },
        set(value){
          task.setSearch(value)
        }
      }
    }
  }
</script>

<style scoped>

</style>
