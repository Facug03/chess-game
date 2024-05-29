import { PIECES } from '../../consts/pieces'
import { Color, Piece, PieceName, PiecePosition } from '../../types'

export class Pawn implements Piece {
  public name: PieceName = PIECES.pawn

  constructor(
    public color: Color,
    public position: PiecePosition,
    public image: string
  ) {
    this.color = color
    this.position = position
    this.image = image
  }

  setPosition(position: PiecePosition): void {
    this.position = position
  }
}
