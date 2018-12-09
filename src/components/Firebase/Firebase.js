import firebase from 'firebase'
//var firebase = require("firebase-admin");
//var serviceAccount = require('./serviceAccountKey.json');

// authenticiation 
var config = {
  apiKey: "AIzaSyAniO5TGmsQTWLvqnvlRNwlEjjiycYvevo",
  authDomain: "henmformitas.firebaseapp.com",
  databaseURL: "https://henmformitas.firebaseio.com",
  projectId: "henmformitas",
  storageBucket: "henmformitas.appspot.com",
  messagingSenderId: "505504123402"
};

firebase.initializeApp(config);
export default firebase;