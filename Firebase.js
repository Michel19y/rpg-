import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAF4o4HFV3JEJ6BZhItEmBPpWCF0lSsmtY",
  authDomain: "ichigo-fc9d5.firebaseapp.com",
  projectId: "ichigo-fc9d5",
  storageBucket: "ichigo-fc9d5.firebasestorage.app",
  messagingSenderId: "572626862242",
  appId: "1:572626862242:web:c42faff4a8d81c63ba97fb",
  measurementId: "G-Q58KS4FDXT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, { persistence: getReactNativePersistence(ReactNativeAsyncStorage)});
const db = getFirestore(app);

export { auth, db };