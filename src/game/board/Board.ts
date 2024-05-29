import { PIECES } from '../../consts/pieces'
import { Color, Piece } from '../../types'

export class Board {
  private squares: (Piece | null)[][]

  constructor() {
    this.squares = Array(4)
      .fill('')
      .map((_, y) => {
        return Array(8)
          .fill('')
          .map((_, x) => {
            return {
              name: '',
              color: '',
              image: '',
              x: x,
              y: Math.abs(y - 5),
            }
          })
      })
  }

  private generateCommonRowAndPawns(color: Color) {
    const isWhite = color === 'white'
    const commonRowX = isWhite ? 0 : 7

    const commonRows: Piece[] = [
      { name: PIECES.rook, color, image: '', x: 0, y: commonRowX },
      {
        name: PIECES.knight,
        color,
        image: '',
        x: 1,
        y: commonRowX,
      },
      {
        name: PIECES.bishop,
        color,
        image: '',
        x: 2,
        y: commonRowX,
      },
      {
        name: PIECES.queen,
        color,
        image: '',
        x: 3,
        y: commonRowX,
      },
      { name: PIECES.king, color, image: '', x: 4, y: commonRowX },
      {
        name: PIECES.bishop,
        color,
        image: '',
        x: 5,
        y: commonRowX,
      },
      {
        name: PIECES.knight,
        color,
        image: '',
        x: 6,
        y: commonRowX,
      },
      { name: PIECES.rook, color, image: '', x: 7, y: commonRowX },
    ]

    const pawns = Array(8)
      .fill('')
      .map((_, i) => ({
        name: PIECES.pawn,
        color,
        image: '',
        x: i,
        y: isWhite ? 1 : 6,
      }))

    return { commonRows, pawns }
  }
}
