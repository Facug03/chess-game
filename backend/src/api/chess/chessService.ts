import { StatusCodes } from 'http-status-codes'
import jsChessEngine, { Depth } from 'js-chess-engine'

import { Chess } from '@/api/chess/chessModel'
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse'
import { logger } from '@/server'

export const chessService = {
  getMove: (fen: string, depth: Depth): ServiceResponse<Chess | null> => {
    try {
      const { move, aiMove } = jsChessEngine
      const moveMade = aiMove(fen, depth)
      const [from, to] = Object.entries(moveMade)[0]
      const newFen = move(fen, from, to)

      return new ServiceResponse<Chess>(
        ResponseStatus.Success,
        'Move calculated',
        {
          depth,
          fen: newFen,
          move: { from, to }
        },
        StatusCodes.OK
      )
    } catch (ex) {
      const errorMessage = `Error while calculating move: $${(ex as Error).message}`
      logger.error(errorMessage)
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR)
    }
  }
}
