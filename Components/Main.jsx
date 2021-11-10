import React, { useRef, useState } from "react";
import styles from "../styles/Main.module.css";
import { AiFillDropboxSquare } from "react-icons/ai";
import Tilt from "react-parallax-tilt";
import axios from "axios";
import LinearProgressBar from "./LinearProgressBar";
import Notifications from "./Notifications";
import { toast, ToastContainer } from "react-toastify";
import { Tooltip, tooltipClasses } from "@mui/material";
import { styled } from "@mui/material/styles";
import Select from "react-select";

const Main = () => {
  const BootstrapTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: theme.palette.common.black,
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.black,
      fontSize: "10pt",
      padding: "10px 25px 10px 25px",
      textAlign: "center",
    },
  }));
  const selectOptions = [
    {
      value: "normal-conversion",
      label: "Word to PDF (Normal)",
      url: "https://docs-to-pdf-converter.herokuapp.com/word-to-pdf",
    },
    {
      value: "merged-conversion",
      label: "Word to PDF (Single Merged File)",
      url: "https://docs-to-pdf-converter.herokuapp.com/words-to-pdf-merged",
    },
  ];
  const hiddenFileInput = useRef();
  const [progress, setProgress] = useState(0);
  const [tiltEnabled, setTiltEnabled] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showProgress, setShowProgress] = useState(false);
  const [converterType, setConverterType] = useState(selectOptions[0]);
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
      url: converterType.url,
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
          console.log(result.data.type);
          const url = window.URL.createObjectURL(new Blob([result.data]));
          const link = document.createElement("a");
          link.href = url;
          result.data.type === "application/zip"
            ? link.setAttribute("download", "ConvertedFile.zip")
            : link.setAttribute("download", "ConvertedPDF.pdf");
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
  return (
    <main className={styles.main}>
      <ToastContainer theme="colored" autoClose={5000} position="top-right" />
      <div className={styles.header}>
        <h1>{converterType.label} Converter !</h1>
        <div className={styles.selectandbuttonWrapper}>
          <form>
            <Select
              isClearable={false}
              instanceId="wordtopdf@645"
              isSearchable={false}
              value={converterType}
              onChange={(option) => setConverterType(option)}
              className={styles.select}
              options={selectOptions}
              placeholder="Select Converter Type ..."
            ></Select>
          </form>
          <BootstrapTooltip title="Toggle Tilt Effect">
            <button
              className={styles.stopTilt}
              onClick={() => {
                setTiltEnabled((value) => !value);
              }}
            >
              {tiltEnabled ? "Disable Tilt Effect" : "Enable Tilt Effect"}
            </button>
          </BootstrapTooltip>
        </div>
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
