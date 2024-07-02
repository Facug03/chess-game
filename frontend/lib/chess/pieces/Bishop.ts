import { ChessBoard, Color, Piece, PieceName, PiecePosition } from '../types'
import { PIECES } from '@src/consts/pieces'
import { isSameColor } from '@src/utils/isPieceSameColor'

export class Bishop implements Piece {
  public name: PieceName = PIECES.bishop

  constructor(
    public color: Color,
    public position: PiecePosition,
    public image: string,
    public moveCount: number
  ) {
    this.color = color
    this.position = position
    this.image = image
    this.moveCount = moveCount
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

    if (squaresToMoveY > 0) {
      if (squaresToMoveX > 0) {
        for (let i = 1; i < squaresToMoveX; i++) {
          if (board[fromY - i][fromX - i].name !== PIECES.empty) {
            return true
          }
        }
      } else if (squaresToMoveX < 0) {
        for (let i = 1; i < Math.abs(squaresToMoveX); i++) {
          if (board[fromY - i][fromX + i].name !== PIECES.empty) {
            return true
          }
        }
      }
    }

    if (squaresToMoveY < 0) {
      if (squaresToMoveX > 0) {
        for (let i = 1; i < squaresToMoveX; i++) {
          if (board[fromY + i][fromX - i].name !== PIECES.empty) {
            return true
          }
        }
      } else if (squaresToMoveX < 0) {
        for (let i = 1; i < Math.abs(squaresToMoveX); i++) {
          if (board[fromY + i][fromX + i].name !== PIECES.empty) {
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
      squaresToMoveY
    }
  }
}
