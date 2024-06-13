import { ChessBoard, Color, FinishGame, MoveType, Movements, Piece, PiecePosition, PieceName } from './interface'
import { Bishop } from './pieces/Bishop'
import { Empty } from './pieces/Empty'
import { King } from './pieces/King'
import { Knight } from './pieces/Knight'
import { Pawn } from './pieces/Pawn'
import { Queen } from './pieces/Queen'
import { Rook } from './pieces/Rook'
import { Player } from './player/Player'
import { getPieceClass } from '../consts/getPieceClass'

export class Chess {
  public board: ChessBoard
  private players: [Player, Player]
  public currentPlayer: Color
  private lastMovedPiece: Piece | null = null
  public reverse = false
  private movements: Movements = []
  private actualMovement = 0
  public state: 'playing' | 'finished' = 'playing'

  constructor() {
    this.board = Array(8)
      .fill(null)
      .map(() => Array(8).fill(null))
    this.players = [new Player('white'), new Player('black')]
    this.currentPlayer = 'white'
    this.placeInitialPieces('white')
    this.placeInitialPieces('black')
    this.placeInitialEmptyPieces()
  }

  public makeMove(
    [fromX, fromY]: PiecePosition,
    [toX, toY]: PiecePosition
  ): {
    moved: boolean
    result: FinishGame | null
    type: MoveType | null
    callBack?: (pieceName: PieceName) => void
  } {
    const currentPiece = this.board[fromX][fromY]
    const canMove = currentPiece.canMovePieceTo([toX, toY], this.board, this.lastMovedPiece)

    if (!canMove) {
      return {
        moved: false,
        result: null,
        type: null,
      }
    }

    const copyBoard = this.copyBoard()
    this.movePiece([fromX, fromY], [toX, toY], copyBoard, false)
    const currentPlayer = this.currentPlayer === 'white' ? this.players[0] : this.players[1]
    const isCheckAfterMove = this.isKingInCheck(copyBoard, [currentPlayer])

    if (isCheckAfterMove) {
      return {
        moved: false,
        result: null,
        type: null,
      }
    }

    if (this.movements.length !== this.actualMovement) {
      this.movements.splice(this.actualMovement)
    }

    const moveMade = this.movePiece([fromX, fromY], [toX, toY], this.board, true)
    this.actualMovement += 1
    const result = this.isCheckMateOrStealMate()

    if (result.isCheckMate) {
      this.state = 'finished'
      return {
        moved: true,
        result: 'checkmate',
        type: 'normal',
      }
    }

    if (result.isStealMate) {
      this.state = 'finished'
      return {
        moved: true,
        result: 'stalemate',
        type: 'normal',
      }
    }

    return {
      moved: true,
      result: null,
      type: 'normal',
      callBack: moveMade.callBackMove,
    }
  }

  private placeInitialPieces(color: Color): void {
    const isWhite = color === 'white'
    const mainRow = isWhite ? 7 : 0
    const pawnRow = isWhite ? 6 : 1

    this.board[mainRow][0] = new Rook(color, [mainRow, 0], `/assets/pieces/${color}/rook.png`, 0)
    this.board[mainRow][1] = new Knight(color, [mainRow, 1], `/assets/pieces/${color}/knight.png`, 0)
    this.board[mainRow][2] = new Bishop(color, [mainRow, 2], `/assets/pieces/${color}/bishop.png`, 0)
    this.board[mainRow][3] = new Queen(color, [mainRow, 3], `/assets/pieces/${color}/queen.png`, 0)
    this.board[mainRow][4] = new King(color, [mainRow, 4], `/assets/pieces/${color}/king.png`, 0)
    this.board[mainRow][5] = new Bishop(color, [mainRow, 5], `/assets/pieces/${color}/bishop.png`, 0)
    this.board[mainRow][6] = new Knight(color, [mainRow, 6], `/assets/pieces/${color}/knight.png`, 0)
    this.board[mainRow][7] = new Rook(color, [mainRow, 7], `/assets/pieces/${color}/rook.png`, 0)

    for (let i = 0; i < 8; i++) {
      this.board[pawnRow][i] = new Pawn(color, [pawnRow, i], `/assets/pieces/${color}/pawn.png`, 0)
    }
  }

  private placeInitialEmptyPieces() {
    Array(4)
      .fill('')
      .map((_, x) => {
        return Array(8)
          .fill('')
          .forEach((_, y) => {
            this.board[Math.abs(x - 5)][y] = new Empty('empty', [Math.abs(x - 5), y], '', 0)
          })
      })
  }

