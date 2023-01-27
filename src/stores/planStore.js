import { defineStore } from 'pinia';
import { firebaseDb, auth } from 'boot/firebase'
import { Notify } from 'quasar'



export const usePlanStore = defineStore('plan', {
  state: () => ({
     plans: [],
     plan:{
      title: '',
      dateCreate: Date.now(),
      dueDate: '',
      concurso: '',
      color: 'bg-primary',
      completed: false,
     },
     plansDownloads: false,
     status: [
      {id: 0, name: 'Não iniciado'},
      {id: 1, name: 'Em andamento'},
      {id: 2, name: 'Concluído'},
      {id: 3, name: 'Paralisado'}
     ]
  }),
  getters: {
      readPlans(){
        let values = this.plans.filter(function (a) {
          return !this[JSON.stringify(a)] && (this[JSON.stringify(a)] = true);
        }, Object.create(null))

        return values
      },
      readUid(){
        return auth
      },
      readDowloadComplete(){
        return this.plansDownloads
      }
  },
  actions: {
    cargaPlans(){
        this.plans = []
        let userUid = auth.currentUser.uid
        let linkUser = firebaseDb.ref(`/task/${userUid}/plans`)

        // initial carga for data
        linkUser.once('value', snapshot => {
          this.completeDowload(true)
        })

        //child added
        linkUser.on('child_added', snapshot => {
          let plan = snapshot.val()
          this.plans.push(plan)
        })

        //child change
        linkUser.on('child_changed', snapshot => {
          let plan = snapshot.val()
          this.updatePlan(plan)
        })

        //child remove
        linkUser.on('child_removed', snapshot => {
          let plan = snapshot.val()
          this.deletePlan(plan)
        })
    },
    addPlan(item){
      let plan = {
        title: item.title,
        concurso: item.concurso,
        dateCreate: Date.now(),
        dueDate: item.dueDate,
        dateLastAcess: '',
        status: 0
      }

      let userUid = auth.currentUser.uid
      let linkUser = firebaseDb.ref(`/task/${userUid}/plans/${plan.dateCreate}`)
      linkUser.set(plan)
      Notify.create('Planejamento adicionado a lista!')
    },
    updatePlan(payload){
      const x = this.plans.map(item => item.dateCreate == payload.dateCreate ? payload : item)
      this.plans = x
    },
    deletePlan(payload){
      // this.plans = this.plans.filter( item => item.dateCreate != payload.dateCreate)
        let index = this.plans.findIndex(x => x.dateCreate == payload.dateCreate)
        this.plans.splice(index, 1)
    },
    fbUpdatePlan(item){
      let userUid = auth.currentUser.uid
      let linkUser = firebaseDb.ref(`/task/${userUid}/plans/${item.dateCreate}`)
      linkUser.update(item)
      Notify.create('Planejamento Atualizado!')
    },
    fbDeletePlan(item){
      let userUid = auth.currentUser.uid
      let linkUser = firebaseDb.ref(`/task/${userUid}/plans/${item.dateCreate}`)
      linkUser.remove()
      Notify.create('Planejamento Removido!')
    },
    completeDowload(value){
      this.plansDownloads = value
    },
    saveDateLastAcess(item){
      item.dateLastAcess = Date.now()
      let userUid = auth.currentUser.uid
      let linkUser = firebaseDb.ref(`/task/${userUid}/plans/${item.dateCreate}`)
      linkUser.update(item)
    }
  },
});
