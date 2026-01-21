import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { EfElement } from '../../lib/ef-element'
import stylesText from './ef-button.css?raw'
import {
  forwardAttribute,
  matchesAttributeCategory,
  isButtonType,
  isEfId
} from '../../utils'
import { 
  type ColorSet, 
  colorValues,
  resolveColor,
  type ShapeSet,
  shapeValues,
  shapeRadius
} from '../../tokens'
import { type EventOf } from '../../lib/events';

/**
 * Element Forge Alert Element.
 *
 * @slot - This element has a slots
 */
@customElement('ef-alert')
export class EfAlert extends EfElement {
  static stylesText = stylesText

  @property({ type: String, reflect: true })
  color: ColorSet = 'primary'

  @property({ type: String, reflect: true })
  icon: IconName | null = null;
  
  @property({ type: String, reflect: true })
  shape: ShapeSet = 'rounded'



  render() {
    return html`
      <slot></slot>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ef-alert': EfAlert
  }
}