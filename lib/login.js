import { auth, db } from "../firebase/clientApp";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import {
  query,
  getDocs,
  collection,
  doc,
  where,
  setDoc,
} from "firebase/firestore";
import { signOut } from "firebase/auth";

const signInWithGoogle = async (
  setAttempt,
  setName,
  setCrossWord,
  setNotverified
) => {
  try {
    const googleProvider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;

    if (user.email.split("@")[1] != "nitc.ac.in") {
      setNotverified(true);
      signOut(auth);
      return;
    }
    // else if (user.email.split("_")[1].slice(0, 3).toLowerCase() != "b21") {
    //   setNotverified(true);
    //   return;
    // }

    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    const crossword = Math.floor(Math.random() * 50 + 1);
    if (docs.docs.length === 0) {
      const ref = doc(db, "users", user.uid);
      await setDoc(ref, {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        attempt: "fresh",
        crossword: crossword,
      });
      setName(user.displayName);
      setAttempt("fresh");
      setCrossWord(crossword);
    } else {
      await getDocs(q).then((doc) => {
        const data = doc.docs[0].data();
        setAttempt(data.attempt);
        setName(data.name);
        setCrossWord(data.crossword);
      });
    }
    window.localStorage.setItem("uid", user.uid);
    window.localStorage.setItem("crossid", crossword);
    window.localStorage.setItem("name", user.displayName);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

export { signInWithGoogle };
