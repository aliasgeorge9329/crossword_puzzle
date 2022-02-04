import styles from "@/components/register/register.module.css";
import { useRouter } from "next/router";
import { UserContext } from "@/context/userContext";
import { useContext, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/clientApp";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import updateMe from "@/lib/updateMe";
import getMe from "@/lib/getMe";

export default function Register() {
  const [user, loading, error] = useAuthState(auth);

  const { name, setName, attempt, setAttempt, setStarttime } =
    useContext(UserContext);

  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/");
      return;
    }
    if (attempt === undefined) {
      const res = getMe(user.uid);
      res.then((data) => {
        setAttempt(data.attempt);
        if (data.attempt) router.push("/");
      });
    }
  }, [user]);

  async function handlesubmit(e) {
    e.preventDefault();
    if (attempt && attempt != "fresh") {
      toast.error("Already attempted!", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setTimeout(() => {
        router.push("/");
      }, 5000);
    } else if (attempt === "fresh") {
      setAttempt(false);
      setName(e.target.name.value);
      localStorage.setItem("name", e.target.name.value);
      setStarttime(new Date());
      const data = {
        name: e.target.name.value,
        phone: e.target.phone.value,
        attempt: false,
        starttime: new Date().toGMTString(),
      };
      updateMe(user.uid, data);
      router.push("/crossword");
    }
  }

  return (
    <>
      <div className={styles.main}>
        <form onSubmit={handlesubmit} className={styles.form}>
          <div className={styles.form_header}>
            <h1 className={styles.form_title}>Register</h1>
            <p className={styles.form_description}>
              Fill the details to start the Game
            </p>
          </div>
          <div className={styles.form_body}>
            <div className={styles.form_group}>
              <input
                type="name"
                id="name"
                onChange={(e) => {
                  setName(e.target.value);
                }}
                value={name}
                className={styles.form_input}
                required
              />
              <label htmlFor="name" className={styles.label}>
                Name
              </label>
            </div>
            <div className={styles.form_group}>
              <input
                type="phone"
                id="phone"
                className={styles.form_input}
                required
              />
              <label htmlFor="phone" className={styles.label}>
                Phone No
              </label>
            </div>
            <div className={styles.wrap}>
              <button className={`${styles.form_btn} ${styles.button}`}>
                START
              </button>
            </div>
          </div>
        </form>
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
