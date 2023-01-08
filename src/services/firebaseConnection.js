import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyDfvJPorXNWA7TF2foHlUb_8OICqbRfc7o",
  authDomain: "tickets-842da.firebaseapp.com",
  projectId: "tickets-842da",
  storageBucket: "tickets-842da.appspot.com",
  messagingSenderId: "1099140157101",
  appId: "1:1099140157101:web:184a7f1c8804714c510024",
  measurementId: "G-084G347R89"
};

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);

const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export { auth, db, storage};