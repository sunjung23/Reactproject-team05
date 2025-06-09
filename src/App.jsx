import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TransactionProvider } from './components/Transaction';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Breakdown from './pages/Breakdown';
import './App.css';

function App() {
  return (
    <TransactionProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/breakdown" element={<Breakdown/>} />
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </Router>
    </TransactionProvider>
  );
}

export default App;