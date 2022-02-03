import { useState, useEffect } from "react";

export default function Timer({ Stopattempt }) {
  let total_time = 1000;
  const [timeLeft, setTimeLeft] = useState(total_time);
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
    Time();
  }, []);

  return (
    <>
      {timeLeft > 60 ? Math.floor(timeLeft / 60) : 0}
      {`: ${timeLeft % 60}`}
    </>
  );
}
