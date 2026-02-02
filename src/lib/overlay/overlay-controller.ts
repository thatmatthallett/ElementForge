// src/lib/overlay/overlay-controller.ts

import type { EfElement } from '../ef-element';
import { trapFocus, restoreFocus } from '../ally';

export type OverlayOpenSource = 'keyboard' | 'mouse' | 'programmatic';
export type OverlayCloseReason = 'escape' | 'backdrop' | 'programmatic';

export interface OverlayControllerConfig {
  anchor: HTMLElement | null;
  overlay: EfElement;

  dismissible?: boolean;
  trapFocus?: boolean;
  restoreFocus?: boolean;

  onOpen?: (source: OverlayOpenSource) => void;
  onClose?: (reason: OverlayCloseReason) => void;

  getNextZIndex?: () => number;
  animateIn?: (el: HTMLElement) => void;
  animateOut?: (el: HTMLElement, done: () => void) => void;

  setupDismissListeners?: (
    overlay: HTMLElement,
    options: { escape: boolean; outsideClick: boolean },
    onDismiss: () => void
  ) => { remove: () => void };
}

export class OverlayController {
  private config: OverlayControllerConfig;
  private isOpen = false;

  private dismissHandles: { remove: () => void } | null = null;
  private focusTrapCleanup: (() => void) | null = null;
  private restoreFocusCleanup: (() => void) | null = null;

  constructor(config: OverlayControllerConfig) {
    this.config = config;
  }

  update(partial: Partial<OverlayControllerConfig>) {
    this.config = { ...this.config, ...partial };
  }

  // ------------------------------------------------------------
  // PUBLIC INTERNAL API
  // ------------------------------------------------------------

  openOverlay(source: OverlayOpenSource) {
    if (this.isOpen) return;
    this.isOpen = true;

    this.mount();
    this.config.onOpen?.(source);
  }

  closeOverlay(reason: OverlayCloseReason) {
    if (!this.isOpen) return;
    this.isOpen = false;

    this.unmount();
    this.config.onClose?.(reason);
  }

  toggle() {
    this.isOpen
      ? this.closeOverlay('programmatic')
      : this.openOverlay('programmatic');
  }

  destroy() {
    this.unmount();
  }

  // ------------------------------------------------------------
  // MOUNT / UNMOUNT
  // ------------------------------------------------------------

  private mount() {
    const {
      overlay,
      anchor,
      dismissible,
      trapFocus: shouldTrap,
      restoreFocus: shouldRestore,
      getNextZIndex,
      animateIn,
      setupDismissListeners
    } = this.config;

    overlay.setAttribute('data-open', '');

    // layering
    if (getNextZIndex) {
      overlay.style.zIndex = String(getNextZIndex());
    }

    // motion
    if (animateIn) {
      animateIn(overlay);
    }

    // dismiss
    if (dismissible && setupDismissListeners) {
      this.dismissHandles = setupDismissListeners(
        overlay,
        { escape: true, outsideClick: true },
        () => this.closeOverlay('backdrop')
      );
    }

    // focus trap
    if (shouldTrap) {
      const cleanup = trapFocus(overlay);
      if (cleanup) this.focusTrapCleanup = cleanup;
    }

    // restore focus
    if (shouldRestore) {
      this.restoreFocusCleanup = restoreFocus((anchor ?? overlay) as EfElement);
    }
  }

  private unmount() {
    const { overlay, animateOut } = this.config;

    overlay.removeAttribute('data-open');

    // motion
    if (animateOut) {
      animateOut(overlay, () => {});
    }

    // dismiss cleanup
    this.dismissHandles?.remove();
    this.dismissHandles = null;

    // focus trap cleanup
    this.focusTrapCleanup?.();
    this.focusTrapCleanup = null;

    // restore focus cleanup
    this.restoreFocusCleanup?.();
    this.restoreFocusCleanup = null;
  }
}