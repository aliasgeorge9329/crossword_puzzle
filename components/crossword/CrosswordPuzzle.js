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
import getCrossword from "@/lib/getCrossword";

export default function CrosswordPuzzle() {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  const [html, setHtml] = useState(false);
  const databack = {
    across: {
        2: {
          clue: 'Which Tathva event provides a platform for researchers to present their research topics?',
          answer: 'BLUEPRINT',
          row: 2,
          col: 4,
        },
        3: {
            clue: 'JEE Mock exam conducted by NitC is called',
            answer: 'ZEROTHATTEMPT',
            row: 4,
            col: 0,
          },
          5: {
            clue: 'The first principal of NITC was? ',
            answer: 'MVKESAVARAO',
            row: 7,
            col: 4,
          },
          6: {
            clue: 'WHO INAUGURATED THE ARCHITECTURE DEPARTMENT BLOCK?',
            answer: 'SHANKARDAYAL',
            row: 10,
            col: 4,
          },
      },
      down: {
        1: {
          clue: 'AN AREA IN CAMPUS WHERE ONCERTS OR MUSIC PROGRAMS ARE HELD',
          answer: 'CREATIVEZONE',
          row: 0,
          col: 7,
        },
        4: {
            clue: 'THIS YEAR’S MASCOT’S NAME?',
            answer: 'METVA',
            row: 4,
            col: 10,
          },
    }
}

  const {
    name,
    correctanswer,
    setCorrectAnswer,
    attempt,
    setAttempt,
    starttime,
    setStarttime,
    crossword,
    setCrossWord,
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
      localStorage.setItem("cross",data.crossword)
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
    });
 
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

      // cross.current.fillAllAnswers();
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
        // cross.current.reset();
        router.push("/");
        logout(ResetAllState);
      }, 3000);
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

  const cross = useRef(null);
  function Getcross() {
    const res1 = getCrossword(localStorage.getItem("cross"));
    res1.then((doc) => {
    let data = ""
    try{
      data = JSON.parse(doc.data?.split("`")[1]);
    }
    catch {
      data = JSON.parse(doc.data?.split("'")[1]);
    }
    try{
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
    );}
    catch {
      setHtml(
        <>
          <Crossword
            data={databack}
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
      )
    };
  })
  }


  return (
    <>
      <div className={styles.timer}>
        {!attempt ? (
          <Timer setAttempt={setAttempt} Stopattempt={Stopattempt} />
        ) : (
          <>
            <span style={{ color: "red" }}>Timer is Up!!!</span>
            {correctanswer !== null && correctanswer.length !== 0 ? (
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
        {html ? html : <div>Loading...</div>}
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
