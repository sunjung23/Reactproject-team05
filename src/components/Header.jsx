import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
  return (
    <header>
      <div>
        <Link to="/calendar" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h1>가계부</h1>
        </Link>

        <nav>
          <Link to="/breakdown" className="hdbtn"> 수입/지출 내역</Link>
          <Link to="/dashboard" className="hdbtn"> 대시보드</Link>
          <Link to="/calendar" className="hdbtn"> 캘린더</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;