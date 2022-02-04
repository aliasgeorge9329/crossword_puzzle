import { signInWithGoogle } from "@/lib/login";
import { useAuthState } from "react-firebase-hooks/auth";
import { UserContext } from "@/context/userContext";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth, db } from "../firebase/clientApp";
import styles from "@/components/common/index.module.css";
import { logout } from "@/lib/logout";
import sortArray from "sort-array";
import { collection, onSnapshot } from "firebase/firestore";

export default function Index() {
  let [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  const { attempt, name, setName, setAttempt, setCrossWord, ResetAllState } =
    useContext(UserContext);
  const [notverified, setNotverified] = useState(null);

  useEffect(() => {
    if (loading) return;
    if (localStorage.getItem("uid") === undefined) {
      user = [];
      return;
    }
  }, [user, loading]);

  useEffect(() => {
    if (notverified) {
      toast.error(
        `Sorry ${
          user.displayName.split(" ")[0]
        }, Login with B21 NITC Email ID or you Not belongs to b21`,
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
      logout(ResetAllState);
    }
    // } else if(attempt) {

    //   // logout(ResetAllState);
    // }
  }, [notverified]);

  const [leaderboard, setLeaderBoard] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "leaderboard"), (snap) => {
      const data = snap.docs.map((doc) => doc.data());
      let leaderboard = sortArray(data, {
        by: "timetook",
        order: "asc",
      });
      leaderboard = sortArray(leaderboard, {
        by: "count",
        order: "desc",
      });
      setLeaderBoard(leaderboard);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (attempt === "fresh") {
      router.push("/register");
      return;
    } else if (name && attempt) {
      toast.error(`Sorry ${name.split(" ")[0]} ,you already attempted!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }, [attempt, name]);

  return (
    <>
      <div className={styles.logbtn}>
        {user ? (
          <button onClick={() => logout(ResetAllState)}>Log Out</button>
        ) : (
          <>
            <button
              onClick={() =>
                signInWithGoogle(
                  setAttempt,
                  setName,
                  setCrossWord,
                  setNotverified,
                  logout,
                  ResetAllState
                )
              }
            >
              Log In
            </button>
          </>
        )}
      </div>

      <div className={styles.brandtitle}>
        <h1>Crossword Puzzle</h1>
      </div>
      <div className={styles.main}>
        <div className={styles.laddernav}>
          <div className={`${styles.laddertitle}`}>
            <h1>Standings</h1>
          </div>
        </div>
        <div className={styles.laddernavresults}>
          <div className={styles.laddernavresultscol}>
            <label>Rank</label>
          </div>
          <div className={styles.laddernavresultscol}>
            <label>Name</label>
          </div>
          <div className={styles.laddernavresultscol}>
            <label>Count</label>
          </div>
          <div className={styles.laddernavresultscol}>
            <label>Time Took (s)</label>
          </div>
        </div>

        {leaderboard.length != 0 ? (
          leaderboard.map((each, index) => {
            return (
              <div key={each}>
                <div className={styles.laddernavresultsplayers}>
                  <div className={styles.resultscol}>
                    <span className={styles.resultsrank}>
                      <span className={styles.positions}>{index + 1}</span>
                    </span>
                  </div>
                  <div className={styles.resultscol}>
                    <span>{each.name}</span>
                  </div>
                  <div className={styles.resultscol}>
                    <span>{each.count}</span>
                  </div>
                  <div className={styles.resultscol}>
                    <span>{each.timetook / 1000}</span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <h1 style={{ textAlign: "center", marginTop: "60px" }}>
            Not Available
          </h1>
        )}
      </div>
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
