// ABOUTME: Main game container managing game state and flow
// ABOUTME: Coordinates game engine, AI player, and UI components
import { useState, useEffect } from 'react'
import { TicTacToeGame } from '../engine/TicTacToeGame'
import { AIPlayer } from '../engine/AIPlayer'
import { ScoreTracker } from '../engine/ScoreTracker'
import { Board } from './Board'
import { ScoreBoard } from './ScoreBoard'

const game = new TicTacToeGame()
const ai = new AIPlayer()
const scoreTracker = new ScoreTracker()

export function Game() {
  const [board, setBoard] = useState(() => {
    game.reset()
    return game.getBoard()
  })
  const [currentPlayer, setCurrentPlayer] = useState(game.getCurrentPlayer())
  const [winner, setWinner] = useState(game.getWinner())
  const [winningCells, setWinningCells] = useState(game.getWinningCells())
  const [isAiThinking, setIsAiThinking] = useState(false)
  const [scores, setScores] = useState(scoreTracker.getStats())

  const updateGameState = () => {
    setBoard(game.getBoard())
    setCurrentPlayer(game.getCurrentPlayer())
    const newWinner = game.getWinner()
    setWinner(newWinner)
    setWinningCells(game.getWinningCells())

    // Record score if game just ended
    if (newWinner && newWinner !== winner) {
      scoreTracker.recordResult(newWinner)
      setScores(scoreTracker.getStats())
    }
  }

  const handleCellClick = (row: number, col: number) => {
    if (isAiThinking || game.isGameOver()) {
      return
    }

    const success = game.makeMove(row, col)
    if (!success) {
      return
    }

    updateGameState()

    // Trigger AI move if game is not over
    if (!game.isGameOver()) {
      setIsAiThinking(true)
    }
  }

  useEffect(() => {
    if (isAiThinking && currentPlayer === 'O' && !game.isGameOver()) {
      // Delay AI move for better UX
      const timeout = setTimeout(() => {
        const [row, col] = ai.calculateMove(game)
        game.makeMove(row, col)
        updateGameState()
        setIsAiThinking(false)
      }, 300)

      return () => clearTimeout(timeout)
    }
  }, [isAiThinking, currentPlayer])

  const handleNewGame = () => {
    game.reset()
    setWinner(null)
    updateGameState()
    setIsAiThinking(false)
  }

  return (
    <div>
      <h1>Tic Tac Toe</h1>
      <ScoreBoard
        playerWins={scores.playerWins}
        aiWins={scores.aiWins}
        draws={scores.draws}
      />
      <Board
        board={board}
        onCellClick={handleCellClick}
        winningCells={winningCells}
      />
      {winner && (
        <div>
          <p>
            {winner === 'Draw' ? "It's a draw!" : `${winner} wins!`}
          </p>
          <button onClick={handleNewGame}>New Game</button>
        </div>
      )}
      {!winner && <p>Current player: {currentPlayer}</p>}
    </div>
  )
}
