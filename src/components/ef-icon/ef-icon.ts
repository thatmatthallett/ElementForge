import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { EfElement } from '../../lib/ef-element';
import { dsLogger, isIconName } from '../../utils';
import stylesText from './ef-icon.css?raw';

import { icons } from '../../assets/icons/icons';
import { 
  type ColorSet,
  colorValues,
  resolveColor,
  strokeWidthTokens,
  type StrokeWidthPreset
} from '../../tokens';

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
  // default to width, width must be set first to default correctly
  height?: string;
  
  @property({ type: String, reflect: true })
  width: string = '2rem';

  @property({ type: Boolean, reflect: true })
  spinner = false;

  @property({ type: String, reflect: true })
  strokeWidth: StrokeWidthPreset | string = '2';

  updated(changedProps: Map<string, unknown>) {
    if (changedProps.has('color'))
      this.updateColor();

    if (changedProps.has('name') && !this.name)
      dsLogger.error(
        this.componentName,
        'missing required "name" attribute. See: src/assets/icons/icon-types.ts',
        `${this.componentName}#name`
      );

    if (changedProps.has('width'))
      this.updateWidth();

    if (changedProps.has('height'))
      this.updateHeight();

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

    if (!colorValues.includes(this.color as any)) {
      this.warnOnce('invalidColor', `invalid "color" value: ${this.color} - ef-icon#color`);
      this.style.removeProperty('--ef-icon-color');
      return;
    }

    this.style.setProperty('--ef-icon-color', resolveColor(this.color));
  }

  private updateHeight(): void {
    const finalHeight = this.height ?? this.width;
    
    if (CSS.supports('height', finalHeight)) {
      this.style.setProperty('--ef-icon-height', finalHeight);
    } else {
      this.warnOnce('invalidHeight', `invalid "height" value: ${finalHeight} - ef-icon#height`);
      this.style.removeProperty('--ef-icon-height'); }
  }

  private updateWidth(): void {
    if (this.width === '2rem') {
      this.style.removeProperty('--ef-icon-width');
      return;
    }

    if (CSS.supports('width', this.width)) {
      this.style.setProperty('--ef-icon-width', this.width);
    } else {
      this.warnOnce('invalidWidth', `invalid "width" value: ${this.width} - ef-icon#width`);
      this.style.removeProperty('--ef-icon-width'); // fall back to CSS default
    }

    // If height is unset, width changes should also update height
    if (!this.height) { this.updateHeight(); }
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
      this.warnOnce('invalidStrokeWidth', `invalid "strokeWidth" value: ${this.strokeWidth} - ef-icon#strokeWidth`);
      this.style.removeProperty('--ef-icon-stroke-width');
    }
  }


  render() {
    // Inline SVG via slot
    if (this.hasChildNodes()) {
      return html`<slot></slot>`;
    }

    // Registry icon via name
    if (isIconName(this._name)) {
      return html`${icons[this._name]}`;
    }

    // Fallback + error
    dsLogger.error(
      this.componentName,
      'missing required "name" attribute or valid src/slot.',
      `${this.componentName}}#name`
    );

    return html``;
  }
}


declare global {
  interface HTMLElementTagNameMap {
    'ef-icon': EfIcon
  }
}