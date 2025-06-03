import React from 'react';
import './Calendar.css';

function Calendar({ currentMonth, selectedDate, onDateSelect }) {
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  const offset = firstDay.getDay();
  const totalDays = lastDay.getDate();

  const calendar = Array(offset).fill(null).concat(Array.from({ length: totalDays }, (_, i) => i + 1));

  return (
    <div className="box">
      <div className="month-nav">
        <button onClick={() => onDateSelect('prev')}>◀</button>
        <h2 className="month">
          {currentMonth.getFullYear()}년 {String(currentMonth.getMonth() + 1).padStart(2, '0')}월
        </h2>
        <button onClick={() => onDateSelect('next')}>▶</button>
      </div>
      <div className="grid">
        {['일', '월', '화', '수', '목', '금', '토'].map(day => (
          <div key={day} className="grid-header">{day}</div>
        ))}
        {calendar.map((day, idx) => (
          <div
            key={idx}
            className={`grid-cell ${day && selectedDate === day ? 'selected' : ''}`}
            onClick={() => day && onDateSelect('day', day)}
          >
            {day || ''}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Calendar;