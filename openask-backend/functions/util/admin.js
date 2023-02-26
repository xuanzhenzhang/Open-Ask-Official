const admin = require("firebase-admin");

const firebaseConfig = {
  apiKey: "AIzaSyDT15ZSVlGn7LeiKfZ1aT_U47bVgx4DiEw",
  authDomain: "open-ask-dbbe2.firebaseapp.com",
  projectId: "open-ask-dbbe2",
  storageBucket: "open-ask-dbbe2.appspot.com",
  messagingSenderId: "295827151242",
  appId: "1:295827151242:web:2e44d60787c08ca18b1073",
  measurementId: "G-K8X4BV069M",
};
admin.initializeApp(firebaseConfig);
const db = admin.firestore();
module.exports = { admin, db };
