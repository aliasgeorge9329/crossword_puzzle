import { query, getDocs, collection, where } from "firebase/firestore";
import { db } from "../firebase/clientApp";

const getMe = async (uid) => {
  try {
    const data = "";
    const q = query(collection(db, "users"), where("uid", "==", uid));
    await getDocs(q).then((doc) => {
      data = doc.docs[0].data();
    });
    return data;
  } catch (err) {
    console.error(err);
    return "nouser";
  }
};

export default getMe;
