import { Chess } from './chess/Chess'
import { Color, FinishGame, PiecePosition, PieceName } from './chess/interface'
import { Square } from './ui/Square'
import { Gameover } from './ui/Gameover'
import { Promote } from './ui/Promote'
import './style.css'

const chess = new Chess()

let $pieceSelected: HTMLElement | null = null
const $turn = document.getElementById('turn') as HTMLHeadingElement

initGame()

function initGame() {
  printBoard()
  options()
}

function printBoard() {
  const $board = document.getElementById('board') as HTMLDivElement
  $turn.innerText = `TURN: ${chess.currentPlayer.toUpperCase()}`
  const rows: string[] = []

  chess.board.forEach((row) => {
    rows.push(
      row
        .map((piece) => {
          return Square({ piece })
        })
        .join('')
    )
  })

  if (chess.reverse) rows.reverse()

  $board.innerHTML = rows
    .map((row) => {
      return row
    })
    .join('')

  gameLoop()
}

function gameLoop() {
  const $pieces = [...document.querySelectorAll('.square')] as HTMLElement[]

  $pieces.forEach(($pieceElement) => {
    $pieceElement.addEventListener('click', () => {
      if (chess.state !== 'playing') return

      removePromotePawn()

      if ($pieceElement.dataset.color !== chess.currentPlayer && $pieceSelected !== $pieceElement && $pieceSelected) {
        if (!$pieceElement.dataset.xy || !$pieceSelected.dataset.xy) return

        const [fromX, fromY] = $pieceSelected.dataset.xy.split('-').map((data) => Number(data))
        const [toX, toY] = $pieceElement.dataset.xy.split('-').map((data) => Number(data))

        const moveMade = chess.makeMove([fromX, fromY], [toX, toY])

        if (!moveMade.moved) {
          removeColorClass($pieceSelected)
          $pieceSelected = null
          remodeAllGuideLines()
          return
        }

        printBoard()
        highlightLastMovement([fromX, fromY], [toX, toY])

        if (moveMade.result) {
          gameOver(moveMade.result, chess.currentPlayer === 'white' ? 'black' : 'white')
          return
        }

        const callBackMove = moveMade?.callBack

        if (callBackMove) {
          const $toElement = document.querySelector(`[data-xy="${toX}-${toY}"]`)
          if (!$toElement) return
          $toElement.innerHTML = Promote({ color: chess.currentPlayer })
          const $promoteElement = [...document.querySelectorAll('.promote')] as HTMLDivElement[]
          if (!$promoteElement) return
          for (const $element of $promoteElement) {
            $element.addEventListener('click', (e) => {
              e.stopPropagation()
              const pieceName = $element.dataset.piece as PieceName

              if (!pieceName) return

              callBackMove(pieceName)
              removePromotePawn()
            })
          }
        }

        return
      }

      if ($pieceElement.dataset.color !== chess.currentPlayer || !$pieceElement.dataset.xy) return

      if ($pieceSelected) {
        removeColorClass($pieceSelected)
        remodeAllGuideLines()

        if ($pieceElement === $pieceSelected) {
          $pieceSelected = null

          return
        }
      }

      $pieceSelected = $pieceElement
      addColorClass($pieceSelected)
      const position = $pieceElement.dataset.xy.split('-').map((data) => Number(data)) as PiecePosition
      const validMoves = chess.getAllPossibleMoves(position)

      for (const move of validMoves) {
        const [x, y] = move

        const $element = document.querySelector(`.square[data-xy="${x}-${y}"]`) as HTMLElement

        if (!$element) continue

        if ($element.dataset.color !== 'empty') {
          $element.innerHTML = `<div class="captureGuideLine"></div>`
          continue
        }

        $element.innerHTML = `<div class="guideLine"></div>`
      }
    })
  })
}

function resetAndPrintBoard() {
  chess.reset()
  document.querySelector('.gameover')?.remove()
  printBoard()
}

function options() {
  const $reverse = document.getElementById('chess-reverse')
  const $reset = document.getElementById('chess-reset')
  const $undo = document.getElementById('chess-undo')
  const $redo = document.getElementById('chess-redo')

  if (!$reverse || !$reset || !$undo || !$redo) return

  $reverse.addEventListener('click', () => {
    chess.toggleReverse()
    printBoard()
  })

  $reset.addEventListener('click', () => {
    resetAndPrintBoard()
  })

  $undo.addEventListener('click', () => {
    chess.undo()
    printBoard()
  })

  $redo.addEventListener('click', () => {
    chess.redo()
    printBoard()
  })
}

function removePromotePawn() {
  const $promotes = document.querySelectorAll('.promote')

  $promotes.forEach(($promote) => {
    $promote.remove()
  })
}

function removeColorClass($element: HTMLElement | null) {
  $element?.classList?.remove(`selected-${$element.classList.contains('green') ? 'green' : 'grey'}`)
}

function addColorClass($element: HTMLElement | null) {
  $element?.classList?.add(`selected-${$element.classList.contains('green') ? 'green' : 'grey'}`)
}

function remodeAllGuideLines() {
  const $guideLines = document.querySelectorAll('.guideLine, .captureGuideLine')

  $guideLines.forEach(($guideLine) => {
    $guideLine.remove()
  })
}

function highlightLastMovement(from: PiecePosition, move: PiecePosition) {
  const [fromX, fromY] = from
  const [toX, toY] = move
  const $toElement = document.querySelector(`[data-xy="${toX}-${toY}"]`) as HTMLElement
  const $fromElement = document.querySelector(`[data-xy="${fromX}-${fromY}"]`) as HTMLElement
  const $elements = [...document.querySelectorAll('.selected-green, .selected-grey')] as HTMLElement[]

  $elements.forEach(($element) => {
    removeColorClass($element)
  })

  addColorClass($toElement)
  addColorClass($fromElement)
}

function gameOver(type: FinishGame, win: Color) {
  const $app = document.getElementById('app')

  if (!$app) return

  $app.insertAdjacentHTML('beforeend', Gameover({ type, win }))

  const $restart = document.getElementById('chess-restart')

  if (!$restart) return

  $restart.addEventListener('click', () => {
    resetAndPrintBoard()
  })
}
