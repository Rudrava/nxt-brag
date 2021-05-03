import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD8RcQvidNnMrsHsXtEn7AKzVVhrQHLL9I",
  authDomain: "brag-c2658.firebaseapp.com",
  projectId: "brag-c2658",
  storageBucket: "brag-c2658.appspot.com",
  messagingSenderId: "383917928731",
  appId: "1:383917928731:web:27dbbe5fe5e3b854c0a3be",
  measurementId: "G-50DFNM40G0",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export const firestore = firebase.firestore();
export const fromMillis = firebase.firestore.Timestamp.fromMillis;
export const serverTimeStamp = firebase.firestore.FieldValue.serverTimestamp;
export const increment = firebase.firestore.FieldValue.increment;
export const storage = firebase.storage();
export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED;

/**
 * Gets a user/{uid} doc with username
 * @param {string} username
 */

export async function getUserWithUsername(username) {
  const usersRef = firestore.collection("users");
  const query = usersRef.where("username", "==", username).limit(1);
  const userDoc = (await query.get()).docs[0];
  return userDoc;
}

/**
 * as firestore timestamp is not serializable to json so we have to change it explicitly
 * for which this func

 * Gets a user/{uid} doc with username
 * @param {DocumentSnapshot} doc
 */
export const postToJSON = (doc) => {
  const data = doc.data();
  return {
    ...data,
    createdAt: data.createdAt.toMillis(),
    updatedAt: data.updatedAt.toMillis(),
  };
};
