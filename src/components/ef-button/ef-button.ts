import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { EfElement } from '../../lib/ef-element'
import stylesText from './ef-button.css?raw'
import { 
  dsLogger,
  forwardAttribute,
  matchesAttributeCategory,
  isButtonType,
  createComponentId } from '../../utils'
import { type ColorSet } from '../../tokens'

/**
 * litPortfolio Button Element.
 *
 * @slot - This element has a slots
 * @csspart button - The button
 */

type LoadingIconName = Extract<IconName, "loader" | "loader-2" | "loader-3" | "loader-quarter" | "fidget-spinner" | "fidget-spinner-filled">;

@customElement('ef-button')
export class EfButton extends EfElement {
  protected observeAttributes = true;
  static stylesText = stylesText;
  static formAssociated = true;
  private internals = this.attachInternals();
  private _expandedWarning = false;
  private _iconOnlyWarning = false;
  private _loaderWarning = false;
  private _toggleWarning = false;

  @property({ type: String })
  efId: string = createComponentId('efButton');

  @property({ type: String, reflect: true })
  color: ColorSet = 'primary';

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

  @property({ type: Boolean, reflect: true })
  toggle = false;
  @property({ type: Boolean, reflect: true })
  toggled: boolean = false;
  @property({ type: String })
  toggleIcon: IconName | null = null;

  connectedCallback(): void {
    super.connectedCallback();

    // Accessibility
    this.ally.assertLabel();
    this.ally.assertRole({ mustNotExist: true });
    this.ally.assertSingleTabStop();

    // Handle Clicks
    this.addEventListener('click', this.#preventHostClick);

    // Handle Loading Events
    window.addEventListener('ef-loading-start', this.onLoadingStart as EventListener);
    window.addEventListener('ef-loading-end', this.onLoadingEnd as EventListener);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();

    // Remove Click Handler
    this.removeEventListener('click', this.#preventHostClick);

    // Remove Loading Handlers
    window.removeEventListener('ef-loading-start', this.onLoadingStart as EventListener);
    window.removeEventListener('ef-loading-end', this.onLoadingEnd as EventListener);
  }

  updated(changedProps: Map<string, unknown>) {
    super.updated(changedProps);

    const hasText = this.textContent?.trim().length > 0;
    const hasIcon = !!this.icon;
    const hasAriaLabel = this.hasAttribute('aria-label');

    if (!hasText && hasIcon && !hasAriaLabel) {
      if (import.meta.env.DEV && !this._iconOnlyWarning) {
        this._iconOnlyWarning = true;
        dsLogger.warn( 'ef-button', 'icon-only usage detected without aria-label. Add aria-label to describe the button action.' );
      }
    }

    // Warn if loading is enabled but loader is not
    if (this.loading && !this.loader && !this._loaderWarning) {
      this._loaderWarning = true;
      dsLogger.warn(
        'ef-button',
        'loading is enabled but loader=false. Enable loader to display loading visuals.'
      );
    }

    // Warn if toggle is not set but toggledIcon or toggled is used
    if (!this.toggle && (this.toggled || this.toggleIcon) && !this._toggleWarning) {
      this._toggleWarning = true;
      dsLogger.warn(
        'ef-button',
        'Toggle-related props (toggled or toggledIcon) are set but toggle mode is disabled. Add toggle to enable toggle behavior.'
      );
    }

    if (this.toggle && this.hasAttribute('aria-expanded') && !this._expandedWarning) {
      this._expandedWarning = true;
      dsLogger.warn(
        'ef-button',
        'aria-expanded is set on a toggle button. aria-pressed will be suppressed to avoid conflicting ARIA states.'
      );
     }
  }


  #onInternalClick(event: MouseEvent) {
    if (this.disabled || this.loading) return;
    
    const form = this.internals.form;
    if (this.type === 'submit') {
      form?.requestSubmit();
      return;
    }
    if (this.type === 'reset') {
      form?.reset();
      return;
    }

    if (this.toggle) { this.toggled = !this.toggled; }

    this.emit('ef-click', { originalEvent: event });
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
    const attributs = ['aria-','disabled','type','form', 'formaction', 'formenctype', 'formmethod', 'formnovalidate', 'formtarget', 'tabindex', 'name', 'value']
    if (!matchesAttributeCategory(name, attributs)) return;

    const btn = this.shadowRoot!.querySelector('button');
    if (!btn) return;

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

    // Prevent tabindex on host
    if (name === 'tabindex') {
      if (import.meta.env.DEV) {
        console.warn('<ef-button> does not support tabindex. The internal button manages focus.');
      }

      this.removeAttribute('tabindex'); return;
    }

    forwardAttribute(this, btn, name, newValue);
  }

  private onLoadingStart = (e: CustomEvent<{ efId: string }>) => {
    if (e.detail.efId !== this.efId) return;
    this.startLoading();
  }
  private onLoadingEnd = (e: CustomEvent<{ efId: string }>) => {
    if (e.detail.efId !== this.efId) return;
    this.stopLoading();
  }

  /**
   * Event Passthrough
   */
  focus(options?: FocusOptions) { this.shadowRoot?.querySelector('button')?.focus(options); }
  blur() { this.shadowRoot?.querySelector('button')?.blur(); }
  click() { this.shadowRoot?.querySelector('button')?.click(); }


  render() {
    const ariaPressed = this.toggle && !this.hasAttribute('aria-expanded')
      ? String(this.toggled)
      : null;
    const currentIcon = this.toggle && this.toggled ? this.toggleIcon ?? this.icon : this.icon;

    const loaderCode = html`
      <span class="loader ${this.loading ? 'mode-loading' : 'mode-normal'}">
        <ef-icon name=${this.loadingIcon} spinner part="loader"></ef-icon>
      </span>
    `;

    const iconCode = html`
      <span class="icon-${this.iconPosition} ${this.loading ? 'mode-loading' : 'mode-normal'}">
        <ef-icon name=${currentIcon} part="icon"></ef-icon>
      </span>
    `;

    return html`
      <button
        type="${this.type}"
        color="${this.color}"
        @click=${this.#onInternalClick}
        ?disabled=${this.disabled || this.loading}
        aria-busy=${this.loader ? String(this.loading) : null}
        aria-pressed=${ariaPressed}
        aria-expanded=${this.getAttribute('aria-expanded')}
        part="button"
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
    'ef-button': EfButton
  }
}