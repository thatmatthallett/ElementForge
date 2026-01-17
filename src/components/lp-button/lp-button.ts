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

type LoadingIconName = Extract<IconName, "loader" | "loader-2" | "loader-3" | "loader-quarter" | "fidget-spinner" | "fidget-spinner-filled">;

@customElement('lp-button')
export class LpButton extends LpElement {
  protected observeAttributes = true;

  static stylesText = stylesText;

  @property({ type: String, reflect: true })
  color: ColorSet = 'blue';

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: String, reflect: true })
  iconStart: IconName | null = null;
  @property({ type: String, reflect: true })
  iconEnd: IconName | null = null;

  @property({ type: Boolean, reflect: true })
  loading = false;
  @property({ type: String })
  loadingIcon: LoadingIconName = 'loader-2';

  @property({ type: String, reflect: true })
  type: HTMLButtonElement['type'] = 'button';

  connectedCallback(): void {
    super.connectedCallback();

    // Accessibility
    this.ally.assertLabel();
    this.ally.assertRole({ mustNotExist: true });
    this.ally.assertSingleTabStop();

    // Handle Clicks
    this.addEventListener('click', this.#preventHostClick);


  }

  #onInternalClick(event: MouseEvent) {
    if (this.disabled || this.loading) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }

    this.emit('lp-click', { originalEvent: event });
  }

  #preventHostClick(event: MouseEvent) {
    // If the click originated on the host (not the internal button), ignore it
    if (event.target === this) {
      event.stopImmediatePropagation();
    }
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
      <button
        type="${this.type}"
        class="${this.color}"
        @click=${this.#onInternalClick}
        ?disabled=${this.disabled || this.loading}
        aria-busy=${this.loading ? 'true' : 'false'}
      >
        <span class="icon-start">
          ${this.iconStart  
            ? html`<lp-icon name=${this.iconStart} size="1rem"></lp-icon>`
            : null
          }
        </span>
        <slot></slot>
        <span class="icon-end">
          ${this.loading &&
            html`<lp-icon name=${this.loadingIcon} size="1rem" spinner></lp-icon>`
          }
          ${this.iconEnd &&
            html`<lp-icon name=${this.iconEnd} size="1rem"></lp-icon>`
          }
        </span>
      </button>
    `
  } 
}

declare global {
  interface HTMLElementTagNameMap {
    'lp-button': LpButton
  }
}