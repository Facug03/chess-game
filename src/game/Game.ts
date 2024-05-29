import { Color, Piece } from '../types'
import { Board } from './board/Board'
import { Player } from './player/Player'

export class Game {
  private players: [Player, Player]
  private currentPlayer: Color

  constructor(private readonly chessBoard: Board) {
    this.players = [new Player('white'), new Player('black')]
    this.currentPlayer = 'white'
  }

  startGame() {
    this.chessBoard.setupBoard()
    this.gameLoop()
  }

  private gameLoop() {
    const $pieces = [...document.querySelectorAll('.square')] as HTMLElement[]
    let $pieceSelected: HTMLElement | null

    $pieces.map(($pieceElement) => {
      $pieceElement.addEventListener('click', () => {
        if (
          ($pieceSelected?.textContent?.length ?? 0) > 0 &&
          $pieceElement.textContent === '' &&
          $pieceSelected !== $pieceElement &&
          $pieceSelected
        ) {
          if (!$pieceElement.dataset.xy) return

          const [x, y] = $pieceElement.dataset.xy
            .split('-')
            .map((data) => Number(data))

          // const [xSelected, ySelected] = $pieceSelected.dataset.xy
          //   .split('-')
          //   .map((data) => Number(data))

          // canPieceMove({
          //   piece: $pieceSelected?.textContent ?? '',
          //   currentPosition: { xSelected, ySelected },
          //   movePosition: { x, y },
          // })

          return
        }

        if (
          $pieceElement.dataset.color !== this.currentPlayer ||
          !$pieceElement.dataset.xy
        )
          return

        if ($pieceSelected) {
          $pieceSelected.classList.remove(
            `selected-${
              $pieceSelected.classList.contains('green') ? 'green' : 'grey'
            }`
          )

          if ($pieceElement === $pieceSelected) {
            $pieceSelected = null

            return
          }
        }

        $pieceSelected = $pieceElement

        $pieceElement.classList.add(
          `selected-${
            $pieceElement.classList.contains('green') ? 'green' : 'grey'
          }`
        )

        const [x, y] = $pieceElement.dataset.xy.split('-')

        const getPiece: Piece = this.chessBoard.board[Number(x)][Number(y)]

        console.log(getPiece)
      })
    })
  }
}
