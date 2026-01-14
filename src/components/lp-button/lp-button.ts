import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import stylesText from './lp-button.css?raw'

/**
 * litPortfolio Button Element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('lp-button')
export class MyElement extends LitElement {
  private static _sheet?: CSSStyleSheet
  private _styleEl?: HTMLStyleElement
  
  


  render() {
    return html`
      <button >
        <slot name="start"></slot>
        <slot></slot>
        <slot name="end"></slot>
      </button>
    `
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
    'lp-button': MyElement
  }
}
