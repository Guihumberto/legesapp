<template>
  <div class="bg-white">
    <q-layout view="lHh Lpr lFf" container class="shadow-2 rounded-borders">
      <q-header elevated>
          <q-bar>
            <span>{{setComment.disciplina.name}}</span>
            <q-space />
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip class="bg-white text-primary">Close</q-tooltip>
            </q-btn>
        </q-bar>
      </q-header>
      <q-page-container>
        <q-page>
          <q-card-section class="q-pt-xs">
            <!-- Disiciplina e assunto -->
            <div class="text-h6">{{setComment.disciplina.name}}</div>
            <p>{{ setComment.title }}</p>
            <q-separator spaced inset  />

            <!-- formulárui -->
            <q-form class="q-pa-md" @submit.prevent="addComment(comment)">
              <q-input
                bg-color="white"
                label="Conceito/Título"
                class="q-mt-sm"
                outlined dense
                autofocus
                v-model="comment.title"
                :rules="[val => !!val || 'Campo Obrigatório']"
              />
              <q-input
                bg-color="white"
                label="Texto"
                class="q-mt-sm"
                outlined dense
                v-model="comment.text"
                autogrow
                maxlength="280"
                counter clearable
                placeholder="Descrição da tarefa"
              />
              <div class="row q-mt-md">
                <q-space></q-space>
                <q-btn
                  color="green"
                  type="submit"
                >
                  Incluir
                </q-btn>
              </div>
            </q-form>
            <q-separator spaced inset  />
          </q-card-section>

          <!-- lista de comentarios -->
          <q-card-section v-if="commentList.length">
            <q-list separator>
                <q-item
                  v-for="(item, i) in commentList"
                  :key="i"
                  clickable
                  v-ripple
                  @click.stop="deleteComment(item)"

                >
                <q-item-section>
                  <q-item-label>{{ item.title }}</q-item-label>
                  <q-item-label caption lines="4">{{ item.text }}</q-item-label>
                </q-item-section>

                <!-- favoritar -->
                <transition
                  appear
                  enter-active-class="animated bounceInRight slower"
                  leave-active-class="animated bounceOutRight slower"
                >
                  <q-item-section side top v-if="deleteId != item.dateCreate">
                  <q-btn
                      round
                      flat
                      :icon="item.favorite ? 'star':'star_outline'"
                      color="amber-14"
                      @click.stop="updateComment(item)"
                    />
                  </q-item-section>
                </transition>

                <!-- deletar -->
                <transition
                  appear
                  enter-active-class="animated bounceInRight slower"
                  leave-active-class="animated bounceOutRight slower"
                >
                  <q-item-section side class="bg-red" v-if="deleteId == item.dateCreate">
                   <q-btn
                      round
                      flat
                      class="q-mr-md"
                      icon="delete"
                      color="white"
                      @click.stop="deleteConfirm(item)"
                    />
                  </q-item-section>
                </transition>
              </q-item>

            </q-list>
          </q-card-section>

          <!-- aviso -->
          <q-card-section v-else>
           <q-banner class="bg-grey-3">
              <template v-slot:avatar>
                <q-icon name="block" color="primary" />
              </template>
              Não há comentários cadastrados da discipina {{ setComment.disciplina.name }} neste planejamento
              <template v-slot:action>
              </template>
            </q-banner>
          </q-card-section>
          <!-- place QPageScroller at end of page -->
          <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[18, 18]">
            <q-btn fab icon="keyboard_arrow_up" color="primary" />
          </q-page-scroller>
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
  import { useCommentsStore } from '../../stores/CommentsStore'
  const commentStore = useCommentsStore()

  export default {
    props:{
      setComment: true
    },
    data(){
      return{
        planSelect: this.$route.params.id,
        deleteId: null,
        comment:{
          title: '',
          text: ''
        },
      }
    },
    computed:{
      commentList(){
        return commentStore.readComments.filter(x => x.planId == this.planSelect && x.disciplina == this.setComment.disciplina.id)
      }
    },
    methods: {
      addComment(item){
        let comment = {
          planId: this.setComment.planId,
          disciplina: this.setComment.disciplina.id,
          subject: this.setComment.title,
          dateCreate: Date.now(),
          title: item.title,
          text: item.text,
          favorite: false
        }
        commentStore.addComment(comment);
        this.clearCommet()
      },
      updateComment(item){
        item.favorite = !item.favorite
        commentStore.fbUpdatePlan(item)
      },
      deleteComment(item){
        if(this.deleteId == item.dateCreate){
          this.deleteId = null
        } else {
          this.deleteId = item.dateCreate
        }
      },
      deleteConfirm(item){
       commentStore.fbDeleteComment(item)
       this.deleteId = null
      },
      clearCommet(){
        this.comment = {
          title: '',
          text: ''
        }
      }
    },
  }
</script>

<style lang="scss" scoped>

</style>
