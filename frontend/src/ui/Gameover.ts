import { Color } from '../chess/types'

interface CheckmateProps {
  type: 'checkmate'
  win: Color
}

interface StalemateProps {
  type: 'stalemate'
}

type Props = CheckmateProps | StalemateProps

export function Gameover(props: Props): string {
  if (props.type === 'stalemate') {
    return `
    <div class="gameover">
        <h2>Stalemate</h2>

        <button class="play-again" id="chess-restart">
            Play again
        </button>
    </div>
    `
  }

  return `
    <div class="gameover">
        <h2>${props.win === 'white' ? 'White' : 'Black'} wins</h2>

        <button class="play-again" id="chess-restart">
            Play again
        </button>
    </div>
  `
}
