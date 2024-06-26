import { ChessBoard, Color, PiecePosition } from '@lib/chess/types'

export const isSameColor = (board: ChessBoard, position: PiecePosition, color: Color): boolean => {
  return board[position[0]][position[1]].color === color
}
