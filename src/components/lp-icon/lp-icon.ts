import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import stylesText from './lp-icon.css?raw';

import { icons } from '../../assets/icons/icons';
import { isColorSet, isIconName } from '../../utils/global-utils';

/**
 * litPortfolio Icon Element.
 *
 */
@customElement('lp-icon')
export class LpIcon extends LitElement {
  private static _sheet?: CSSStyleSheet
  private _styleEl?: HTMLStyleElement
  
  @property({ type: String })
  name!: IconName;

  @property({ type: String })
  size: string = '2rem';

  @property({ type: String })
  stroke: ColorSet | 'currentColor' = 'blue';

  render() {
    if (!isIconName(this.name)) {
      console.warn('<lp-icon> "name" attribute value not found:', this.name);
      return html``;
    }

    return html`
      ${icons[this.name]}
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

  updated(changedProps: Map<string, unknown>) {
    if (changedProps.has('name') && !this.name)
      console.warn('<lp-icon> missing required "name" attribute');

    if (changedProps.has('size')) 
      this.style.setProperty('--icon-size', this.size);

    if (changedProps.has('stroke'))
      if (!isColorSet(this.stroke)){
        console.warn('<lp-icon> "stroke" attribute has invalid value:', this.stroke, 'Value must be one of black, gray, blue, slate, lgray, or currentColor. Defaulting to blue.');
        this.style.setProperty('--icon-stroke', 'var(--color-blue)');
      } else {
        this.style.setProperty('--icon-stroke', 'var(--color-' + this.stroke + ')');
      }

    this.updateAria()
  }

  private updateAria(): void {
    const hasLabel = this.hasAttribute('aria-label');
    const isHidden = this.getAttribute('aria-hidden') === 'true';

    if (hasLabel) { // Meaningful icon
      this.removeAttribute('aria-hidden');
      if (!this.hasAttribute('role')) this.setAttribute('role', 'img');
      return;
    }

    if (isHidden) { // Consumer explicitly wants it hidden
      this.removeAttribute('role');
      return;
    }

    // Default behavior: decorative
    this.setAttribute('aria-hidden', 'true');
    this.removeAttribute('role');
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lp-icon': LpIcon
  }
}