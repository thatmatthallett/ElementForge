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
  static stylesText = stylesText;

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


  connectedCallback() {
    super.connectedCallback();
    
    // Accessibility role
    if (this.static)
      this.ally.assertRole({ mustBe: ['alert', 'status'] });
    
    // Auto-dismiss timer
    if (!this.static && this.duration) {
      this._timer = window.setTimeout(() => {
        this.emit('ef-alert-auto-dismiss', {});
      }, this.duration);
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
  }

  private _onDismiss() { this.emit('ef-alert-dismiss', {}); }

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
      <div class="ef-alert-wrapper">
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
        ${this.dismissible ? html`
          <ef-button aria-label="Dismiss Alert" class="dismiss-button" variant="outline" shape="pill" @click=${this._onDismiss}>
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