import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { EfElement } from '../../lib/ef-element';
import { dsLogger, isIconName } from '../../utils';
import stylesText from './ef-icon.css?raw';

import { icons } from '../../assets/icons/icons';
import { 
  colorSetValues,
  strokeWidthTokens,
  type StrokeWidthPreset
} from '../../types';

/**
 * litPortfolio Icon Element.
 *
 */
@customElement('ef-icon')
export class EfIcon extends EfElement {
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
      dsLogger.error('ef-icon', 'missing required "name" attribute. See: src/assets/icons/icon-types.ts', 'ef-icon#name');

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
      this.style.removeProperty('--ef-icon-color');
      return;
    }

    if (!colorSetValues.includes(this.color as any)) {
      dsLogger.warn('ef-icon', `invalid "color" value: ${this.color}`, 'ef-icon#color');
      this.style.removeProperty('--ef-icon-color');
      return;
    }

    this.style.setProperty('--ef-icon-color', `var(--color-${this.color})`);
  }

  private updateSize(): void {
    if (this.size === '2rem') {
      this.style.removeProperty('--ef-icon-size');
      return;
    }

    if (CSS.supports('width', this.size)) {
      this.style.setProperty('--ef-icon-size', this.size);
    } else {
      dsLogger.warn('ef-icon', `invalid "size" value: ${this.size}`, 'ef-icon#size');
      this.style.removeProperty('--ef-icon-size'); // fall back to CSS default
    }
  }

  private updateStrokeWidth(): void {
    const preset = strokeWidthTokens[this.strokeWidth as StrokeWidthPreset];

    if (preset) {
      this.style.setProperty('--ef-icon-stroke-width', preset);
      return;
    }

    if (CSS.supports('stroke-width', this.strokeWidth)) {
      this.style.setProperty('--ef-icon-stroke-width', this.strokeWidth);
    } else {
      dsLogger.warn('ef-icon', `invalid "strokeWidth" value: ${this.strokeWidth}`, 'ef-icon#strokeWidth');
      this.style.removeProperty('--ef-icon-stroke-width');
    }
  }


  render() {
    if (!isIconName(this._name)) {
      dsLogger.error('ef-icon', 'missing required "name" attribute. See: src/assets/icons/icon-types.ts', 'ef-icon#name');
      return html``;
    }

    return html`
      ${icons[this._name]}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ef-icon': EfIcon
  }
}