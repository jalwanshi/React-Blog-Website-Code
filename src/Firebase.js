import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import "firebase/compat/firestore"
import "firebase/compat/database"
const firebaseConfig = {
  apiKey: "AIzaSyC2xeIsUfJyrwCz6rZmsXz_yI5vtm1CfzA",
  authDomain: "uploadnews-85bb0.firebaseapp.com",
  databaseURL: "https://uploadnews-85bb0-default-rtdb.firebaseio.com",
  projectId: "uploadnews-85bb0",
  storageBucket: "uploadnews-85bb0.appspot.com",
  messagingSenderId: "648630406044",
  appId: "1:648630406044:web:1366f33e2ecfe3102ad659"
};

// Initialize Firebase
 const Firebase= firebase.initializeApp(firebaseConfig);
 export default Firebase.database().ref()

