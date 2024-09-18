import React, { useState, useEffect } from 'react';
import './totaldata.css';

export const TotalData = ({ group }) => {
	const [totalLbs, setTotalLbs] = useState(0);
	const [totalReps, setTotalReps] = useState(0);
	const [totalSets, setTotalSets] = useState(0);
	const [totalHours, setTotalHours] = useState(0);
	const [totalMinutes, setTotalMinutes] = useState(0);
	const [maxWeight, setMaxWeight] = useState(0);

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
		let maxWeight = 0;
	
		group.users.forEach(user => {
			user.workouts.forEach(workout => {
				
				totalHours += parseInt(workout.duration?.hours || 0);
				totalMinutes += parseInt(workout.duration?.minutes || 0);
	
				workout.exercises.forEach(exercise => {
					
					totalLbs += exercise.sets?.reduce((sum, _, index) => {
						const reps = exercise.reps?.[index] || 0;
						const lbs = exercise.lbs?.[index] || 0;
						return sum + (parseInt(exercise.sets[index]) * parseInt(reps) * parseInt(lbs));
					}, 0) || 0;
	
					totalReps += exercise.reps?.reduce((sum, rep) => sum + parseInt(rep), 0) || 0;
					totalSets += exercise.sets?.length || 0;

					const maxExerciseWeight = Math.max(...exercise.lbs.map(weight => parseInt(weight)));
					if (maxExerciseWeight > maxWeight) {
						maxWeight = maxExerciseWeight;
					}
				});
			});
		});
	
		if (totalMinutes >= 60) {
			totalHours += Math.floor(totalMinutes / 60);
			totalMinutes = totalMinutes % 60;
		}
		
		setTotalLbs(totalLbs);
		setTotalReps(totalReps);
		setTotalSets(totalSets);
		setTotalHours(totalHours);
		setTotalMinutes(totalMinutes);
		setMaxWeight(maxWeight);
	};

	function abbreviateNumber(num) {
		if (num >= 1000000) {
			return Math.floor(num / 100000) / 10 + 'M';
		} else if (num >= 1000) {
			return Math.floor(num / 100) / 10 + 'K';
		} else {
			return num.toString();
		}
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
						<div>Max Weight</div>
					</div>
					<div className='stats-data'>
						<div>{abbreviateNumber(totalLbs)} lbs</div>
						<div>{totalReps}</div>
						<div>{totalSets}</div>
						<div>{totalHours}h {totalMinutes}m</div>
						<div>{maxWeight} lbs</div>
					</div>
				</div>
			</div>
		</div>
		</>
  	);
};
