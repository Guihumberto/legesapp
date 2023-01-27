<template>
    <q-card>
      <q-card-section class="bg-primary text-white row">
        <div class="text-h6">Adicionar Comentário</div>
        <q-space />
        <q-btn flat icon="close" color="white" v-close-popup />
      </q-card-section>
      <q-card-section>
        <div class="q-py-lg q-px-md row items-end q-col-gutter-md">
          <q-form
            @submit.prevent="addNewCommentRev()"
            @reset="reset()"
            class="q-gutter-md"
          >
            <q-input
                class="textRev"
                autofocus
                v-model="comment.title"
                placeholder="Pergunta/Título"
                clearable
              >
            </q-input>
            <q-input
                bottom-slots
                class="textRev"
                v-model="comment.text"
                placeholder="Resposta/Texto"
                counter
                maxlength="280"
                autogrow
                clearable
              >
            </q-input>

            <q-card-actions  align="right">
              <q-btn
                label="Limpar"
                type="reset"
                rounded no-caps
                color="primary"
                flat
                class="q-ml-sm q-mb-md" />
              <q-btn
                class="q-mb-md"
                :disable="!comment.title"
                unelevated
                rounded no-caps
                type="submit"
                color="primary"
                label="Salvar"
              />
            </q-card-actions>
          </q-form>
        </div>
      </q-card-section>
    </q-card>
</template>

<script>
import { useCommentsStore } from '../../stores/CommentsStore'
  const commentStore = useCommentsStore()

  export default {
    data(){
      return{
        comment:{
            planId: 99,
            disciplina: 99,
            subject: 'nao especificado',
            dateCreate: Date.now(),
            title: null,
            text: null,
            favorite: false
          }
      }
    },
    methods:{
      addNewCommentRev(){
        this.comment.dateCreate = Date.now()
        commentStore.addComment(this.comment)
        this.clearComment()
        this.$emit('close')
      },
      clearComment(){
        this.comment = {
          planId: 99,
          disciplina: 99,
          subject: 'nao especificado',
          dateCreate: Date.now(),
          title: null,
          text: null,
          favorite: false
        }
      },
      reset(){
        this.comment = {
          text: null,
          title: null
        }
      }
    }
  }
</script>

<style scoped>

</style>
