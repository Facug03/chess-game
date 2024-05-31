import { ChessBoard, Color, PiecePosition } from '../types'
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
  private $pieceSelected: HTMLElement | null = null
  private $turn: HTMLElement | null = null

  constructor() {
    this.board = Array(8)
      .fill(null)
      .map(() => Array(8).fill(null))
    this.players = [new Player('white'), new Player('black')]
    this.currentPlayer = 'white'
    this.$turn = document.getElementById('turn')
  }

  public startGame() {
    this.setupBoard()
  }

  private gameLoop() {
    const $pieces = [...document.querySelectorAll('.square')] as HTMLElement[]

    $pieces.map(($pieceElement) => {
      $pieceElement.addEventListener('click', () => {
        if (
          $pieceElement.dataset.color !== this.currentPlayer &&
          this.$pieceSelected !== $pieceElement &&
          this.$pieceSelected
        ) {
          if (!$pieceElement.dataset.xy || !this.$pieceSelected.dataset.xy)
            return

          const [toX, toY] = $pieceElement.dataset.xy
            .split('-')
            .map((data) => Number(data))
          const [fromX, fromY] = this.$pieceSelected.dataset.xy
            .split('-')
            .map((data) => Number(data))
          const currentPiece = this.board[fromX][fromY]
          const canMove = currentPiece.canMovePieceTo([toX, toY], this.board)

          if (!canMove) {
            console.log('Cant move')
            this.removeColorClass()
            this.$pieceSelected = null

            return
          }

          const copyBoard = this.copyBoard()
          this.movePiece([fromX, fromY], [toX, toY], copyBoard, false)
          const isCheckAfterMove = this.isKingInCheck(copyBoard)

          console.log({ isCheckAfterMove })

          if (isCheckAfterMove) {
            this.removeColorClass()
            this.$pieceSelected = null

            return
          }

          this.movePiece([fromX, fromY], [toX, toY], this.board, true)
          this.changePlayer()
          this.printBoard()

          return
        }

        if (
          $pieceElement.dataset.color !== this.currentPlayer ||
          !$pieceElement.dataset.xy
        ) {
          return
        }

        if (this.$pieceSelected) {
          this.removeColorClass()

          if ($pieceElement === this.$pieceSelected) {
            this.$pieceSelected = null

            return
          }
        }

        this.$pieceSelected = $pieceElement
        this.addColorClass()
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

  private removeColorClass() {
    this.$pieceSelected?.classList.remove(
      `selected-${
        this.$pieceSelected.classList.contains('green') ? 'green' : 'grey'
      }`
    )
  }

  private addColorClass() {
    this.$pieceSelected?.classList.add(
      `selected-${
        this.$pieceSelected.classList.contains('green') ? 'green' : 'grey'
      }`
    )
  }

  public changePlayer() {
    this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white'

    if (this.$turn) {
      this.$turn.innerText = `TURN: ${this.currentPlayer.toUpperCase()}`
    }
  }

  private isKingInCheck(board: ChessBoard): boolean {
    for (const player of this.players) {
      console.log(player)

      let kingPosition: PiecePosition | null = null

      for (const row of board) {
        for (const piece of row) {
          if (piece.name === 'king' && piece.color !== player.getColor()) {
            kingPosition = [board.indexOf(row), row.indexOf(piece)]
            break
          }
        }

        if (kingPosition) break
      }

      if (!kingPosition) continue

      const isCheck = board.some((row) =>
        row.some(
          (piece) =>
            piece.color === player.getColor() &&
            piece.canMovePieceTo(kingPosition, board)
        )
      )

      if (!isCheck) continue

      return isCheck
    }

    return false
  }

  private movePiece(
    position: PiecePosition,
    moveTo: PiecePosition,
    board: ChessBoard,
    changePosition: boolean
  ) {
    const [fromX, fromY] = position
    const [toX, toY] = moveTo
    const piece = board[fromX][fromY]

    board[toX][toY] = piece
    board[fromX][fromY] = new Empty('empty', [fromX, fromY], '')

    if (changePosition) {
      piece.moveCount += 1
      piece.setPosition(moveTo)
    }
  }

  private copyBoard(): ChessBoard {
    return this.board.map((row) => {
      return row.map((piece) => piece)
    })
  }
}
