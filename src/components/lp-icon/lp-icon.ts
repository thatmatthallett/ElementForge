import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import stylesText from './lp-icon.css?raw';

import { icons } from '../../assets/icons/icons';

/**
 * litPortfolio Icon Element.
 *
 */
@customElement('lp-icon')
export class LpIcon extends LitElement {
  private static _sheet?: CSSStyleSheet
  private _styleEl?: HTMLStyleElement
  
  @property({ type: String })
  name: string = '';

  render() {
    const icon = icons[this.name];
    console.log('icon', icon);
    if (!icon) return html`Icon failed to load: ${this.name}`;

    return html`
      ${icons[this.name]}
      ${icon}
    `;
  }

  connectedCallback() {
    super.connectedCallback()
    const root = this.renderRoot as ShadowRoot

    if ('adoptedStyleSheets' in ShadowRoot.prototype) {
      if (!LpIcon._sheet) {
        const sheet = new CSSStyleSheet()
        if ('replaceSync' in CSSStyleSheet.prototype) {
          ;(sheet as any).replaceSync(stylesText)
        } else if ((sheet as any).replace) {
          ;(sheet as any).replace(stylesText)
        }
        LpIcon._sheet = sheet
      }
      ;(root as any).adoptedStyleSheets = [LpIcon._sheet]
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
    'lp-icon': LpIcon
  }
}