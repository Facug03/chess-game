import { ChessBoard, Color, Piece, PieceName, PiecePosition } from '../types'
import { isSameColor } from '@src/utils/isPieceSameColor'
import { PIECES } from '@src/consts/pieces'

export class King implements Piece {
  public name: PieceName = PIECES.king

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

    if (Math.abs(squaresToMoveY) > 1 || Math.abs(squaresToMoveX) > 2) {
      return false
    }

    if (Math.abs(squaresToMoveY) === 1 && Math.abs(squaresToMoveX) === 2) {
      return false
    }

    if (this.checkColision(moveTo, board, lastMovedPiece)) {
      return false
    }

    return true
  }

  checkColision(moveTo: PiecePosition, board: ChessBoard, lastMovedPiece: Piece | null): boolean {
    const [toX, toY] = moveTo
    const [fromX, fromY] = this.position
    const { squaresToMoveX } = this.squaresToMove(moveTo)

    if (board[toY][toX].color === this.color) {
      return true
    }

    if (Math.abs(squaresToMoveX) === 2) {
      const isCheck = board.some((row) =>
        row.some((piece) => piece.color !== this.color && piece.canMovePieceTo(this.position, board, lastMovedPiece))
      )

      if (isCheck) {
        return true
      }

      if (this.moveCount > 0) {
        return true
      }

      const direction = squaresToMoveX > 0 ? -1 : 1
      const squaresToCheck = squaresToMoveX > 0 ? 4 : 3

      for (let i = 1; i <= squaresToCheck; i++) {
        const intermediateX = fromX + i * direction

        if (i === squaresToCheck) {
          if (board[fromY][intermediateX].name !== PIECES.rook) return true

          if (board[fromY][intermediateX].moveCount > 0) return true
        } else {
          if (board[fromY][intermediateX].name !== PIECES.empty) return true

          if (board[fromY][intermediateX].name === PIECES.empty && i <= 2) {
            const canMove = board.some((row) =>
              row.some(
                (piece) =>
                  piece.color !== this.color && piece.canMovePieceTo([intermediateX, fromY], board, lastMovedPiece)
              )
            )

            if (canMove) return true
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
