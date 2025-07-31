import firebase from 'firebase';

// Your web app's Firebase configuration
const firebaseConfig = {
  /*
   Coloque aqui as credenciais / api keys
   do seu projeto firebase
   */
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const database = firebase.firestore();
