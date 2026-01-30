import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { EfElement } from '../../lib/ef-element';
import stylesText from './ef-button.css?raw';
import {
  forwardAttribute,
  matchesAttributeCategory,
  isButtonType,
  isEfId
} from '../../utils';
import { 
  type ColorSet, 
  colorValues,
  resolveColor,
  resolveTextColor,
  type ShapeSet,
  shapeValues,
  shapeRadius
} from '../../tokens';
import { type EventOf } from '../../lib/events';

/**
 * Element Forge Button Element.
 *
 * @slot - This element has a slots
 */

type LoadingIconName = Extract<IconName, "loader" | "loader-2" | "loader-3" | "loader-quarter" | "fidget-spinner" | "fidget-spinner-filled">;

@customElement('ef-button')
export class EfButton extends EfElement {
  protected observeAttributes = true;
  static stylesText = stylesText;
  static formAssociated = true;
  private internals = this.attachInternals();

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
  size: 'sm' | 'md' | 'lg' | 'xl' | 'xxl' = 'md';

  @property({ type: String, reflect: true })
  shape: ShapeSet = 'rounded';

  @property({ type: String, reflect: true })
  type: HTMLButtonElement['type'] = 'button';

  @property({ type: Boolean, reflect: true })
  toggle = false;
  @property({ type: Boolean, reflect: true })
  toggled: boolean = false;
  @property({ type: Boolean, reflect: true })
  toggleManual = false;
  @property({ type: String })
  toggleIcon: IconName | null = null;

  @property({ type: String, reflect: true })
  variant: 'solid' | 'ghost' | 'link' | 'outline' | 'soft' = 'solid';

  connectedCallback(): void {
    super.connectedCallback();

    // Accessibility
    this.ally.assertLabel();
    this.ally.assertRole({ mustNotExist: true });
    this.ally.assertSingleTabStop();

    // Handle Clicks
    this.listen(this, 'click', this.#preventHostClick as EventListener);

    // Handle Loading Events
    this.listen(window, 'ef-loading-start', this.onLoadingStart as EventListener);
    this.listen(window, 'ef-loading-end', this.onLoadingEnd as EventListener);
  }

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

    if (changedProps.has('toggled') && this.toggleManual) {
      const previous = changedProps.get('toggled');

      if (typeof previous === 'boolean') {
        this.emit('ef-toggle', {
          previous: previous,
          now: this.toggled });
      }
    }

    // Warn if loading is enabled but loader is not
    if (this.loading && !this.loader) {
      this.warnOnce('loadingNoLoader',
        'loading is enabled but loader=false. Enable loader to display loading visuals.'
      );
    }

    // Warn if toggle is not set but toggledIcon or toggled is used
    if (!this.toggle && (this.toggled || this.toggleIcon)) {
      this.warnOnce('togglePropsWithoutToggle',
        'Toggle-related props (toggled or toggledIcon) are set but toggle mode is disabled. Add toggle to enable toggle behavior.'
      );
    }

    if (this.toggle && this.hasAttribute('aria-expanded')) {
      this.warnOnce('ariaExpandedWithToggle',
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

    if (this.toggle && !this.toggleManual) {
      const toggledState = this.toggled;
      this.toggled = !this.toggled;

      this.emit('ef-toggle', {
        previous: toggledState,
        now: this.toggled,
      });
    }

    this.emit('ef-click', { originalEvent: event });
  }


  #preventHostClick(event: MouseEvent) {
    // If the click originated on the host (not the internal button), ignore it
    if (event.target === this) {
      event.stopImmediatePropagation();
    }
  }

  public startLoading() {
    this.loading = true;
    this.emit('ef-loading', { active: true })
  }
  public stopLoading() {
    this.loading = false;
    this.emit('ef-loading', { active: false })
  }
  public toggleLoading() {
    this.loading = !this.loading;
    this.emit('ef-loading', { active: this.loading })
  }
  
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

  private onLoadingStart = (e:  EventOf<'ef-loading-start'>) => {
    if (!isEfId(e.detail.efId, this.efId)) return;
    this.startLoading();
  }
  private onLoadingEnd = (e:  EventOf<'ef-loading-end'>) => {
    if (!isEfId(e.detail.efId, this.efId)) return;
    this.stopLoading();
  }

  private updateColor() {
    if (this.color === 'primary') return;

    if (!colorValues.includes(this.color as any)) {
      this.warnOnce('invalidColor',
        `invalid "color" value: ${this.color} - ef-button#color`
      );
      this.style.removeProperty('--ef-btn-base-color');
      this.style.removeProperty('--ef-btn-text');
      return;
    }

    this.style.setProperty('--ef-btn-base-color', resolveColor(this.color));
    this.style.setProperty('--ef-btn-text', resolveTextColor(this.color));
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
    console.log(currentIcon);

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
        @click=${this.#onInternalClick}
        @focus=${() => this.emit('ef-focus', {})}
        @blur=${() => this.emit('ef-blur', {})}
        @mouseenter=${() => this.emit('ef-hover', { hovering: true })}
        @mouseleave=${() => this.emit('ef-hover', { hovering: false })}
        ?disabled=${this.disabled || this.loading}
        aria-busy=${ifDefined(this.loader ? String(this.loading): undefined)}
        aria-pressed=${ifDefined(ariaPressed)}
        aria-expanded=${ifDefined(this.getAttribute('aria-expanded'))}
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
      ${this.statusMessage ? this.renderStatusMessage() : null}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ef-button': EfButton
  }
}