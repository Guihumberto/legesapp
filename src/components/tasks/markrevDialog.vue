<template>
  <q-card style="width: 700px; max-width: 80vw;">
    <q-card-section class="bg-green text-white q-py-sm">
      <div class="row">
        <div class="text-h6">Tarefas Marcadas para Revisao</div>
        <q-space></q-space>
        <q-btn
          icon="close"
          flat
          @click="$emit('closeMarkrev')"
        />
      </div>
    </q-card-section>
    <q-card-section>
      <q-list bordered v-for="(item, i) in marksrevlist" :key="i">
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon color="primary" name="bluetooth" />
          </q-item-section>
          <q-item-section>{{item}}</q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script>
  export default {
    data(){
      return{
        list:[]
      }
    },
    props:{
      marksrevlist: Array
    }
  }
</script>

<style scoped>

</style>
