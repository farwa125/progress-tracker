import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCWj2NIBEj-HV_U9onCug68lQOiBdTKPBI",
  authDomain: "mern-test-8acc1.firebaseapp.com",
  projectId: "mern-test-8acc1",
  storageBucket: "mern-test-8acc1.appspot.com",
  messagingSenderId: "189199041614",
  appId: "1:189199041614:web:26bcdc4c758efabd0d6f1f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);