  public changePlayer(color?: Color) {
    if (color) this.currentPlayer = color
    else this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white'
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

  private movePiece(
    position: PiecePosition,
    moveTo: PiecePosition,
    board: ChessBoard,
    changePosition: boolean
  ): {
    type: MoveType
    callBackMove?: (pieceName: PieceName) => void
  } {
    const [fromX, fromY] = position
    const [toX, toY] = moveTo
    const piece = board[fromX][fromY]
    const promotePawn =
      piece.name === 'pawn' &&
      ((piece.color === 'white' && toX === 0) || (piece.color === 'black' && toX === 7)) &&
      changePosition
    const enPassant = piece.name === 'pawn' && fromY !== toY && board[toX][toY].name === 'empty'
    const castling = piece.name === 'king' && Math.abs(fromY - toY) === 2
    let type: MoveType = 'normal'

    if (changePosition) {
      piece.moveCount += 1
    }

    if (promotePawn) {
      const callBackMove = this.movePromotion(position, moveTo, board)
      type = 'promotion'

      return {
        type,
        callBackMove,
      }
    } else if (enPassant) {
      this.moveEnPassant(position, moveTo, board, changePosition)
      type = 'enPassant'
    } else if (castling) {
      this.moveCastling(position, moveTo, board, changePosition)
      type = 'castling'
    } else {
      if (changePosition) {
        this.movements.push([
          {
            from: new getPieceClass[piece.name](piece.color, [fromX, fromY], piece.image, piece.moveCount),
            to: board[toX][toY],
          },
        ])
      }

      board[fromX][fromY] = new Empty('empty', [fromX, fromY], '', 0)
      board[toX][toY] = piece
    }

    if (changePosition) {
      piece.setPosition(moveTo)
      this.lastMovedPiece = piece
      this.changePlayer()
    }

    return {
      type,
    }
  }

  private movePromotion(
    [fromX, fromY]: PiecePosition,
    [toX, toY]: PiecePosition,
    board: ChessBoard
  ): (pieceName: PieceName) => void {
    let piece = this.board[fromX][fromY]

    return (pieceName: PieceName) => {
      const newPiece = new getPieceClass[pieceName](
        this.currentPlayer,
        [toX, toY],
        `/assets/pieces/${this.currentPlayer}/${pieceName}.png`,
        piece.moveCount
      )
      this.movements.push([
        {
          from: new getPieceClass[piece.name](piece.color, [fromX, fromY], piece.image, piece.moveCount),
          to: board[toX][toY],
        },
      ])
      piece = newPiece

      board[toX][toY] = piece
      board[fromX][fromY] = new Empty('empty', [fromX, fromY], '', 0)

      piece.setPosition([toX, toY])
      this.lastMovedPiece = piece
      this.changePlayer()
    }
  }

  private moveCastling(
    [fromX, fromY]: PiecePosition,
    [toX, toY]: PiecePosition,
    board: ChessBoard,
    changePosition: boolean
  ): void {
    const piece = this.board[fromX][fromY]

    this.movements.push([
      {
        from: new getPieceClass[piece.name](piece.color, [fromX, fromY], piece.image, piece.moveCount),
        to: board[toX][toY],
      },
    ])
    board[toX][toY] = piece
    board[fromX][fromY] = new Empty('empty', [fromX, fromY], '', 0)

    if (this.currentPlayer === 'white') {
      if (fromY < toY) {
        if (changePosition) {
          this.movements[this.movements.length - 1].push({
            from: new getPieceClass[board[toX][7].name](
              board[toX][7].color,
              [toX, 7],
              board[toX][7].image,
              board[toX][7].moveCount
            ),
            to: new getPieceClass[board[toX][toY - 1].name](
              board[toX][toY - 1].color,
              [toX, toY - 1],
              board[toX][toY - 1].image,
              board[toX][toY - 1].moveCount
            ),
          })
          board[toX][7].setPosition([toX, toY - 1])
        }

        board[toX][toY - 1] = board[toX][7]
        board[toX][7] = new Empty('empty', [toX, 7], '', 0)
      } else {
        if (changePosition) {
          this.movements[this.movements.length - 1].push({
            from: new getPieceClass[board[toX][0].name](
              board[toX][0].color,
              [toX, 0],
              board[toX][0].image,
              board[toX][0].moveCount
            ),
            to: new getPieceClass[board[toX][toY + 1].name](
              board[toX][toY + 1].color,
              [toX, toY + 1],
              board[toX][toY + 1].image,
              board[toX][toY + 1].moveCount
            ),
          })
          board[toX][0].setPosition([toX, toY + 1])
        }

        board[toX][toY + 1] = board[toX][0]
        board[toX][0] = new Empty('empty', [toX, 0], '', 0)
      }
    }
  }

  private moveEnPassant(
    [fromX, fromY]: PiecePosition,
    [toX, toY]: PiecePosition,
    board: ChessBoard,
    changePosition: boolean
  ) {
    const piece = this.board[fromX][fromY]
    const formatToX = this.currentPlayer === 'white' ? toX + 1 : toX - 1

    if (changePosition) {
      this.movements.push([
        {
          from: new getPieceClass[piece.name](piece.color, [fromX, fromY], piece.image, piece.moveCount),
          to: board[toX][toY],
        },
        {
          from: new getPieceClass[board[formatToX][toY].name](
            board[formatToX][toY].color,
            [formatToX, toY],
            board[formatToX][toY].image,
            board[formatToX][toY].moveCount
          ),
          to: new Empty('empty', [formatToX, toY], '', 0),
        },
      ])
    }

    board[toX][toY] = piece
    board[fromX][fromY] = new Empty('empty', [fromX, fromY], '', 0)
    board[formatToX][toY] = new Empty('empty', [formatToX, toY], '', 0)
  }

  public copyBoard(): ChessBoard {
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

        if (validMoves.length > 0) {
          return {
            isCheckMate: false,
            isStealMate: false,
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

  public getAllPossibleMoves(position: PiecePosition): PiecePosition[] {
    const [x, y] = position
    const piece = this.board[x][y]
    const possibleMoves: PiecePosition[] = []
    const currentPlayer = this.currentPlayer === 'white' ? this.players[0] : this.players[1]

    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        const canMove = piece.canMovePieceTo([x, y], this.board, this.lastMovedPiece)

        if (!canMove) continue

        const copyBoard = this.copyBoard()
        this.movePiece(piece.position, [x, y], copyBoard, false)

        if (this.isKingInCheck(copyBoard, [currentPlayer])) continue

        possibleMoves.push([x, y])
      }
    }

    return possibleMoves
  }

  public toggleReverse() {
    this.reverse = !this.reverse
  }

  public reset() {
    this.placeInitialPieces('white')
    this.placeInitialPieces('black')
    this.placeInitialEmptyPieces()
    this.changePlayer('white')
    this.movements = []
    this.actualMovement = 0
    this.state = 'playing'
  }

  public undo() {
    if (!this.movements.length) return

    const lastMovements = this.movements[this.actualMovement - 1]

    if (!lastMovements) return

    for (const movement of lastMovements) {
      const [fromX, fromY] = movement.from.position
      const [toX, toY] = movement.to.position

      if (lastMovements.indexOf(movement) === 0 && this.movements[this.actualMovement - 2]) {
        const movementBefore = this.movements[this.actualMovement - 2]

        if (this.movements[this.actualMovement - 2][0] && movementBefore) {
          this.lastMovedPiece = new getPieceClass[movementBefore[0].from.name](
            movementBefore[0].from.color,
            movementBefore[0].to.position,
            movementBefore[0].from.image,
            movementBefore[0].from.moveCount
          )
        } else this.lastMovedPiece = null
      }

      const newPiece = new getPieceClass[movement.from.name](
        movement.from.color,
        [fromX, fromY],
        movement.from.image,
        movement.from.moveCount
      )

      if (fromX === toX && fromY === toY) {
        this.board[fromX][fromY] = newPiece
        continue
      }

      if (lastMovements.indexOf(movement) === 0) {
        newPiece.moveCount -= 1
      }
      this.board[fromX][fromY] = newPiece
      this.board[toX][toY] = movement.to
    }

    this.actualMovement -= 1
    this.changePlayer(this.actualMovement % 2 === 0 ? 'white' : 'black')
  }

  public redo() {
    if (!this.movements.length) return

    const nextMovements = this.movements[this.actualMovement]

    if (!nextMovements) return

    for (const movement of nextMovements) {
      const [fromX, fromY] = movement.from.position
      const [toX, toY] = movement.to.position

      if (fromX === toX && fromY === toY) {
        this.board[toX][toY] = new getPieceClass[movement.to.name](
          movement.to.color,
          [toX, toY],
          movement.to.image,
          movement.to.moveCount
        )
        continue
      }

      const newPiece = new getPieceClass[movement.from.name](
        movement.from.color,
        [toX, toY],
        movement.from.image,
        movement.from.moveCount
      )

      if (nextMovements.indexOf(movement) === 0) {
        this.lastMovedPiece = newPiece
      }

      this.board[fromX][fromY] = new Empty('empty', [fromX, fromY], '', 0)
      this.board[toX][toY] = newPiece
    }

    this.actualMovement += 1
    this.changePlayer(this.actualMovement % 2 === 0 ? 'white' : 'black')
  }
}
