import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import styled from 'styled-components';
import './index.css';

import MainPage from './pages/MainPage';
import JoinPage from './pages/JoinPage';
import Nav from './components/Nav';

const Background = styled.div`
  background-color: #a3bb98;
  width: 100%;
  min-height: 100vh;
  margin: 0px;
`;
const App = styled.div`
  width: 600px;
  height: 100vh;
  margin-left: auto;
  margin-right: auto;
  background-color: #3c6255;

`;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Background>
        <App className='App'>
          <Nav />
          <Routes>
            <Route path='/' element={<MainPage />} />
            <Route path='/join' element={<JoinPage />} />
          </Routes>
        </App>
      </Background>
    </BrowserRouter>
  </React.StrictMode>
);
