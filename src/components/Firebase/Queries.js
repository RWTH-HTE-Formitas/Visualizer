/*
run 
`node Queries.js`
inside the Firebase folder to test queries
*/

var admin = require('firebase-admin');
// authentication details
var serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://henmformitas.firebaseio.com'
});

var database = admin.database();
var jsonResults = [];
// get all objects that have a note attached
var objectsRef = database.ref("Projects/17/Objects");
objectsRef.orderByKey().on("value", function(snapshot) {
  snapshot.forEach(function(childSnap) {
    if(childSnap.hasChild('Notes')){
      jsonResults.push(childSnap.val());
      console.log(jsonResults.length);
    }
  });
});

for(let i = 0; i < jsonResults.length; i++){

  var t = jsonResults[i];
  console.log(t['ID']);
}


  
