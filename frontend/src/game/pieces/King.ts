import { PIECES } from '../../consts/pieces'
import { ChessBoard, Color, Piece, PieceName, PiecePosition } from '../../types'
import { isSameColor } from '../../utils/isPieceSameColor'

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

    if (Math.abs(squaresToMoveX) > 1 || Math.abs(squaresToMoveY) > 2) {
      return false
    }

    if (Math.abs(squaresToMoveX) === 1 && Math.abs(squaresToMoveY) === 2) {
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
    const { squaresToMoveY } = this.squaresToMove(moveTo)
    if (board[toX][toY].color === this.color) {
      return true
    }

    if (Math.abs(squaresToMoveY) === 2) {
      const isCheck = board.some((row) =>
        row.some((piece) => piece.color !== this.color && piece.canMovePieceTo(this.position, board, lastMovedPiece))
      )

      if (isCheck) {
        return true
      }

      if (this.moveCount > 0) {
        return true
      }

      const direction = squaresToMoveY > 0 ? -1 : 1
      const squaresToCheck = squaresToMoveY > 0 ? 4 : 3

      for (let i = 1; i <= squaresToCheck; i++) {
        const intermediateY = fromY + i * direction

        console.log(board[fromX][intermediateY].name, i, [fromX, intermediateY])

        if (i === squaresToCheck) {
          if (board[fromX][intermediateY].name !== PIECES.rook) return true

          if (board[fromX][intermediateY].moveCount > 0) return true
        } else {
          if (board[fromX][intermediateY].name !== PIECES.empty) return true

          if (board[fromX][intermediateY].name === PIECES.empty) {
            const canMove = board.some((row) =>
              row.some(
                (piece) =>
                  piece.color !== this.color && piece.canMovePieceTo([fromX, intermediateY], board, lastMovedPiece)
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
      squaresToMoveY,
    }
  }
}
