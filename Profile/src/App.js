import './App.css';
import React, { useState, useRef, useEffect } from 'react';
import { MotionConfig, motion } from "framer-motion"
import { MotionCanvas, motion as motion3d } from "framer-motion-3d"
import { useAnimationFrame } from "framer-motion"
import { useAnimate, usePresence } from "framer-motion"
import navbar from './navbar';
import Home from './Home';
import { Route, Routes } from 'react-router';
import Projects from './projects';

function profilesection(){


  return (
      <div className="flex justify-center items-center bg-slate-700 w-2/3 h-2/3">
        <div className="bg-white justify-start justify-start shadow-lg">
          <div className='Hello'>Hello</div>
        </div>
      </div>
      
  );
}

function App() {
  return (
    
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path='/projects' element={<Projects />} />

    </Routes>
  );
}
export default App;
