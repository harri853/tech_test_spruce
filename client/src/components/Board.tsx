import React from 'react';
import { XorO } from '../types';

interface BoardProps {
  board: (XorO | undefined)[][];
  handleClick: (rowIndex: number, colIndex: number) => void;
  boardSize: number;
}

const Board: React.FC<BoardProps> = ({ board, handleClick, boardSize }) => (
  <div className='board' style={{ gridTemplateColumns: `repeat(${boardSize}, 1fr)`, gridTemplateRows: `repeat(${boardSize}, 1fr)` }}>
    {board.map((row, rowIndex) => (
      <div key={rowIndex} className='board-row'>
        {row.map((column, colIndex) => (
          <div
            key={colIndex}
            className='cell'
            onClick={() => handleClick(rowIndex, colIndex)}
          >
            {column}
          </div>
        ))}
      </div>
    ))}
  </div>
);

export default Board;