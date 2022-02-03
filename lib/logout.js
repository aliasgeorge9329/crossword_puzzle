import { auth } from "../firebase/clientApp";
import { signOut } from "firebase/auth";
const logout = (ResetAllState) => {
  signOut(auth);
  ResetAllState();
};

export { logout };
