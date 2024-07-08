import React from "react";





export default function preeConnection(){


    return 
    {
        <>
        <div className="container">
        <div className="row mb-3 mt-3 justify-content-md-center">
            <div id="user-name"></div>
            <button id="call" className="btn btn-primary col-1">Call!</button>
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
    }
}








