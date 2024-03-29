import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/database";

const firebaseConfig = {
  apiKey: "Your-API-Key",
  authDomain: "Your-Auth-Domain",
  databaseURL: "Your-Database-URL",
  projectId: "Your-Project-ID",
  storageBucket: "Your-Storage-Bucket",
  messagingSenderId: "Your-Messaging-Sender-ID",
  appId: "Your-App-ID"
};

// Initialize Firebase
const Firebase = firebase.initializeApp(firebaseConfig);

export const database = Firebase.database().ref();

export default Firebase;
// Use Your Firebase Setup Here Thank You
