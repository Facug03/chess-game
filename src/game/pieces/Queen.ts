import { PIECES } from '../../consts/pieces'
import { ChessBoard, Color, Piece, PieceName, PiecePosition } from '../../types'

export class Queen implements Piece {
  public name: PieceName = PIECES.queen

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

  movePieceTo(moveTo: PiecePosition, board: ChessBoard): boolean {
    return false
  }
}
