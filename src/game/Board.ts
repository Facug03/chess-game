import { ChessBoard, Color } from '../types'
import { Bishop } from './pieces/Bishop'
import { Empty } from './pieces/Empty'
import { King } from './pieces/King'
import { Knight } from './pieces/Knight'
import { Pawn } from './pieces/Pawn'
import { Queen } from './pieces/Queen'
import { Rook } from './pieces/Rook'
import { Player } from './player/Player'

export class Board {
  public board: ChessBoard
  private players: [Player, Player]
  private currentPlayer: Color

  constructor() {
    this.board = Array(8)
      .fill(null)
      .map(() => Array(8).fill(null))
    this.players = [new Player('white'), new Player('black')]
    this.currentPlayer = 'white'
  }

  public startGame() {
    this.setupBoard()
  }

  private gameLoop() {
    const $pieces = [...document.querySelectorAll('.square')] as HTMLElement[]
    let $pieceSelected: HTMLElement | null

    $pieces.map(($pieceElement) => {
      $pieceElement.addEventListener('click', () => {
        if (
          $pieceElement.dataset.color !== this.currentPlayer &&
          $pieceSelected !== $pieceElement &&
          $pieceSelected
        ) {
          if (!$pieceElement.dataset.xy || !$pieceSelected.dataset.xy) return

          const [x, y] = $pieceElement.dataset.xy
            .split('-')
            .map((data) => Number(data))
          const [xSelected, ySelected] = $pieceSelected.dataset.xy
            .split('-')
            .map((data) => Number(data))
          const currentPiece = this.board[xSelected][ySelected]

          const canMove = currentPiece.movePieceTo([x, y], this.board)

          if (!canMove) {
            console.log('Cant move')
            this.removeColorClass($pieceSelected)
            $pieceSelected = null
          }

          if (canMove) {
            this.printBoard()
            this.changePlayer()
          }

          return
        }

        if (
          $pieceElement.dataset.color !== this.currentPlayer ||
          !$pieceElement.dataset.xy
        ) {
          return
        }

        if ($pieceSelected) {
          this.removeColorClass($pieceSelected)

          if ($pieceElement === $pieceSelected) {
            $pieceSelected = null

            return
          }
        }

        $pieceSelected = $pieceElement
        this.addColorClass($pieceElement)

        // const [x, y] = $pieceElement.dataset.xy.split('-')

        // const getPiece: Piece = this.board[Number(x)][Number(y)]
      })
    })
  }

  private setupBoard() {
    this.placeInitialPieces('white')
    this.placeInitialPieces('black')
    this.placeInitialEmptyPieces()

    this.printBoard()
  }

  private placeInitialPieces(color: Color): void {
    const isWhite = color === 'white'
    const mainRow = isWhite ? 7 : 0
    const pawnRow = isWhite ? 6 : 1

    this.board[mainRow][0] = new Rook(
      color,
      [mainRow, 0],
      `/assets/pieces/${color}/rook.png`
    )
    this.board[mainRow][1] = new Knight(
      color,
      [mainRow, 1],
      `/assets/pieces/${color}/knight.png`
    )
    this.board[mainRow][2] = new Bishop(
      color,
      [mainRow, 2],
      `/assets/pieces/${color}/bishop.png`
    )
    this.board[mainRow][3] = new Queen(
      color,
      [mainRow, 3],
      `/assets/pieces/${color}/queen.png`
    )
    this.board[mainRow][4] = new King(
      color,
      [mainRow, 4],
      `/assets/pieces/${color}/king.png`
    )
    this.board[mainRow][5] = new Bishop(
      color,
      [mainRow, 5],
      `/assets/pieces/${color}/bishop.png`
    )
    this.board[mainRow][6] = new Knight(
      color,
      [mainRow, 6],
      `/assets/pieces/${color}/knight.png`
    )
    this.board[mainRow][7] = new Rook(
      color,
      [mainRow, 7],
      `/assets/pieces/${color}/rook.png`
    )

    for (let i = 0; i < 8; i++) {
      this.board[pawnRow][i] = new Pawn(
        color,
        [pawnRow, i],
        `/assets/pieces/${color}/pawn.png`
      )
    }
  }

  private placeInitialEmptyPieces() {
    Array(4)
      .fill('')
      .map((_, x) => {
        return Array(8)
          .fill('')
          .forEach((_, y) => {
            this.board[Math.abs(x - 5)][y] = new Empty(
              'empty',
              [Math.abs(x - 5), y],
              ''
            )
          })
      })
  }

  private printBoard() {
    const $board = document.getElementById('board')

    if (!$board) return

    const rows: string[] = []

    this.board.forEach((row, index) => {
      const isEven = (index + 1) % 2 === 0 ? 0 : 1

      rows.push(
        row
          .map((piece, i) => {
            const [x, y] = piece.position

            return `<div style="background-image: url('${
              piece.image
            }');" class="${
              (i + 1) % 2 === isEven ? 'grey' : 'green'
            } square" data-color="${piece.color}" data-xy="${x}-${y}"></div>`
          })
          .join('')
      )
    })

    $board.innerHTML = rows
      .map((row) => {
        return `<div class="row">${row}</div>`
      })
      .join('')

    this.gameLoop()
  }

  private removeColorClass($element: HTMLElement) {
    $element.classList.remove(
      `selected-${$element.classList.contains('green') ? 'green' : 'grey'}`
    )
  }

  private addColorClass($element: HTMLElement) {
    $element.classList.add(
      `selected-${$element.classList.contains('green') ? 'green' : 'grey'}`
    )
  }

  changePlayer() {
    this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white'
  }
}
