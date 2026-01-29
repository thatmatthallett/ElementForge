import { html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { EfElement } from '../../lib/ef-element';
import stylesText from './ef-badge.css?raw';
import {
  forwardAttribute,
  matchesAttributeCategory
} from '../../utils';
import { 
  type ColorSet, 
  colorValues,
  resolveColor,
  type ShapeSet,
  shapeValues,
  shapeRadius
} from '../../tokens';
import { type anchorPositionBlockSet, type anchorPositionInlineSet } from '../../types/anchorPositions';

/**
 * Element Forge Badge Element.
 *
 * @slot - This element has a slots
 */
@customElement('ef-badge')
export class EfBadge extends EfElement {
  static stylesText = stylesText

  @property({ type: String })
  anchorElement?: String;
  @property({ type: String, reflect: true })
  anchorName?: String;
  @property({ type: String, reflect: true })
  anchorPositionBlock?: anchorPositionBlockSet;
  @property({ type: String, reflect: true })
  anchorPositionInline?: anchorPositionInlineSet;
  @property({ type: String })
  anchorOffsetBlock: String = '1rem';
  @property({ type: String })
  anchorOffsetInline: String = '1rem';

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

    // anchor updating
    if (changedProps.has('anchorElement') ||
      changedProps.has('anchorName') ||
      changedProps.has('anchorPositionBlock') ||
      changedProps.has('anchorPositionInline') ||
      changedProps.has('anchorOffsetBlock') ||
      changedProps.has('anchorOffsetInline')) {
      this.schedule('anchor', () => this.updateAnchor());
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

private previousAnchorEl?: HTMLElement;

private updateAnchor() {
  // If neither is set, do nothing (no warning unless user attempted anchor usage)
  if (!this.anchorElement && !this.anchorName) {
    this.style.removeProperty('position-anchor');
    this.style.removeProperty('--ef-badge-anchor-offset-block');
    this.style.removeProperty('--ef-badge-anchor-offset-inline');
    return;
  }

  // If both are set, anchorName wins
  if (this.anchorElement && this.anchorName) {
    this.warnOnce('invalidAnchor',
      `"anchorElement" and "anchorName" are present. Using "anchorName".`
    );
  }

  // Resolve anchor name (valid CSS identifier)
  const anchorName = this.anchorName ?? `--${this.efId}`;
  this.style.setProperty('position-anchor', anchorName as string);

  // Resolve anchor element if using selector mode
  let anchorEl: HTMLElement | null = null;

  if (!this.anchorName && this.anchorElement) {
    anchorEl = document.querySelector(this.anchorElement as string);
    if (!anchorEl) {
      this.warnOnce('invalidAnchorElement',
        `"anchorElement" selector "${this.anchorElement}" matched no elements.`
      );
      return;
    }
  }

  // Clean up old anchor
  if (this.previousAnchorEl && this.previousAnchorEl !== anchorEl) {
    this.previousAnchorEl.style.removeProperty('anchor-name');
  }

  // Apply anchor-name to target element
  if (anchorEl) {
    anchorEl.style.setProperty('anchor-name', anchorName as string);
    this.previousAnchorEl = anchorEl;
  }

  // Offsets (no validation)
  if (this.anchorOffsetBlock && this.anchorOffsetBlock != "1rem")
    this.style.setProperty('--ef-badge-offset-block', this.anchorOffsetBlock as string);

  if (this.anchorOffsetInline && this.anchorOffsetInline != "1rem")
    this.style.setProperty('--ef-badge-offset-inline', this.anchorOffsetInline as string);
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