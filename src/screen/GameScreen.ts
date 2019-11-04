import m from 'mithril'

import { Game } from '../Game'
import { Keyboard } from '../input/Keyboard'
import { Mouse } from '../input/Mouse'
import { Pointer } from '../input/Pointer'
import { Touch } from '../input/Touch'
import { state } from '../State'
import { isTouchDevice } from '../Util'

let game: Game = null

export class GameScreen {
  private keyboard: Keyboard
  private pointer: Pointer

  public view() {
    return [
      m('div', { 'class': 'topbar' }, [
        m('div', { 'class': 'topbar-level' }, 'Niveau X/Y'),
        m('div', { 'class': 'topbar-menu' }, [
          m('button', { 'onclick': restartLevel, 'class': 'topbar-button', 'title': 'Recommencer le niveau' }, '⟳'),
          m('button', { 'onclick': showMenu, 'class': 'topbar-button topbar-button-menu' }, 'Menu'),
          m('nav', { 'class': 'topbar-menu-nav' }, [
            m('button', { 'onclick': restartLevel, 'class': 'topbar-nav-button' }, 'Recommencer le niveau'),
            m(m.route.Link, { 'href': '/choose-level', 'class': 'topbar-nav-button' }, 'Retourner au menu'),
          ]),
        ]),
      ]),
      m('div', { 'id': 'app-wrapper' }, [
        m('canvas', { 'id': 'app' }),
      ]),
    ]
  }

  public oncreate(vnode: m.Vnode) {
    const canvas = document.getElementById('app') as HTMLCanvasElement

    this.keyboard = new Keyboard()

    if (isTouchDevice()) {
      this.pointer = new Touch(canvas)
    } else {
      this.pointer = new Mouse(canvas)
    }

    const attrs = vnode.attrs as any

    const levelName = attrs.level as string

    game = new Game(this, levelName)

    updateTopbarLevel(levelName)

    document.addEventListener('click', documentClickEvent)

    document.body.classList.add('bg-dark')
  }

  public onupdate(vnode: m.Vnode) {
    const attrs = vnode.attrs as any

    game.stop()
    game.unlisten()

    const levelName = attrs.level as string

    game = new Game(this, levelName)

    updateTopbarLevel(levelName)
  }

  public onremove(vnode: m.Vnode) {
    game.stop()
    game.unlisten()

    document.removeEventListener('click', documentClickEvent)

    document.body.classList.remove('bg-dark')

    this.keyboard.unlisten()
    this.pointer.unlisten()
  }

  public getKeyboard(): Keyboard {
    return this.keyboard
  }

  public getPointer(): Pointer {
    return this.pointer
  }
}

function showMenu(e: any): void {
  e.redraw = false

  const nav = document.querySelector('.topbar-menu-nav')

  if (nav instanceof HTMLElement) {
    nav.classList.toggle('topbar-menu-nav-displayed')
  }
}

function goToMenu(e: any): void {
  m.route.set('/choose-level')
}

function restartLevel(e: any): void {
  e.redraw = true

  const nav = document.querySelector('.topbar-menu-nav')

  if (nav instanceof HTMLElement) {
    nav.classList.remove('topbar-menu-nav-displayed')
  }
}

function updateTopbarLevel(levelName: string) {
  const topbarLevel = document.querySelector('.topbar-level')

  if (topbarLevel instanceof HTMLElement) {
    const levels = state.getStorage().getLevels()
    const nbLevels = Object.keys(levels).length
    const levelNumber = levels[levelName].fixed.number

    topbarLevel.innerText = `${levelNumber}/${nbLevels}`
  }
}

function documentClickEvent(e: MouseEvent) {
  const button = document.querySelector('.topbar-button-menu')
  const nav = document.querySelector('.topbar-menu-nav')
  const target = e.target as Node

  if (!nav.contains(target) && target !== button) {
    nav.classList.remove('topbar-menu-nav-displayed')
  }
}
