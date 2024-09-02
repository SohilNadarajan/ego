import React, { useState, useEffect } from 'react';
import './totaldata.css';

export const TotalData = ({ group }) => {
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
					<div>Max Reps</div>
				</div>
				<div className='stats-data'>
					<div>-- lbs</div>
					<div>--</div>
					<div>--</div>
					<div>--h --m</div>
					<div>-- lbs</div>
					<div>--</div>
				</div>
			</div>
        </div>
      </div>
    </>
  );
};
