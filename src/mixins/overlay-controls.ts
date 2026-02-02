import { EfElement } from '../lib/ef-element';
import type { EventOf } from '../lib/events';
import { matchesAttributeCategory } from '../utils';
import { OverlayController, type OverlayOpenSource, type OverlayCloseReason } from '../lib/overlay/overlay-controller';

type Constructor<T = {}> = new (...args: any[]) => T;

export const OverlayControls = <T extends Constructor<EfElement>>(Base: T) => class extends Base {
  static properties = {
    delay: { type: Number },
    open: { type: Boolean, reflect: true },
    trigger: { type: String, reflect: true },
  };

  delay:number = 0;
  open = false;
  trigger: 'click' | 'hover' | 'focus' | Array<'click' | 'hover' | 'focus'> = 'click';

  declare anchor: HTMLElement | null;
  declare controller: OverlayController;

  private _closeTimeout: number | null = null;
  private _triggerDebounce = false;

  updated(changedProps: Map<string, unknown>) {
    super.updated(changedProps);
    
    if (changedProps.has('anchor'))
      this._setupListeners();
  }  

  private _setupListeners() {
    if (!this.anchor) return;

    const triggers = Array.isArray(this.trigger) ? this.trigger : [this.trigger];
    
    if (triggers.includes('click')) {
      this.listen(this.anchor, 'click', () => {
        this._debounceTrigger(() => this.openOverlay('mouse'));
      });
    }
    if (triggers.includes('hover')) {
      this.listen(this.anchor, 'mouseenter', () => this.openOverlay('mouse'));
      this.listen(this.anchor, 'mouseleave', () => this.closeOverlay('programmatic'));
    }
    if (triggers.includes('focus')) {
      this.listen(this.anchor, 'focus', () => {
        this._debounceTrigger(() => this.openOverlay('keyboard'));
      });
      this.listen(this.anchor, 'blur', () => this.closeOverlay('programmatic'));
    }

    // Global commands
    this.listen(window, 'ef-show', this.showOverlay as EventListener);
    this.listen(window, 'ef-hide', this.hideOverlay as EventListener);
  }

  private showOverlay(e: EventOf<'ef-show'>) {
    if (e.detail?.efId === this.efId) this.openOverlay('programmatic');
  }

  private hideOverlay(e: EventOf<'ef-hide'>) {
    if (e.detail?.efId === this.efId) this.closeOverlay('programmatic');
  }

  private _debounceTrigger(fn: () => void) {
    if (this._triggerDebounce) return;
    this._triggerDebounce = true; queueMicrotask(() => {
      this._triggerDebounce = false;
      fn();
    });
  }

  // PUBLIC API

  openOverlay(source: OverlayOpenSource = 'programmatic') {
    this.open = true;
    this.controller?.openOverlay(source);
  }

  closeOverlay(reason: OverlayCloseReason = 'programmatic') {
    if (this._closeTimeout) clearTimeout(this._closeTimeout);

    this._closeTimeout = window.setTimeout(() => {
      this.open = false;
      this.controller?.closeOverlay(reason)
    }, this.delay);
  }

  toggle() {
    this.open ? this.closeOverlay() : this.openOverlay();
  }

  protected onAttributeChanged(name: string, oldVal: string | null, newVal: string | null) {
    super.onAttributeChanged?.(name, oldVal, newVal);

    const attributs = ['open']
    if (!matchesAttributeCategory(name, attributs)) return;
    
    if (name === 'open') {
      if (newVal !== null) {
        this.controller?.openOverlay('programmatic');
      } else {
        this.controller?.closeOverlay('programmatic');
      }
    }
  }
}