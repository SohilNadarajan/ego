import React, { useState, useEffect } from 'react';
import './landing.css';
import './glitch.css';
import './mobile.css';

export const Landing = ({ enterLanding }) => {
    const emojis = ['🚀', '️‍🔥', '💪'];
    const [index, setIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isPaused) {
                setIndex(prevIndex => (prevIndex + 1) % emojis.length);
                setIsPaused(true);
            } else {
                setIsPaused(false);
            }
        }, isPaused ? 1500 : 1000);

        return () => clearInterval(interval);
    }, [isPaused, emojis.length]);

    const blowupScreen = () => {
        const blowupDiv1 = document.querySelector('.blowup-div-1');
        const blowupDiv2 = document.querySelector('.blowup-div-2');
        blowupDiv1.classList.add('active');
        setTimeout(() => blowupDiv2.classList.add('active'), 100);
        setTimeout(() => enterLanding(), 1250);
    }

    return (
        <>
            <div className='screen'>
                <img className='o-streak' src={require('../../images/streak.png')} />
                <div className='hero-text'>
                    <div className='glitch' data-text='EGO'>EGO</div>
                    <div className='enter-button' onClick={blowupScreen}>{emojis[index]}</div>
                </div>
            </div>
            <div className='blowup-div blowup-div-1'></div>
            <div className='blowup-div blowup-div-2'></div>
        </>
    );
};