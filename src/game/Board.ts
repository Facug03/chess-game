import { Square } from '../ui/Square'
import { ChessBoard, Color, Piece, PiecePosition } from '../types'
import { Bishop } from './pieces/Bishop'
import { Empty } from './pieces/Empty'
import { King } from './pieces/King'
import { Knight } from './pieces/Knight'
import { Pawn } from './pieces/Pawn'
import { Queen } from './pieces/Queen'
import { Rook } from './pieces/Rook'
import { Player } from './player/Player'
import { Promote } from '../ui/Promote'
import { getPromoteClass } from '../consts/getPromoteClass'

export class Board {
  private board: ChessBoard
  private players: [Player, Player]
  private currentPlayer: Color
  private $pieceSelected: HTMLElement | null = null
  private $turn: HTMLElement | null = null
  private lastMovedPiece: Piece | null = null

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

    $pieces.forEach(($pieceElement) => {
      $pieceElement.addEventListener('click', () => {
        this.removePromotePawn()

        if (
          $pieceElement.dataset.color !== this.currentPlayer &&
          this.$pieceSelected !== $pieceElement &&
          this.$pieceSelected
        ) {
          if (!$pieceElement.dataset.xy || !this.$pieceSelected.dataset.xy) return

          const [toX, toY] = $pieceElement.dataset.xy.split('-').map((data) => Number(data))
          const [fromX, fromY] = this.$pieceSelected.dataset.xy.split('-').map((data) => Number(data))
          const currentPiece = this.board[fromX][fromY]
          const canMove = currentPiece.canMovePieceTo([toX, toY], this.board, this.lastMovedPiece)

          if (!canMove) {
            this.removeColorClass(this.$pieceSelected)
            this.$pieceSelected = null
            this.remodeAllGuideLines()

            return
          }

          const copyBoard = this.copyBoard()
          this.movePiece([fromX, fromY], [toX, toY], copyBoard, false)
          const currentPlayer = this.currentPlayer === 'white' ? this.players[0] : this.players[1]

          const isCheckAfterMove = this.isKingInCheck(copyBoard, [currentPlayer])

          if (isCheckAfterMove) {
            this.removeColorClass(this.$pieceSelected)
            this.$pieceSelected = null
            this.remodeAllGuideLines()

            return
          }

          this.movePiece([fromX, fromY], [toX, toY], this.board, true)

          const result = this.isCheckMateOrStealMate()

          if (result.isCheckMate) {
            console.log('Checkmate! Game over.')
            return
          }

          if (result.isStealMate) {
            console.log('Stealmate! Game over.')
            return
          }

          return
        }

        if ($pieceElement.dataset.color !== this.currentPlayer || !$pieceElement.dataset.xy) {
          return
        }

        if (this.$pieceSelected) {
          this.removeColorClass(this.$pieceSelected)
          this.remodeAllGuideLines()

          if ($pieceElement === this.$pieceSelected) {
            this.$pieceSelected = null

            return
          }
        }

        this.$pieceSelected = $pieceElement
        this.addColorClass(this.$pieceSelected)
        const position = $pieceElement.dataset.xy.split('-').map((data) => Number(data)) as PiecePosition
        const validMoves = this.getAllPossibleMoves(position)

        for (const move of validMoves) {
          const copyBoard = this.copyBoard()
          this.movePiece(position, move, copyBoard, false)

          const currentPlayer = this.currentPlayer === 'white' ? this.players[0] : this.players[1]

          if (!this.isKingInCheck(copyBoard, [currentPlayer])) {
            const element = document.querySelector(`.square[data-xy="${move[0]}-${move[1]}"]`) as HTMLElement

            if (!element) continue

            if (element.dataset.color !== 'empty') {
              element.innerHTML = `<div class="captureGuideLine"></div>`
              continue
            }

            element.innerHTML = `<div class="guideLine"></div>`
          }
        }
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

    this.board[mainRow][0] = new Rook(color, [mainRow, 0], `/assets/pieces/${color}/rook.png`)
    this.board[mainRow][1] = new Knight(color, [mainRow, 1], `/assets/pieces/${color}/knight.png`)
    this.board[mainRow][2] = new Bishop(color, [mainRow, 2], `/assets/pieces/${color}/bishop.png`)
    this.board[mainRow][3] = new Queen(color, [mainRow, 3], `/assets/pieces/${color}/queen.png`)
    this.board[mainRow][4] = new King(color, [mainRow, 4], `/assets/pieces/${color}/king.png`)
    this.board[mainRow][5] = new Bishop(color, [mainRow, 5], `/assets/pieces/${color}/bishop.png`)
    this.board[mainRow][6] = new Knight(color, [mainRow, 6], `/assets/pieces/${color}/knight.png`)
    this.board[mainRow][7] = new Rook(color, [mainRow, 7], `/assets/pieces/${color}/rook.png`)

    for (let i = 0; i < 8; i++) {
      this.board[pawnRow][i] = new Pawn(color, [pawnRow, i], `/assets/pieces/${color}/pawn.png`)
    }
  }

  private placeInitialEmptyPieces() {
    Array(4)
      .fill('')
      .map((_, x) => {
        return Array(8)
          .fill('')
          .forEach((_, y) => {
            this.board[Math.abs(x - 5)][y] = new Empty('empty', [Math.abs(x - 5), y], '')
          })
      })
  }

  private printBoard() {
    const $board = document.getElementById('board')

    if (!$board) return

    const rows: string[] = []

    this.board.forEach((row) => {
      rows.push(
        row
          .map((piece) => {
            return Square({ piece })
          })
          .join('')
      )
    })

    $board.innerHTML = rows
      .map((row) => {
        return row
      })
      .join('')

    this.gameLoop()
  }

  private removeColorClass($element: HTMLElement | null) {
    if (!$element) return

    $element.classList.remove(`selected-${$element.classList.contains('green') ? 'green' : 'grey'}`)
  }

  private addColorClass($element: HTMLElement) {
    if (!$element) return

    $element.classList.add(`selected-${$element.classList.contains('green') ? 'green' : 'grey'}`)
  }

  public changePlayer() {
    this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white'

    if (this.$turn) {
      this.$turn.innerText = `TURN: ${this.currentPlayer.toUpperCase()}`
    }
  }

  private isKingInCheck(board: ChessBoard, players: Player[]): boolean {
    for (const player of players) {
      let kingPosition: PiecePosition | null = null

      for (const row of board) {
        for (const piece of row) {
          if (piece.name === 'king' && piece.color === player.getColor()) {
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
            piece.color !== player.getColor() &&
            piece.canMovePieceTo(kingPosition as PiecePosition, board, this.lastMovedPiece)
        )
      )

      if (!isCheck) continue

      return isCheck
    }

    return false
  }

  private movePiece(position: PiecePosition, moveTo: PiecePosition, board: ChessBoard, changePosition: boolean) {
    const [fromX, fromY] = position
    const [toX, toY] = moveTo
    let piece = board[fromX][fromY]

    if (
      piece.name === 'pawn' &&
      ((piece.color === 'white' && toX === 0) || (piece.color === 'black' && toX === 7)) &&
      changePosition
    ) {
      // Promote pawn
      const $toElement = document.querySelector(`[data-xy="${toX}-${toY}"]`)

      if (!$toElement) return

      $toElement.innerHTML = Promote({ color: this.currentPlayer })

      const $promoteElement = [...document.querySelectorAll('.promote')] as HTMLDivElement[]

      if (!$promoteElement) return

      for (const $element of $promoteElement) {
        $element.addEventListener('click', (e) => {
          e.stopPropagation()
          const pieceName = $element.dataset.piece as keyof typeof getPromoteClass

          console.log({ pieceName })

          if (!pieceName) return

          piece = new getPromoteClass[pieceName](
            this.currentPlayer,
            [toX, toY],
            `/assets/pieces/${piece.color}/${pieceName}.png`
          )

          board[toX][toY] = piece
          board[fromX][fromY] = new Empty('empty', [fromX, fromY], '')

          piece.moveCount += 1
          piece.setPosition(moveTo)
          this.lastMovedPiece = piece
          this.removePromotePawn()
          this.changePlayer()
          this.printBoard()
          this.highlightLastMovement([fromX, fromY], [toX, toY])
        })
      }

      return
    }

    if (piece.name === 'pawn' && fromY !== toY && board[toX][toY].name === 'empty') {
      // En passant
      const formatToX = this.currentPlayer === 'white' ? toX + 1 : toX - 1

      board[toX][toY] = piece
      board[fromX][fromY] = new Empty('empty', [fromX, fromY], '')
      board[formatToX][toY] = new Empty('empty', [toX, toY], '')
    } else if (piece.name === 'king' && Math.abs(fromY - toY) === 2) {
      // Castling
      board[toX][toY] = piece
      board[fromX][fromY] = new Empty('empty', [fromX, fromY], '')

      if (this.currentPlayer === 'white') {
        if (fromY < toY) {
          if (changePosition) {
            board[toX][7].setPosition([toX, toY - 1])
          }

          board[toX][toY - 1] = board[toX][7]
          board[toX][7] = new Empty('empty', [toX, 7], '')
        } else {
          if (changePosition) {
            board[toX][0].setPosition([toX, toY + 1])
          }

          board[toX][toY + 1] = board[toX][0]
          board[toX][0] = new Empty('empty', [toX, 0], '')
        }
      } else {
        if (fromY > toY) {
          console.log('right')
          if (changePosition) {
            board[toX][0].setPosition([toX, toY + 1])
          }

          board[toX][toY + 1] = board[toX][0]
          board[toX][0] = new Empty('empty', [toX, 0], '')
        } else {
          if (changePosition) {
            board[toX][7].setPosition([toX, toY - 1])
          }

          board[toX][toY - 1] = board[toX][7]
          board[toX][7] = new Empty('empty', [toX, 7], '')
        }
      }
    } else {
      board[toX][toY] = piece
      board[fromX][fromY] = new Empty('empty', [fromX, fromY], '')
    }

    if (changePosition) {
      piece.moveCount += 1
      piece.setPosition(moveTo)
      this.lastMovedPiece = piece
      this.changePlayer()
      this.printBoard()
      this.highlightLastMovement([fromX, fromY], [toX, toY])
    }
  }

  private copyBoard(): ChessBoard {
    return this.board.map((row) => {
      return row.map((piece) => piece)
    })
  }

  private isCheckMateOrStealMate(): {
    isCheckMate: boolean
    isStealMate: boolean
  } {
    const currentPlayer = this.currentPlayer === 'white' ? this.players[0] : this.players[1]

    for (const row of this.board) {
      for (const piece of row) {
        if (piece.color !== this.currentPlayer) {
          continue
        }

        const validMoves = this.getAllPossibleMoves(piece.position)

        for (const move of validMoves) {
          const copyBoard = this.copyBoard()
          this.movePiece(piece.position, move, copyBoard, false)

          if (!this.isKingInCheck(copyBoard, [currentPlayer])) {
            return {
              isCheckMate: false,
              isStealMate: false,
            }
          }
        }
      }
    }

    if (this.isKingInCheck(this.board, [currentPlayer])) {
      return {
        isCheckMate: true,
        isStealMate: false,
      }
    }

    return {
      isCheckMate: false,
      isStealMate: true,
    }
  }

  private getAllPossibleMoves(position: PiecePosition): PiecePosition[] {
    const [x, y] = position
    const piece = this.board[x][y]
    const possibleMoves: PiecePosition[] = []

    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        if (piece.canMovePieceTo([x, y], this.board, this.lastMovedPiece)) {
          possibleMoves.push([x, y])
        }
      }
    }

    return possibleMoves
  }

  private remodeAllGuideLines() {
    const $guideLines = document.querySelectorAll('.guideLine, .captureGuideLine')

    if (!$guideLines) return

    $guideLines.forEach(($guideLine) => {
      $guideLine.remove()
    })
  }

  private removePromotePawn() {
    const $promotes = document.querySelectorAll('.promote')

    if (!$promotes) return

    $promotes.forEach(($promote) => {
      $promote.remove()
    })
  }

  private highlightLastMovement(from: PiecePosition, move: PiecePosition) {
    const [fromX, fromY] = from
    const [toX, toY] = move
    const $toElement = document.querySelector(`[data-xy="${toX}-${toY}"]`) as HTMLElement
    const $fromElement = document.querySelector(`[data-xy="${fromX}-${fromY}"]`) as HTMLElement
    const $elements = [...document.querySelectorAll('.selected-green, .selected-grey')] as HTMLElement[]

    $elements.forEach(($element) => {
      this.removeColorClass($element)
    })

    this.addColorClass($toElement)
    this.addColorClass($fromElement)
  }
}
