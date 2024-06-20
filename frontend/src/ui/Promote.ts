import { PIECES } from '@src/consts/pieces'
import { Color, PieceName } from '@lib/chess/types'

interface Props {
  color: Color
}

export function Promote({ color }: Props): string {
  const isWhite = color === 'white'
  const boxShadow = isWhite ? 'rgba(0, 0, 0, 0.35) 0px 5px 8px' : 'rgba(0, 0, 0, 0.35) 0px -5px 8px'
  const borderRadiusTop = isWhite ? '10px 10px 0 0' : '0 0 10px 10px'
  const borderRadiusBottom = isWhite ? '0 0 10px 10px' : '10px 10px 0 0'
  const bgImage = (piece: PieceName) => `/assets/pieces/${color}/${piece}.png`

  return `
  <div
    class="promote queen" 
    data-piece="${PIECES.queen}"
    style="background-image: url(${bgImage('queen')}); background-color: #f9f9f9; top: ${isWhite ? '0' : '0'}; box-shadow: ${boxShadow}; border-radius: ${borderRadiusTop};"
  >
  </div>
  <div 
    class="promote knight" 
    data-piece="${PIECES.knight}" 
    style="background-image: url(${bgImage('knight')}); background-color: #f9f9f9; top: ${isWhite ? '100%' : '-100%'}; box-shadow: ${boxShadow};"
  >
  </div>
  <div 
    class="promote rook" 
    data-piece="${PIECES.rook}" 
    style="background-image: url(${bgImage('rook')}); background-color: #f9f9f9; top: ${isWhite ? '200%' : '-200%'}; box-shadow: ${boxShadow};"
  >
  </div>
  <div 
    class="promote bishop" 
    data-piece="${PIECES.bishop}" 
    style="background-image: url(${bgImage('bishop')}); background-color: #f9f9f9; top: ${isWhite ? '300%' : '-300%'}; box-shadow: ${boxShadow}; border-radius: ${borderRadiusBottom};"
  >
  </div>
  `
}
