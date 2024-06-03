import { PIECES } from '../../consts/pieces'
import { ChessBoard, Color, Piece, PieceName, PiecePosition } from '../../types'
import { isSameColor } from '../../utils/isPieceSameColor'

export class King implements Piece {
  public name: PieceName = PIECES.king
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

  setPosition(position: PiecePosition): void {
    this.position = position
  }

  canMovePieceTo(
    moveTo: PiecePosition,
    board: ChessBoard,
    lastMovedPiece: Piece | null
  ): boolean {
    const { squaresToMoveX, squaresToMoveY } = this.squaresToMove(moveTo)

    console.log(this.position)

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

  checkColision(
    moveTo: PiecePosition,
    board: ChessBoard,
    lastMovedPiece: Piece | null
  ): boolean {
    const [toX, toY] = moveTo
    const [fromX, fromY] = this.position
    const { squaresToMoveY } = this.squaresToMove(moveTo)
    if (board[toX][toY].color === this.color) {
      return true
    }

    if (Math.abs(squaresToMoveY) === 2) {
      const isCheck = board.some((row) =>
        row.some(
          (piece) =>
            piece.color !== this.color &&
            piece.canMovePieceTo(this.position, board, lastMovedPiece)
        )
      )

      if (isCheck) {
        return true
      }

      if (this.moveCount > 0) {
        return true
      }

      if (squaresToMoveY > 0) {
        const squaresLeft = 7 - (fromY - 2)

        for (let i = 1; i < squaresLeft; i++) {
          if (i + 1 === squaresLeft) {
            if (board[fromX][fromY - i].name !== 'rook') return true

            if (board[fromX][fromY - i].moveCount > 0) return true
          } else if (board[fromX][fromY - i].name !== PIECES.empty) return true
        }
      } else if (squaresToMoveY < 0) {
        const squaresRigth = 7 - (fromY - 1)

        for (let i = 1; i < squaresRigth; i++) {
          if (i + 1 === squaresRigth) {
            if (board[fromX][fromY + i].name !== 'rook') return true

            if (board[fromX][fromY + i].moveCount > 0) return true
          } else if (board[fromX][fromY + i].name !== PIECES.empty) return true
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
