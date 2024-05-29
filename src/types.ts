export interface Piece {
  name: PieceName
  color: Color
  image: string
  x: number
  y: number

  setPosition(x: number, y: number): void
}

export type PieceName =
  | 'rook'
  | 'knight'
  | 'bishop'
  | 'queen'
  | 'king'
  | 'pawn'
  | 'empty'

export type Color = 'white' | 'black' | 'empty'
