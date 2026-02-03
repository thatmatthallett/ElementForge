import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { EfElement } from '../../lib/ef-element';
import { AnchorPositioning, OverlayControls } from '../../mixins';
import { OverlayController } from '../../lib/overlay/overlay-controller';
import stylesText from './ef-tooltip.css?raw';
import sharedAnchorStyles from '../../shared/anchor-position.css?raw';
import { mergeCss } from '../../utils';
import { 
  type ColorSet, 
  colorValues,
  resolveColor,
  resolveTextColor,
  type ShapeSet,
  shapeValues,
  shapeRadius
} from '../../tokens';

/**
 * Element Forge Tooltip Element.
 *
 * @slot - This element has a slots
 */
class EfTooltipBase extends OverlayControls( AnchorPositioning(EfElement) ) {}

@customElement('ef-tooltip')
export class EFTooltip extends EfTooltipBase {
  static stylesText = mergeCss(sharedAnchorStyles, stylesText);

  @property({ type: String, reflect: true })
  color: ColorSet = 'secondary';

  @property({ type: String, reflect: true })
  shape: ShapeSet = 'rounded';

  @property({ type: String, reflect: true })
  variant: 'solid' | 'outline' = 'outline';

  controller = new OverlayController({
    overlay: this,
    anchor: this.anchor,
    dismissible: false, // tooltips do not dismiss via outside click or escape
    trapFocus: false, // tooltips never trap focus
    restoreFocus: false // tooltips do not restore focus
  });

  constructor() {
    super();
    this.trigger = ['hover', 'focus'];
    this.delay = 500;
    this.anchorOffsetBlock = '1rem';
    this.anchorOffsetInline = '0rem';
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

  private updateColor() {
    if (this.color === 'primary') return;
    
    if (!colorValues.includes(this.color as any)) {
      this.warnOnce('invalidColor',
        `invalid "color" value: ${this.color} - ef-tooltip#color`
      );
      this.style.removeProperty('--ef-tooltip-base-color');
      this.style.removeProperty('--ef-tooltip-text');
      return;
    }

    this.style.setProperty('--ef-tooltip-base-color', resolveColor(this.color));
    if (this.variant !== 'outline')
      this.style.setProperty('--ef-tooltip-text', resolveTextColor(this.color));
  }

  private updateShape() {
    if (!shapeValues.includes(this.shape as any)) {
      this.warnOnce('invalidShape',
        `invalid "shape" value: ${this.shape} - ef-tooltip#shape`
      );
      this.style.removeProperty('--ef-tooltip-radius');
      return;
    }

    this.style.setProperty('--ef-tooltip-radius', shapeRadius[this.shape]);
  }

  render() {
    return html`
      <div class="tooltip">
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ef-tooltip': EFTooltip
  }
}