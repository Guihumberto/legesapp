import { defineStore } from 'pinia';
import { LocalStorage, Loading } from 'quasar'
import { firebase, auth, db } from 'boot/firebase'

import { showErrorMessage } from 'src/functions/function-show-error'
import { useRouter } from 'vue-router'

import { usePlanStore } from './planStore'

const plan = usePlanStore()


export const useAuthStore = defineStore('auth', {
  state: () => ({
     users: [],
     user: {
      email: '',
      password: '',
      name: '',
      photo: '',
      uid: ''
     },
     loggedIn: false
  }),
  getters: {
    readLoggedIn(){
      return this.loggedIn
    },
    readUser(){
      return this.user
    }
  },
  actions: {
    async registerUser(user){
      Loading.show()
      await auth.createUserWithEmailAndPassword(user.email, user.password)
      .then(response => {
        Loading.hide()
        console.log('cadastro')
      })
      .catch( error => {
        Loading.hide()
        showErrorMessage(error.message)
      })

    },
    async loginUser(user){
      Loading.show()
      await auth.signInWithEmailAndPassword(user.email, user.password)
      .then(response => {
        Loading.hide()
      })
      .catch( error => {
        showErrorMessage(error.message)
      })
    },
    logOut(){
      auth.signOut()
      this.loggedIn = false
      LocalStorage.set('loggedIn', false)
      this.router.replace('/auth').catch( err => {})
      this.user = {
        email: '',
        password: ''
      }
    },
    handlerAuthStateChange(){
      const router = useRouter()

      auth.onAuthStateChanged(user => {
        Loading.hide()
        if (user) {
          this.loggedIn = true
          LocalStorage.set('loggedIn',true)
          plan.cargaPlans()
          router.replace("/")
        } else {
          this.loggedIn = false
          LocalStorage.set('loggedIn', false)
        }
      });
    },
    async loginGmail(){
          const provider = new firebase.auth.GoogleAuthProvider();
          firebase.auth().languageCode = 'pt-br';

          try {
              //login user
              const result = await firebase.auth().signInWithPopup(provider);
              const user = result.user;
              this.setUser(user)
              //register user
              const usuario = {
                  name: user.displayName,
                  email: user.email,
                  uid: user.uid,
                  photo: user.photoURL
              }
              //Guardar en Firestore
              await db.collection('usuarios').doc(usuario.uid).set(usuario)
          } catch (error) {
              console.log(error);
          }
    },
    setUser(user){
      this.user = {
        email: user.email,
        name: user.displayName,
        photo: user.photoURL,
        uid: user.uid
       }
    }
  },
});
