import { PIECES } from '../../consts/pieces'
import { ChessBoard, Color, Piece, PieceName, PiecePosition } from '../../types'
import { Empty } from './Empty'

export class Knight implements Piece {
  public name: PieceName = PIECES.knight

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

    if (squaresToMoveX === 0 || squaresToMoveY === 0) {
      return false
    }

    if (Math.abs(squaresToMoveX) > 2 || Math.abs(squaresToMoveY) > 2) {
      return false
    }

    if (Math.abs(squaresToMoveX) === Math.abs(squaresToMoveY)) {
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

    if (board[toX][toY].color === this.color) {
      return true
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
