import './style.css'
import { Piece } from './types'

const FILL_BOARD: Array<Piece[]> = Array(4)
  .fill('')
  .map((_, y) => {
    return Array(8)
      .fill('')
      .map((_, x) => {
        return {
          name: '',
          color: 'none',
          image: '',
          x: x,
          y: Math.abs(y - 5),
        }
      })
  })

const { commonRows: commonRowsBlack, pawns: pawnsBlack } =
  generateCommonRowAndPawns('black')
const { commonRows: commonRowsWhite, pawns: pawnsWhite } =
  generateCommonRowAndPawns('white')

let BOARD: Array<Piece[]> = [
  commonRowsBlack,
  pawnsBlack,
  ...FILL_BOARD,
  pawnsWhite,
  commonRowsWhite,
]

initGame(BOARD)
initEvents()

function initGame(board: Array<Piece[]>) {
  console.log({ board })

  const $board = document.getElementById('board')

  if (!$board) return

  const rows: string[] = []

  board.forEach((row, index) => {
    const isEven = (index + 1) % 2 === 0 ? 0 : 1

    rows.push(
      row
        .map((piece, i) => {
          return `<div class="${
            (i + 1) % 2 === isEven ? 'grey' : 'green'
          } square" data-color="${piece.color}" data-xy="${piece.x}-${
            piece.y
          }">${piece.name}</div>`
        })
        .join('')
    )
  })

  $board.innerHTML = rows
    .map((row) => {
      return `<div class="row">${row}</div>`
    })
    .join('')
}

function initEvents() {
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

      if ($pieceElement.dataset.color !== TURN || !$pieceElement.dataset.xy)
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

      let getPiece: Piece | undefined

      BOARD.forEach((row) => {
        const findPiece = row.find((piece) => {
          return (
            piece.name === $pieceElement.textContent &&
            piece.x === Number(x) &&
            piece.y === Number(y)
          )
        })

        if (findPiece) {
          getPiece = findPiece
        }
      })

      if (!getPiece) return

      console.log(getPiece)
    })
  })
}

function canPieceMove({
  piece,
  currentPosition,
  movePosition,
}: {
  piece: string
  currentPosition: { x: number; y: number }
  movePosition: { x: number; y: number }
}) {
  if (piece === 'pawn') {
    if (
      currentPosition.y + 2 > movePosition.y ||
      currentPosition.y <= movePosition.y
    )
      return

    console.log('permitido')
  }
}
