declare module 'js-chess-engine' {
  type BoardConfiguration = string
  type Depth = 0 | 1 | 2 | 3 | 4

  export function move(boardConfiguration: BoardConfiguration, from: string, to: string): string

  export function aiMove(boardConfiguration: BoardConfiguration, depth: Depth): Record<string, string>
}
