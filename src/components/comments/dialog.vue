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
            <div class="row">
              <div class="col">
                <div class="text-h6">{{setComment.disciplina.name}}:</div>
                <p>
                  <span class="text-bold">{{ setComment.title }}: </span>
                  <span v-if="setComment.description" class="text-thin">{{ setComment.description }}</span>
                </p>
              </div>
              <div class="col-auto">
                <q-btn flat round color="grey" :icon="showFordAddComment ? 'expand_more' : 'chevron_right'" @click="showFordAddComment = !showFordAddComment" />
              </div>
            </div>


            <q-separator spaced inset  />

            <transition
              appear
              enter-active-class="animated fadeInRight slower"
              leave-active-class="animated fadeOutRight slower"
            >
              <div v-if="showFordAddComment">
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
              </div>
            </transition>

            <q-btn-group>
              <q-btn size="md" dense icon="filter_list" :class="reverse ? 'rotate-180': ''" @click="reverse = !reverse"/>
              <q-btn flat size="md" color="amber-7" dense :icon="favorites ? 'star' : 'star_outline'"  @click="favorites = !favorites"/>
            </q-btn-group>

            <!-- formulárui -->
          </q-card-section>

          <!-- lista de comentarios -->
          <q-card-section v-if="commentList.length" class="q-pa-sm">
            <q-list separator>
              <q-item
                  v-for="(item, i) in commentList"
                  :key="i"
                  clickable
                  v-ripple
                  @click.stop="deleteComment(item)"
                  class="q-pa-none"

                >
                <q-item-section class="q-py-sm">
                  <q-item-label>{{ item.title }}</q-item-label>
                  <q-item-label caption lines="4">{{ item.text }}</q-item-label>
                </q-item-section>

                <!-- favoritar -->
                <transition
                  appear
                  enter-active-class="animated fadeInRight slower"
                  leave-active-class="animated fadeOutRight slower"
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

                <!-- deletar e editar-->
                <transition-group
                  appear
                  enter-active-class="animated fadeInRight slower"
                  leave-active-class="animated fadeOutRight slower"
                >
                <q-item-section side class="bg-grey-4" v-if="deleteId == item.dateCreate">
                   <q-btn
                      round
                      flat
                      class="q-mr-md"
                      icon="edit"
                      color="white"
                      @click.stop="callEdit(item)"
                    />
                  </q-item-section>
                  <q-item-section side class="bg-red" v-if="deleteId == item.dateCreate">
                   <q-btn
                      round
                      flat
                      class="q-mr-md"
                      icon="delete"
                      color="white"
                      @click.stop="deleteConfirmDialog = true"
                    />
                  </q-item-section>
                </transition-group>

                <q-dialog v-model="showFormEdit" persistent>
                 <editComment :editComment="editComment" @saveEdit="saveEditComment($event)" />
                </q-dialog>

                <q-dialog v-model="deleteConfirmDialog" persistent>
                  <q-card>
                    <q-card-section class="row items-center">
                      <q-avatar icon="delete" color="red" text-color="white" />
                      <span class="q-ml-sm">Tem certeza que deseja apagar esse registro?</span>
                    </q-card-section>
                    <q-card-actions align="right">
                      <q-btn flat label="Cancelar" no no-caps color="grey" v-close-popup />
                      <q-btn outline label="Apagar" color="red" @click="deleteConfirm(item)"/>
                    </q-card-actions>
                  </q-card>
                </q-dialog>

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
          <q-page-scroller position="top" :scroll-offset="350" :offset="[18, 18]" >
              <q-btn size="md" color="white" dense text-color="grey" icon="filter_list" :class="reverse ? 'rotate-180': ''" @click.stop="reverse = !reverse"/>
              <q-btn size="md" color="white" text-color="amber-7" dense :icon="favorites ? 'star' : 'star_outline'"  @click.stop="favorites = !favorites"/>
          </q-page-scroller>
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
  import { useCommentsStore } from '../../stores/CommentsStore'
  import editComment from 'components/comments/editDialog.vue'
  const commentStore = useCommentsStore()

  export default {
    components:{
      editComment
    },
    props:{
      setComment: true
    },
    data(){
      return{
        planSelect: this.$route.params.id,
        deleteConfirmDialog: false,
        deleteId: null,
        editId: null,
        showFordAddComment: true,
        showFormEdit: false,
        comment:{
          title: '',
          text: ''
        },
        editComment:{
          title: '',
          text: '',
          dateCreate: null,
        },
        reverse: false,
        favorites: false
      }
    },
    computed:{
      commentList(){
        let list = commentStore.readComments.filter(x => x.planId == this.planSelect && x.disciplina == this.setComment.disciplina.id).sort(this.order)
        if(this.favorites){
         list = list.filter(x => x.favorite)
        }
        return list
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
        this.clearSetId()
      },
      updateComment(item){
        this.clearSetId()
        item.favorite = !item.favorite
        commentStore.fbUpdateComment(item)
      },
      deleteComment(item){
        if(this.deleteId == item.dateCreate){
          this.deleteId = null
        } else {
          this.deleteId = item.dateCreate
        }
      },
      deleteConfirm(item){
       commentStore.fbDeleteComment(this.deleteId)
       this.clearSetId()
       this.deleteConfirmDialog = false
      },
      callEdit(item){
        this.showFormEdit = true
        this.editComment = {
          title: item.title,
          text: item.text,
          dateCreate: item.dateCreate
        }
      },
      saveEditComment(item){
        commentStore.fbUpdateComment(item)
        this.showFormEdit = false
        this.clearSetId()
      },
      clearCommet(){
        this.comment = {
          title: '',
          text: ''
        }
      },
      clearSetId(){
        this.deleteId = null,
        this.editId = null
      },
      order(a, b){
          return this.reverse
          ? a.dateCreate -  b.dateCreate
          : b.dateCreate -  a.dateCreate
      },
    },
  }
</script>

<style lang="scss" scoped>

</style>
