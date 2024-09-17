import React from 'react';
import './App.css';
import http from './utils/http';
import { Outlet } from 'react-router-dom';
import Algo from '../src/views/algo/algo'

function App() {

 

  return (
    <div className="App">
      <header className="App-header">
        <Outlet></Outlet>
        {/* <Algo></Algo> */}
      </header>
    </div>
  );
}

export default App;
