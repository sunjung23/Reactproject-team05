import React from "react";
import "./Header.css";

function Header() {
  return (
    <header>
      <div>
        <h1>가계부</h1>
        <nav>
          <a href="#" className="hdbtn"> 수입/지출 내역</a>
          <a href="#" className="hdbtn"> 대시보드</a>
          <a href="#" className="hdbtn"> 캘린더</a>
        </nav>
      </div>
    </header>
  );
}

export default Header;