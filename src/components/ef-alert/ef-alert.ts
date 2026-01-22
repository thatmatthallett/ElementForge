import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { EfElement } from '../../lib/ef-element';
import stylesText from './ef-alert.css?raw';
import {
  getStatusIcon,
  isIconName
} from '../../utils';
import { 
  type ColorSet, 
  colorValues,
  resolveColor,
  type ShapeSet,
  shapeValues,
  shapeRadius
} from '../../tokens';

/**
 * Element Forge Alert Element.
 *
 * @slot - This element has a slots
 */
@customElement('ef-alert')
export class EfAlert extends EfElement {
  @property({ type: String, reflect: true })
  color: ColorSet = 'primary';

  @property({ type: Number })
  duration?: number;

  @property({ type: Boolean, reflect: true })
  dismissible = false;
  
  @property({ type: String, reflect: true })
  icon: IconName | null = null;
  
  @property({ type: String, reflect: true })
  shape: ShapeSet = 'rounded';

  @property({ type: Boolean, reflect: true })
  static = false;

  @property({ type: String, reflect: true })
  variant: 'solid' | 'outline' = "solid";

  @state() private _timer?: number;

  get isStatic() { return this.static || (!this.dismissible && !this.duration); }
  
  static stylesText = stylesText;
  private remaining = 0; 
  private timeoutId: number | null = null;
  private lastTick = 0;

  connectedCallback() {
    super.connectedCallback();

    requestAnimationFrame(() => this.setAttribute('open', ''));
    if (this.isStatic)
      this.setAttribute('open', '');
    
    // Accessibility role
    if (this.static)
      this.ally.assertRole({ mustBe: ['alert', 'status'] });
    
    // Auto-dismiss timer
    if (!this.isStatic && this.duration) {
      this.remaining = this.duration;
      this.startTimer();
    }
  }
  
  disconnectedCallback() {
    if (this._timer) clearTimeout(this._timer);
  
    super.disconnectedCallback();
  }

  updated(changedProps: Map<string, unknown>) {
    super.updated(changedProps);

    // color updating
    if (changedProps.has('color'))
      this.schedule('color', () => this.updateColor());

    // shape updating
    if (changedProps.has('shape'))
      this.schedule('shape', () => this.updateShape());

    if (this.static && (this.duration || this.dismissible)) {
      this.warnOnce('alertStatic',
        "'static' overrides 'dismissible' and 'duration'. This alert will behave as static. Remove 'static' or remove ephemeral props."
      );
    }
  }

  private _onDismiss() { this.emit('ef-alert-dismiss', {}); }

  private startClose() {
    this.setAttribute('closing', '');
    setTimeout(() => this._onDismiss(), 150); // matches exit duration
  }

  private startTimer() {
    if (this.isStatic) return;

    this.lastTick = performance.now();
    this.timeoutId = window.setTimeout(() => this.startClose(), this.remaining);
  }

  private pauseTimer() {
    if (this.timeoutId === null) return;

    window.clearTimeout(this.timeoutId);
    this.timeoutId = null;

    const now = performance.now();
    this.remaining -= now - this.lastTick;
  }

  private resumeTimer() {
    if (this.isStatic) return;
    if (this.timeoutId) return;

    this.lastTick = performance.now();
    this.timeoutId = window.setTimeout(() => this.startClose(), this.remaining);
  }

  private updateColor() {
    if (!colorValues.includes(this.color as any)) {
      this.warnOnce('invalidColor',
        `invalid "color" value: ${this.color} - ef-alert#color`
      );
      this.style.removeProperty('--ef-alert-base-color');
      return;
    }

    this.style.setProperty('--ef-alert-base-color', resolveColor(this.color));
  }

  private updateShape() {
    if (!shapeValues.includes(this.shape as any)) {
      this.warnOnce('invalidShape',
        `invalid "shape" value: ${this.shape} - ef-alert#shape`
      );
      this.style.removeProperty('--ef-alert-radius');
      return;
    }

    this.style.setProperty('--ef-alert-radius', shapeRadius[this.shape]);
  }

  render() {
    let iconName = this.icon ? this.icon : getStatusIcon(this.color, true);
            
    if (!isIconName(iconName)) {
      this.warnOnce('invalidIcon', `invalid "icon" value: ${iconName} - ef-status#icon`);
      iconName = getStatusIcon(this.color, true);
    }

    const hasCustomIcon = !!this.querySelector('[slot="icon"]');

    return html`
      <div
        class="ef-alert-wrapper"
        @mouseenter=${this.pauseTimer}
        @mouseleave=${this.resumeTimer}
      >
        ${hasCustomIcon ?
          html`<slot name="icon"></slot>` : 
          html`<ef-icon name=${iconName} class="status-icon"></ef-icon>` }
        <span class="content">
          <slot name="title"></slot>
          <slot></slot>
        </span>
        <span class="actions">
          <slot name="actions"></slot>
        </span>
        ${!this.isStatic && this.dismissible ? html`
          <ef-button aria-label="Dismiss Alert" class="dismiss-button" variant="outline" shape="pill" @click=${this.startClose}>
            <ef-icon name="x"></ef-icon>
          </ef-button>
        ` : null}
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ef-alert': EfAlert
  }
}