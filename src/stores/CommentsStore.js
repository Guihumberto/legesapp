import { defineStore } from 'pinia';
import { firebaseDb, auth } from 'boot/firebase'
import { Notify } from 'quasar'


export const useCommentsStore = defineStore('comments', {
  state: () => ({
     comments: [],
     okDowload: false
  }),
  getters: {
      readComments(){
        return this.comments
      },
      readIdComments(){
        return this.comments.map(x => x.dateCreate)
      }
  },
  actions: {
    cargaComments(){
      this.comments = []
        let userUid = auth.currentUser.uid
        let linkUser = firebaseDb.ref(`/task/${userUid}/comments`)

        // initial carga for data
        linkUser.once('value', snapshot => {
          this.completeDowload(true)
        })

        //child added
        linkUser.on('child_added', snapshot => {
          let comment = snapshot.val()
          this.noDuplicate(comment)
          console.log(this.readComments);
          this.comments.push(comment)
        })

        //child change
        linkUser.on('child_changed', snapshot => {
          let comment = snapshot.val()
          this.updateComment(comment)
        })

        //child remove
        linkUser.on('child_removed', snapshot => {
          let comment = snapshot.val()
          this.deleteComment(comment)
        })
    },
    addComment(item){
      item.tofile = false
      let userUid = auth.currentUser.uid
      let linkUser = firebaseDb.ref(`/task/${userUid}/comments/${item.dateCreate}`)
      linkUser.set(item)
      Notify.create('Commentário adicionado a revisão!')
    },
    deleteComment(payload){
      let index = this.comments.findIndex(x => x.dateCreate == payload.dateCreate)
      this.comments.splice(index, 1)
    },
    updateComment(payload){
      const x = this.comments.map(item => item.dateCreate == payload.dateCreate ? payload : item)
      this.comments = x
    },
    fbUpdatePlan(item){
      let userUid = auth.currentUser.uid
      let linkUser = firebaseDb.ref(`/task/${userUid}/comments/${item.dateCreate}`)
      linkUser.update(item)
      Notify.create('Comentário Atualizado!')
    },
    fbDeleteComment(item){
      let userUid = auth.currentUser.uid
      let linkUser = firebaseDb.ref(`/task/${userUid}/comments/${item.dateCreate}`)
      linkUser.remove()
      Notify.create('Comentário Removido!')
    },
    completeDowload(value){
      this.okDowload = value
    },
    noDuplicate(item){
      let exist = this.readIdComments.find(x => x.dateCreate == item.dateCreate)
      console.log(exist, !!exist, 'inforacao');
      return !!exist
    }
  },
});
