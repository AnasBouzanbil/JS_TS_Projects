import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { UserContextProvider } from "./components/Context/main";
import { ToastContainer } from 'react-toastify';
import { BrowserRouter } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);


root.render(
  <React.Fragment>
    <UserContextProvider>
    <BrowserRouter>
      <App />
      <ToastContainer />
      {/* <ToastContainer position="bottom-right" newestOnTop /> */}
    </BrowserRouter>
    </UserContextProvider>
  </React.Fragment>
);

/*
  The user should be able to know if he is muted or not.
  There is somthing wrong when i type something in the input field, the member rerendered. ???!
*/