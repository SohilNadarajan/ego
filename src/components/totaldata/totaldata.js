import React, { useState, useEffect } from 'react';
import './totaldata.css';
import './glitch.css';
import './mobile.css';

export const TotalData = ({ group }) => {
	const [totalLbs, setTotalLbs] = useState(0);
	const [totalReps, setTotalReps] = useState(0);
	const [totalSets, setTotalSets] = useState(0);
	const [totalHours, setTotalHours] = useState(0);
	const [totalMinutes, setTotalMinutes] = useState(0);
	const [maxLegs, setMaxLegs] = useState([]);
	const [maxPush, setMaxPush] = useState([]);
	const [maxPull, setMaxPull] = useState([]);
	const [maxColors, setMaxColors] = useState([]);
	const [oneNameMax, setOneNameMax] = useState(false);
	const [bestDay, setBestDay] = useState('');
	const [maxWeightOnBestDay, setMaxWeightOnBestDay] = useState(0);

	useEffect(() => {
        if (group && group.users?.length > 0) {
            calculateTotalMetrics();
        }
    }, [group]);

	const calculateTotalMetrics = () => {
		let totalLbs = 0;
		let totalReps = 0;
		let totalSets = 0;
		let totalHours = 0;
		let totalMinutes = 0;
		let maxLegs = 0, maxLegsUser = '';
		let maxPush = 0, maxPushUser = '';
		let maxPull = 0, maxPullUser = '';
		let bestDay = '';
		let maxWeightOnBestDay = 0;
    	let dayWeightMap = {};
	
		group.users.forEach(user => {
			user.workouts.forEach(workout => {
				let dailyTotalLbs = 0;
				
				totalHours += parseInt(workout.duration?.hours || 0);
				totalMinutes += parseInt(workout.duration?.minutes || 0);
	
				workout.exercises.forEach(exercise => {
					
					const exerciseLbs = exercise.sets?.reduce((sum, _, index) => {
						const reps = exercise.reps?.[index] || 0;
						const lbs = exercise.lbs?.[index] || 0;
						return sum + (parseInt(exercise.sets[index]) * parseInt(reps) * parseInt(lbs));
					}, 0) || 0;

					totalLbs += exerciseLbs;
					dailyTotalLbs += exerciseLbs;
	
					totalReps += exercise.reps?.reduce((sum, rep) => sum + parseInt(rep), 0) || 0;
					totalSets += exercise.sets?.length || 0;

					/*
					const maxExerciseWeight = Math.max(...exercise.lbs.map(weight => parseInt(weight)));
					if (maxExerciseWeight > maxWeight) {
						maxWeight = maxExerciseWeight;
					}
					*/
					if (workout.category.toLowerCase() === 'legs' ||
						workout.category.toLowerCase() === 'legs-abs') {
						exercise.lbs.forEach(lbs => {
							lbs = parseInt(lbs);
							if (lbs > maxLegs) {
								maxLegs = lbs;
								maxLegsUser = user.displayName;
							}
						});
					} else if (workout.category.toLowerCase() === 'push') {
						exercise.lbs.forEach(lbs => {
							lbs = parseInt(lbs);
							if (lbs > maxPush) {
								maxPush = lbs;
								maxPushUser = user.displayName;
							}
						});
					} else if (workout.category.toLowerCase() === 'pull') {
						exercise.lbs.forEach(lbs => {
							lbs = parseInt(lbs);
							if (lbs > maxPull) {
								maxPull = lbs;
								maxPullUser = user.displayName;
							}
						});
					}
				});

				if (!dayWeightMap[workout.date]) {
					dayWeightMap[workout.date] = dailyTotalLbs;
				} else {
					dayWeightMap[workout.date] += dailyTotalLbs;
				}
			});
		});

		for (let day in dayWeightMap) {
			if (dayWeightMap[day] > maxWeightOnBestDay) {
				maxWeightOnBestDay = dayWeightMap[day];
				bestDay = day;
			}
		}
	
		if (totalMinutes >= 60) {
			totalHours += Math.floor(totalMinutes / 60);
			totalMinutes = totalMinutes % 60;
		}
		
		setTotalLbs(totalLbs);
		setTotalReps(totalReps);
		setTotalSets(totalSets);
		setTotalHours(totalHours);
		setTotalMinutes(totalMinutes);
		setMaxLegs([maxLegs, maxLegsUser]);
		setMaxPush([maxPush, maxPushUser]);
		setMaxPull([maxPull, maxPullUser]);
		setMaxColors([
			group.colors[group.users.findIndex(user => user.displayName === maxLegsUser)],
			group.colors[group.users.findIndex(user => user.displayName === maxPushUser)],
			group.colors[group.users.findIndex(user => user.displayName === maxPullUser)]
		]);
		if (maxLegsUser === maxPushUser && maxPushUser === maxPullUser) {
			setOneNameMax(true);
		}
		setBestDay(bestDay);
		setMaxWeightOnBestDay(maxWeightOnBestDay);
	};

	function abbreviateNumber(num) {
		if (num >= 1000000) {
			return Math.floor(num / 100000) / 10 + 'm';
		} else if (num >= 1000) {
			return Math.floor(num / 100) / 10 + 'k';
		} else {
			return num.toString();
		}
	}

	function formatDate(dateString) {
		const date = new Date(dateString);
	
		const day = date.getDate() + 1;
		const month = date.toLocaleString('default', { month: 'short' });
		const year = date.getFullYear();
	
		return `${day} ${month} ${year}`;
	}

  	return (
		<>
		<div className='totaldata-container'>
			<div className='users-section'>
				<h1 className='totaldata-heading'>Users</h1>
				{group?.users?.length > 0 && group?.colors?.length > 0 && group.users.map((user, index) => (
					<div 
						key={index} 
						className='totaldata-tag' 
						style={{ background: group.colors[index % group.colors.length] }}
					>
						{user.displayName}
					</div>
				))}
			</div>
			<div className='data-section'>
				<h1 className='totaldata-heading'>Stats</h1>
				<div className='stats-box'>
					<div className='stats-names'>
						<div>Total Weight</div>
						<div>Total Reps</div>
						<div>Total Sets</div>
						<div>Total Duration</div>
						<div>Best Day</div>
						<div>&nbsp;</div>
						{oneNameMax && 
						<div className='glitch-mini' 
							 data-text={maxLegs[1].toUpperCase()}
							 style={{visibility: 'hidden'}}>
							{maxLegs[1].toUpperCase()}
						</div>}
						<div>Max Legs</div>
						{!oneNameMax && <div className='totaldata-tag-mini' style={{backgroundColor: maxColors[0], visibility: 'hidden'}}>{maxLegs[1]}</div>}
						<div>Max Push</div>
						{!oneNameMax && <div className='totaldata-tag-mini' style={{backgroundColor: maxColors[1], visibility: 'hidden'}}>{maxPush[1]}</div>}
						<div>Max Pull</div>
						{!oneNameMax && <div className='totaldata-tag-mini' style={{backgroundColor: maxColors[2], visibility: 'hidden'}}>{maxPull[1]}</div>}
					</div>
					<div className='stats-data'>
						<div>{abbreviateNumber(totalLbs)} lbs</div>
						<div>{totalReps}</div>
						<div>{totalSets}</div>
						<div>{totalHours}h {totalMinutes}m</div>
						<div>{formatDate(bestDay)}</div>
						<div>{abbreviateNumber(maxWeightOnBestDay)} lbs</div>
						{oneNameMax && 
						<div className='glitch-mini' 
							 data-text={maxLegs[1].toUpperCase()}>
							{maxLegs[1].toUpperCase()}
						</div>}
						<div>{maxLegs[0]} lbs</div>
						{!oneNameMax && <div className='totaldata-tag-mini' style={{backgroundColor: maxColors[0]}}>{maxLegs[1]}</div>}
						<div>{maxPush[0]} lbs</div>
						{!oneNameMax && <div className='totaldata-tag-mini' style={{backgroundColor: maxColors[1]}}>{maxPush[1]}</div>}
						<div>{maxPull[0]} lbs</div>
						{!oneNameMax && <div className='totaldata-tag-mini' style={{backgroundColor: maxColors[2]}}>{maxPull[1]}</div>}
					</div>
				</div>
			</div>
		</div>
		</>
  	);
};
