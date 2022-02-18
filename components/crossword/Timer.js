import { useState, useEffect } from "react";
import getMe from "@/lib/getMe";

export default function Timer({ Stopattempt}) {

  const [timeLeft, setTimeLeft] = useState();
  function Time() {
    let timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t > 0) {
          return t - 1;
        } else {
          Stopattempt();
          clearInterval(timer);
        }
      });
    }, 1000);
  }

  useEffect(() => {

    const res = getMe(localStorage.getItem("uid"));
    res.then((data) => {
     const date = new Date(data.starttime)
      const endtime = (date.getTime() + 1*60000)
      const timelef = Math.round((endtime - (new Date()).getTime())/1000)
      setTimeLeft(timelef);
      Time();
    });

  }, []);

  return (
    <>
      {timeLeft > 60 ? Math.floor(timeLeft / 60) : 0}
     {`: ${timeLeft % 60}`}
    </>
  );
}
