import React, { useRef, useState } from "react";
import styles from "../styles/Main.module.css";
import { AiFillDropboxSquare } from "react-icons/ai";
import Tilt from "react-parallax-tilt";
import axios from "axios";
import LinearProgressBar from "./LinearProgressBar";
import Notifications from "./Notifications";
import { toast, ToastContainer } from "react-toastify";

const Main = () => {
  const hiddenFileInput = useRef();
  const [progress, setProgress] = useState(0);
  const [tiltEnabled, setTiltEnabled] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showProgress, setShowProgress] = useState(false);

  const handleSelectFiles = (event) => {
    hiddenFileInput.current.click();
  };

  const handleChange = (event) => {
    setShowProgress(false);
    var files = [...event.target.files];
    files = files.filter((file) => file.name.includes([".doc" || ".docx"]));

    if (files.length !== event.target.files.length) {
      event.target.value = null;
      setSelectedFiles([]);
      Notifications.notifyError("Select only .docx or .doc files !");
    } else {
      setSelectedFiles([...event.target.files]);
    }
    console.log(event.target.files);
  };

  const handleUpload = (event) => {
    setShowProgress((value) => !value);
    event.preventDefault();
    event.target.disabled = true;
    var formData = new FormData();
    selectedFiles.map((file) => {
      formData.append("file", file);
    });

    axios({
      // url: "http://localhost:3123/upload-word-file",
      //url: "https://trade-go.herokuapp.com/upload-word-file",
      url: "https://docs-to-pdf-converter.herokuapp.com/word-to-pdf",
      method: "POST",
      responseType: "blob",
      data: formData,
      onUploadProgress: (progressEvent) => {
        console.log(
          "Whether progress can be detected ? " + progressEvent.lengthComputable
        );
        if (progressEvent.lengthComputable) {
          const { loaded, total } = progressEvent;
          var percentage = Math.floor((loaded * 100) / total);
          console.log(
            `Progress ${loaded / 1000}kb of ${total}\nPercentage: ${percentage}`
          );
          if (percentage === 100) {
            selectedFiles.length > 1
              ? Notifications.notifySuccess("Files Uploaded Successfully !")
              : Notifications.notifySuccess("File Uploaded Successfully !");
            Notifications.notifyLoading();
          }
          setProgress(percentage);
        } else {
          setProgress(100);
        }
      },
    })
      .then((result) => {
        toast.dismiss("success");
        setProgress(0);
        setSelectedFiles([]);
        if (result.status === 200) {
          Notifications.notifyConversionSuccess("loading");
          console.log(result);

          const url = window.URL.createObjectURL(new Blob([result.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "file.zip");
          document.body.appendChild(link);
          link.click();
          link.remove();
        } else {
          Notifications.notifyConversionError("loading");
        }
      })
      .catch((err) => {
        setSelectedFiles([]);
        console.log(err);
        toast.dismiss("success");
        if (toast.isActive("loading")) {
          Notifications.notifyConversionError("loading");
        } else {
          Notifications.notifyError("Something went wrong . Try Again !");
        }
      });
    //event.target.disabled = true;
  };
  // if (selectedFiles.length > 0) {
  //   selectedFiles.map((file) =>
  //     console.log(`${file.name}\n${file.type}\n${file.size / 1000}KB\n`)
  //   );
  // }
  // var demoProgress = setInterval(() => {
  //   if (progress < 100) {
  //     setProgress((progress) => progress + 1);
  //   } else {
  //     clearInterval(demoProgress);
  //   }
  // }, 5000);
  return (
    <main className={styles.main}>
      <ToastContainer theme="colored" autoClose={5000} position="top-right" />
      <div className={styles.header}>
        <h1>Word to PDF Converter !</h1>
        <button
          className={styles.stopTilt}
          onClick={() => {
            setTiltEnabled((value) => !value);
          }}
        >
          {tiltEnabled ? "Disable Tilt Effect" : "Enable Tilt Effect"}
        </button>
      </div>
      <div className={styles.circleDiv}></div>
      <Tilt
        className={styles.tiltDiv}
        tiltEnable={tiltEnabled}
        glareEnable={tiltEnabled}
        tiltMaxAngleX="40"
        tiltMaxAngleY="40"
        glarePosition={tiltEnabled ? "all" : ""}
        scale="1"
        perspective={4000}
        glareBorderRadius={tiltEnabled ? "15px" : ""}
        glareMaxOpacity={tiltEnabled ? "0.5" : ""}
        glareColor={tiltEnabled ? "#c9c9c9" : ""}
        gyroscope={tiltEnabled}
        transitionSpeed={tiltEnabled ? "1300" : ""}
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
            <p>
              <AiFillDropboxSquare className={styles.dropIcon} />
              <br />
              Drop your files here !
            </p>
          </button>
          {selectedFiles.length > 0 && (
            <div className={styles.fileDisplay}>
              {selectedFiles.map((file, index) => {
                return (
                  <div className={styles.pgbarfileWrapper} key={index}>
                    <div className={styles.singleFileDiv}>
                      <p className={styles.fileinfo}>
                        {index + 1}&ensp;.&ensp;{file.name} &nbsp;&nbsp;&nbsp;
                      </p>
                      <p className={styles.fileSize}>{file.size / 1000} KB</p>
                    </div>
                    {/* <CircularProgressBar
                      value={progress}
                      display={showProgress ? false : true}
                    /> */}
                  </div>
                );
              })}
              {showProgress && (
                <LinearProgressBar
                  value={progress}
                  hidden={showProgress ? true : false}
                />
              )}
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
