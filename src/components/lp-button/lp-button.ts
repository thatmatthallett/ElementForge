import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { LpElement } from '../../lib/lp-element'
import stylesText from './lp-button.css?raw'
import { forwardAria, matchesAttributeCategory, isButtonType, createComponentId } from '../../utils'

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
  lpId: string = createComponentId('lpButton');

  @property({ type: String, reflect: true })
  color: ColorSet = 'blue';

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: String, reflect: true })
  icon: IconName | null = null;
  @property({ type: String, reflect: true })
  iconPosition: 'start' | 'end' = 'start';

  @property({ type: Boolean, reflect: true })
  loader = false
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

    // Handle Loading Events
    window.addEventListener('lp-loading-start', this.onLoadingStart as EventListener);
    window.addEventListener('lp-loading-end', this.onLoadingEnd as EventListener);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();

    // Remove Click Handler
    this.removeEventListener('click', this.#preventHostClick);

    // Remove Loading Handlers
    window.removeEventListener('lp-loading-start', this.onLoadingStart as EventListener);
    window.removeEventListener('lp-loading-end', this.onLoadingEnd as EventListener);
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

  public startLoading() { this.loading = true; }
  public stopLoading() { this.loading = false; }
  public toggleLoading() { this.loading = !this.loading; }
  
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

  private onLoadingStart = (e: CustomEvent<{ lpId: string }>) => {
    console.log('lp-loading-start received', e.detail.lpId, this.lpId);
    if (e.detail.lpId !== this.lpId) return;
    this.startLoading();
  }
  private onLoadingEnd = (e: CustomEvent<{ lpId: string }>) => {
    console.log('lp-loading-end received', e.detail.lpId, this.lpId);
    if (e.detail.lpId !== this.lpId) return;
    this.stopLoading();
  }


  render() {
    const iconCode = html`
      <span class="icon-${this.iconPosition} ${this.loading ? 'mode-loading' : 'mode-normal'}">
        <lp-icon name=${this.icon}></lp-icon>
      </span>
    `;

    const loaderCode = html`
      <span class="loader ${this.loading ? 'mode-loading' : 'mode-normal'}">
        <lp-icon name=${this.loadingIcon} spinner></lp-icon>
      </span>
    `;

    return html`
      <button
        type="${this.type}"
        class="${this.color}"
        @click=${this.#onInternalClick}
        ?disabled=${this.disabled || this.loading}
        aria-busy=${this.loading ? 'true' : 'false'}
      >
        ${this.icon && this.iconPosition === 'start' 
          ? iconCode : null
        }
        <slot></slot>
        ${this.icon && this.iconPosition === 'end' 
          ? iconCode : null
        }
        ${this.loader ? loaderCode : null}
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lp-button': LpButton
  }
}