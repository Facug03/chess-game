import { PIECES } from '../../consts/pieces'
import { ChessBoard, Color, Piece, PieceName, PiecePosition } from '../../types'
import { isSameColor } from '../../utils/isPieceSameColor'

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

    if (squaresToMoveX <= 0 || squaresToMoveX > 2 || Math.abs(squaresToMoveY) > 1) {
      return false
    }

    if (squaresToMoveX === 2 && squaresToMoveY !== 0) {
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
    const moveToBoardPosition = board[toX][toY]

    if (squaresToMoveX === 2 && squaresToMoveY === 0) {
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

    if (squaresToMoveX === 1 && squaresToMoveY === 0) {
      if (moveToBoardPosition.name !== PIECES.empty && moveToBoardPosition.color !== this.color) {
        return true
      }
    }

    if (squaresToMoveX === 1 && squaresToMoveY !== 0) {
      if (moveToBoardPosition.color === this.color) {
        return true
      }

      if (moveToBoardPosition.name === PIECES.empty) {
        const formatToX = this.color === 'white' ? toX + 1 : toX - 1
        const sidePiece = board[formatToX][toY]

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
    let squaresToMoveX = fromX - toX
    const squaresToMoveY = fromY - toY
    squaresToMoveX = this.color === 'white' ? squaresToMoveX : -squaresToMoveX

    return {
      squaresToMoveX,
      squaresToMoveY,
    }
  }
}
