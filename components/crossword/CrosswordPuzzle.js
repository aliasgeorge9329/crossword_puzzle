import Crossword from "@jaredreisinger/react-crossword";
import styles from "./crossword.module.css";
import { useState, useEffect, useRef, useContext } from "react";
import Timer from "./Timer";
import { UserContext } from "@/context/userContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth, db } from "../../firebase/clientApp";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { logout } from "@/lib/logout";

import {
  doc,
  query,
  updateDoc,
  setDoc,
  getDocs,
  collection,
  where,
} from "firebase/firestore";
import getMe from "@/lib/getMe";

export default function CrosswordPuzzle() {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  const [html, setHtml] = useState(false);

  const databackup = {
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

  const {
    name,
    correctanswer,
    setCorrectAnswer,
    attempt,
    setAttempt,
    starttime,
    setStarttime,
    crossword,
    endTime,
    setEndTime,
    ResetAllState,
  } = useContext(UserContext);

  let anslist = [];

  function OnCorrect(direction, num) {
    if (localStorage.getItem("anslist") === null) {
      localStorage.setItem("anslist", []);
    }

    if (anslist.indexOf(num) === -1) {
      anslist.push(num[0]);
      localStorage.setItem("anslist", JSON.stringify(anslist));
    }

    toast.success("🎊 Hurrah Correct", {
      position: "top-right",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/");
    }
  }, [user, loading]);

  useEffect(() => {
    const res = getMe(localStorage.getItem("uid"));
    res.then((data) => {
      setAttempt(data.attempt);
      setStarttime(new Date(data.starttime));
      if (data.attempt) router.push("/");
    });

    if (attempt && attempt != undefined) {
      toast.error("Already attempted!", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      router.push("/");
    } else if (!attempt) {
      Getcross();
    }
  }, []);

  async function Stopattempt() {
    if (!attempt && attempt != null) {
      let end_time = new Date();
      setEndTime(endTime);
      setAttempt(true);
      let finalans = null;
      if (anslist.length != 0) finalans = anslist;
      else finalans = JSON.parse(localStorage.getItem("anslist"));
      setCorrectAnswer(finalans);
      try {
        const ref = doc(db, "users", user.uid);
        await updateDoc(ref, {
          attempt: true,
          correctanswer: finalans,
          endTime: new Date().toGMTString(),
          timetook: end_time - starttime,
          count: finalans.length,
        });
        let newname = "";
        if (name) newname = name;
        else newname = localStorage.getItem("name");
        const refleader = doc(db, "leaderboard", user.uid);
        await setDoc(refleader, {
          name: newname,
          // email: user.email,
          timetook: end_time - starttime,
          count: finalans.length,
        });
      } catch (err) {
        console.error(err);
      }

      cross.current.fillAllAnswers();
      toast.success("Attempt saved", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setAttempt(true);

      setTimeout(() => {
        cross.current.reset();
        logout(ResetAllState);
        router.push("/");
      }, 10000);
    } else {
      toast.error("Already attempted!", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }

  // useEffect(() => {
  //   // if (html) cross.current.reset();
  // }, [html]);

  function Getcross() {
    let no = 1;
    if (crossword) no = crossword;

    const q = query(collection(db, "crossword"), where("name", "==", no));
    getDocs(q).then((doc) => {
      try {
        const res = doc.docs[0].data().data;
        const data = JSON.parse(res.split("'")[1]);
        setHtml(
          <>
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
          </>
        );
      } catch {
        if (attempt === "fresh" || !attempt)
          setHtml(
            <>
              <Crossword
                data={databackup}
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
            </>
          );
      }
    });
  }

  const cross = useRef(null);

  return (
    <>
      <div className={styles.timer}>
        {!attempt ? (
          <Timer setAttempt={setAttempt} Stopattempt={Stopattempt} />
        ) : (
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
              <p> Nothing Filled</p>
            )}
          </>
        )}
      </div>

      <div style={{ width: "65%" }} className={styles.main}>
        {/* Cross */}
        {html ? html : <div>Loading</div>}
      </div>

      <button
        className={styles.finishbtn}
        onClick={() => {
          Stopattempt();
        }}
      >
        Finish
      </button>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}
