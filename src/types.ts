export interface Piece {
  name: string
  color: Color
  image: string
  x: number
  y: number
}

export type Color = 'white' | 'black' | 'none'
