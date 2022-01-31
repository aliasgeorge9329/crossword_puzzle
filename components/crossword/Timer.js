import { useState, useEffect } from "react";

export default function timer({ setAttempt }) {
  const [timeLeft, setTimeLeft] = useState(5);

  function Time() {
    let timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t > 0) {
          return t - 1;
        } else {
          setAttempt(false);
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
