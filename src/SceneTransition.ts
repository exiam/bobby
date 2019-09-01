import { Game } from './Game'
import { Scene } from './Scene'

abstract class Transition {
  private readonly game: Game

  protected constructor(game: Game) {
    this.game = game
  }

  public getGame(): Game {
    return this.game
  }

  public abstract update(dt: number): void

  public abstract render(ctx: CanvasRenderingContext2D): void

  public abstract isFinished(): boolean
}

class OutTransition extends Transition {
  private readonly duration: number
  private readonly nextScene: Scene
  private counter: number

  public constructor(game: Game, nextScene: Scene) {
    super(game)

    this.nextScene = nextScene

    this.duration = 1
    this.counter = 0
  }

  public update(dt: number): void {
    this.counter += dt

    if (this.counter >= this.duration) {
      this.counter = this.duration

      this.getGame().changeScene(this.nextScene)
    }
  }

  public render(ctx: CanvasRenderingContext2D): void {
    const [ width, height ] = this.getGame().getScreenSize()

    ctx.fillStyle = 'black'
    ctx.globalAlpha = this.counter
    ctx.fillRect(0, 0, width, height)
    ctx.globalAlpha = 1
  }

  public isFinished(): boolean {
    return this.counter >= this.duration
  }
}

class InTransition extends Transition {
  private counter: number

  public constructor(game: Game) {
    super(game)

    this.counter = 1
  }

  public update(dt: number): void {
    this.counter -= dt

    if (this.counter <= 0) {
      this.counter = 0
    }
  }

  public render(ctx: CanvasRenderingContext2D): void {
    const [ width, height ] = this.getGame().getScreenSize()

    ctx.fillStyle = 'black'
    ctx.globalAlpha = this.counter
    ctx.fillRect(0, 0, width, height)
    ctx.globalAlpha = 1
  }

  public isFinished(): boolean {
    return this.counter <= 0
  }
}

// Éviter d'avoir une dépendance à Game. Préférer utiliser un callback pour le
// changement de scène et passer en paramètre de changeScene la taille de
// l'écran.
export class SceneTransition {
  private readonly game: Game
  private readonly transitions: Array<Transition>
  private currentTransition: Transition | null

  public constructor(game: Game) {
    this.game = game

    this.transitions = []
    this.currentTransition = null
  }

  public changeScene(nextScene: Scene) {
    if (!this.isChanging()) {
      this.transitions.push(new OutTransition(this.game, nextScene))
      this.transitions.push(new InTransition(this.game))

      this.currentTransition = this.transitions.shift()
    }
  }

  public update(dt: number): void {
    if (this.currentTransition instanceof Transition) {
      this.currentTransition.update(dt)

      if (this.currentTransition.isFinished()) {
        if (this.transitions.length === 0) {
          this.currentTransition = null
        } else {
          this.currentTransition = this.transitions.shift()
        }
      }
    }
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (this.currentTransition instanceof Transition) {
      this.currentTransition.render(ctx)
    }
  }

  public isChanging(): boolean {
    return this.currentTransition !== null
  }
}
