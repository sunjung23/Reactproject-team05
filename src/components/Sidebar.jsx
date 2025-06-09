import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

function Sidebar({ currentPage = '캘린더' }) {
  const menuItems = [
    { name: '수입/지출 내역', href: '/breakdown' },
    { name: '대시보드', href: '/dashboard' },
    { name: '캘린더', href: '/' }
  ];

  return (
    <div className="sidebar">
      <h3 className="sidebar-title">Menu</h3>
      <div className="sidebar-menu">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`menu-item ${currentPage === item.name ? 'active' : ''}`}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;