import { PieceName } from '@lib/chess/types'

export const PIECES: Record<PieceName, PieceName> = {
  rook: 'rook',
  knight: 'knight',
  bishop: 'bishop',
  queen: 'queen',
  king: 'king',
  pawn: 'pawn',
  empty: 'empty',
}
