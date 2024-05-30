import { PIECES } from '../../consts/pieces'
import { Color, Piece, PieceName, PiecePosition } from '../../types'

export class Empty implements Piece {
  public name: PieceName = PIECES.empty

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

  movePieceTo(): boolean {
    return false
  }

  checkColision(): boolean {
    return false
  }

  squaresToMove() {
    return { squaresToMoveX: 0, squaresToMoveY: 0 }
  }
}
