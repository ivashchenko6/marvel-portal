import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import App from './components/app/App';

import './style/style.scss';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App/>

  </StrictMode>
);