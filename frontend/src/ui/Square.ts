import { Piece } from '@lib/chess/types'
import { config } from '@src/config'

interface Props {
  piece: Piece
  isCheck?: boolean
}

export function Square({ piece, isCheck = false }: Props): string {
  const [x, y] = piece.position
  const isEven = (x + 1) % 2 === 0 ? 0 : 1

  return `<div draggable="true" 
  style="background-image: url('${piece.image}') ${isCheck ? ', radial-gradient(ellipse at center, rgb(200, 91, 91) 0%, rgb(200, 91, 91) 25%, rgba(153, 38, 38, 0) 89%, rgba(132, 33, 33, 0) 100%)' : ''};'; ${config.PROD ? '' : 'position: relative;'}" class="${
    (y + 1) % 2 === isEven ? 'grey' : 'green'
  } square" data-color="${piece.color}" data-xy="${x}-${y}">${Debug({ piece })}</div>`
}

function Debug({ piece }: Props): string {
  const [x, y] = piece.position

  return `${config.PROD ? '' : `<p style="position: absolute; color: black; margin: 0; top: 0; left: 0; font-size: 12px; font-weight: bold;">${x}-${y} ${piece.moveCount}</p>`}`
}
