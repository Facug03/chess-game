export class Player {
  private color: string

  constructor(color: string) {
    this.color = color
  }

  getColor(): string {
    return this.color
  }
}
