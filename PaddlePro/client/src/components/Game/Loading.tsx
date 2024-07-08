import React from "react";
import './Style_Files/Loading.css';



export default function Loading() {


    return (
    <>
        <div className="wrapper">
            <div className="left_wall"></div>
            <div className="ball"></div>
            <div className="right_wall"></div>
            <div className="clear"></div>
        </div>
        <div className="PaddlePro">
            <div className="paddle">
                <h1 className="text1">Paddle</h1>
            </div>
            <div className="pro">
                <h1 className="text2">Pro</h1>
            </div>
        </div>
    </>
    )
}



export function Loading2() {
    return (
        <>
        <div className="center">
        <div className="flex">
          <div className="wave"></div>
          <div className="wave"></div>
          <div className="wave"></div>
          <div className="wave"></div>
          <div className="wave"></div>
          <div className="wave"></div>
          <div className="wave"></div>
          <div className="wave"></div>
          <div className="wave"></div>
          <div className="wave"></div>
          <div className="wave"></div>
          <div className="wave"></div>
          <div className="wave"></div>
        </div>
        <div className="text flex flex-row space-x-2 md:space-x-3 lg:space-x-4 xl:space-x-5 2xl:space-x-6 mt-9 ">
            <div className="char">L</div>
            <div className="char">O</div>
            <div className="char">A</div>
            <div className="char">D</div>
            <div className="char">I</div>
            <div className="char">N</div>
            <div className="char">G</div>
            <div className="char">.</div>
            <div className="char">.</div>
            <div className="char">.</div>

        </div>
        </div>
        </>
    )
}