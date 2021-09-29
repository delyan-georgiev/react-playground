import React, { MouseEventHandler, useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

type squareProps = {
	onSquareClick: MouseEventHandler,
	value: string
}

type BoardProps = {
	squares: Squares,
	onClick: (i: number) => void
}

type Squares = Array<string>

function Square(props: squareProps): JSX.Element {
	return (
		<button
			className="square"
			onClick={props.onSquareClick}>
			{props.value}
		</button>
	);
}

const Board = (props: BoardProps) => {
	const renderSquare = (i: number) => {
		return (
			<Square
				value={props.squares[i]}
				onSquareClick={() => props.onClick(i)} />
		);
	}


	return (
		<div>
			<div className="board-row">
				{renderSquare(0)}
				{renderSquare(1)}
				{renderSquare(2)}
			</div>
			<div className="board-row">
				{renderSquare(3)}
				{renderSquare(4)}
				{renderSquare(5)}
			</div>
			<div className="board-row">
				{renderSquare(6)}
				{renderSquare(7)}
				{renderSquare(8)}
			</div>
		</div>
	);
}

const Game = (): JSX.Element => {
	const [history, setHistory] = useState([{ squares: Array(9).fill(null) }]);
	const [stepNumber, setStepNumber] = useState(0);
	const [xIsNext, setXIsNext] = useState(true);

	const handleClick = (i: number) => {
		const currentHistory = history.slice(0, stepNumber + 1);
		const current = currentHistory[currentHistory.length - 1];
		const squares = current.squares.slice();

		if (calculateWinner(squares) || squares[i]) return; // there is winner or this square is already clicked

		squares[i] = xIsNext ? 'X' : 'O';
		setHistory(currentHistory.concat([{ squares }]));
		setStepNumber(currentHistory.length);
		setXIsNext(!xIsNext);
	}

	const jumpTo = (stepNumber: number) => {
		setStepNumber(stepNumber);
		setXIsNext((stepNumber % 2) === 0);

	}


	const currentHistoryStep = history[stepNumber];
	const winner = calculateWinner(currentHistoryStep.squares);

	const moves = history.map((step, move): JSX.Element => {
		const description = move ? 'Go to move #' + move : 'Go to start';

		return (
			<li key={move}>
				<button onClick={() => jumpTo(move)}>{description}</button>
			</li>
		)
	})
	let status;
	if (winner) {
		status = 'Winner: ' + winner;
	}
	else {
		status = 'Next player: ' + (xIsNext ? 'X' : 'O');
	}
	return (
		<div className="game">
			<div className="game-board">
				<Board
					squares={currentHistoryStep.squares}
					onClick={(i) => handleClick(i)}
				/>
			</div>
			<div className="game-info">
				<div>{status}</div>
				<ol>{moves}</ol>
			</div>
		</div>
	);

}

function calculateWinner(squares: Squares): string | null {
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
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return squares[a];
		}
	}

	return null;
}

// ========================================

ReactDOM.render(
	<Game />,
	document.getElementById('root')
);