<template>
   <q-card>
    <q-card-section class="bg-primary text-white row">
        <div class="text-h6">Editar Comentário</div>
        <q-space />
        <q-btn flat icon="close" color="white" v-close-popup />
      </q-card-section>
      <q-card-section class="row items-center">
        <q-form class="q-pa-md" @submit.prevent="editSaveComment(editComment)">
          <q-input
            bg-color="white"
            label="Conceito/Título"
            class="q-mt-sm"
            outlined dense
            autofocus
            v-model="editComment.title"
            :rules="[val => !!val || 'Campo Obrigatório']"
          />
          <q-input
            bg-color="white"
            label="Texto"
            class="q-mt-sm"
            outlined dense
            v-model="editComment.text"
            autogrow
            maxlength="280"
            counter clearable
            placeholder="Descrição da tarefa"
          />
          <div class="row q-mt-md">
            <q-space></q-space>
            <q-btn flat color="grey" no-caps label="Cancelar" v-close-popup />
            <q-btn
              color="green"
              type="submit"
            >
              Incluir
            </q-btn>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
</template>

<script>
  export default {
    data(){
      return{
        comment:{
          title: '',
          text: '',
          dateCreate: null
        },
      }
    },
    props:{
      editComment:Object
    },
    methods:{
      editSaveComment(item){
        this.$emit('saveEdit', this.editComment)
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
