import { html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { EfElement } from '../../lib/ef-element';
import { isIconName } from '../../utils';
import type { StatusSet } from '../../tokens/';
import stylesText from './ef-status.css?raw';

@customElement('ef-status')
export class EfStatus extends EfElement {
  static stylesText = stylesText;

  @property({ type: String, reflect: true})
  fontSize: string = '0.875rem';

  @property({ type: String, reflect: true })
  icon?: IconName | null;

  updated(changedProps: Map<string, unknown>) {
    if (changedProps.has('fontSize'))
      this.schedule('fontSize', () => this.updateFontSize());
  }

  private getIconForStatus(status?: StatusSet): IconName {
    switch (status) {
      case 'error': return 'alert-circle-filled';
      case 'warning': return 'alert-triangle-filled';
      case 'success': return 'circle-check-filled';
      case 'info': return 'info-circle-filled';
      default: return 'info-circle-filled';
    }
  }

  private updateFontSize() {
    if (this.fontSize === '0.875rem') {
      this.style.removeProperty(' --ef-status-font-size');
      return;
    }

    if (CSS.supports('font-size', this.fontSize)) {
      this.style.setProperty(' --ef-status-font-size', this.fontSize);
    } else {
      this.warnOnce('invalidFontSize', `invalid "fontSize" value: ${this.fontSize} - ef-status#fontSize`);
      this.style.removeProperty('--ef-status-font-size'); // fall back to CSS default
    }
  }

  render() {
    // Errors + warnings should interrupt politely
    const ariaLive =
      this.status === 'error' || this.status === 'warning'
        ? 'assertive'
        : 'polite';

    let iconName = this.icon ? this.icon : this.getIconForStatus(this.status);
        
    if (!isIconName(iconName)) {
      this.warnOnce('invalidIcon', `invalid "icon" value: ${iconName} - ef-status#icon`);
      iconName = this.getIconForStatus(this.status);
    }

    const hasCustomIcon = !!this.querySelector('[slot="icon"]');

    const slotted = this.textContent?.trim();
    const message = slotted || this.statusMessage;

    if (!message) return nothing;

    return html`
      <div
        class="ef-status-wrapper ${this.status} ${this.statusMessage ? 'show' : nothing}"
        role="status"
        aria-live=${ariaLive}
        aria-atomic="true"
      >
        ${hasCustomIcon ?
          html`<slot name="icon"></slot>` : 
          html`<ef-icon name=${iconName} class="status-icon"></ef-icon>` }
        <span class="status-text">${message}</span>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ef-status': EfStatus;
  }
}
