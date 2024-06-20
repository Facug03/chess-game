import { test, expect } from '@playwright/test'
import { HomePage } from '@lib/pages/home.page'

test('should be able to select and move piece - chess', async ({ page }) => {
  const homePage = new HomePage(page)

  await homePage.goto()
  await homePage.local.check()
  await homePage.getPiece(53).click()
  const piece = homePage.getPiece(45)
  await piece.click()

  await expect(piece).toHaveClass(/selected-green/)
})

test('should detect checkmate 1 - chess', async ({ page }) => {
  const homePage = new HomePage(page)

  await homePage.goto()
  await homePage.local.check()
  await homePage.getPiece(54).click()
  await homePage.getPiece(46).click()
  await homePage.getPiece(13).click()
  await homePage.getPiece(29).click()
  await homePage.getPiece(55).click()
  await homePage.getPiece(39).click()
  await homePage.getPiece(4).click()
  await homePage.getPiece(40).click()

  await expect(page.getByText(/Black wins/)).toBeVisible()

  await page.getByRole('button', { name: 'Play again' }).click()

  await expect(homePage.getPiece(54)).toHaveAttribute('data-color', 'white')
})

test('should detect checkmate 2 - chess', async ({ page }) => {
  const homePage = new HomePage(page)

  await homePage.goto()
  await homePage.local.check()
  await homePage.getPiece(53).click()
  await homePage.getPiece(37).click()
  await homePage.getPiece(13).click()
  await homePage.getPiece(29).click()
  await homePage.getPiece(62).click()
  await homePage.getPiece(35).click()
  await homePage.getPiece(2).click()
  await homePage.getPiece(19).click()
  await homePage.getPiece(60).click()
  await homePage.getPiece(32).click()
  await homePage.getPiece(7).click()
  await homePage.getPiece(22).click()
  await homePage.getPiece(32).click()
  await homePage.getPiece(14).click()

  await expect(page.getByText(/White wins/)).toBeVisible()
})

test('should not let piece pass through - chess', async ({ page }) => {
  const homePage = new HomePage(page)

  await homePage.goto()
  await homePage.local.check()
  await homePage.getPiece(57).click()
  const piece = homePage.getPiece(41)
  await piece.click()

  await expect(piece).not.toHaveClass(/selected-green/)
  await expect(piece).toHaveAttribute('data-color', 'empty')
})

test('reset - option', async ({ page }) => {
  const homePage = new HomePage(page)

  await homePage.goto()
  await homePage.local.check()
  await homePage.getPiece(53).click()
  await homePage.getPiece(37).click()
  await homePage.getPiece(2).click()
  await homePage.getPiece(17).click()
  await homePage.getPiece(63).click()
  await homePage.getPiece(46).click()

  await page.locator('#chess-reset').click()

  await expect(homePage.getPiece(53)).toHaveAttribute('data-color', 'white')
  await expect(homePage.getPiece(37)).toHaveAttribute('data-color', 'empty')
  await expect(homePage.getPiece(2)).toHaveAttribute('data-color', 'black')
  await expect(homePage.getPiece(17)).toHaveAttribute('data-color', 'empty')
  await expect(homePage.getPiece(63)).toHaveAttribute('data-color', 'white')
  await expect(homePage.getPiece(46)).toHaveAttribute('data-color', 'empty')
})

test('reverse - option', async ({ page }) => {
  const homePage = new HomePage(page)

  await homePage.goto()
  await homePage.reverse.click()
  const piece = homePage.getPiece(53)

  await expect(piece).toHaveAttribute('data-color', 'black')

  await homePage.reverse.click()

  await expect(piece).toHaveAttribute('data-color', 'white')
})

test('undo and redo - option', async ({ page }) => {
  const homePage = new HomePage(page)

  await homePage.goto()
  await homePage.local.check()

  await homePage.getPiece(53).click()
  await homePage.getPiece(37).click()
  await homePage.getPiece(12).click()
  await homePage.getPiece(28).click()
  await homePage.getPiece(37).click()
  await homePage.getPiece(28).click()

  await homePage.undo.click()
  await homePage.undo.click()
  await homePage.undo.click()

  await expect(homePage.getPiece(53)).toHaveAttribute('data-color', 'white')
  await expect(homePage.getPiece(12)).toHaveAttribute('data-color', 'black')

  await homePage.redo.click()
  await homePage.redo.click()
  await homePage.redo.click()

  await expect(homePage.getPiece(28)).toHaveAttribute('data-color', 'white')
  await expect(homePage.getPiece(37)).toHaveAttribute('data-color', 'empty')
})
