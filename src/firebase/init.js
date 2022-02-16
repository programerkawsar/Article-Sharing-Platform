// Import firebase app
import firebase from 'firebase/app'
// import firebase database
import 'firebase/firestore'

// firebase config codes
const firebaseConfig = {
    // your codes
};
  
// initialize firebase app to the config
const firebaseApp = firebase.initializeApp(firebaseConfig)
firebaseApp.firestore().settings({}) // use firebase firestore

export default firebaseApp.firestore()