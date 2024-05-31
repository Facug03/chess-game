export interface Piece {
  name: PieceName
  position: PiecePosition
  color: Color
  image: string
  moveCount: number

  canMovePieceTo(moveTo: PiecePosition, board: ChessBoard): boolean
  checkColision(moveTo: PiecePosition, board: ChessBoard): boolean
  setPosition(position: PiecePosition): void
  squaresToMove(moveTo: PiecePosition): {
    squaresToMoveX: number
    squaresToMoveY: number
  }
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

export type ChessBoard = Piece[][]
