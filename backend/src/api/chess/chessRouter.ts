import express, { Request, Response, Router } from 'express'

import { PostChessSchema, PostChess } from '@/api/chess/chessModel'
import { chessService } from '@/api/chess/chessService'
import { handleServiceResponse, validateRequest } from '@/common/utils/httpHandlers'

export const chessRouter: Router = (() => {
  const router = express.Router()

  router.post('/ai-move', validateRequest(PostChessSchema), (req: Request, res: Response) => {
    const { depth, fen } = req.body as PostChess

    const serviceResponse = chessService.getMove(fen, depth)
    handleServiceResponse(serviceResponse, res)
  })

  return router
})()
