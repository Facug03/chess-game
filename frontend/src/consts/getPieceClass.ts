import { Queen } from '../chess/pieces/Queen'
import { Knight } from '../chess/pieces/Knight'
import { Rook } from '../chess/pieces/Rook'
import { Bishop } from '../chess/pieces/Bishop'
import { Empty } from '../chess/pieces/Empty'
import { Pawn } from '../chess/pieces/Pawn'
import { King } from '../chess/pieces/King'

export const getPieceClass = {
  queen: Queen,
  knight: Knight,
  rook: Rook,
  bishop: Bishop,
  empty: Empty,
  pawn: Pawn,
  king: King,
}
