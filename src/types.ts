export interface Piece {
  name: PieceName
  position: PiecePosition
  color: Color
  image: string

  setPosition(position: PiecePosition): void
}

export type PiecePosition = [number, number]

export type PieceName =
  | 'rook'
  | 'knight'
  | 'bishop'
  | 'queen'
  | 'king'
  | 'pawn'
  | 'empty'

export type Color = 'white' | 'black' | 'empty'
