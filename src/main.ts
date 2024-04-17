import './style.css'
import { Color, Piece } from './types'

const PIECES = {
  rook: 'rook',
  horse: 'horse',
  bishop: 'bishop',
  queen: 'queen',
  king: 'king',
  pawn: 'pawn',
}

const TURN: Color = 'white'

function generateCommonRowAndPawns(color: Color) {
  const isWhite = color === 'white'
  const commonRowX = isWhite ? 0 : 7

  const commonRows: Piece[] = [
    { name: PIECES.rook, color, image: '', x: commonRowX, y: 0 },
    {
      name: PIECES.horse,
      color,
      image: '',
      x: commonRowX,
      y: 1,
    },
    {
      name: PIECES.bishop,
      color,
      image: '',
      x: commonRowX,
      y: 2,
    },
    {
      name: PIECES.queen,
      color,
      image: '',
      x: commonRowX,
      y: 3,
    },
    { name: PIECES.king, color, image: '', x: commonRowX, y: 4 },
    {
      name: PIECES.bishop,
      color,
      image: '',
      x: commonRowX,
      y: 5,
    },
    {
      name: PIECES.horse,
      color,
      image: '',
      x: commonRowX,
      y: 6,
    },
    { name: PIECES.rook, color, image: '', x: commonRowX, y: 7 },
  ]

  const pawns = Array(8)
    .fill('')
    .map((_, i) => ({
      name: PIECES.pawn,
      color,
      image: '',
      x: i,
      y: isWhite ? 1 : 6,
    }))

  return { commonRows, pawns }
}

const FILL_BOARD = Array(4).fill(
  Array(8).fill({
    name: '',
    color: '',
    image: '',
  })
)

const { commonRows: commonRowsBlack, pawns: pawnsBlack } =
  generateCommonRowAndPawns('black')
const { commonRows: commonRowsWhite, pawns: pawnsWhite } =
  generateCommonRowAndPawns('white')

const BOARD: Array<Piece[]> = [
  commonRowsBlack,
  pawnsBlack,
  ...FILL_BOARD,
  pawnsWhite,
  commonRowsWhite,
]

initGame()
initEvents()

function initGame() {
  console.log({ BOARD })

  const $board = document.getElementById('board')

  if (!$board) return

  const rows: string[] = []

  BOARD.forEach((row, index) => {
    const isEven = (index + 1) % 2 === 0 ? 0 : 1

    rows.push(
      row
        .map((piece, i) => {
          const isPiece = piece.name.length > 0 ? 'piece' : ''

          return `<div class="${
            (i + 1) % 2 === isEven ? 'grey' : 'green'
          } square ${isPiece}" data-color="${piece.color}">${piece.name}</div>`
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
  const $pieces = [...document.querySelectorAll('.piece')] as HTMLElement[]

  $pieces.map(($pieceElement) => {
    $pieceElement.addEventListener('click', () => {
      if ($pieceElement.dataset.color !== TURN) return

      console.log($pieceElement.textContent)
    })
  })
}
