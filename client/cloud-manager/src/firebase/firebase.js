import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCN76raikk2zvhUY_MIPTgDqfDBsbmlL84",
  authDomain: "bustling-dynamo-420507.firebaseapp.com",
  projectId: "bustling-dynamo-420507",
  storageBucket: "bustling-dynamo-420507.appspot.com",
  messagingSenderId: "892836665451",
  appId: "1:892836665451:web:9a225d9c26cb468480792e",
  measurementId: "G-TCPT73TTJV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { auth, app };
