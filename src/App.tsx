import React from 'react';
import './App.css';
import http from './utils/http';
import { Outlet } from 'react-router-dom';

function App() {

 

  return (
    <div className="App">
      <header className="App-header">
        <Outlet></Outlet>
      </header>
    </div>
  );
}

export default App;
