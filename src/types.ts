export interface Piece {
  name: PieceName
  position: PiecePosition
  color: Color
  image: string
  moveCount: number

  canMovePieceTo(moveTo: PiecePosition, board: ChessBoard, lastMovedPiece: Piece | null): boolean
  checkColision(moveTo: PiecePosition, board: ChessBoard, lastMovedPiece: Piece | null): boolean
  setPosition(position: PiecePosition): void
  squaresToMove(moveTo: PiecePosition): {
    squaresToMoveX: number
    squaresToMoveY: number
  }
}

export type PiecePosition = [number, number]

export type PieceName = 'rook' | 'knight' | 'bishop' | 'queen' | 'king' | 'pawn' | 'empty'

export type Color = 'white' | 'black' | 'empty'

export type ChessBoard = Piece[][]

export type Movements = { from: Piece; to: Piece }[][]

export type FinishGame = 'checkmate' | 'stalemate'
