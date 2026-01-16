import { LitElement } from 'lit';
import type { ComponentEvents } from './events';

export class LpElement extends LitElement {
  private static _sheet?: CSSStyleSheet
  private _styleEl?: HTMLStyleElement

  connectedCallback() {
    super.connectedCallback();
    this.applyComponentStyles();
  }

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
  protected log(message: string, ...args: unknown[]) {
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

  /**
   * A static tagName property for consistent logging.
   * You can set this in each component:
   *   static tagName = 'lp-icon';
   */
  static tagName?: string;
}
