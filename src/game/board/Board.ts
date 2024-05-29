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
    const mainRow = isWhite ? 0 : 7
    const pawnRow = isWhite ? 1 : 6

    this.board[mainRow][0] = new Rook(color, [mainRow, 0], '')
    this.board[mainRow][1] = new Knight(color, [mainRow, 1], '')
    this.board[mainRow][2] = new Bishop(color, [mainRow, 2], '')
    this.board[mainRow][3] = new Queen(color, [mainRow, 3], '')
    this.board[mainRow][4] = new King(color, [mainRow, 4], '')
    this.board[mainRow][5] = new Bishop(color, [mainRow, 5], '')
    this.board[mainRow][6] = new Knight(color, [mainRow, 6], '')
    this.board[mainRow][7] = new Rook(color, [mainRow, 7], '')

    for (let i = 0; i < 8; i++) {
      this.board[pawnRow][i] = new Pawn(color, [pawnRow, i], '')
    }
  }

  private placeInitialEmptyPieces() {
    Array(4)
      .fill('')
      .map((_, y) => {
        return Array(8)
          .fill('')
          .forEach((_, x) => {
            this.board[x][Math.abs(y - 5)] = new Empty(
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

    this.board.forEach((row, index) => {
      const isEven = (index + 1) % 2 === 0 ? 0 : 1

      rows.push(
        row
          .map((piece, i) => {
            const [x, y] = piece.position

            return `<div class="${
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
