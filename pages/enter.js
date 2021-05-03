import { googleAuthProvider, auth, firestore } from "../lib/fireBase";
import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../lib/context";
import { debounce } from "lodash";
export default function EnterPage({}) {
  const { user, username } = useContext(UserContext);
  return (
    <main>
      {user ? (
        !username ? (
          <UserNameForm />
        ) : (
          <SignOutButton />
        )
      ) : (
        <SignInButton />
      )}
    </main>
  );
}

const SignInButton = () => {
  const signInWithGoogle = async () => {
    await auth.signInWithPopup(googleAuthProvider);
  };
  return (
    <button className="btn-google" onClick={signInWithGoogle}>
      <img src={"/google.png"} alt="" />
    </button>
  );
};
const SignOutButton = () => (
  <button onClick={() => auth.signOut()}>Sign out</button>
);
const UserNameForm = () => {
  const [formValue, setFormValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user, username } = useContext(UserContext);
  const onChange = (e) => {
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }
    if (re.test(val)) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }
  };
  useEffect(() => {
    checkUserName(formValue);
  }, [formValue]);

  const checkUserName = useCallback(
    debounce(async (username) => {
      if (username.length >= 3) {
        const ref = firestore.doc(`usernames/${username}`);
        const { exists } = await ref.get();
        console.log("firestore username read executed");
        setIsValid(!exists);
        setLoading(false);
      }
    }, 500),
    []
  );
  const onSubmit = async (e) => {
    e.preventDefault();
    const userDoc = firestore.doc(`users/${user.uid}`);
    const userNameDoc = firestore.doc(`usernames/${formValue}`);
    const batch = firestore.batch();
    batch.set(userDoc, {
      username: formValue,
      photoURL: user.photoURL,
      displayName: user.displayName,
    });
    batch.set(userNameDoc, { uid: user.uid });
    await batch.commit();
  };

  return (
    !username && (
      <section>
        <h3>Chosse Username</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="username"
            placeholder="username"
            value={formValue}
            onChange={onChange}
            autoComplete="off"
          />
          <UsernameMessage
            username={formValue}
            isValid={isValid}
            loading={loading}
          />
          <button type="submit" className="btn btn-green" disabled={!isValid}>
            Confirm
          </button>

          <h2>Debug State</h2>
          <div>
            UserName: {formValue}
            <br />
            Loading: {loading.toString()}
            <br />
            User name valid: {isValid.toString()}
          </div>
        </form>
      </section>
    )
  );
};
function UsernameMessage({ username, isValid, loading }) {
  if (loading) {
    return <p>Checking...</p>;
  } else if (isValid) {
    return <p className="text-success">{username} avialable</p>;
  } else if (username && !isValid) {
    return <p className="text-danger">That username is taken</p>;
  } else return <p></p>;
}
