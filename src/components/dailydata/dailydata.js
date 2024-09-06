import React, { useState, useEffect } from 'react';
import './dailydata.css';

export const DailyData = ({ group, date }) => {
    const [userWorkouts, setUserWorkouts] = useState([]);

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
                return 'SH';
            case 'HOLISTIC':
                return 'HOL';
            case 'LEGS-ABS':
                return 'L/A';
            case 'CHEST-TRIS':
                return 'C/T';
            case 'BACK-BIS':
                return 'B/B';
            case 'CHEST-BACK':
                return 'C/B';
            case 'SHOULDER-ARMS':
                return 'SH/A';
            case 'MISCELLANEOUS':
                return 'MISC';
            default:
                return 'unknown'; // Handle unexpected values
        }
    };

    useEffect(() => {
        const workouts = [];
        group?.users?.forEach((user, index) => {
            const userWorkouts = user.workouts || [];
            
            userWorkouts.forEach(workout => {
                if (workout.date === date) {
                    workouts.push({
                        ...workout,
                        name: user.displayName,
                        color: group.colors[index]
                    });
                }
            });
        });
        setUserWorkouts(workouts);
    }, [group, date]);

    return (
        <>
            {userWorkouts.length > 0 ? userWorkouts.map((workout, index) => (
                <div
                    key={index}
                    className='dailydata-box'
                    style={{ borderColor: workout.color, boxShadow: `0 6px ${workout.color}` }}
                >
                    <div className='title-container'>
                        <h1 className='user-title'>{workout.name}</h1>
                        <h2 className='user-subtitle'>{mapCategoryToShortened(workout.category.toUpperCase())}</h2>
                    </div>
                    <div className='time-point'>
                        <div className='time-title'>Duration</div>
                        <div className='time-details'>{workout.duration.hours}h {workout.duration.minutes}m</div>
                    </div>
                    {workout.exercises.map((exercise, i) => (
                        <div key={i} className='exercise-point'>
                            <div className='exercise-title'>{exercise.name}</div>
                            {exercise.sets.map((set, j) => (
                                <div key={j} className='exercise-details'>
                                    {set}x{exercise.reps[j]} @ {exercise.lbs[j]} lbs
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )) : (
                <div className='no-work-message'>No workouts completed today!</div>
            )}
        </>
    );
};
