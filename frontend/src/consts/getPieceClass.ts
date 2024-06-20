import { Queen } from '@lib/chess/pieces/Queen'
import { Knight } from '@lib/chess/pieces/Knight'
import { Rook } from '@lib/chess/pieces/Rook'
import { Bishop } from '@lib/chess/pieces/Bishop'
import { Empty } from '@lib/chess/pieces/Empty'
import { Pawn } from '@lib/chess/pieces/Pawn'
import { King } from '@lib/chess/pieces/King'

export const getPieceClass = {
  queen: Queen,
  knight: Knight,
  rook: Rook,
  bishop: Bishop,
  empty: Empty,
  pawn: Pawn,
  king: King,
}
