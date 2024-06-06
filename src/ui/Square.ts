import { config } from '../config'
import { Piece } from '../types'

interface Props {
  piece: Piece
}

export function Square({ piece }: Props): string {
  const [x, y] = piece.position
  const isEven = (x + 1) % 2 === 0 ? 0 : 1

  return `<div style="background-image: url('${piece.image}');" class="${
    (y + 1) % 2 === isEven ? 'grey' : 'green'
  } square" data-color="${piece.color}" data-xy="${x}-${y}">${config.PROD ? '' : `<p style="color: black; margin: 0; margin-top: auto; font-size: 12px; font-weight: bold;">${x}-${y}</p>`}</div>`
}
