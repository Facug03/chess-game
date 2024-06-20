import { Page } from '@playwright/test'

export class HomePage {
  constructor(private readonly page: Page) {}

  readonly local = this.page.getByLabel('Local')
  readonly reset = this.page.locator('#chess-reset')
  readonly reverse = this.page.locator('#chess-reverse')
  readonly undo = this.page.locator('#chess-undo')
  readonly redo = this.page.locator('#chess-redo')

  public async goto() {
    await this.page.goto('http://127.0.0.1:5173/')
  }

  public getPiece(position: number) {
    return this.page.locator(`#board > div:nth-child(${position})`)
  }
}

export default HomePage
