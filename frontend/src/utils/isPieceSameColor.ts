import { ChessBoard, Color, PiecePosition } from '@lib/chess/types'

export const isSameColor = (board: ChessBoard, position: PiecePosition, color: Color): boolean => {
  return board[position[1]][position[0]].color === color
}
