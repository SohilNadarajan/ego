import React, { useState, useEffect, useRef } from 'react';
import './sessionpopupform.css';
import {
    doc, getDocs, getDoc, setDoc, updateDoc, addDoc,
    arrayUnion,
    Timestamp,
    collection, query, where } from 'firebase/firestore';
import { db, auth, googleProvider } from '../../config/firebase';

export const SessionPopupForm = ({ group, user, updateData, disableScreen }) => {
    const [date, setDate] = useState(formatDate(new Date())); // Default to current date
    const [category, setCategory] = useState('');
    const [durationHours, setDurationHours] = useState('');
    const [durationMinutes, setDurationMinutes] = useState('');
    const [exercises, setExercises] = useState([{}]); // Initialize with one empty exercise
    const [dropsets, setDropsets] = useState([{}]);

    const formRef = useRef(null);

    useEffect(() => {
        if (formRef.current) {
            formRef.current.scrollTop = formRef.current.scrollHeight;
        }
    }, [exercises]);

    const addExercise = () => {
        setExercises([...exercises, {}]);
    };

    const removeExercise = () => {
        if (exercises.length > 1) {
            setExercises(exercises.slice(0, -1));
        }
    };

    const handleExerciseChange = (index, field, value) => {
        const newExercises = exercises.map((exercise, i) => 
            i === index ? { ...exercise, [field]: value } : exercise
        );
        setExercises(newExercises);
    };

    const submitForm = async () => {
        // Check for empty fields
        if (!date || !category || durationHours === '' || durationMinutes === '') {
            alert("Please fill in all required fields.");
            return;
        }

        // Check for at least one exercise
        if (exercises.length === 0 || exercises.every(ex => !ex.name || ex.sets === '' || ex.reps === '' || ex.lbs === '')) {
            alert("Please add at least one exercise with all required details.");
            return;
        }

        // Create JSON object
        const formData = {
            date,
            category,
            duration: {
                hours: durationHours,
                minutes: durationMinutes
            },
            exercises: exercises.map(exercise => ({
                name: exercise.name || '',
                sets: exercise.sets || 0,
                reps: exercise.reps || 0,
                lbs: exercise.lbs || 0
            }))
        };

        console.log(formData);
        const userDocRef = doc(db, "users", auth?.currentUser?.uid);
        await updateDoc(userDocRef, {
            workouts: arrayUnion(formData)
        });

        // Reset form
        setDate(formatDate(new Date()));
        setCategory('');
        setDurationHours('');
        setDurationMinutes('');
        setExercises([{}]);
        disableScreen();
        updateData();
    };

    return (
        <div className='session-popup-form' ref={formRef}>
            <h1 className='popup-form-name'>{user.displayName}</h1>
            <div className='inline-input form-section'>
                <div className='input-name'>Date: </div>
                <input 
                    className='form-inline-input'
                    type='date'
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    style={{width: '120px', textAlign: 'center'}}
                />
            </div>
            <div className='inline-input form-section'>
                <div className='input-name'>Gym Day: </div>
                <select 
                    className='form-inline-input' 
                    name='exercise-category' 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value='select'>SELECT</option>
                    <option value='legs'>LEGS</option>
                    <option value='push'>PUSH</option>
                    <option value='pull'>PULL</option>
                    <option value='arms'>ARMS</option>
                    <option value='abs'>ABS</option>
                    <option value='chest'>CHEST</option>
                    <option value='back'>BACK</option>
                    <option value='cardio'>CARDIO</option>
                    <option value='shoulder'>SHOULDERS</option>
                    <option value='holistic'>HOLISTIC</option>
                    <option value='legs-abs'>LEGS/ABS</option>
                    <option value='chest-back'>CHEST/BACK</option>
                    <option value='shoulder-arms'>SHOULDER/ARMS</option>
                    <option value='miscellaneous'>MISCELLANEOUS</option>
                </select>
            </div>
            <div className='inline-input form-section'>
                <div className='input-name'>Duration: </div>
                <input 
                    className='form-inline-input fii-num'
                    type='number'
                    value={durationHours}
                    onChange={(e) => setDurationHours(e.target.value)}
                /> hours
                <input 
                    className='form-inline-input fii-num'
                    type='number'
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(e.target.value)}
                /> minutes
            </div>
            {exercises.map((exercise, index) => (
                <div key={index} className='exercise-input'>
                    <div className='inline-input'>
                        <div className='input-name'>Exercise: </div>
                        <input 
                            className='form-inline-input fii-alpha'
                            value={exercise.name || ''}
                            onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                        />
                    </div>
                    <div className='inline-input'>
                        <input 
                            className='form-inline-input fii-num'
                            type='number'
                            value={exercise.sets || ''}
                            onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)}
                            style={{ marginLeft: '0' }}
                        /> sets
                        <span className='symbol'>&#10005;</span>
                        <input 
                            className='form-inline-input fii-num'
                            type='number'
                            value={exercise.reps || ''}
                            onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
                        /> reps
                        <span className='symbol'>@</span>
                        <input 
                            className='form-inline-input fii-num'
                            type='number'
                            value={exercise.lbs || ''}
                            onChange={(e) => handleExerciseChange(index, 'lbs', e.target.value)}
                        /> lbs
                    </div>
                </div>
            ))}
            <div className='form-button-container'>
                <div className='form-button' onClick={removeExercise}>Remove Exercise</div>
                <div className='form-button' onClick={addExercise}>Add Exercise</div>
            </div>
            <div className='submit-form-button' onClick={submitForm}>Submit</div>
        </div>
    );
};

// Helper function to format date as YYYY-MM-DD
const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
