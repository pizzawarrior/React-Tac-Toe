import React from 'react'
import { useState } from 'react'

// Square DISPLAYS the value of the square based on the STATE managed by the GAME
// Square and Board are child components of Game
function Square({ value, onSquareClick }) {
  // send value and onSquareClick as props to the Squares instances in the Board COMPONENT
  return (
    <button
      className="square"
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

// The Board component is fully controlled by the props passed to it by the Game component.
// Since state is private to a component that defines it, you cannot update the Board’s state directly from Square.
function Board({ xIsNext, squares, onPlay }) {
  // define handleClick here to update squares array HOLDING THE BOARD'S STATE
  // The handleClick function creates a copy of the squares array (nextSquares) with the slice() Array method.
  // handleClick updates the nextSquares array to add X to the first ([0] index) square.
  function handleClick(i) {
    //  If the square is already filled, you will return in the handleClick function early—before it tries to update the board state.
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    // This is so the Game component can update the Board when the user clicks a square:
    // This will trigger a re-render of the components that use the squares state (Board) as well as its child components (the Square components that make up the board).
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;

  if (winner) {
    status = `Winner: ${winner}!`;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
    <div className='status'>{ status }</div>
    <div className="board-row">
      {/* connect onSquareClick prop to Square instance through a fn called handleClick */}
      {/* JavaScript supports closures which means an inner function (e.g. handleClick) has access to variables and functions defined in a outer function (e.g. Board).
      The handleClick function can read the square's state and call the setSquares method because they are both defined inside of the Board function. */}
      <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
      <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
      <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
    </div>
    <div className="board-row">
      <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
      <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
      <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
    </div>
    <div className="board-row">
      <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
      <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
      <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
    </div>
    </>
  );
    // When clicking on a Square, the child Square component now asks the parent Board component to update the state of the board.
    // When the Board’s state changes, both the Board component and every child Square re-renders automatically.
    // Keeping the state of all squares in the Board component will allow it to determine the winner in the future.
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];


  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove +1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length -1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = `Go to move # ${ move }`;
    } else {
      description = `Go to game start`;
    }
    return (
    <li key={ move }>
      <button onClick = {() => jumpTo(move)}>{ description }</button>
    </li>
    )
  });

  return (
    <div className='game'>
      <div className='game-board'>
        <Board xIsNext={xIsNext} squares={ currentSquares } onPlay={ handlePlay } />
      </div>
      <div className='game-info'>
        <ol>{ moves }</ol>
      </div>
    </div>
  );
}

const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++){
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
