import { ChessBoard, Color, Piece, PieceName, PiecePosition } from '../types'
import { isSameColor } from '@src/utils/isPieceSameColor'
import { PIECES } from '@src/consts/pieces'

export class Pawn implements Piece {
  public name: PieceName = PIECES.pawn

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

  setPosition(position: PiecePosition): void {
    this.position = position
  }

  canMovePieceTo(moveTo: PiecePosition, board: ChessBoard, lastMovedPiece: Piece | null): boolean {
    const { squaresToMoveX, squaresToMoveY } = this.squaresToMove(moveTo)

    if (isSameColor(board, moveTo, this.color)) {
      return false
    }

    if (squaresToMoveY <= 0 || squaresToMoveY > 2 || Math.abs(squaresToMoveX) > 1) {
      return false
    }

    if (squaresToMoveY === 2 && squaresToMoveX !== 0) {
      return false
    }

    if (this.checkColision(moveTo, board, lastMovedPiece)) {
      return false
    }

    return true
  }

  checkColision(moveTo: PiecePosition, board: ChessBoard, lastMovedPiece: Piece | null): boolean {
    const [toX, toY] = moveTo
    const { squaresToMoveX, squaresToMoveY } = this.squaresToMove(moveTo)
    const moveToBoardPosition = board[toY][toX]

    if (squaresToMoveY === 2 && squaresToMoveX === 0) {
      if (this.moveCount > 0) {
        return true
      }

      if (moveToBoardPosition.name !== PIECES.empty) {
        return true
      }

      const formatToY = this.color === 'white' ? toY + 1 : toY - 1

      if (board[formatToY][toX].name !== PIECES.empty) {
        return true
      }
    }

    if (squaresToMoveY === 1 && squaresToMoveX === 0) {
      if (moveToBoardPosition.name !== PIECES.empty && moveToBoardPosition.color !== this.color) {
        return true
      }
    }

    if (squaresToMoveY === 1 && squaresToMoveX !== 0) {
      if (moveToBoardPosition.color === this.color) {
        return true
      }

      if (moveToBoardPosition.name === PIECES.empty) {
        const formatToY = this.color === 'white' ? toY + 1 : toY - 1
        const sidePiece = board[formatToY][toX]

        if (sidePiece.name === PIECES.empty) {
          return true
        }

        if (sidePiece.color === this.color) {
          return true
        }

        if (sidePiece.name !== PIECES.pawn) {
          return true
        }

        if (sidePiece.moveCount !== 1) {
          return true
        }

        if (
          lastMovedPiece?.position[0] !== sidePiece.position[0] ||
          lastMovedPiece?.position[1] !== sidePiece.position[1]
        ) {
          return true
        }
      }
    }

    return false
  }

  squaresToMove(moveTo: PiecePosition) {
    const [fromX, fromY] = this.position
    const [toX, toY] = moveTo
    const squaresToMoveX = fromX - toX
    let squaresToMoveY = fromY - toY
    squaresToMoveY = this.color === 'white' ? squaresToMoveY : -squaresToMoveY

    return {
      squaresToMoveX,
      squaresToMoveY
    }
  }
}
