import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { EfElement } from '../../lib/ef-element';
import stylesText from './ef-alert-container.css?raw';
import { type EventOf } from '../../lib/events';
import { type AlertRequestDetail } from '../../types/alertRequestDetail';
import { repeat } from 'lit/directives/repeat.js';
import { ref, createRef } from 'lit/directives/ref.js';
import { createComponentId } from '../../utils';


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

  @state() private _alerts: Array<AlertRequestDetail & { efId: string }> = [];
  
  private _liveRegion!: HTMLElement;
  private _liveRegionRef = createRef<HTMLDivElement>();
  

  connectedCallback() {
    super.connectedCallback();

    // Global alert requests
    this.listen(window, 'ef-alert', this.#onRequest as EventListener);

    // Dismiss events from alerts
    this.listen(this, 'ef-alert-dismiss', this.#onDismiss as EventListener);
    this.listen(this, 'ef-alert-auto-dismiss', this.#onDismiss as EventListener);
  }

  firstUpdated() { this._liveRegion = this._liveRegionRef.value!; }

  // Imperative API
  pushAlert(detail: AlertRequestDetail) {
    console.log('pushAlert', detail);
    return this.createAlert(detail);
  }
  
  removeAlert(efId: string) {
    this._alerts = this._alerts.filter(a => a.efId !== efId);
  }

  clearAlerts() {
    this._alerts = [];
  }

  #onRequest = (e: CustomEvent<AlertRequestDetail>) => {
    this.createAlert(e.detail);
  };

  #onDismiss = (e: EventOf<'ef-alert-dismiss'> | EventOf<'ef-alert-auto-dismiss'>) => {
    this.removeAlert(e.detail.efId);
  };

  private createAlert(detail: AlertRequestDetail) {
    console.log('createAlert', detail);
    this._announce(detail.message);

    const efId = createComponentId("efAlert");

    this._alerts = [...this._alerts, { ...detail, efId }];

    return efId;
  }

  private _announce(message?: string) {
    if (!message || !this._liveRegion) return;

    this._liveRegion.textContent = '';
    requestAnimationFrame(() => {
      this._liveRegion.textContent = message;
    });
  }

  render() {
    return html`
      <div class="ef-alert-container ${this.position}">
        ${repeat(
          this._alerts,
          a => a.efId,
          a => html`
            <ef-alert
              .efId=${a.efId}
              .color=${a.color ?? 'primary'}
              .duration=${a.duration ?? 5000}
              .dismissible=${a.dismissible ?? true}
              .icon=${a.icon ?? null}
              .shape=${a.shape ?? 'rounded'}
              .variant=${a.variant ?? 'solid'}
            >
              ${a.message}
            </ef-alert>
          `
        )}
      </div>

      <!-- Centralized aria-live region -->
      <div
        class="ef-alert-live"
        aria-live="polite"
        aria-atomic="true"
        ${ref(this._liveRegionRef)}
      ></div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ef-alert-container': EfAlertContainer;
  }
}