import { LitElement } from 'lit';
import type { ComponentEvents } from './events';
import * as a11y from './ally';
import { observeAttributes } from '../utils';

export class LpElement extends LitElement {
  private static _sheet?: CSSStyleSheet;
  private _styleEl?: HTMLStyleElement;
  private _attributeObserverCleanup: (() => void) | null = null;
  private _listeners: Array<() => void> = [];

  /* Accessibility Helpers */
  protected ally = {
    assertAltText: () => a11y.assertAltText(this),
    assertAriaControls: (id: string) => a11y.assertAriaControls(this, id),
    assertAriaExpanded: (expanded: boolean) => a11y.assertAriaExpanded(this, expanded),
    assertFocusable: () => a11y.assertFocusable(this),
    assertLabel: () => a11y.assertLabel(this),
    assertRequiredProps: (props: string[]) => a11y.assertRequiredProps(this, props),
    assertRole: (expected: string) => a11y.assertRole(this, expected),
    assertSingleTabStop: () => a11y.assertSingleTabStop(this),
    ensureTabbable: () => a11y.ensureTabbable(this),
    restoreFocus: () => a11y.restoreFocus(this),
    trapFocus: () => a11y.trapFocus(this),
    warnIfInteractiveWithoutRole: () => a11y.warnIfInteractiveWithoutRole(this),
  };
  /* Attribute Observation Boolean */
  protected observeAttributes = false;
  
  /**
   * A static tagName property for consistent logging.
   * You can set this in each component:
   *   static tagName = 'lp-icon';
   */
  static tagName?: string;


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
    const ctor = this.constructor as typeof LpElement;
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
    detail: ComponentEvents[T],
    options?: Omit<CustomEventInit, 'detail'>
  ): boolean {
    return this.dispatchEvent(
      new CustomEvent(type, {
        detail,
        bubbles: true,
        composed: true,
        cancelable: false,
        ...options
      })
    );
  }

  /**
   * A dev‑mode logger that only runs in development.
   * You can expand this later for warnings, analytics, etc.
   */
  public log(message: string, ...args: unknown[]) {
    if (import.meta.env.DEV) {
      const tag = (this.constructor as typeof LpElement).tagName ?? this.tagName.toLowerCase();
      console.debug(`[${tag}] ${message}`, ...args);
    }
  }

  /**
   * A lifecycle hook wrapper that logs updates.
   * Useful for debugging component behavior during development.
   */
  protected updated(changedProps: Map<string, unknown>) {
    super.updated(changedProps);

    if (import.meta.env.DEV && changedProps.size > 0) {
      this.log('updated', Object.fromEntries(changedProps));
    }
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

}
