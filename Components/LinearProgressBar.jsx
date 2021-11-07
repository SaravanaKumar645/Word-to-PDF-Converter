import React, { useEffect, useState } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import styles from "../styles/ProgressBar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { ImSpinner9 } from "react-icons/im";
import { useMediaQuery } from "react-responsive";
import { render } from "react-dom";
const LinearProgressBar = (props) => {
  const percentage = props.value || 0;
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 770px)",
  });
  // console.log(isDesktopOrLaptop);
  return (
    <div className={styles.linearProgress}>
      {isDesktopOrLaptop && (
        <ProgressBar
          completed={percentage}
          maxCompleted={100}
          bgColor={percentage === 100 ? "#05b841" : "#5b468b"} ///05b841
          baseBgColor="#a28ccf"
          labelAlignment={percentage === 100 ? "center" : "right"}
          labelColor="#ffff"
          labelSize="14px"
          ariaValuemax={100}
          ariaValuemin={0}
          ariaValuetext={1}
          width="350px"
          height="15px"
          transitionDuration="0.2s"
          className={styles.ProgressBar}
        />
      )}
      {isDesktopOrLaptop === false && (
        <ProgressBar
          completed={percentage}
          maxCompleted={100}
          bgColor={percentage === 100 ? "#05b841" : "#5b468b"} ///05b841
          baseBgColor="#a28ccf"
          labelAlignment={percentage === 100 ? "center" : "right"}
          labelColor="#ffff"
          labelSize="14px"
          ariaValuemax={100}
          ariaValuemin={0}
          ariaValuetext={1}
          width="170px"
          height="15px"
          transitionDuration="0.2s"
          className={styles.ProgressBar}
        />
      )}
      {/* <i className="fas fa-check-circle"></i> */}
      {percentage !== 100 && (
        <button className={styles.loadingIcon}>
          <ImSpinner9 size="20px" />
        </button>
      )}
      {percentage === 100 && (
        <FontAwesomeIcon className={styles.successIcon} icon={faCheckCircle} />
      )}
    </div>
  );
};

export default LinearProgressBar;
