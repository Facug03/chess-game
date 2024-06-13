import { z } from 'zod'

const fenRegex =
  /^([rnbqkpRNBQKP1-8]{1,8}\/){7}[rnbqkpRNBQKP1-8]{1,8} [wb] (KQ?k?q?|Qk?q?|kq?|q|-|-) ([a-h][36]|-) \d+ \d+$/

export type Chess = z.infer<typeof ChessSchema>
export type PostChess = z.infer<typeof PostChessSchema>

const fen = z.string().regex(fenRegex, 'FEN is not valid')
const depth = z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3), z.literal(4)], {
  message: 'Depth should be 0, 1, 2, 3 or 4',
})

export const ChessSchema = z.object({
  fen,
  depth,
  move: z.object({
    from: z.string(),
    to: z.string(),
  }),
})

export const PostChessSchema = z.object({
  fen,
  depth,
})
