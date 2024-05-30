import { Game } from './game/Game'
import { Board } from './game/board/Board'
import './style.css'

const board = new Board()
const game = new Game(board)

game.startGame()
