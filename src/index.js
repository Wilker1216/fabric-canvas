import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { FabricProdivder } from "./context/FabricContext"

ReactDOM.render(
  <React.StrictMode>
    <FabricProdivder>
      <App />
    </FabricProdivder>
  </React.StrictMode>,
  document.getElementById('root')
);
