import { Difficulty } from '../types'
import { config } from '../config'
import { PiecePosition } from '../chess/types'
import { POSITIONS_MAP_X_REVERSE, POSITIONS_MAP_Y_REVERSE } from '../consts/positionsMap'

export async function getAiMove(
  fen: string,
  depth: Difficulty
): Promise<
  [
    Error | null,
    {
      from: PiecePosition
      to: PiecePosition
    },
  ]
> {
  try {
    const response = await fetch(`${config.BACK_URL}/chess/ai-move`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fen, depth }),
    })
    const { responseObject } = (await response.json()) as {
      responseObject: {
        fen: string
        move: {
          from: string
          to: string
        }
        depth: number
      }
    }

    const from = [
      POSITIONS_MAP_X_REVERSE[responseObject.move.from[1]],
      POSITIONS_MAP_Y_REVERSE[responseObject.move.from[0].toLowerCase()],
    ] as PiecePosition
    const to = [
      POSITIONS_MAP_X_REVERSE[responseObject.move.to[1]],
      POSITIONS_MAP_Y_REVERSE[responseObject.move.to[0].toLowerCase()],
    ] as PiecePosition

    return [null, { from, to }]
  } catch (error) {
    if (error instanceof Error) {
      return [error, { from: [0, 0], to: [0, 0] }]
    }

    return [new Error('Unknown error'), { from: [0, 0], to: [0, 0] }]
  }
}
