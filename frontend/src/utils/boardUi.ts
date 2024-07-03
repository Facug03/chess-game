import { PiecePosition } from '@lib/chess/types'

export function removeColorClass($element: HTMLElement | null) {
  $element?.classList?.remove(`selected-${$element.classList.contains('green') ? 'green' : 'grey'}`)
}

export function addColorClass($element: HTMLElement | null) {
  $element?.classList?.add(`selected-${$element.classList.contains('green') ? 'green' : 'grey'}`)
}

export function remodeAllGuideLines() {
  const $guideLines = document.querySelectorAll('.guideLine, .captureGuideLine')

  $guideLines.forEach(($guideLine) => {
    $guideLine.remove()
  })
}

export function highlightLastMovement(from: PiecePosition, move: PiecePosition) {
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

export function removePromotePawn() {
  const $promotes = document.querySelectorAll('.promote')

  $promotes.forEach(($promote) => {
    $promote.remove()
  })
}
