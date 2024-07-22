import React from 'react';

interface SliderProps {
  boardSize: number;
  handleBoardSizeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  startGame: () => void;
}

const Slider: React.FC<SliderProps> = ({ boardSize, handleBoardSizeChange, startGame }) => (
  <>
    <label className="slider-label">Slide to determine your size of game</label>
    <input
      type="range"
      min="3"
      max="15"
      value={boardSize}
      onChange={handleBoardSizeChange}
      className="slider"
    />
    <div>Board Size: {boardSize} x {boardSize}</div>
    <button onClick={startGame} className="start-button">Start Game</button>
  </>
);

export default Slider;