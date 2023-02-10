import { defineStore } from 'pinia';
import { uid } from 'quasar'
import { firebaseDb, auth } from 'boot/firebase'
import { Notify } from 'quasar'


export const useTaskStore = defineStore('task', {
  state: () => ({
    tasksDownloads: false,
    tasks:[
    ],
    searchTask: null,
    disciplinas: [
      {id: 0, name: 'Selecione'},
      {id: 1, name: 'Direito Administrativo'},
      {id: 2, name: 'Direito Constitucional'},
      {id: 3, name: 'Direito Previdenciário'},
      {id: 4, name: 'Direito Tributário'},
      {id: 5, name: 'Português'},
      {id: 6, name: 'Raciocínio Lógico'},
      {id: 7, name: 'Informática'},
      {id: 8, name: 'Direito Eleitoral'},
      {id: 9, name: 'Regimento Interno'},
      {id: 10, name: 'Direito das Pessoas Com Deficiência'},
      {id: 11, name: 'Normas Aplicáveis aos Servidores Públicos Federais'},
      {id: 12, name: 'Direito das Pessoas Com Deficiência'},
      {id: 13, name: 'Direito Civil'},
      {id: 14, name: 'Direito Penal'},
      {id: 15, name: 'Controle Externo'},
      {id: 16, name: 'Contabilidade Pública'},
      {id: 17, name: 'Contabilidade de Custos'},
      {id: 18, name: 'Contabilidade Geral'},
      {id: 19, name: 'Economia'},
      {id: 20, name: 'Auditoria Governamental'},
      {id: 21, name: 'Administração Pública'},
      {id: 22, name: 'Legislação Civil Especial'},
      {id: 23, name: 'Direito Processual Civil'},
      {id: 24, name: 'Direito Processual Penal'},
      {id: 25, name: 'Direito Financeiro'},
      {id: 26, name: 'Legislação Estadual'},
      {id: 99, name: 'Não Vinculado'},
    ],
  }),
  getters: {
    showTask() {
      let tasks = this.tasksFiltred.filter( x => x.complete == false)
      return tasks
    },
    showTaskComplete() {
      let tasks = this.tasksFiltred.filter( x => x.complete)
      return tasks
    },
    tasksFiltred(){
      if(this.searchTask){
        let search = this.searchTask.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        let exp = new RegExp(search.trim().replace(/[\[\]!'.@><|//\\&*()_+=]/g, ""), "i")
        let filtro = this.tasks.filter(task => exp.test(task.title.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, "") ) || exp.test( task.description.replace('.', '') ))

        filtro = filtro.filter(function (a) {
          return !this[JSON.stringify(a)] && (this[JSON.stringify(a)] = true);
        }, Object.create(null))

        return filtro
      }

      let values = this.tasks.filter(function (a) {
        return !this[JSON.stringify(a)] && (this[JSON.stringify(a)] = true);
      }, Object.create(null))

      return values
    },
    readDisciplinas(){
      return this.disciplinas.sort(function (a, b) {
        if (a.name > b.name) {
          return 1;
        }
        if (a.name < b.name) {
          return -1;
        }
        // a must be equal to b
        return 0;
      })
    }
  },
  actions: {
    cargaTasks(value){
        if(auth.currentUser == null){
          setTimeout(()=> {
            if(auth.currentUser){
              return
            } else {
              console.log("igual a null");
            }
          }, 1000)
        } else {
          this.carga(value)
        }


    },
    carga(value){
        this.tasks = []
        let planId = value
        let userUid = auth.currentUser.uid

        let linkUser = firebaseDb.ref(`/task/${userUid}/plans/${planId}/tasks`)

        // initial carga for data
        linkUser.once('value', snapshot => {
          this.completeDowload(true)
        })

        //child added
        linkUser.on('child_added', snapshot => {
          let tasks = snapshot.val()
          this.tasks.push(tasks)
        })

        //child change
        linkUser.on('child_changed', snapshot => {
          let tasks = snapshot.val()
          this.updateTask(tasks)
        })

        //child remove
        linkUser.on('child_removed', snapshot => {
          let tasks = snapshot.val()
          this.deleteTask(tasks)
        })
    },
    addTask(item) {
      let task = {
        id: uid(),
        planId: item.planId,
        title: item.title,
        description: item.description,
        complete: false,
        disciplina: item.disciplina,
        dueDate: Date.now(),
        dateCreate: Date.now(),
        isRev: item.isRev,
        markRev: item.markRev,
        typeStudy: item.typeStudy
      }

      // let findDisciplina = this.readDisciplinas.find(x => x.id == task.disciplina.id)


      // if(!findDisciplina){
      //   this.addDisciplina(task.disciplina)
      // }

      let userUid = auth.currentUser.uid
      let linkUser = firebaseDb.ref(`/task/${userUid}/plans/${task.planId}/tasks/${task.id}`)
      linkUser.set(task)
      Notify.create('Tarefa adicionado ao planejamento!')
    },
    updateTask(payload) {
      const x = this.tasks.map(item => item.id == payload.id ? payload : item)
      this.tasks = x
    },
    deleteTask(item){
      this.tasks = this.tasks.filter(x => x.id != item.id)
    },
    setSearch(item){
      this.searchTask = item
    },
    fbUpdateTask(item){
      let userUid = auth.currentUser.uid
      let linkUser = firebaseDb.ref(`/task/${userUid}/plans/${item.planId}/tasks/${item.id}`)
      linkUser.update(item)
      Notify.create('Tarefa Atualizada!')
    },
    fbDeleteTask(item){
      let userUid = auth.currentUser.uid
      let linkUser = firebaseDb.ref(`/task/${userUid}/plans/${item.planId}/tasks/${item.id}`)
      linkUser.remove()
      Notify.create('Tarefa Removido!')
    },
    completeDowload(value){
      this.tasksDownloads = value
    },
    addDisciplina(item){
      let userUid = auth.currentUser.uid
      let linkUser = firebaseDb.ref(`/task/${userUid}/disciplinas/${item.id}`)
      linkUser.set(item)
      Notify.create('Disciplina adicionada.')
      this.disciplinas.push(item)
    }
  },
});
