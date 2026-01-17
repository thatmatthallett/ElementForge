import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { LpElement } from '../../lib/lp-element';
import { dsLogger } from '../../utils/dslogger';
import stylesText from './lp-icon.css?raw';

import { icons } from '../../assets/icons/icons';
import { isIconName } from '../../utils';
import { colorSetValues } from '../../types/colorSet';
import { strokeWidthTokens, type StrokeWidthPreset } from '../../types/strokeWidths';

/**
 * litPortfolio Icon Element.
 *
 */
@customElement('lp-icon')
export class LpIcon extends LpElement {
  static stylesText = stylesText;

  @property({ type: String, reflect: true })
  color: ColorSet | 'currentColor' = 'currentColor';

  private _name!: IconName;
  @property({ type: String })
  get name() {
    return this._name;
  }
  set name(value: IconName) {
    const normalized = value?.toLowerCase() as IconName;
    const old = this._name;
    this._name = normalized;
    this.requestUpdate('name', old);
  }

  @property({ type: String, reflect: true })
  size: string = '2rem';

  @property({ type: Boolean, reflect: true })
  spinner = false;

  @property({ type: String, reflect: true })
  strokeWidth: StrokeWidthPreset | string = '2';

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
    if (this.color === 'currentColor') {
      this.style.removeProperty('--lp-icon-color');
      return;
    }

    if (!colorSetValues.includes(this.color as any)) {
      dsLogger.warn('lp-icon', `invalid "color" value: ${this.color}`, 'lp-icon#color');
      this.style.removeProperty('--lp-icon-color');
      return;
    }

    this.style.setProperty('--lp-icon-color', `var(--color-${this.color})`);
  }

  private updateSize(): void {
    if (this.size === '2rem') {
      this.style.removeProperty('--lp-icon-size');
      return;
    }

    if (CSS.supports('width', this.size)) {
      this.style.setProperty('--lp-icon-size', this.size);
    } else {
      dsLogger.warn('lp-icon', `invalid "size" value: ${this.size}`, 'lp-icon#size');
      this.style.removeProperty('--lp-icon-size'); // fall back to CSS default
    }
  }

  private updateStrokeWidth(): void {
    const preset = strokeWidthTokens[this.strokeWidth as StrokeWidthPreset];

    if (preset) {
      this.style.setProperty('--lp-icon-stroke-width', preset);
      return;
    }

    if (CSS.supports('stroke-width', this.strokeWidth)) {
      this.style.setProperty('--lp-icon-stroke-width', this.strokeWidth);
    } else {
      dsLogger.warn('lp-icon', `invalid "strokeWidth" value: ${this.strokeWidth}`, 'lp-icon#strokeWidth');
      this.style.removeProperty('--lp-icon-stroke-width');
    }
  }


  render() {
    if (!isIconName(this._name)) {
      dsLogger.error('lp-icon', 'missing required "name" attribute. See: src/assets/icons/icon-types.ts', 'lp-icon#name');
      return html``;
    }

    return html`
      ${icons[this._name]}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lp-icon': LpIcon
  }
}