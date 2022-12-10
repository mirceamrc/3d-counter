import React from "react";
import { Pose } from "@mediapipe/pose";
import * as cam from "@mediapipe/camera_utils";
import Webcam from "react-webcam";
import { useRef, useEffect } from "react";
import angleBetweenThreePoints from "./angle";
import { Button } from "@material-ui/core";

const styles = {
  webcam: {
    position: "absolute",
    marginRight: "auto",
    marginLeft: "auto",
    left: 0,
    right: 0,
    top: 400,
    textAlign: "center",
    zIndex: 9,
    width: 480,
    height: 360,
  },
  selectBox: {
    position: "absolute",
    marginRight: "auto",
    marginLeft: "auto",
    left: 0,
    right: 0,
    top: 100,
    textAlign: "center",
    width: 300,
    color: "#ffffff",
    background: "#030cad",
  },
};

const exrInfo = {
  bicepCurls: {
    index: [12, 14, 16],
    ul: 160,
    ll: 50,
  },
  squats: {
    index: [24, 26, 28],
    ul: 170,
    ll: 50,
  },
};

let count = 0;
let dir = 0;
let angle = 0;
function Counter(props) {
  //const [exr, setExr] = useState("bicepCurls");
  let title = props.exercise;
  switch (title) {
    case "bicepCurls":
      title = "Biceps Curls";
      break;
    case "squats":
      title = "Squats";
      break;
    default:
      title = "Workout";
  }

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  //const count = useRef(null);
  //const dir = useRef(null);
  //let angle = useRef();
  let camera = null;
  const countTextbox = useRef(0);

  function onResult(results) {
    if (results.poseLandmarks) {
      const position = results.poseLandmarks;

      // set height and width of canvas
      canvasRef.current.width = webcamRef.current.video.videoWidth;
      canvasRef.current.height = webcamRef.current.video.videoHeight;

      const width = canvasRef.current.width;
      const height = canvasRef.current.height;

      //ratios between 0-1, covert them to pixel positions
      const upadatedPos = [];
      const indexArray = exrInfo[props.exercise].index;

      for (let i = 0; i < 3; i += 1) {
        upadatedPos.push({
          x: position[indexArray[i]].x * width,
          y: position[indexArray[i]].y * height,
        });
      }
      //console.log(upadatedPos);
      angle = Math.round(angleBetweenThreePoints(upadatedPos));
      //console.log("Angle is getting updated ",angle)

      // Count reps
      //0 is down, 1 is up
      if (angle > exrInfo[props.exercise].ul) {
        //console.log("test angle ",angle)
        if (dir === 0) {
          //count.current = count.current + 0.5
          console.log(count, " ", " jos ", angle);
          dir = 1;
        }
      }
      if (angle < exrInfo[props.exercise].ll) {
        if (dir === 1) {
          count = count + 1;
          console.log(count, " ", " sus ", angle);
          dir = 0;
        }
      }

      //console.log(count.current)
      const canvasElement = canvasRef.current;
      const canvasCtx = canvasElement.getContext("2d");
      canvasCtx.save();

      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      //canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height)

      for (let i = 0; i < 2; i++) {
        canvasCtx.beginPath();
        canvasCtx.moveTo(upadatedPos[i].x, upadatedPos[i].y);
        canvasCtx.lineTo(upadatedPos[i + 1].x, upadatedPos[i + 1].y);
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = "white";
        canvasCtx.stroke();
      }
      for (let i = 0; i < 3; i++) {
        canvasCtx.beginPath();
        canvasCtx.arc(upadatedPos[i].x, upadatedPos[i].y, 10, 0, Math.PI * 2);
        canvasCtx.fillStyle = "#AAFF00";
        canvasCtx.fill();
      }
      canvasCtx.font = "40px aerial";
      canvasCtx.fillText(angle, upadatedPos[1].x + 10, upadatedPos[1].y + 40);
      canvasCtx.restore();
    }
  }

  useEffect(() => {
    console.log("rendered");
    count = 0;
    dir = 0;
    //console.log(count.current)
    //console.log("rendered counter")
    const pose = new Pose({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.4.1624666670/${file}`;
      },
    });
    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.5,
    });

    pose.onResults(onResult);

    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null
    ) {
      camera = new cam.Camera(webcamRef.current.video, {
        onFrame: async () => {
          countTextbox.current.value = count;
          //console.log(count, dir)
          //console.log("hello",countTextbox.current.value)
          await pose.send({ image: webcamRef.current.video });
        },
        width: 640,
        height: 480,
      });
      camera.start();
    }
  });
  //console.log(props)
  function resetCount() {
    console.log("reset");
    count = 0;
    dir = 0;
  }

  return (
    <div>
      <div style={styles.selectBox}>
        <h1>{title}</h1>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <h1
            style={{
              marginRight: 8,
              position: "relative",
              top: -13,
            }}
          >
            Count:
          </h1>
          <input
            variant="filled"
            ref={countTextbox}
            value={count}
            textAlign="center"
            style={{
              height: 50,
              fontSize: 40,
              width: 60,
              backgroundColor: "#030cad",
              color: "white",
              border: "none",
            }}
          />
        </div>
        <Button
          style={{ top: 15 }}
          size="large"
          variant="contained"
          color="primary"
          onClick={resetCount}
        >
          Reset Counter
        </Button>
      </div>
      <Webcam ref={webcamRef} style={styles.webcam} />
      <canvas ref={canvasRef} style={styles.webcam} />
    </div>
  );
}

export default Counter;
