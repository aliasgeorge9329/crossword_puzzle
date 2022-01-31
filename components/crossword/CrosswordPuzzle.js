import Crossword from "@jaredreisinger/react-crossword";
import styles from "./crossword.module.css";
import { useState, useEffect, useRef } from "react";

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
  const [timeLeft, setTimeLeft] = useState(2);
  const [attempt, setAttempt] = useState(true);

  function OnCorrect(direction, num) {
    if (correctanswer.indexOf(num) === -1) {
      setCorrectAnswer((oldArray) => [...oldArray, num]);
    }
  }

  function Time() {
    setInterval(() => {
      if (timeLeft <= 0) {
        console.log("called");
        setAttempt(false);
        return;
      }
      setTimeLeft((t) => t - 1);
    }, 1000);
  }

  useEffect(() => {
    Time();
  }, []);

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
      <span style={{ color: "red" }}>Timer is Over!!!</span>
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
      {attempt ? (
        <div className={styles.timer}>
          {timeLeft > 60 ? Math.floor(timeLeft / 60) : 0}
          {`: ${timeLeft % 60}`}
        </div>
      ) : (
        <Completionist />
      )}

      <div style={{ width: "65%" }} className={styles.main}>
        <Crossword
          data={data}
          onCorrect={OnCorrect}
          ref={cross}
          useStorage={true}
          theme={{
            columnBreakpoint: "9999px",
            gridBackground: "#acf",
            cellBackground: "#ffe",
            cellBorder: "#fca",
            textColor: "black",
            numberColor: "#9f9",
            focusBackground: "#f00",
            highlightBackground: "#f99",
          }}
        />
      </div>
    </>
  );
}
