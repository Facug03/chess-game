import { PIECES } from '../../consts/pieces'
import { Color, Piece, PieceName } from '../../types'

export class Bishop implements Piece {
  public name: PieceName = PIECES.bishop

  constructor(
    public color: Color,
    public x: number,
    public y: number,
    public image: string
  ) {
    this.color = color
    this.x = x
    this.y = y
    this.image = image
  }

  setPosition(x: number, y: number): void {
    this.x = x
    this.y = y
  }
}
