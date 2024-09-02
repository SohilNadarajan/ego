import React, { useState, useEffect } from 'react';
import {
    doc, getDocs, getDoc, setDoc, updateDoc, addDoc,
    arrayUnion,
    Timestamp,
    collection, query, where } from 'firebase/firestore';
import { db, auth, googleProvider } from '../../config/firebase';
import './dailydata.css';

export const DailyData = ({ group, date }) => {
	const [userWorkouts, setUserWorkouts] = useState([]);

	const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(date.getDate()).padStart(2, '0'); // Days are 1-based
    
        return `${year}-${month}-${day}`;
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
                return 'SH';
            case 'HOLISTIC':
                return 'HOL';
            case 'LEGS-ABS':
                return 'L/A';
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
		var workouts = [];
		group?.users?.map((user, index) => {
			const userWorkouts = user.workouts || [];
			
			userWorkouts.some(workout => {
				if (workout.date === date) {
					workouts.push({
						...workout,
						name: user.displayName,
						category: workout.category,
						exercises: workout.exercises,
						color: group.colors[index]
					});
				}
			});
			return null;
		});
		console.log(workouts);
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
                            <div className='exercise-details'>{exercise.sets}x{exercise.reps} @ {exercise.lbs} lbs</div>
                        </div>
                    ))}
                </div>
            )) : (
				<div className='no-work-message'>No workouts completed today!</div>
			)}
        </>
	/*
    <>
		<div className='dailydata-box' 
			 style={{borderColor: 'dodgerblue', boxShadow: '0 6px dodgerblue'}}>
			<div className='title-container'>
				<h1 className='user-title'>Sohil</h1>
				<h2 className='user-subtitle'>LEGS</h2>
			</div>
			<div className='time-point'>
				<div className='time-title'>Duration</div>
				<div className='time-details'>55m</div>
			</div>
			<div className='exercise-point'>
				<div className='exercise-title'>Tricep Pushdown</div>
				<div className='exercise-details'>4x8 @ 50 lbs</div>
				<div className='exercise-details'>2x10 @ 45 lbs</div>
			</div>
			<div className='exercise-point'>
				<div className='exercise-title'>Shoulder Raises</div>
				<div className='exercise-details'>4x8 @ 10 lbs</div>
			</div>
			<div className='exercise-point'>
				<div className='exercise-title'>Chest Fly</div>
				<div className='exercise-details'>4x8 @ 90 lbs</div>
			</div>
		</div>
		<div className='dailydata-box'
			 style={{borderColor: 'orange', boxShadow: '0 6px orange'}}>
			<div className='title-container'>
				<h1 className='user-title'>Sidharth</h1>
				<h2 className='user-subtitle'>C/B</h2>
			</div>
			<div className='time-point'>
				<div className='time-title'>Duration</div>
				<div className='time-details'>1h 25m</div>
			</div>
			<div className='exercise-point'>
				<div className='exercise-title'>Tricep Pushdown</div>
				<div className='exercise-details'>4x8 @ 50 lbs</div>
				<div className='exercise-details'>2x10 @ 45 lbs</div>
			</div>
			<div className='exercise-point'>
				<div className='exercise-title'>Shoulder Raises</div>
				<div className='exercise-details'>4x8 @ 10 lbs</div>
			</div>
			<div className='exercise-point'>
				<div className='exercise-title'>Chest Fly</div>
				<div className='exercise-details'>4x8 @ 90 lbs</div>
			</div>
		</div>
		<div className='dailydata-box'
			 style={{borderColor: 'red', boxShadow: '0 6px red'}}>
			<div className='title-container'>
				<h1 className='user-title'>Maxim</h1>
				<h2 className='user-subtitle'>PUSH</h2>
			</div>
			<div className='time-point'>
				<div className='time-title'>Duration</div>
				<div className='time-details'>1h 5m</div>
			</div>
			<div className='exercise-point'>
				<div className='exercise-title'>Tricep Pushdown</div>
				<div className='exercise-details'>4x8 @ 50 lbs</div>
				<div className='exercise-details'>2x10 @ 45 lbs</div>
			</div>
			<div className='exercise-point'>
				<div className='exercise-title'>Shoulder Raises</div>
				<div className='exercise-details'>4x8 @ 10 lbs</div>
			</div>
			<div className='exercise-point'>
				<div className='exercise-title'>Chest Fly</div>
				<div className='exercise-details'>4x8 @ 90 lbs</div>
			</div>
		</div>
    </>
	*/
  	);
};
