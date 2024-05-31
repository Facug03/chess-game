import { PIECES } from '../../consts/pieces'
import { ChessBoard, Color, Piece, PieceName, PiecePosition } from '../../types'
import { Empty } from './Empty'

export class Pawn implements Piece {
  public name: PieceName = PIECES.pawn
  private moveCount: number = 0

  constructor(
    public color: Color,
    public position: PiecePosition,
    public image: string
  ) {
    this.color = color
    this.position = position
    this.image = image
  }

  setPosition(position: PiecePosition): void {
    this.position = position
  }

  movePieceTo(moveTo: PiecePosition, board: ChessBoard): boolean {
    const [fromX, fromY] = this.position
    const [toX, toY] = moveTo
    const { squaresToMoveX, squaresToMoveY } = this.squaresToMove(moveTo)
    const currentPiece = board[fromX][fromY]
    const formatSquaresToMoveX =
      this.color === 'white' ? squaresToMoveX : -squaresToMoveX

    console.log({ squaresToMoveX, squaresToMoveY })

    if (formatSquaresToMoveX <= 0 || formatSquaresToMoveX > 2) {
      return false
    }

    if (formatSquaresToMoveX === 2 && squaresToMoveY !== 0) {
      return false
    }

    if (this.checkColision(moveTo, board)) {
      return false
    }

    board[toX][toY] = currentPiece
    board[fromX][fromY] = new Empty('empty', [fromX, fromY], '')
    this.setPosition(moveTo)
    this.moveCount += 1

    return true
  }

  checkColision(moveTo: PiecePosition, board: ChessBoard): boolean {
    const [toX, toY] = moveTo
    const { squaresToMoveX, squaresToMoveY } = this.squaresToMove(moveTo)
    const moveToBoardPosition = board[toX][toY]
    const formatSquaresToMoveX =
      this.color === 'white' ? squaresToMoveX : -squaresToMoveX

    if (formatSquaresToMoveX === 2 && squaresToMoveY === 0) {
      if (this.moveCount > 0) {
        return true
      }

      if (moveToBoardPosition.name !== PIECES.empty) {
        return true
      }

      const formatToX = this.color === 'white' ? toX + 1 : toX - 1

      if (board[formatToX][toY].name !== PIECES.empty) {
        return true
      }
    }

    if (formatSquaresToMoveX === 1 && squaresToMoveY === 0) {
      if (
        moveToBoardPosition.name !== PIECES.empty &&
        moveToBoardPosition.color !== this.color
      ) {
        return true
      }
    }

    if (formatSquaresToMoveX === 1 && squaresToMoveY !== 0) {
      if (moveToBoardPosition.color === this.color) {
        return true
      }

      if (moveToBoardPosition.name === PIECES.empty) {
        return true
      }
    }

    return false
  }

  squaresToMove(moveTo: PiecePosition) {
    const [fromX, fromY] = this.position
    const [toX, toY] = moveTo
    const squaresToMoveX = fromX - toX
    const squaresToMoveY = fromY - toY

    return {
      squaresToMoveX,
      squaresToMoveY,
    }
  }
}
