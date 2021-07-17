
import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyAMcmsEjqF-6hOq2Qq6ttF5plRm8j8eskU",
  authDomain: "instagram-a3cdd.firebaseapp.com",

  projectId: "instagram-a3cdd",
  storageBucket: "instagram-a3cdd.appspot.com",
  messagingSenderId: "998488257721",
  appId: "1:998488257721:web:8de9a7d422de78740a1768",
  measurementId: "G-H1WD54T8N8"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };

