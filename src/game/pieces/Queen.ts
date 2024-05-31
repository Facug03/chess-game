import { PIECES } from '../../consts/pieces'
import { ChessBoard, Color, Piece, PieceName, PiecePosition } from '../../types'
import { Empty } from './Empty'

export class Queen implements Piece {
  public name: PieceName = PIECES.queen

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

    console.log({ squaresToMoveX, squaresToMoveY })

    if (
      Math.abs(squaresToMoveX) !== Math.abs(squaresToMoveY) &&
      squaresToMoveX !== 0 &&
      squaresToMoveY !== 0
    ) {
      console.log('here')
      return false
    }

    if (this.checkColision(moveTo, board)) {
      console.log('xd')
      return false
    }

    board[toX][toY] = currentPiece
    board[fromX][fromY] = new Empty('empty', [fromX, fromY], '')
    this.setPosition(moveTo)

    return true
  }

  checkColision(moveTo: PiecePosition, board: ChessBoard): boolean {
    const [fromX, fromY] = this.position
    const { squaresToMoveX, squaresToMoveY } = this.squaresToMove(moveTo)

    if (squaresToMoveX === 0 || squaresToMoveY === 0) {
      if (squaresToMoveX !== 0) {
        if (squaresToMoveX > 0) {
          for (let i = 1; i < squaresToMoveX; i++) {
            if (board[fromX - i][fromY].name !== PIECES.empty) {
              return true
            }
          }
        } else if (squaresToMoveX < 0) {
          for (let i = 1; i < -squaresToMoveX; i++) {
            if (board[fromX + i][fromY].name !== PIECES.empty) {
              return true
            }
          }
        }
      }

      if (squaresToMoveY !== 0) {
        if (squaresToMoveY > 0) {
          for (let i = 1; i < squaresToMoveY; i++) {
            if (board[fromX][fromY - i].name !== PIECES.empty) {
              return true
            }
          }
        } else if (squaresToMoveY < 0) {
          for (let i = 1; i < -squaresToMoveY; i++) {
            if (board[fromX][fromY + i].name !== PIECES.empty) {
              return true
            }
          }
        }
      }
    }

    if (squaresToMoveX > 0) {
      if (squaresToMoveY > 0) {
        for (let i = 1; i < squaresToMoveY; i++) {
          console.log(fromX, fromY)
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
