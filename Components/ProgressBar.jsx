import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import styles from "../styles/ProgressBar.module.css";
const ProgressBar = (props) => {
  const percentage = props.value;
  return (
    <div className={styles.progressBarContainer}>
      <CircularProgressbar
        value={percentage}
        text={`${percentage}%`}
        strokeWidth={11}
        styles={buildStyles({
          textSize: "30px",
          pathTransitionDuration: "0.7",
          pathColor: `rgba(255,255, 255, 1)`,
          textColor: "white",
          trailColor: `rgba(166,165,255,0.45)`,
        })}
      />
    </div>
  );
};

export default ProgressBar;
