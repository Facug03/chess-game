import { Chess } from '@lib/chess/Chess'
import { Color, FinishGame, PiecePosition, PieceName } from '@lib/chess/types'
import { Square } from '@src/ui/Square'
import { Gameover } from '@src/ui/Gameover'
import { Promote } from '@src/ui/Promote'
import { Difficulty, Mode } from '@src/types'
import { getAiMove } from '@src/services/getAiMove'
import './style.css'

const chess = new Chess()

let $pieceSelected: HTMLElement | null = null
const $turn = document.getElementById('turn') as HTMLHeadingElement
const $reverse = document.getElementById('chess-reverse') as HTMLButtonElement
const $reset = document.getElementById('chess-reset') as HTMLButtonElement
const $undo = document.getElementById('chess-undo') as HTMLButtonElement
const $redo = document.getElementById('chess-redo') as HTMLButtonElement
const $loader = document.querySelector('.loader') as HTMLDivElement
let mode: Mode = 'bot'
let color: Color = 'white'
let difficulty: Difficulty = 2
let loading = false

initGame()

function initGame() {
  playMode()
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

async function gameLoop() {
  $pieceSelected = null

  if (mode === 'bot' && color !== chess.currentPlayer && chess.state === 'playing' && !loading) {
    if (chess.movements.length !== chess.actualMovement) return

    loading = true
    disableButtons(true)
    const [error, res] = await getAiMove(chess.getFen(), difficulty)

    if (error) {
      console.error(error)
      loading = false
      disableButtons(false)
      return
    }

    const { from, to } = res
    const $fromElement = document.querySelector(`[data-xy="${from[0]}-${from[1]}"]`) as HTMLElement
    const $toElement = document.querySelector(`[data-xy="${to[0]}-${to[1]}"]`) as HTMLElement

    if (!$fromElement || !$toElement) {
      loading = false
      disableButtons(false)
      return
    }

    movePiece($fromElement, $toElement)
    loading = false
    disableButtons(false)

    return
  }

  const $pieces = [...document.querySelectorAll('.square')] as HTMLElement[]

  $pieces.forEach(($pieceElement) => {
    if (chess.state !== 'playing') return

    removePromotePawn()

    $pieceElement.addEventListener('click', () => {
      if ($pieceElement.dataset.color !== chess.currentPlayer && $pieceSelected !== $pieceElement && $pieceSelected) {
        movePiece($pieceSelected, $pieceElement)

        return
      }

      selectPiece($pieceElement, 'click')
    })

    $pieceElement.addEventListener('dragstart', () => {
      selectPiece($pieceElement, 'dragstart')
    })

    $pieceElement.addEventListener('dragover', (e) => {
      e.preventDefault()
    })

    $pieceElement.addEventListener('drop', (e) => {
      e.preventDefault()

      if ($pieceElement.dataset.color !== chess.currentPlayer && $pieceSelected !== $pieceElement && $pieceSelected) {
        movePiece($pieceSelected, $pieceElement)
      }
    })
  })
}

function movePiece($from: HTMLElement, $to: HTMLElement) {
  if (!$from.dataset.xy || !$to.dataset.xy) return

  const [fromX, fromY] = $from.dataset.xy.split('-').map((data) => Number(data))
  const [toX, toY] = $to.dataset.xy.split('-').map((data) => Number(data))

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
    if (mode === 'bot' && color !== chess.currentPlayer) {
      callBackMove('queen')
      removePromotePawn()
      printBoard()
      return
    }

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

        const result = callBackMove(pieceName)
        removePromotePawn()
        printBoard()

        if (result) {
          gameOver(result, chess.currentPlayer === 'white' ? 'black' : 'white')
        }
      })
    }
  }
}

function selectPiece($pieceElement: HTMLElement, type: 'click' | 'dragstart') {
  if ($pieceElement.dataset.color !== chess.currentPlayer || !$pieceElement.dataset.xy) return

  if ($pieceSelected) {
    removeColorClass($pieceSelected)
    remodeAllGuideLines()

    if ($pieceElement === $pieceSelected && type === 'click') {
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
      $element.innerHTML = '<div class="captureGuideLine"></div>'
      continue
    }

    $element.innerHTML = '<div class="guideLine"></div>'
  }
}

function resetAndPrintBoard() {
  chess.reset()
  document.querySelector('.gameover')?.remove()
  printBoard()
}

function options() {
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
  const $app = document.getElementById('chess-app')

  if (!$app) return

  $app.insertAdjacentHTML('beforeend', Gameover({ type, win }))

  const $restart = document.getElementById('chess-restart')

  if (!$restart) return

  $restart.addEventListener('click', () => {
    resetAndPrintBoard()
  })
}

function playMode() {
  const $modes = document.querySelectorAll('input[name="mode"]') as NodeListOf<HTMLInputElement>
  const $color = document.querySelectorAll('input[name="color"]') as NodeListOf<HTMLInputElement>
  const $difficulty = document.querySelectorAll('input[name="difficulty"]') as NodeListOf<HTMLInputElement>

  $modes.forEach(($mode) => {
    if ($mode.checked) {
      mode = ($mode.value as Mode) ?? 'bot'
    }

    $mode.addEventListener('click', (e) => {
      const target = e.target as HTMLInputElement
      mode = (target.value as Mode) ?? 'bot'

      printBoard()
    })
  })

  $color.forEach(($color) => {
    if ($color.checked) {
      color = ($color.value as Color) ?? 'white'
    }

    $color.addEventListener('click', (e) => {
      const target = e.target as HTMLInputElement
      color = (target.value as Color) ?? 'white'

      printBoard()
    })
  })

  $difficulty.forEach(($difficulty) => {
    if ($difficulty.checked) {
      difficulty = (Number($difficulty.value) as Difficulty) ?? 2
    }

    $difficulty.addEventListener('click', (e) => {
      const target = e.target as HTMLInputElement
      difficulty = (Number(target.value) as Difficulty) ?? 2

      printBoard()
    })
  })
}

function disableButtons(disabled: boolean) {
  if (disabled) {
    $undo.setAttribute('disabled', 'disabled')
    $redo.setAttribute('disabled', 'disabled')
    $reverse.setAttribute('disabled', 'disabled')
    $reset.setAttribute('disabled', 'disabled')
    $loader.classList.remove('hide')
  } else {
    $undo.removeAttribute('disabled')
    $redo.removeAttribute('disabled')
    $reverse.removeAttribute('disabled')
    $reset.removeAttribute('disabled')
    $loader.classList.add('hide')
  }
}
