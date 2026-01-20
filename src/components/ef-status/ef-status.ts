import { html, nothing } from 'lit';
import { customElement } from 'lit/decorators.js';
import { EfElement } from '../../lib/ef-element';
import type { StatusSet } from '../../tokens/';
import stylesText from './ef-status.css?raw';

@customElement('ef-status')
export class EfStatus extends EfElement {
  static stylesText = stylesText;

  private getIconForStatus(status?: StatusSet): IconName {
    switch (status) {
      case 'error': return 'alert-circle';
      case 'warning': return 'alert-triangle';
      case 'success': return 'circle-check';
      case 'info': return 'info-circle';
      default: return 'info-circle';
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
