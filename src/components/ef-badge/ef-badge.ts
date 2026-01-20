import { html, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { EfElement } from '../../lib/ef-element'
import stylesText from './ef-badge.css?raw'
import {
  isIconName,
  isEfId
} from '../../utils'
import { 
  type ColorSet, 
  colorValues,
  resolveColor,
  type ShapeSet,
  shapeValues,
  shapeRadius
} from '../../tokens'

/**
 * litPortfolio Badge Element.
 *
 * @slot - This element has a slots
 */
@customElement('ef-badge')
export class EfBadge extends EfElement {
  static stylesText = stylesText

  @property({ type: String, reflect: true })
  color: ColorSet = 'primary';
  
  @property({ type: Number, reflect: true })
  count?: number;

  @property({ type: String, reflect: true })
  icon: IconName | null = null;

  @property({ type: String, reflect: true })
  size: 'sm' | 'md' | 'lg' = 'md';

  @property({ type: String, reflect: true })
  shape: ShapeSet = 'rounded';

  @property({ type: String, reflect: true })
  variant: 'solid' | 'subtle' | 'outline' = 'solid';


  updated(changedProps: Map<string, unknown>) {
    super.updated(changedProps);

    const hasText = this.textContent?.trim().length > 0;
    const hasIcon = !!this.icon;
    const hasAriaLabel = this.hasAttribute('aria-label');

    if (!hasText && hasIcon && !hasAriaLabel) {
      this.warnOnce('iconOnlyNoAria',
        'icon-only usage detected without aria-label. Add aria-label to describe the button action.'
      );
    }

    // color updating
    if (changedProps.has('color'))
      this.schedule('color', () => this.updateColor());

    // shape updating
    if (changedProps.has('shape'))
      this.schedule('shape', () => this.updateShape());
  }

  private updateColor() {
    if (!colorValues.includes(this.color as any)) {
      this.warnOnce('invalidColor',
        `invalid "color" value: ${this.color} - ef-button#color`
      );
      this.style.removeProperty('--ef-icon-color');
      return;
    }

    this.style.setProperty('--ef-btn-base-color', resolveColor(this.color));
  }

  private updateShape() {
    if (!shapeValues.includes(this.shape as any)) {
      this.warnOnce('invalidShape',
        `invalid "shape" value: ${this.shape} - ef-button#shape`
      );
      this.style.removeProperty('--ef-btn-radius');
      return;
    }

    this.style.setProperty('--ef-btn-radius', shapeRadius[this.shape]);
  }

  render() {
    const hasCustomIcon = !!this.querySelector('[slot="icon"]');

    return html`
      <span class="ef-badge ${this.variant} ${this.shape} ${this.size}">
        ${hasCustomIcon ?
            html`<slot name="icon"></slot>` : 
            html`<ef-icon name=${this.icon} class="status-icon"></ef-icon>`
          }
        <slot></slot>
        ${this.count !== undefined ? html`<span class="badge-count">${this.count}</span>` : nothing}
      </span>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ef-badge': EfBadge
  }
}