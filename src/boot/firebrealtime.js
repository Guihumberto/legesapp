import firebase from "firebase/app";
import "firebase/auth"
import "firebase/firestore"
import "firebase/storage"


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD8XigxvzBA_cgcLsabbeZiV1FIRBe2R2M",
  authDomain: "leges-estudo.firebaseapp.com",
  databaseURL: "https://leges-estudo-default-rtdb.firebaseio.com",
  projectId: "leges-estudo",
  storageBucket: "leges-estudo.appspot.com",
  messagingSenderId: "729546985481",
  appId: "1:729546985481:web:731084cd791556b85568d8"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }


  const db = firebase.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();

  export {firebase, db, auth, storage}
