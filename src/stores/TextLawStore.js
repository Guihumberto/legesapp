import { defineStore } from 'pinia';
import { firebaseDb, auth } from 'boot/firebase'
import { Notify } from 'quasar'


export const useTextLawStore = defineStore('textlaw', {
  state: () => ({
     textLaw: [],
     downloadComplete: null
  }),
  getters: {
      readTextLaw(){
        return this.textLaw
      },
      readCompleteDownload(){
        return this.downloadComplete
      }
  },
  actions: {
    cargaTextLaw(law){
      this.textLaw = []
      let idLaw = law
      let linkUser = firebaseDb.ref(`/textLaws/${idLaw}`)

      // initial carga for data
      linkUser.once('value', snapshot => {
        this.completeDowload(law)
      })

      //child added
      linkUser.on('child_added', snapshot => {
        let text = snapshot.val()
        this.textLaw.push(text)
      })

      //child change
      linkUser.on('child_changed', snapshot => {
        let text = snapshot.val()
        this.updateTextLaw(text)
      })

      //child remove
      linkUser.on('child_removed', snapshot => {
        let text = snapshot.val()
        this.deleteTextLaw(text)
      })
    },
    updateTextLaw(payload){
      console.log(payload);
    },
    deleteTextLaw(payload){
      console.log(payload);
    },
    completeDowload(value){
      this.downloadComplete = value
    }
  },
});
