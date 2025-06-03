import React from 'react';
import './Sidebar.css';

function Sidebar({ currentPage = '캘린더' }) {
  const menuItems = [
    { name: '수입/지출 내역', href: '/transactions' },
    { name: '대시보드', href: '/dashboard' },
    { name: '캘린더', href: '/' }
  ];

  return (
    <div className="sidebar">
      <h3 className="sidebar-title">Menu</h3>
      <div className="sidebar-menu">
        {menuItems.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className={`menu-item ${currentPage === item.name ? 'active' : ''}`}
          >
            {item.name}
          </a>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;