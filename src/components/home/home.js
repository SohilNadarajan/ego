import React, { useState, useEffect, useRef } from 'react';
import './home.css';
import './calendar.css';
import './mobile.css';
import { SessionPopupForm } from '../sessionpopupform/sessionpopupform.js';
import { TotalData } from '../totaldata/totaldata.js';
import { DailyData } from '../dailydata/dailydata.js';

export const Home = ({ group, user, updateData }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [daysInMonth, setDaysInMonth] = useState([]);
    const [totalCells, setTotalCells] = useState(35);
    const [isScreenVisible, setIsScreenVisible] = useState(false);
    const [isPopupVisible, setIsPopupVisible] = useState(false);

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

        const totalDays = daysArray.length;
        const requiredCells = totalDays > 35 ? 42 : 35;
        setTotalCells(requiredCells);
    }, [currentDate]);

    const handleDateClick = (day) => {
        // Construct the new date based on current month and year
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        setCurrentDate(newDate);
      };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
    };

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(date.getDate()).padStart(2, '0'); // Days are 1-based
    
        return `${year}-${month}-${day}`;
    };

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June', 
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const enableScreen = () => {
        setIsScreenVisible(true);
        setIsPopupVisible(true);
    };

    const disableScreen = () => {
        setIsScreenVisible(false);
        setIsPopupVisible(false);
    };

    const mapCategoryToShortened = (category) => {
        switch (category.toUpperCase()) {
            case 'LEGS':
                return 'LEGS';
            case 'PUSH':
                return 'PUSH';
            case 'PULL':
                return 'PULL';
            case 'ARMS':
                return 'ARMS';
            case 'ABS':
                return 'ABS';
            case 'CHEST':
                return 'CHEST';
            case 'BACK':
                return 'BACK';
            case 'CARDIO':
                return 'CARDIO';
            case 'SHOULDERS':
                return 'SHOULDERS';
            case 'HOLISTIC':
                return 'HOLISTIC';
            case 'LEGS-ABS':
                return 'LEGS/ABS';
            case 'CHEST-TRIS':
                return 'CHEST/TRIS';
            case 'BACK-BIS':
                return 'BACK/BIS';
            case 'CHEST-BACK':
                return 'CHEST/BACK';
            case 'SHOULDER-ARMS':
                return 'SH/ARMS';
            case 'MISCELLANEOUS':
                return 'MISC';
            default:
                return 'unknown'; // Handle unexpected values
        }
    };
 
    return (
        <>
            {isScreenVisible && <div className='cover-screen' onClick={() => disableScreen()}></div>}
            {isPopupVisible &&
            <SessionPopupForm group={group} user={user} updateData={updateData} disableScreen={disableScreen}/>
            }
            <div className='topbar-container'>
                <div className='placeholder' style={{flex: '3'}}></div>
                <div className='top-bar' style={{flex: '10'}}>
                    <div className='calendar-title'>
                        <div className='month-text'>{monthNames[currentDate.getMonth()]}</div>
                        <div className='year-text'>{currentDate.getFullYear()}</div>
                        <div className='month-button' onClick={handlePrevMonth}>&lt;</div>
                        <div className='month-button' onClick={handleNextMonth}>&gt;</div>
                    </div>
                    <div className='workout-button' onClick={() => enableScreen()}>+ Session</div>
                </div>
                <div className='placeholder' style={{flex: '4'}}></div>
            </div>
            <div className='content-container'>
                <div className='totaldata-container'><TotalData group={group}/></div>
                <div className='calendar-container'>
                    <div className='calendar-grid'>
                        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day, index) => (
                            <div key={index} className='calendar-day-header'>{day}</div>
                        ))}
                        {daysInMonth.map((day, index) => (
                            <div key={index} 
                                    className={`calendar-day ${day.length === 0 ? 'empty-day' : ''}`}
                                    onClick={() => handleDateClick(day)}>
                                {day}
                                {group?.users?.map((user, userIndex) => {
                                    // Get the user's workouts for the current day
                                    const userWorkouts = user.workouts || [];
                                    const formattedCurrentDate = formatDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
                            
                                    // Filter workouts to get only those for the current date
                                    const todaysWorkouts = userWorkouts.filter(workout => workout.date === formattedCurrentDate);
                            
                                    return todaysWorkouts.length > 0 ? (
                                        todaysWorkouts.map((workout, workoutIndex) => (
                                            <div 
                                                key={`${user.id}-${workoutIndex}`} // Combine user ID and workout index to ensure unique key
                                                className='calendar-tag'
                                                style={{ background: group.colors[userIndex] }}
                                            >
                                                {mapCategoryToShortened(workout.category.toUpperCase())}
                                            </div>
                                        ))
                                    ) : null;
                                })}
                            </div>
                        ))}
                        {[...Array(totalCells - daysInMonth.length)].map((_, index) => (
                            <div key={`empty-${index}`} className='calendar-day empty-day'></div>
                        ))}
                    </div>
                </div>
                <div className='dailydata-container'><DailyData group={group} date={formatDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()))}/></div>
            </div>
        </>
    );
};
