import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import litLogo from '../../assets/lit.svg'
import viteLogo from '../../assets/vite.svg'
import stylesText from './my-element.css?raw'

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('my-element')
export class MyElement extends LitElement {
  private static _sheet?: CSSStyleSheet
  private _styleEl?: HTMLStyleElement
  /**
   * Copy for the read the docs hint.
   */
  @property()
  docsHint = 'Click on the Vite and Lit logos to learn more'

  /**
   * The number of times the button has been clicked.
   */
  @property({ type: Number })
  count = 0

  render() {
    return html`
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src=${viteLogo} class="logo" alt="Vite logo" />
        </a>
        <a href="https://lit.dev" target="_blank">
          <img src=${litLogo} class="logo lit" alt="Lit logo" />
        </a>
      </div>
      <slot></slot>
      <div class="card">
        <button @click=${this._onClick} part="button">
          count is ${this.count}
        </button>
      </div>
      <p class="read-the-docs">${this.docsHint}</p>
    `
  }

  private _onClick() {
    this.count++
  }

  connectedCallback() {
    super.connectedCallback()
    const root = this.renderRoot as ShadowRoot

    if ('adoptedStyleSheets' in ShadowRoot.prototype) {
      if (!MyElement._sheet) {
        const sheet = new CSSStyleSheet()
        if ('replaceSync' in CSSStyleSheet.prototype) {
          ;(sheet as any).replaceSync(stylesText)
        } else if ((sheet as any).replace) {
          ;(sheet as any).replace(stylesText)
        }
        MyElement._sheet = sheet
      }
      ;(root as any).adoptedStyleSheets = [MyElement._sheet]
    } else {
      if (!this._styleEl) {
        const s = document.createElement('style')
        s.textContent = stylesText
        root.appendChild(s)
        this._styleEl = s
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement
  }
}
