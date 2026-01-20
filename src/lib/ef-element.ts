import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js'
import type { ComponentEvents } from './events';
import * as a11y from './ally';
import type { AssertRoleOptions } from './ally/assertRole';
import type { StatusSet } from '../tokens/statusTokens';
import {
  createComponentId,
  dsLogger,
  isEfId,
  observeAttributes,
 } from '../utils';

type DebounceKey = string;

export class EfElement extends LitElement {
  private static _sheet?: CSSStyleSheet;
  private _styleEl?: HTMLStyleElement;
  private _attributeObserverCleanup: (() => void) | null = null;
  private _listeners: Array<() => void> = [];
  private _pendingStatus?: StatusSet;
  private _pendingMessage?: string;
  private _scheduled = new Set<string>();
  private _warnings = new Set<string>();
  
  public componentName: string;

  @property({ type: String })
  efId!: string;

  @property({ attribute: 'data-theme', reflect: true })
  theme?: 'light' | 'dark' | 'forge' | 'dim' | 'high-contrast';

  @property({ type: String, reflect: true })
  status?: StatusSet;
  @property({ type: String })
  statusMessage?: string


  /* Accessibility Helpers */
  protected ally = {
    assertAltText: () => a11y.assertAltText(this),
    assertAriaControls: (id: string) => a11y.assertAriaControls(this, id),
    assertAriaExpanded: (expanded: boolean) => a11y.assertAriaExpanded(this, expanded),
    assertFocusable: () => a11y.assertFocusable(this),
    assertLabel: () => a11y.assertLabel(this),
    assertRequiredProps: (props: string[]) => a11y.assertRequiredProps(this, props),
    assertRole: (options: AssertRoleOptions) => a11y.assertRole(this, options),
    assertSingleTabStop: () => a11y.assertSingleTabStop(this),
    ensureTabbable: () => a11y.ensureTabbable(this),
    restoreFocus: () => a11y.restoreFocus(this),
    trapFocus: () => a11y.trapFocus(this),
    warnIfInteractiveWithoutRole: () => a11y.warnIfInteractiveWithoutRole(this),
  };
  /* Attribute Observation Boolean */
  protected observeAttributes = false;

  constructor() {
    super();
    this.componentName = this.tagName.toLowerCase();
    const normalized = this.componentName
      .split('-')
      .map((p, i) => i === 0 ? p : p[0].toUpperCase() + p.slice(1))
      .join('');
    
    this.efId = createComponentId(normalized); }


  connectedCallback() {
    super.connectedCallback();
    this.applyComponentStyles();

    if (this.observeAttributes)
      this._attributeObserverCleanup = observeAttributes(
        this,
        (name, oldValue, newValue) => {
        this.onAttributeChanged(name, oldValue, newValue);
      }
    );
    
    // Handle Loading Events
    this.listen(window, 'ef-validate', this.#onValidate as EventListener)
  }

  disconnectedCallback() {
    // Auto-cleanup all listeners
    for (const off of this._listeners) off();
    this._listeners = [];

    this._attributeObserverCleanup?.();

    super.disconnectedCallback();
  }



  /* Stylesheet cache for adopted styles */
  private applyComponentStyles() {
    const ctor = this.constructor as typeof EfElement;
    const root = this.shadowRoot!;
    const css = (ctor as any).stylesText as string | undefined;

    if (!css) return;

    if ('adoptedStyleSheets' in ShadowRoot.prototype) {
      if (!ctor._sheet) {
        const sheet = new CSSStyleSheet();
        if ('replaceSync' in CSSStyleSheet.prototype) {
          sheet.replaceSync(css);
        } else if (sheet.replace) {
          sheet.replace(css);
        }
        ctor._sheet = sheet;
      }
      (root as any).adoptedStyleSheets = [ctor._sheet];
    } else {
      if (!this._styleEl) {
        const s = document.createElement('style');
        s.textContent = css;
        root.appendChild(s);
        this._styleEl = s;
      }
    }
  }


  /**
   * Emit a typed custom event from any component.
   * This enforces consistent event behavior across the entire library.
   */
  protected emit<T extends keyof ComponentEvents>(
    type: T,
    detail: Omit<ComponentEvents[T], 'efId'>,
    options?: Omit<CustomEventInit, 'detail'>
  ): boolean {
    const finalDetail = Object.freeze({ efId: this.efId, ...(detail ?? {}) });
    
    return this.dispatchEvent(
      new CustomEvent(type, {
        detail: finalDetail,
        bubbles: true,
        composed: true,
        cancelable: false,
        ...options
      })
    );
  }

  /* Global Event Listeners w/ Cleanup */
  protected listen(
    target: EventTarget,
    type: string,
    handler: EventListenerOrEventListenerObject,
    options?: AddEventListenerOptions
  ) {
    target.addEventListener(type, handler, options);

    // Store cleanup function
    this._listeners.push(() => {
      target.removeEventListener(type, handler, options);
    });
  }

  /* Attribute Observer */
  protected onAttributeChanged(_name: string, _oldValue: string | null, _newValue: string | null) {
    // default: no-op
  }

  /* Debounce Helper */
  protected schedule<K extends DebounceKey>(key: K, fn: () => void) {
    if (!this._scheduled) this._scheduled = new Set<K>();
    if (this._scheduled.has(key)) return;

    this._scheduled.add(key);

    queueMicrotask(() => {
      this._scheduled.delete(key);
      fn();
    });
  }

  /* Warn Once Helper */
  protected warnOnce(key: string, message: string) {
    if (this._warnings.has(key)) return;
    
    this._warnings.add(key);
    dsLogger.warn(this.componentName, message);
  }

  /* component status helpers */
  #onValidate(e: CustomEvent<ComponentEvents['ef-validate']>) {
    const { status, message, efId } = e.detail;
    
    if (status) { this.updateStatus(efId, status, message); }
    else { this.clearStatus(efId); }
  }

  public updateStatus(efId: string,status: StatusSet, message?: string ) {
    if (!isEfId(efId, this.efId)) return;

    this._pendingStatus = status;
    this._pendingMessage = message;
    
    this.schedule('status', () => {
      this.status = this._pendingStatus;
      this.statusMessage = this._pendingMessage;
    });
  }
  public clearStatus(efId: string) {
    if (!isEfId(efId, this.efId)) return;

    this.schedule('status', () => {
      this.status = undefined;
      this.statusMessage = undefined;
    });
  }
  protected renderStatusMessage() {
    if (!this.statusMessage) return null;

    return html`
      <ef-status
        status=${this.status ?? nothing}
        message=${this.statusMessage}
      ></ef-status>
    `;
  }

}
