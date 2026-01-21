import { html, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { EfElement } from '../../lib/ef-element'
import stylesText from './ef-badge.css?raw'
import {
  forwardAttribute,
  matchesAttributeCategory
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
  size: 'sm' | 'md' | 'lg' | 'xl' | 'xxl' = 'md';

  @property({ type: String, reflect: true })
  shape: ShapeSet = 'rounded';

  @property({ type: String, reflect: true })
  variant: 'solid' | 'subtle' | 'outline' = 'solid';


  updated(changedProps: Map<string, unknown>) {
    super.updated(changedProps);

    const hasText = this.textContent?.trim().length > 0;
    const hasCount = !!this.count;
    const hasIcon = !!this.icon;
    const hasAriaLabel = this.hasAttribute('aria-label');

    if (!hasText && hasIcon && !hasAriaLabel) {
      this.warnOnce('iconOnlyNoAria',
        'icon-only usage detected without aria-label. Add aria-label to describe the badge contents.'
      );
    }

    if (!hasText && hasCount && !hasAriaLabel) {
      this.warnOnce('countNoAria',
        'count usage detected without aria-label. Add aria-label to describe the badge contents.'
      );
    }

    // color updating
    if (changedProps.has('color'))
      this.schedule('color', () => this.updateColor());

    // shape updating
    if (changedProps.has('shape'))
      this.schedule('shape', () => this.updateShape());
  }

  protected onAttributeChanged(name: string, _oldValue: string | null, newValue: string | null) {
    const attributs = ['aria-']
    if (!matchesAttributeCategory(name, attributs)) return;

    const el = this.shadowRoot!.querySelector('.ef-badge') as HTMLElement;
    if (!el) return;
    
    forwardAttribute(this, el, name, newValue);
  }

  private updateColor() {
    if (!colorValues.includes(this.color as any)) {
      this.warnOnce('invalidColor',
        `invalid "color" value: ${this.color} - ef-badge#color`
      );
      this.style.removeProperty('--ef-badge-base-color');
      return;
    }

    this.style.setProperty('--ef-badge-base-color', resolveColor(this.color));
  }

  private updateShape() {
    if (!shapeValues.includes(this.shape as any)) {
      this.warnOnce('invalidShape',
        `invalid "shape" value: ${this.shape} - ef-badge#shape`
      );
      this.style.removeProperty('--ef-badge-radius');
      return;
    }

    this.style.setProperty('--ef-badge-radius', shapeRadius[this.shape]);
  }

  render() {
    const hasCustomIcon = !!this.querySelector('[slot="icon"]');

    return html`
      <span class="ef-badge">
        ${hasCustomIcon
          ? html`<slot name="icon"></slot>`
          : this.icon
              ?html`<ef-icon name=${this.icon} class="status-icon"></ef-icon>`
              :nothing
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