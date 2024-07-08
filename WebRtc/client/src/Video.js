import { DOM_KEY_LOCATION } from "@testing-library/user-event/dist/keyboard/types";
import React, { useState, useEffect } from "react";

import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
// const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:4000';

// const constraints = {
//   audio: true,
//   video: true,
// };
// export const socket = io(URL);

export default function Myvideo() {
  let localVideoEL;
  let remoteVideoEL;
  useEffect(()=>
  {
    localVideoEL = document.querySelector('#local-video');
    remoteVideoEL = document.querySelector('#remote-video');
    console.log('localVideoEL:', localVideoEL);
    console.log('remoteVideoEL:', remoteVideoEL);
    
    
  },[])
  
  
    let locaLsream;
    let remoteStream;
   let  peerConnection;
 let peerConf = {
  iceServers: [{
    urls: [
      'stun:stun.l.google.com:19302',
      'stun:stun1.l.google.com:19302'
    ]
  }]
}

  const call = async (e) =>{
    const stream = await navigator.mediaDevices.getUserMedia({
      video : true,
      audio : true,
    });
    if (stream == null)
      alert("error stream is " + stream);
    localVideoEL.srcObject = stream;
    locaLsream = stream;
   await createPeerConnection();
    try {
      console.log('creating offer ...');
      const offer  = await peerConnection.createOffer();
      console.log(offer);
    }
    catch(err)
    {
      console.log("catch error is  " + err);
    }
  }


  const createPeerConnection =  () =>{
    return new Promise (async (resolve, reject) =>
    {
      peerConnection = await new RTCPeerConnection(peerConf)

      locaLsream.getTracks().forEach(element => {
        peerConnection.addTrack(element, locaLsream);
        
      });
      peerConnection.addEventListener('icecandidate', e=>{
      console.log(".............yao yao ...........\n", e);
    })
    resolve();
  })
  }

  return (
    <>
    <div className="containerr">
    <div className="row mb-3 mt-3 justify-content-md-center">
        <div id="user-name"></div>
        <button id="call" onClick={call} className="btn btn-primary col-1">Call!</button>
        <button id="hangup" className="col-1btn btn-primary">Hangup</button>
        <div id="answer" className="col"></div>AAAA
    </div>
    <div id="videos">
    <div id="video-wrapper">
        <div id="waiting" className="btn btn-warning">Waiting for answer...</div>
        <video className="video-player" id="local-video" autoPlay playsInline controls></video>
    </div>
    <video className="video-player" id="remote-video" autoPlay playsInline controls></video>
    </div>
     </div>   
    </>
    )
}