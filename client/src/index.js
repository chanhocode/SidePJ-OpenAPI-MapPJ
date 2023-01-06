import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/configureStore';
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

  @media (max-width: 600px) {
    width: 100%;
  }
`;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store()}>
        <Background>
          <App className='App'>
            <Nav />
            <Routes>
              <Route path='/' element={<JoinPage />} />
              <Route path='/main' element={<MainPage />} />
            </Routes>
          </App>
        </Background>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
