// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// Add a second document with a generated ID.
import { addDoc, collection, getFirestore, connectFirestoreEmulator } from "firebase/firestore"; 

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA9Vwy_tWwvgXyah6Y4kowQMhfoFqoE8zw",
  authDomain: "patch-dev-e6061.firebaseapp.com",
  projectId: "patch-dev-e6061",
  storageBucket: "patch-dev-e6061.appspot.com",
  messagingSenderId: "516816905398",
  appId: "1:516816905398:web:6143553facccc4cd11f217"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
connectFirestoreEmulator(db, '127.0.0.1', 8082);

try {
  const docRef = await addDoc(collection(db, "projects"), {"vmstate":{"targets":[{
    "name" : "Stage",
    "tags" : [],
    "isStage" : true,
    "variables" : {},
    "costumes" : [{
        "name": "Arctic",
        "assetId": "67e0db3305b3c8bac3a363b1c428892e",
        "bitmapResolution": 2,
        "dataFormat": "png",
        "md5ext": "67e0db3305b3c8bac3a363b1c428892e.png",
        "rotationCenterX": 480,
        "rotationCenterY": 360
    }],
    "sounds" : [],
    "blocks" : {}
 
 },{"isStage":false,"name":"Cat","variables":{},"lists":{},"broadcasts":{},"blocks":{},"comments":{},"currentCostume":0,"costumes":[{"name":"cat-a","bitmapResolution":1,"dataFormat":"svg","assetId":"bcf454acf82e4504149f7ffe07081dbc","md5ext":"bcf454acf82e4504149f7ffe07081dbc.svg","rotationCenterX":48,"rotationCenterY":50},{"name":"cat-b","bitmapResolution":1,"dataFormat":"svg","assetId":"0fb9be3e8397c983338cb71dc84d0b25","md5ext":"0fb9be3e8397c983338cb71dc84d0b25.svg","rotationCenterX":46,"rotationCenterY":53}],"sounds":[{"name":"Meow","assetId":"83c36d806dc92327b9e7049a565c6bff","dataFormat":"wav","format":"","rate":48000,"sampleCount":40681,"md5ext":"83c36d806dc92327b9e7049a565c6bff.wav"}],"volume":100,"layerOrder":1,"visible":true,"x":0,"y":0,"size":100,"direction":90,"draggable":false,"rotationStyle":"all around","threads":[{"script":"","triggerEventId":"event_whenflagclicked","triggerEventOption":""}]}],"extensions":[],"meta":{"semver":"3.0.0","vm":"1.1.8","agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"}},"globalVariables":[]});

  console.log("Document written with ID: ", docRef.id);
} catch (e) {
  console.error("Error adding document: ", e);
}