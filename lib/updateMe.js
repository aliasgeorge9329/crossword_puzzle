import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/clientApp";
const updateMe = async (uid, data) => {
  try {
    const ref = doc(db, "users", uid);
    await updateDoc(ref, data);
  } catch (err) {
    console.error(err);
  }
};

export default updateMe;
