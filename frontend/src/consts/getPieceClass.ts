import { Queen } from '../game/pieces/Queen'
import { Knight } from '../game/pieces/Knight'
import { Rook } from '../game/pieces/Rook'
import { Bishop } from '../game/pieces/Bishop'
import { Empty } from '../game/pieces/Empty'
import { Pawn } from '../game/pieces/Pawn'
import { King } from '../game/pieces/King'

export const getPieceClass = {
  queen: Queen,
  knight: Knight,
  rook: Rook,
  bishop: Bishop,
  empty: Empty,
  pawn: Pawn,
  king: King,
}
