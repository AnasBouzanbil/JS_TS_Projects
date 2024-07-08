import React, { useState, useEffect } from "react";

import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:4000';

const constraints = {
  audio: true,
  video: true,
};
export const socket = io(URL);

export default function Myvideo() {
  const [stream, setStream] = useState(null);
  const videoel = document.querySelector('#my-video');
  var mediaRecoder ;
  let reacorderblobs = [];
  let localsream;
  let remoteSTream;
  let preeConnection;

const startRecoder = (e) =>
{
    mediaRecoder = new MediaRecorder(stream);
    mediaRecoder.ondataavailable = a=>{
        console.log("data is availible for daat recoder : " + a.data);
        reacorderblobs.push(a.data);
      }

    mediaRecoder.start();

}

const stopRecoder = () =>
{
  mediaRecoder.stop();
}
const playRecoder = (e) =>
{
    const buffer = new Blob(reacorderblobs);
    const videorecorderel = document.querySelector('#other-video');
    videorecorderel.src = window.URL.createObjectURL(buffer);
    videorecorderel.controls = true;
    videorecorderel.play();
}
const getMicCam = async () => 
{
  try 
  {
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);
  } catch (error) {
      console.error("Error accessing media devices:", error);
      }
};

const showmyFeed = () => {
  if (stream != null)
    videoel.srcObject = stream;
  };

const stopVideo = () => {
  if (stream) {
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
    setStream(null); // Clear stream state
  }
};

  // Add functions for changing video size, recording, etc. (implement logic)

  useEffect(() => {
    const showVideoButton = document.getElementById("show-video");
    showVideoButton.addEventListener("click", showmyFeed);

    return () => {
      showVideoButton.removeEventListener("click", showmyFeed);
    };
  }, []);

  return (
    <>
      <div className="container row">
        <div className="buttons col-4">
          <button id="share" onClick={getMicCam} className="btn btn-primary d-block mb-1">
            Share my mic and camera
          </button>
          <button id="show-video" onClick={showmyFeed} className="btn btn-secondary d-block mb-1">
            Show My Video
          </button>
          <button id="stop-video" onClick={stopVideo} className="btn btn-secondary d-block mb-1">
            Stop My Video
          </button>
        </div>
        <div class="mb-1">
                <button id="start-record" onClick={startRecoder} className="btn btn-secondary mb-1">Start recording</button>
                <button id="stop-record" onClick={stopRecoder} className="btn btn-secondary mb-1">Stop Recording</button>
                <button id="play-record" onClick={playRecoder} className="btn btn-secondary mb-1">Play Recording</button>
            </div>
            <button id="share-screen" className="btn btn-secondary d-block mb-1">Share Screen</button>
            <div>
                <label>Select audio input: </label>
                <select id="audio-input"></select>
            </div>
            <div>
                <label>Select audio output: </label>
                <select id="audio-output"></select>
            </div>
            <div>
                <label>Select video input: </label>
                <select id="video-input"></select>
            </div>

        <div className="videos col-8">
          <div>
            <h3>My feed</h3>
            <video id="my-video" className="video" autoPlay controls playsInline srcObject={stream} />
          </div>
            <div>
                <h3>Their feed</h3>
                <video id="other-video"  className="video" autoPlay playsInline></video>
            </div>
        </div>
    </div>
        </>
    )
}