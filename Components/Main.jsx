import React, { useRef, useState } from "react";
import styles from "../styles/Main.module.css";
import { AiFillDropboxSquare } from "react-icons/ai";
import Tilt from "react-parallax-tilt";
import ProgressBar from "./ProgressBar";
const Main = () => {
  const hiddenFileInput = useRef();
  const fileTypes = [".doc", ".docx"];
  const [tiltEnabled, setTiltEnabled] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showProgress, setShowProgress] = useState(false);
  const handleSelectFiles = (event) => {
    hiddenFileInput.current.click();
  };
  const handleChange = (event) => {
    var files = [...event.target.files];
    files = files.filter((file) => file.name.includes([".doc" || ".docx"]));

    if (files.length !== event.target.files.length) {
      event.target.value = null;
      setSelectedFiles([]);
      alert("Select only .doc or .docx files !");
    } else {
      setSelectedFiles([...event.target.files]);
    }

    let formData = new FormData();

    // for (var i = 0; i < event.target.files.length; i++) {
    //   console.log(event.target.files[i]);
    // }
    // for (const key of Object.keys(selectedFiles)) {
    //   formData.append("imagesArray", selectedFiles[key]);
    // }
    //console.log(formData);
    //console.log(selectedFiles);

    // for (var i = 0; i < event.target.files.length; i++) {
    //   console.log(event.target.files[i].name);
    //   console.log(event.target.files[i].size / 1000 + " KB");
    //   console.log(event.target.files[i].type);
    // }

    console.log(event.target.files);
    // console.log(file.name);
    // console.log(file.size / 1000 + " KB");
    // console.log(file.type);
  };
  const handleUpload = (event) => {
    event.preventDefault();
    event.target.disabled = true;
    setShowProgress(true);
  };
  if (selectedFiles.length > 0) {
    selectedFiles.map((file) =>
      console.log(`${file.name}\n${file.type}\n${file.size / 1000}KB\n`)
    );
  }
  // var demoProgress = setInterval(() => {
  //   if (progress < 100) {
  //     setProgress((progress) => progress + 1);
  //   } else {
  //     clearInterval(demoProgress);
  //   }
  // }, 5000);
  return (
    <main className={styles.main}>
      <button
        className={styles.stopTilt}
        onClick={() => setTiltEnabled((value) => !value)}
      >
        {tiltEnabled ? "Disable Tilt Effect" : "Enable Tilt Effect"}
      </button>
      <div className={styles.circleDiv}></div>
      <Tilt
        className={styles.tiltDiv}
        tiltEnable={tiltEnabled}
        glareEnable={tiltEnabled}
        tiltMaxAngleX="30"
        tiltMaxAngleY="30"
        glarePosition={tiltEnabled ? "all" : ""}
        scale="1"
        perspective="1000"
        glareBorderRadius={tiltEnabled ? "15px" : ""}
        glareMaxOpacity={tiltEnabled ? "0.5" : ""}
        glareColor={tiltEnabled ? "#c9c9c9" : ""}
        gyroscope={tiltEnabled}
        transitionSpeed={tiltEnabled ? "1000" : ""}
      >
        <div className={styles.form}>
          <input
            type="file"
            multiple
            accept=".doc,.docx"
            ref={hiddenFileInput}
            style={{ display: "none" }}
            onChange={handleChange}
          ></input>
          <button onClick={handleSelectFiles} className={styles.selectBtn}>
            <pre>
              <AiFillDropboxSquare className={styles.dropIcon} />
              <br />
              Drop your files here !
            </pre>
          </button>
          {selectedFiles.length > 0 && (
            <div className={styles.fileDisplay}>
              {selectedFiles.map((file, index) => {
                return (
                  <div className={styles.pgbarfileWrapper}>
                    <div className={styles.singleFileDiv} key={index}>
                      <p className={styles.fileinfo}>
                        {file.name} &nbsp;&nbsp;&nbsp;
                      </p>
                      <p className={styles.fileSize}>{file.size / 1000} KB</p>
                    </div>

                    {showProgress && <ProgressBar value={0} />}
                  </div>
                );
              })}
              <button
                className={styles.uploadBtn}
                onClick={handleUpload}
                name="uploadbtn"
                type="button"
              >
                Convert to PDF
              </button>
            </div>
          )}
        </div>
      </Tilt>
    </main>
  );
};

export default Main;
