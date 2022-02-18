import { query, getDocs, collection, where } from "firebase/firestore";
import { db } from "../firebase/clientApp";

const getCrossword= async (no)=> {
  try {
    const data = "";
    const q = query(collection(db, "crossword"), where("name", "==", `${no}`));
    await getDocs(q).then((doc) => {
      data = doc.docs[0].data();
    });
    return data;
  } catch (err) {
    console.error(err);
    return "nodata";
  }
};

export default getCrossword;
