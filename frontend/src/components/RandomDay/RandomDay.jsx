import React, { useState, useEffect } from "react";
import classes from "./Random.module.css";

const RandomDay = () => {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  function getTimeLeft() {
    const dateFuture = new Date(new Date().getFullYear() + 1, 0, 1);
    const dateNow = new Date();

    let seconds = Math.floor((dateFuture - dateNow) / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);

    hours = hours % 24;
    minutes = minutes % 60;
    seconds = seconds % 60;

    return {
      days: String(days),
      hours: String(hours).padStart(2, "0"),
      minutes: String(minutes).padStart(2, "0"),
      seconds: String(seconds).padStart(2, "0"),
    };
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const { days, hours, minutes, seconds } = timeLeft;

  return (
    <>
      <div className={classes.warning}>Hurry Up! Deals End In:</div>
      <div className={classes.main}>
        <div className={classes.time}>
          <div className={classes.day}>{days}</div>
          <p>Days <span>:</span></p>
        </div>

        <div className={classes.time}>
          <div className={classes.day}>{hours}</div>
          <p>Hour <span>:</span></p>
        </div>

        <div className={classes.time}>
          <div className={classes.day}>{minutes}</div>
          <p>Min <span>:</span></p>
        </div>

        <div className={classes.time}>
          <div className={classes.day2}>{seconds}</div>
          <p className={classes.p1}>Sec</p>
        </div>
      </div>
    </>
  );
};

export default RandomDay;
