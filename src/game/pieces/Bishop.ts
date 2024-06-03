import { PIECES } from '../../consts/pieces'
import { ChessBoard, Color, Piece, PieceName, PiecePosition } from '../../types'
import { isSameColor } from '../../utils/isPieceSameColor'

export class Bishop implements Piece {
  public name: PieceName = PIECES.bishop
  public moveCount: number = 0

  constructor(
    public color: Color,
    public position: PiecePosition,
    public image: string
  ) {
    this.color = color
    this.position = position
    this.image = image
  }

  setPosition(position: PiecePosition) {
    this.position = position
  }

  canMovePieceTo(moveTo: PiecePosition, board: ChessBoard): boolean {
    const { squaresToMoveX, squaresToMoveY } = this.squaresToMove(moveTo)

    if (isSameColor(board, moveTo, this.color)) {
      return false
    }

    if (Math.abs(squaresToMoveX) !== Math.abs(squaresToMoveY)) {
      return false
    }

    if (this.checkColision(moveTo, board)) {
      return false
    }

    return true
  }

  checkColision(moveTo: PiecePosition, board: ChessBoard): boolean {
    const [fromX, fromY] = this.position
    const { squaresToMoveX, squaresToMoveY } = this.squaresToMove(moveTo)

    if (squaresToMoveX > 0) {
      if (squaresToMoveY > 0) {
        for (let i = 1; i < squaresToMoveY; i++) {
          if (board[fromX - i][fromY - i].name !== PIECES.empty) {
            return true
          }
        }
      } else if (squaresToMoveY < 0) {
        for (let i = 1; i < Math.abs(squaresToMoveY); i++) {
          if (board[fromX - i][fromY + i].name !== PIECES.empty) {
            return true
          }
        }
      }
    }

    if (squaresToMoveX < 0) {
      if (squaresToMoveY > 0) {
        for (let i = 1; i < squaresToMoveY; i++) {
          if (board[fromX + i][fromY - i].name !== PIECES.empty) {
            return true
          }
        }
      } else if (squaresToMoveY < 0) {
        for (let i = 1; i < Math.abs(squaresToMoveY); i++) {
          if (board[fromX + i][fromY + i].name !== PIECES.empty) {
            return true
          }
        }
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
