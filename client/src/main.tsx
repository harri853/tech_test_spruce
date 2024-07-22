import React, { useState, useEffect } from 'react';
import './assets/index.css';
import { XorO } from './types';
import Slider from './components/Slider';
import Board from './components/Board';
import Stats from './components/Stats';

const Main: React.FC = () => {
  const [boardSize, setBoardSize] = useState<number>(3);
  const [board, setBoard] = useState<(XorO | undefined)[][]>(Array(3).fill(undefined).map(() => Array(3).fill(undefined)));
  const [currentPlayer, setCurrentPlayer] = useState<XorO>('X');
  const [winner, setWinner] = useState<XorO | undefined>(undefined);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [isDraw, setIsDraw] = useState<boolean>(false);
  const [stats, setStats] = useState<{ X: { win: number; loss: number }, O: { win: 0; loss: number } }>({ X: { win: 0, loss: 0 }, O: { win: 0, loss: 0 } });

  useEffect(() => {
    fetch('/api/stats')
      .then(response => response.json())
      .then(data => setStats(data));
  }, []);

  const handleClick = (rowIndex: number, colIndex: number) => {
    if (board[rowIndex][colIndex] || winner || isDraw) return;

    const newBoard = board.map((row, rIndex) =>
      row.map((cell, cIndex) =>
        rIndex === rowIndex && cIndex === colIndex ? currentPlayer : cell
      )
    );

    setBoard(newBoard);
    const newWinner = calculateWinner(newBoard);
    if (newWinner) {
      setWinner(newWinner);
      submitResult([
        { player: newWinner, result: 'win' },
        { player: currentPlayer === 'X' ? 'O' : 'X', result: 'loss' }
      ]);
    } else if (isBoardFull(newBoard) && !canAnyPlayerWin(newBoard)) {
      setIsDraw(true);
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const submitResult = async (results: { player: XorO; result: 'win' | 'loss' }[]) => {
    await fetch('/api/game-result', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(results)
    });
    fetchStats();
  };

  const fetchStats = () => {
    fetch('/api/stats')
      .then(response => response.json())
      .then(data => setStats(data));
  };

  const calculateWinner = (board: (XorO | undefined)[][]): XorO | undefined => {
    const size = board.length;
    const lines: (XorO | undefined)[][] = [];

    // Rows and Columns
    for (let i = 0; i < size; i++) {
      const row = board[i];
      const col = board.map(row => row[i]);
      lines.push(row, col);
    }

    // Diagonals
    const diagonal1 = board.map((row, index) => row[index]);
    const diagonal2 = board.map((row, index) => row[size - index - 1]);
    lines.push(diagonal1, diagonal2);

    for (const line of lines) {
      if (line.every(cell => cell && cell === line[0])) {
        return line[0];
      }
    }

    return undefined;
  };

  const isBoardFull = (board: (XorO | undefined)[][]): boolean => {
    return board.every(row => row.every(cell => cell !== undefined));
  };

  const canAnyPlayerWin = (board: (XorO | undefined)[][]): boolean => {
    const players: XorO[] = ['X', 'O'];
    for (let player of players) {
      for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board.length; col++) {
          if (board[row][col] === undefined) {
            const newBoard = board.map((r, rIndex) =>
              r.map((c, cIndex) =>
                rIndex === row && cIndex === col ? player : c
              )
            );
            if (calculateWinner(newBoard)) {
              return true;
            }
          }
        }
      }
    }
    return false;
  };

  const startGame = () => {
    const newBoard = Array(boardSize).fill(undefined).map(() => Array(boardSize).fill(undefined));
    setBoard(newBoard);
    setCurrentPlayer('X');
    setWinner(undefined);
    setIsDraw(false);
    setGameStarted(true);
  };

  const resetGame = () => {
    setBoard(Array(3).fill(undefined).map(() => Array(3).fill(undefined)));
    setCurrentPlayer('X');
    setWinner(undefined);
    setIsDraw(false);
    setGameStarted(false);
    setBoardSize(3);
  };

  const clearBoard = () => {
    const newBoard = Array(boardSize).fill(undefined).map(() => Array(boardSize).fill(undefined));
    setBoard(newBoard);
    setWinner(undefined);
    setIsDraw(false);
  };

  const handleBoardSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const size = Math.max(3, Math.min(15, Number(event.target.value)));
    setBoardSize(size);
  };

  return (
    <div className='flex flex-col mt-10 items-center gap-10'>
      <div className='font-bold text-2xl'>Tic Tac Toe</div>
      {!gameStarted ? (
        <Slider boardSize={boardSize} handleBoardSizeChange={handleBoardSizeChange} startGame={startGame} />
      ) : (
        <>
          <Board board={board} handleClick={handleClick} boardSize={boardSize} />
          {winner && <p>Winner: {winner}</p>}
          {isDraw && <p>Game is a Draw</p>}
          <div className='flex gap-4'>
            <button onClick={resetGame} className="restart-button">Restart Game</button>
            <button onClick={clearBoard} className="clear-button">Clear Board</button>
          </div>
          <Stats stats={stats} />
        </>
      )}
    </div>
  );
};

export default Main;
