/**
 * @file firebase.js
 * @description Initializes the client-side Firebase Application instance 
 * and exposes the Authentication service module. This architecture enforces 
 * individual session isolation as mandated by the project requirements.
 */

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

/**
 * Client-side configuration topology using Vite environment variables.
 * Utilizing environment variables prevents the exposure of sensitive API 
 * credentials within the public version control repository.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Instantiates the centralized Firebase application topology.
const app = initializeApp(firebaseConfig);

// Exports the authentication service interface for state verification loops.
export const auth = getAuth(app);