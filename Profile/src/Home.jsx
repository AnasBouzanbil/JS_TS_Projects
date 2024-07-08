import React, { useState, useEffect, useRef } from 'react';
import navbar, { NavbarPhone } from './navbar';
import imageNormal from './image.png';
import { Avatar, Icon } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { SocialIcon } from 'react-social-icons'
import './App.scss';
import {gsap} from "gsap";
import { useGSAP } from "@gsap/react";
import { motion } from 'framer-motion';
import Articles from './Articles';
import Projects from './projects';
gsap.registerPlugin(useGSAP);

function Meinfo() {
  const boxRef = useRef(null);
  const tlRef = useRef(null);

  useEffect(() => {
    tlRef.current = gsap.timeline();
    tlRef.current.to(boxRef.current, { rotation: 360, duration: 3, yoyo: true, repeat: 1, ease: 'elastic 0.1' });
  }, []);


  return (
    <div className="flex min-h-screen items-center justify-center bg-black font-bold text-white">
      <div className=" text-center space-y-12">
        <div className='text-center text-5xl font-bold' ref={boxRef}>Welcome</div> 
      <div className="text-center text-5xl font-bold">
        I'm 
        <div className="relative inline-grid grid-cols-1 grid-rows-1 gap-12 overflow-hidden">
        <span className="animate-word col-span-full row-span-full">Anas Bouzanbil</span>
        <span className="animate-word-delay-1 col-span-full row-span-full">Software enginner</span>
        <span className="animate-word-delay-2 col-span-full row-span-full">Student</span>
        </div>
    </div>
    <motion.p  className=" text-white" id="test" animate={{ x: 50 }} transition={{ duration: 2 }}>
       I can do anything for fun, or money
    </motion.p>
    <ul className='socail '>

<li className="item">
  <a href="#">
    <SocialIcon className="icon fa-brands fa-instagram" url='instagram.com' />
  </a>
</li>
<li className="item">
  <a href="#">
   <SocialIcon className="icon fa-brands fa-linkedin" url='linkedin.com' />
  </a>
</li>
<li className="item">
  <a href="#" id='tt'>
   <SocialIcon className="icon fa-brands fa-github" url='github.com/elhazin' />
  </a>
</li>
<li className="item ">
  <a href="#">
   <SocialIcon className="icon fa-brands fa-meduim " url='https://medium.com/elhazin' />
  </a>
</li>
<li className="item">
  <a href="#">
   <SocialIcon className="icon fa-brands fa-gmail" url='https://mail.google.com/mail/u/0/#inbox' />
  </a>
</li>
</ul>
  </div>
</div>

    )
}

function ImageAvatar() {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down(767));
  
    const image =  imageNormal;
  
    return (
        <div className='flex avatar  justify-end xs:hidden hidden-at-[634px] '> 
                <Avatar  id='avatar' className=''
                    alt="Anas Bouzanbil"
                    src={image}
                    sx={{ 
                        width: { xs: '100px', sm: '90%', md: '98%', lg: '95%', xl: '85%', mw : '300px' },
                        height: { xs: '100px', sm: '90%', md: '90%', lg: '95%', xl: '85%' },
                        borderRadius: 0,
                        borderBottomLeftRadius: '60%',
                        borderBottomRightRadius: '40%',
                        marginLeft: '10%',
                        marginTop: { xs: '10%', sm: '1%', md: '10%', lg: '-1%', xl: '10%', xm: '5%', mw: '5%'},
                        animation:  'move 5s infinite',
                    }}
                />         
        </div>
    )
}


export default function Home() {
  const d = ()=>{
    const width = window.innerWidth;
    const height = window.innerHeight;

    console.log(`Width: ${width}, Height: ${height}`);   
    alert(`Width: ${width}, Height: ${height}`); 
  }
    return (
      <div className='overflow-y-auto h-screen'>
                  <div class="stars">
  <div class="star"></div>
  <div class="star"></div>
  <div class="star"></div>
  <div class="star"></div>
  
  <div class="star"></div>
  <div class="star"></div>
  <div class="star"></div>
  <div class="star"></div>
  <div class="star"></div>
  <div class="star"></div>
  <div class="star"></div>
  <div class="star"></div>
  <div class="star"></div>
  <div class="star"></div>
  <div class="star"></div>
</div>
        {navbar()}
        <div className='div1 flex flex-row justify-center w-screen h-screen bg-every flex-grow shadow-2xl'>
          <Meinfo />
          <ImageAvatar className="z-index"/>
        </div>
        <div className='div2 flex flex-row justify-center w-screen h-screen bg-every flex-grow'>
          <div className=' bg-slate-700 '>
            <div className=" flex text-white flex-row  justify-around ">
              <Articles />
            </div>
          </div>
        </div>
        <div className='div3 flex flex-row justify-center w-screen h-screen bg-every flex-grow'>
          <div className=' bg-slate-700 '>
            <div className=" flex text-white flex-row  justify-around ">
              <Projects />
            </div>
          </div>
        </div>
      </div>
    );
}