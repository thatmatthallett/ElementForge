import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { LpElement } from '../../lib/lp-element'
import stylesText from './lp-button.css?raw'
import { forwardAria, matchesAttributeCategory, isButtonType } from '../../utils'

/**
 * litPortfolio Button Element.
 *
 * @slot - This element has a slots
 * @csspart button - The button
 */
@customElement('lp-button')
export class LpButton extends LpElement {
  protected observeAttributes = true;

  static stylesText = stylesText;

  @property({ type: String })
  color: ColorSet = 'blue';

  @property({ type: String })
  type: HTMLButtonElement['type'] = 'button';

  connectedCallback(): void {
    super.connectedCallback();

    // Accessibility
    this.ally.assertLabel();
    this.ally.assertSingleTabStop();
  }
  
  protected onAttributeChanged(name: string, _oldValue: string | null, newValue: string | null) {
    if (!matchesAttributeCategory(name, ['aria-','disabled','type'])) return;

    const btn = this.shadowRoot!.querySelector('button');
    if (!btn) return;

    // ARIA forwarding
    if (name.startsWith('aria-')) {
      forwardAria(this, btn, name, newValue);
      return;
    }

    // Disabled forwarding
    if (name === 'disabled') {
      btn.disabled = newValue !== null;
      return;
    }

    // Type forwarding (optional)
    if (name === 'type') {
      btn.type = isButtonType(newValue) ? newValue : 'button';
      return;
    }

  }


  render() {
    return html`
      <button type="${this.type}" class="${this.color}">
        <slot name="start"></slot>
        <slot></slot>
        <slot name="end"></slot>
      </button>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lp-button': LpButton
  }
}