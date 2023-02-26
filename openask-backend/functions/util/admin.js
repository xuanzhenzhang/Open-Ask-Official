const admin = require("firebase-admin");

const firebaseConfig = {
  apiKey: "AIzaSyBxzkOmWASUN7LnXqvFgC40Qrc1pffKxdI",
  authDomain: "fir-quickask.firebaseapp.com",
  projectId: "fir-quickask",
  storageBucket: "fir-quickask.appspot.com",
  messagingSenderId: "990063199875",
  appId: "1:990063199875:web:08a54ce8833256da53fdb6",
  measurementId: "G-4CZB3NP94L",
};
admin.initializeApp(firebaseConfig);
const db = admin.firestore();
module.exports = { admin, db };
