import { Color, Piece } from '../../types'
import { Bishop } from '../pieces/Bishop'
import { Empty } from '../pieces/Empty'
import { King } from '../pieces/King'
import { Knight } from '../pieces/Knight'
import { Pawn } from '../pieces/Pawn'
import { Queen } from '../pieces/Queen'
import { Rook } from '../pieces/Rook'

export class Board {
  board: Piece[][]

  constructor() {
    this.board = Array(8)
      .fill(null)
      .map(() => Array(8).fill(null))
  }

  public setupBoard() {
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
      .map((_, y) => {
        return Array(8)
          .fill('')
          .forEach((_, x) => {
            console.log(x)
            this.board[Math.abs(y - 5)][x] = new Empty(
              'empty',
              [x, Math.abs(y - 5)],
              ''
            )
          })
      })
  }

  private printBoard() {
    const $board = document.getElementById('board')

    if (!$board) return

    const rows: string[] = []

    console.log(this.board)

    this.board.forEach((row, index) => {
      const isEven = (index + 1) % 2 === 0 ? 0 : 1

      rows.push(
        row
          .map((piece, i) => {
            const [x, y] = piece.position

            console.log(piece.image)

            return `<div style="background-image: url('${
              piece.image
            }');" class="${
              (i + 1) % 2 === isEven ? 'grey' : 'green'
            } square" data-color="${piece.color}" data-xy="${x}-${y}">${
              piece.name
            }</div>`
          })
          .join('')
      )
    })

    $board.innerHTML = rows
      .map((row) => {
        return `<div class="row">${row}</div>`
      })
      .join('')
  }
}
