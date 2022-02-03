import React, { createContext, useState } from "react";
import { useEffect } from "react";

export const UserContext = createContext();
const UserContextProvider = (props) => {
  const [name, setName] = useState();
  const [correctanswer, setCorrectAnswer] = useState([]);
  const [attempt, setAttempt] = useState();
  const [starttime, setStarttime] = useState();
  const [endTime, setEndTime] = useState();
  const [crossword, setCrossWord] = useState();

  useEffect(() => {
    if (localStorage.getItem("name")) {
      setName(localStorage.getItem("name"));
    }
  }, []);

  function ResetAllState() {
    setName(null);
    setCorrectAnswer(null);
    setAttempt(null);
    setStarttime(null);
    setStarttime(null);
    setEndTime(null);
    setCorrectAnswer(null);
    setCorrectAnswer(null);
    localStorage.removeItem("uid");
    localStorage.removeItem("anslist");
    localStorage.removeItem("crossid");
    localStorage.removeItem("name");
  }

  return (
    <UserContext.Provider
      value={{
        name,
        setName,
        correctanswer,
        setCorrectAnswer,
        attempt,
        setAttempt,
        starttime,
        setStarttime,
        endTime,
        setEndTime,
        crossword,
        setCrossWord,
        ResetAllState,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};
export default UserContextProvider;
