import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { dsLogger } from '../../utils/dslogger';
import stylesText from './lp-icon.css?raw';

import { icons } from '../../assets/icons/icons';
import { isColorSet, isIconName } from '../../utils/global-utils';
import { colorSetValues } from '../../types/colorSet';

/**
 * litPortfolio Icon Element.
 *
 */
@customElement('lp-icon')
export class LpIcon extends LitElement {
  private static _sheet?: CSSStyleSheet
  private _styleEl?: HTMLStyleElement

  @property({ type: String, reflect: true })
  color: ColorSet | 'currentColor' = 'blue';
  
  @property({ type: String })
  name!: IconName;

  @property({ type: String, reflect: true })
  size: string = '2rem';

  @property({ type: String, reflect: true })
  strokeWidth: string = '2';

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
    if (changedProps.has('color'))
      this.updateColor();

    if (changedProps.has('name') && !this.name)
      dsLogger.error('lp-icon', 'missing required "name" attribute. See: src/assets/icons/icon-types.ts', 'lp-icon#name');

    if (changedProps.has('size'))
      this.updateSize();

    if (changedProps.has('strokeWidth'))
      this.updateStrokeWidth();

    this.updateAria()
  }

  private updateAria(): void {
    const hasLabel = this.hasAttribute('aria-label') || this.hasAttribute('aria-labelledby');
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

  private updateColor(): void {
    if (!isColorSet(this.color)){
      dsLogger.warn('lp-icon', `invalid "color" value: ${this.color} - Value must be one of ${colorSetValues.join(', ')} or currentColor. Defaulting to blue.`, 'lp-icon#color');
      this.style.setProperty('--icon-color', 'var(--color-blue)');
    } else {
      this.style.setProperty('--icon-color', `var(--color-${this.color})`);
    }
  }

  private updateSize(): void {
    if (CSS.supports('width', this.size)) {
      this.style.setProperty('--icon-size', this.size);
    } else {
      dsLogger.warn('lp-icon', `invalid "size" value: ${this.size} - Defaulting to 2rem.`, 'lp-icon#size');
      this.style.setProperty('--icon-size', '2rem');
    }
  }

  private updateStrokeWidth(): void {
    if (CSS.supports('stroke-width', this.strokeWidth)) {
      this.style.setProperty('--icon-stroke-width', this.strokeWidth);
    } else {
      dsLogger.warn('lp-icon', `invalid "strokeWidth" value: ${this.strokeWidth} - Defaulting to 2.`, 'lp-icon#strokeWidth');
      this.style.setProperty('--icon-stroke-width', '2');
    }
    
  }

  render() {
    if (!isIconName(this.name)) {
      dsLogger.error('lp-icon', 'missing required "name" attribute. See: src/assets/icons/icon-types.ts', 'lp-icon#name');
      return html``;
    }

    return html`
      ${icons[this.name]}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lp-icon': LpIcon
  }
}