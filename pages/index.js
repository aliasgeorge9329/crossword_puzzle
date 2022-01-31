import Head from "next/head";
import Link from "next/link";
import styles from "@/components/common/index.module.css";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  function handlesubmit(e) {
    e.preventDefault();
    console.log(e.target.name.value);
    router.push("/crossword");
  }
  return (
    <div className={styles.main}>
      <Head>
        <title>Crossword</title>
      </Head>
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
              className={styles.form_input}
              placeholder=" "
              autocomplete="off"
            />
            <label for="name" className={styles.label}>
              Name
            </label>
          </div>

          <div className={styles.form_group}>
            <input
              type="email"
              id="email"
              className={styles.form_input}
              placeholder=" "
            />
            <label for="email" className={styles.label}>
              Email
            </label>
          </div>
          <div className={styles.form_group}>
            <input
              type="phone"
              id="phone"
              className={styles.form_input}
              placeholder=" "
            />
            <label for="phone" className={styles.label}>
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
  );
}
