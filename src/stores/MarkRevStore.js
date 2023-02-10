import { defineStore } from 'pinia';
import { firebaseDb, auth } from 'boot/firebase'
import { Notify } from 'quasar'


export const userMarkrevStore = defineStore('markrev', {
  state: () => ({
     markrevList: [],
     downloadComplete: false
  }),
  getters: {
      readMarkRevList(){
        return this.markrevList
      }
  },
  actions: {
     cargaMarkRev(){
      this.markrevList = []
      let userUid = auth.currentUser.uid
      let linkUser = firebaseDb.ref(`/task/${userUid}/markrev`)

      // initial carga for data
      linkUser.once('value', snapshot => {
        this.completeDowload(true)
      })

      //child added
      linkUser.on('child_added', snapshot => {
        let task = snapshot.val()
        this.markrevList.push(task)
      })

      //child change
      linkUser.on('child_changed', snapshot => {
        let task = snapshot.val()
        this.updateMarkRev(task)
      })

      //child remove
      linkUser.on('child_removed', snapshot => {
        let task = snapshot.val()
        this.deleteMarkRev(task)
      })
    },
    addMarkRev(item){
      let task = {
        id: item.dateCreate,
        planId: item.planId,
        title: item.title,
        description: item.description,
        complete: false,
        disciplina: item.disciplina,
        dueDate: Date.now(),
        dateCreate: Date.now(),
        isRev: true,
        markRev: true,
        typeStudy: item.typeStudy
      }

      let userUid = auth.currentUser.uid
      let linkUser = firebaseDb.ref(`/task/${userUid}/markrev/${task.id}`)
      linkUser.set(task)
      Notify.create('Tarefa adicionada a lista de revisao!')
    },
    updateMarkRev(payload){
      const x = this.markrevList.map(item => item.id == payload.dateCreate ? payload : item)
      this.markrevList = x
    },
    deleteMarkRev(payload){
      let index = this.markrevList.findIndex(x => x.id == payload.dateCreate)
      this.markrevList.splice(index, 1)
    },
    fbUpdateMarkRev(item){
      let userUid = auth.currentUser.uid
      let linkUser = firebaseDb.ref(`/task/${userUid}/markrev/${item.id}`)
      linkUser.update(item)
      Notify.create('Lista de tarefas para revisao Atualizada!')
    },
    fbDeleteMarkRev(item){
      let userUid = auth.currentUser.uid
      let linkUser = firebaseDb.ref(`/task/${userUid}/markrev/${item.dateCreate}`)
      linkUser.remove()
      Notify.create('Tarefa para revisao Removida!')
    },
    completeDowload(value){
      this.downloadComplete = value
    }
  },
});
