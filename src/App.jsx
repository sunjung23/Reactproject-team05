import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Breakdown from './pages/Breakdown';

function App() {
  // 전역 상태로 거래 내역과 현재 월 관리
  const [transactions, setTransactions] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <Home 
              transactions={transactions}
              setTransactions={setTransactions}
              currentMonth={currentMonth}
              setCurrentMonth={setCurrentMonth}
            />
          } 
        />
        <Route 
          path="/breakdown" 
          element={
            <Breakdown
              transactions={transactions}
              currentMonth={currentMonth}
              setCurrentMonth={setCurrentMonth}
            />
          } 
        />
       
      </Routes>
    </Router>
  );
}

export default App;