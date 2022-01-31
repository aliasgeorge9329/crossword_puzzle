import Crossword from "@jaredreisinger/react-crossword";
import styles from "./crossword.module.css";
import { useState, useEffect, useRef, useContext } from "react";
import Timer from "./Timer";
import { UserContext } from "@/context/userContext";

export default function CrosswordPuzzle() {
  const data = {
    across: {
      1: {
        clue: "one plus one",
        answer: "TWO",
        row: 0,
        col: 0,
      },
    },
    down: {
      2: {
        clue: "three minus two",
        answer: "ONE",
        row: 0,
        col: 2,
      },
    },
  };
  const [correctanswer, setCorrectAnswer] = useState([]);
  const [count, setCount] = useState(0);

  const [attempt, setAttempt] = useState(true);

  function OnCorrect(direction, num) {
    if (correctanswer.indexOf(num) === -1) {
      setCorrectAnswer((oldArray) => [...oldArray, num]);
      setCount((t) => {
        return t + 1;
      });
    }
  }

  useEffect(() => {
    if (attempt) {
      cross.current.reset();
    } else {
      cross.current.fillAllAnswers();
    }
  }, [attempt]);

  const cross = useRef(null);

  const Completionist = () => (
    <>
      <span style={{ color: "red" }}>Timer is Up!!!</span>
      {correctanswer.length !== 0 ? (
        <p>
          The correct Answers are:
          {correctanswer.map((each) => {
            return each + " ";
          })}
        </p>
      ) : (
        <p> "Nothing Filled"</p>
      )}
    </>
  );

  return (
    <>
      <div className={styles.timer}>
        {attempt ? <Timer setAttempt={setAttempt} /> : <Completionist />}
      </div>
      <div style={{ width: "65%" }} className={styles.main}>
        <Crossword
          data={data}
          onCorrect={OnCorrect}
          ref={cross}
          useStorage={true}
          theme={{
            columnBreakpoint: "9999px",
            gridBackground: "black",
            cellBackground: "#ffe",
            cellBorder: "grey",
            textColor: "black",
            numberColor: "blue",
            focusBackground: "#f00",
            highlightBackground: "#f99",
          }}
        />
      </div>
    </>
  );
}
