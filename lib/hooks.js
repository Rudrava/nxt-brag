import { auth, firestore } from "./fireBase";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

// Custom hook to read  auth record and user profile doc
export function useUserData() {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState(null);

  useEffect(async () => {
    // turn off realtime subscription
    let unsubscribe;

    if (user) {
      const ref = firestore
        .collection("users")
        .doc(user.uid)
        .onSnapshot((doc) => setUsername(doc.data()?.username) || null);
    } else {
      setUsername(null);
    }
  }, [user]);

  return { user, username };
}
