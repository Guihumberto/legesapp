import { defineStore } from 'pinia';


export const useLawStore = defineStore('law', {
  state: () => ({
     laws: [],
     nameLaw: 'null'
  }),
  getters: {
      showLaws(){
        return this.laws
      },
      readNameLaw(){
        return this.nameLaw
      }
  },
  actions: {
     async cargaLawList(){
        try {
            const res = await fetch('https://leges-estudo-default-rtdb.firebaseio.com/laws.json')
            const dataDB = await res.json()

            for (let id in dataDB){
                this.laws.push(dataDB[id])
            }
        } catch (error) {
            console.log(error)
        }
    },
    setNameLaw(item){
      this.nameLaw = item
    }
  },
});
