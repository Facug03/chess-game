import { Board } from './board/Board'
import { Player } from './player/Player'

export class Game {
  private board: Board
  private players: [Player, Player]
  private currentPlayerIndex: number

  constructor() {
    this.board = new Board()
    this.players = [new Player('white'), new Player('black')]
    this.currentPlayerIndex = 0
  }

  startGame() {
    this.setupBoard()
    this.gameLoop()
  }

  private setupBoard() {
    // Coloca las piezas iniciales en el tablero
    // Ejemplo de colocación de piezas
    // this.board.placePiece(new Rook("white", [0, 0]), [0, 0]);
    // this.board.placePiece(new Knight("white", [0, 1]), [0, 1]);
    // ...
  }

  private gameLoop(): void {}
}
