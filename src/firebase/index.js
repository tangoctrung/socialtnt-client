import firebase from 'firebase/app';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY_FIREBASE,
  authDomain: "socialtnt-6007a.firebaseapp.com",
  projectId: "socialtnt-6007a",
  storageBucket: "socialtnt-6007a.appspot.com",
  messagingSenderId: "565276746209",
  appId: "1:565276746209:web:cb6d004e258b494d5432a0"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

export {
    storage, firebase as default
}