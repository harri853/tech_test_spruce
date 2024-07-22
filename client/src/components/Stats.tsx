import React from 'react';

interface StatsProps {
  stats: { X: { win: number; loss: number }, O: { win: number; loss: number } };
}

const Stats: React.FC<StatsProps> = ({ stats }) => (
  <div className='stats'>
    <h3>Stats:</h3>
    <div className='flex'>
      <div className='flex flex-col mr-4'>
        <p>X Wins: {stats.X.win}</p>
        <p>X Losses: {stats.X.loss}</p>
      </div>
      <div className='flex flex-col'>
        <p>O Wins: {stats.O.win}</p>
        <p>O Losses: {stats.O.loss}</p>
      </div>
    </div>
  </div>
);

export default Stats;