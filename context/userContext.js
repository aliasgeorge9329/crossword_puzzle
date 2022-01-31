import React, { createContext, useState } from "react";
import { useRouter } from "next/router";
export const UserContext = createContext();
const UserContextProvider = (props) => {
  const [correctanswer, setCorrectanswer] = useState([]);

  return (
    <UserContext.Provider value={{ correctanswer, setCorrectanswer }}>
      {props.children}
    </UserContext.Provider>
  );
};
export default UserContextProvider;
