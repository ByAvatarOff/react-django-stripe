import { ButtonContextProvider } from './AuthComponent/components/LoginContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ButtonContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </BrowserRouter>
    </ButtonContextProvider>

);