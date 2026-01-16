import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { LpElement } from '../../lib/lp-element'
import stylesText from './lp-button.css?raw'

/**
 * litPortfolio Button Element.
 *
 * @slot - This element has a slots
 * @csspart button - The button
 */
@customElement('lp-button')
export class LpButton extends LpElement {
  static stylesText = stylesText;

  @property({ type: String })
  color: ColorSet = 'blue';
  

  render() {
    return html`
      <button class="${this.color}">
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