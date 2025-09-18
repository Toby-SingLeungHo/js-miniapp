import React, { useState, useEffect } from 'react';

import { Card, Grid, Button, makeStyles } from '@material-ui/core';
import { sendAnalytics } from './helper';
import { MAAnalyticsActionType, MAAnalyticsEventType } from 'js-miniapp-sdk';

import Webcam from 'react-webcam';

const useStyles = makeStyles((theme) => ({
  root: {
    height: 'auto',
    width: '100%',
    overflowY: 'auto', // Add this line to make the page scrollable
  },
  grid: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '20px',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'center',
    padding: '20px',
  },
  table: {
    minWidth: '80%',
  },
  content: {
    height: '50%',
    justifyContent: 'space-between',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontSize: 18,
    color: theme.color.primary,
    fontWeight: 'bold',
  },
  contentSection: {
    padding: '10px',
  },
  label: {
    display: 'block',
    fontSize: 12,
    width: '100%',
    color: theme.color.primary,
  },
  imageBox: {
    height: '250px',
    margin: '20px',
  },
  imageBoxContent: {
    height: '250px',
    objectFit: 'contain',
  },
}));
const speechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = speechRecognition && new speechRecognition();
if (recognition) {
  recognition.lang = 'en-US';
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    document.getElementById('output').innerText =
      event.results[0][0].transcript;
  };
}

const Camera = () => {
  const [image, setImage] = useState();
  const [videoConstraints, setVideoConstraints] = useState();
  const [audioConstraints, setAudioConstraints] = useState();

  const [cameraPermission, setCameraPermission] = useState('Checking...');
  const [microphonePermission, setMicrophonePermission] =
    useState('Checking...');
  const [isMuted, setIsMuted] = useState(true);
  const [cameraIndex, setViewingCamera] = useState('user');
  const [listOfCameraDevices, setListOfCameraDevices] = useState([]);

  const webcamRef = React.useRef(null);
  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  }, [webcamRef]);
  const classes = useStyles();

  useEffect(() => {
    sendAnalytics(
      MAAnalyticsEventType.appear,
      MAAnalyticsActionType.open,
      'Camera',
      'Screen',
      'Page',
      ''
    );
  });

  const requestPermission = React.useCallback(
    async (type) => {
      let devices;
      if(navigator.mediaDevices.enumerateDevices){
        devices = await navigator.mediaDevices.enumerateDevices();
        devices = devices.filter((val) => val.kind === 'videoinput');
        setListOfCameraDevices(devices);
      }

      let status = 'denied';

      const _videoConstraints = {
        width: 640,
        height: 480,
      };
      if (devices?.length>0) setViewingCamera(devices[0].deviceId);

      if (cameraIndex === 'user' || cameraIndex === 'environment')
        _videoConstraints.facingMode = cameraIndex;
      else _videoConstraints.deviceId = cameraIndex;

      try {
        const newConstraints = {};
        newConstraints.audio =
          microphonePermission === 'granted' || type === 'microphone'
            ? { echoCancellation: true }
            : false;
        newConstraints.video =
          cameraPermission === 'granted' || type === 'camera'
            ? _videoConstraints
            : false;
        await navigator.mediaDevices.getUserMedia(newConstraints);
        status = 'granted';
        setVideoConstraints(newConstraints.video);
        setAudioConstraints(newConstraints.audio);
      } catch (error) {
        alert(`getUserMedia::error -> ${error}`);
        status = 'denied';
        setVideoConstraints(undefined);
        setAudioConstraints(undefined);
      }
      updateStatus(type, status);
    },
    [cameraIndex, microphonePermission, cameraPermission]
  );

  useEffect(() => {
    if (cameraPermission !== 'Checking...' && cameraPermission !== 'denied') {
      console.log('requestPermission requested');
      requestPermission('camera').finally(() => {
        console.log('requestPermission done');
      });
    }
  }, [cameraIndex, cameraPermission, microphonePermission, requestPermission]);

  const updateStatus = function (type, status) {
    if (type === 'microphone') setMicrophonePermission(status);
    if (type === 'camera') setCameraPermission(status);
  };

  const switchMute = () => {
    setIsMuted(!isMuted);
    setVideoConstraints(undefined);
    setAudioConstraints(undefined);
  };

  const switchCamera = (dev) => {
    setViewingCamera(
      dev ? dev.deviceId : cameraIndex === 'user' ? 'environment' : 'user'
    );
    setListOfCameraDevices([]);
    setVideoConstraints(undefined);
    setAudioConstraints(undefined);
    setCameraPermission('Changed');
  };

  const onUserMedia = (stream) => {
    console.log(`onUserMedia::${stream}`);
  };

  const onUserMediaError = (error) => {
    console.error(`onUserMediaError::error -> ${error}`);
  };

  return (
    <Card className={classes.root}>
      <Grid className={classes.grid} align="center">
        <div className={classes.contentSection}>
          {/* <Grid className={classes.buttons}>{buttons}</Grid> */}
          {cameraPermission === 'granted'
            ? [
                listOfCameraDevices.map((val) => [
                  <Button
                    key={val.deviceId}
                    variant="contained"
                    color="primary"
                    disabled={val.deviceId === cameraIndex}
                    onClick={() => switchCamera(val)}
                  >
                    {val.label}
                  </Button>,
                  <>&nbsp;</>,
                ]),
                <br />,
                <Webcam
                  mirrored={true}
                  audio={!isMuted}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                  audioConstraints={audioConstraints}
                  onUserMedia={onUserMedia}
                  onUserMediaError={onUserMediaError}
                  width="100%"
                  screenshotQuality="1"
                ></Webcam>,
                <br />,
                microphonePermission === 'granted'
                  ? [
                      <Button
                        key="muteButton"
                        variant="contained"
                        color="primary"
                        onClick={switchMute}
                      >
                        {isMuted ? 'Unmute' : 'Mute'}
                      </Button>,
                      <br />,
                    ]
                  : null,
                <br />,
                <Button
                  key="screenshotButton"
                  variant="contained"
                  color="primary"
                  onClick={capture}
                >
                  Get ScreenShot
                </Button>,
                <br />,
              ]
            : null}
          <div
            id="imageBox"
            className={classes.imageBox}
            hidden={image == null}
          >
            <img
              id="imageBoxContent"
              alt="CapturedPicture"
              className={classes.imageBoxContent}
              src={image}
            />
          </div>
        </div>
        <div className={classes.contentSection}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => requestPermission('camera')}
          >
            Request Camera Permission
          </Button>
          <label className={classes.label}>{cameraPermission}</label>
        </div>
        <div className={classes.contentSection}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => requestPermission('microphone')}
          >
            Request Microphone Permission
          </Button>
          <label className={classes.label}>{microphonePermission}</label>
        </div>
        <div className={classes.contentSection}>
          <Button
            id="start"
            variant="contained"
            color="primary"
            onClick={() => recognition.start()}
          >
            Start Speech Recognition
          </Button>
        </div>
        <div className={classes.contentSection}>
          <Button
            id="stop"
            variant="contained"
            color="primary"
            onClick={() => recognition.stop()}
          >
            Stop Speech Recognition
          </Button>
        </div>
        <div className={classes.contentSection}>
          <label id="output" className={classes.label}></label>
        </div>
      </Grid>
    </Card>
  );
};

export { Camera };
export default Camera;
