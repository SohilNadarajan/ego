import React, { useState, useEffect } from 'react';
import './calendar.css';

export const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [daysInMonth, setDaysInMonth] = useState([]);
  
  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth(); // 0-indexed: 0 = January, 7 = August
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();

    let daysArray = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      daysArray.push('');
    }
    for (let day = 1; day <= daysInCurrentMonth; day++) {
      daysArray.push(day);
    }

    setDaysInMonth(daysArray);
  }, [currentDate]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <>
      <div className="calendar-header">
        <button onClick={handlePrevMonth}>Prev</button>
        <span>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
        <button onClick={handleNextMonth}>Next</button>
      </div>
      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
          <div key={index} className="calendar-day-header">{day}</div>
        ))}
        {daysInMonth.map((day, index) => (
          <div key={index} className="calendar-day">{day}</div>
        ))}
      </div>
    </>
  );
};