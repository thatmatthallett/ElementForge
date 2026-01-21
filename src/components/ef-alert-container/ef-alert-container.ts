import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { EfElement } from '../../lib/ef-element';
import stylesText from './ef-alert-container.css?raw';
import { type EventOf } from '../../lib/events';
import { type AlertRequestDetail } from '../../types/alertRequestDetail';
import type { EfAlert } from '../ef-alert/ef-alert';

/**
 * Element Forge Alert Container Element.
 *
 * @slot - This element has a slots
 */
@customElement('ef-alert-container')
export class EfAlertContainer extends EfElement {
  static stylesText = stylesText;

  @property({ type: String, reflect: true })
  position:
    | 'top-left'
    | 'top-right'
    | 'top-center'
    | 'bottom-left'
    | 'bottom-right'
    | 'bottom-center' = 'top-right';

  @state() private _alerts: Array<{ id: string; template: unknown }> = [];

  private _liveRegion!: HTMLElement;

  connectedCallback() {
    super.connectedCallback();

    // Global alert requests
    this.listen(window, 'ef-alert', this.#onRequest as EventListener);

    // Dismiss events from alerts
    this.listen(this, 'ef-alert-dismiss', this.#onDismiss as EventListener);
    this.listen(this, 'ef-alert-auto-dismiss', this.#onDismiss as EventListener);
  }

  // Imperative API
  pushAlert(detail: AlertRequestDetail) {
    return this.createAlert(detail);
  }

  removeAlert(id: string) {
    this._alerts = this._alerts.filter(a => a.efId !== id);
  }

  clearAlerts() {
    this._alerts = [];
  }

  #onRequest = (e: CustomEvent<AlertRequestDetail>) => {
    this.createAlert(e.detail);
  };

  #onDismiss = (e: EventOf<'ef-alert-dismiss'> | EventOf<'ef-alert-auto-dismiss'>) => {
    const alert = e.target as EfAlert;
    const efId = alert.efId;
    if (efId) this.remove(efId);
  };

  private createAlert(detail: AlertRequestDetail) {
    const id = crypto.randomUUID();

    // Announce for screen readers
    this._announce(detail.message);

    const template = detail.render
      ? detail.render()
      : html`
          <ef-alert
            data-id=${id}
            color=${detail.color ?? 'primary'}
            duration=${detail.duration ?? 5000}
            ?dismissible=${detail.dismissible ?? true}
            icon=${detail.icon ?? ''}
            shape=${detail.shape ?? 'rounded'}
            variant=${detail.variant ?? 'solid'}
          >
            ${detail.message}
          </ef-alert>
        `;

    this._alerts = [...this._alerts, { id, template }];
    return id;
  }

  private _announce(message?: string) {
    if (!message) return;
    this._liveRegion.textContent = '';
    requestAnimationFrame(() => {
      this._liveRegion.textContent = message;
    });
  }

  render() {
    return html`
      <div class="ef-alert-container ${this.position}">
        ${this._alerts.map(a => a.template)}
      </div>

      <!-- Centralized aria-live region -->
      <div
        class="ef-alert-live"
        aria-live="polite"
        aria-atomic="true"
        ${el => (this._liveRegion = el)}
      ></div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ef-alert-container': EfAlertContainer;
  }
}