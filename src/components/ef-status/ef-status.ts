import { html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { EfElement } from '../../lib/ef-element';
import type { StatusSet } from '../../tokens/';
import stylesText from './ef-status.css?raw';

@customElement('ef-status')
export class EfStatus extends EfElement {
  static stylesText = stylesText;

  @property({ type: String, reflect: true})
  fontSize: string = '0.875rem';

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
      this.style.removeProperty(' --ef-status-font-size'); // fall back to CSS default
    }
  }

  render() {
    console.log('Rendering ef-status with message:', this.statusMessage);
    console.log('Status:', this.status);
    if (!this.statusMessage) return nothing;

    // Errors + warnings should interrupt politely
    const ariaLive =
      this.status === 'error' || this.status === 'warning'
        ? 'assertive'
        : 'polite';

    const iconName = this.getIconForStatus(this.status);

    return html`
      <div
        class="ef-status-wrapper ${this.status} ${this.statusMessage ? 'show' : ''}"
        role="status"
        aria-live=${ariaLive}
      >
        <ef-icon name=${iconName} class="status-icon"></ef-icon>
        <span class="status-text">${this.statusMessage}</span>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ef-status': EfStatus;
  }
}
