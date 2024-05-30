import { PIECES } from '../../consts/pieces'
import { ChessBoard, Color, Piece, PieceName, PiecePosition } from '../../types'
import { Empty } from './Empty'

export class Pawn implements Piece {
  public name: PieceName = PIECES.pawn

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
    const squaresToMoveX = fromX - toX
    const squaresToMoveY = fromY - toY
    const currentPiece = board[fromX][fromY]

    console.log(
      { squaresToMoveX, squaresToMoveY },
      this.checkColision(moveTo, board)
    )

    if (squaresToMoveX <= 0 || squaresToMoveX > 2) {
      return false
    }

    if (squaresToMoveX === 2 && squaresToMoveY !== 0) {
      return false
    }

    if (this.checkColision(moveTo, board)) {
      return false
    }

    board[toX][toY] = currentPiece
    board[fromX][fromY] = new Empty('empty', [fromX, fromY], '')
    this.setPosition(moveTo)

    return true
  }

  checkColision(moveTo: PiecePosition, board: ChessBoard): boolean {
    const [toX, toY] = moveTo
    const { squaresToMoveX, squaresToMoveY } = this.squaresToMove(moveTo)
    const moveToBoardPosition = board[toX][toY]

    if (squaresToMoveX === 2 && squaresToMoveY === 0) {
      if (moveToBoardPosition.name !== PIECES.empty) {
        return true
      }

      if (board[toX - 1][toY].name !== PIECES.empty) {
        return true
      }
    }

    if (squaresToMoveX === 1 && squaresToMoveY === 0) {
      if (
        moveToBoardPosition.name !== PIECES.empty &&
        moveToBoardPosition.color !== this.color
      ) {
        return true
      }
    }

    if (squaresToMoveX === 1 && squaresToMoveY !== 0) {
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
