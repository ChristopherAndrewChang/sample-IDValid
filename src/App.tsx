import React from 'react';
import { Link } from 'react-router';

import logo from './logo.svg';

import './App.css';

function App() {
  return (
    <div className="App">
      <Link to="/integration">
        Integration
      </Link>
    </div>
  );
}

export default App;
