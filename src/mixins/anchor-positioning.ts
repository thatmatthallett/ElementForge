import { EfElement } from '../lib/ef-element';
import { type anchorPositionBlockSet, type anchorPositionInlineSet } from '../types/anchorPositions';

type Constructor<T = {}> = new (...args: any[]) => T;

export const AnchorPositioning = <T extends Constructor<EfElement>>(Base: T) => class extends Base {
  static properties = {
    anchorPositionBlock: { type: String, reflect: true },
    anchorPositionInline: { type: String, reflect: true },
    anchorOffsetBlock: { type: String },
    anchorOffsetInline: { type: String },
    anchorElement: { type: String },
    anchorName: { type: String, reflect: true }
  };

  anchorPositionBlock: anchorPositionBlockSet = 'top-outside';
  anchorPositionInline: anchorPositionInlineSet = 'right-outside';
  anchorOffsetBlock = '1rem';
  anchorOffsetInline = '1rem';
  anchorElement?: string;
  anchorName?: string;

  private previousAnchorEl?: HTMLElement;

  updated(changedProps: Map<string, unknown>) {
    super.updated(changedProps);
    
    // anchor updating
    if (changedProps.has('anchorElement') ||
      changedProps.has('anchorName') ||
      changedProps.has('anchorPositionBlock') ||
      changedProps.has('anchorPositionInline') ||
      changedProps.has('anchorOffsetBlock') ||
      changedProps.has('anchorOffsetInline')) {
      this.schedule('anchor', () => this.updateAnchor());
    }
  }

  protected updateAnchor() {
    // If neither is set, do nothing (no warning unless user attempted anchor usage)
    if (!this.anchorElement && !this.anchorName) {
      this.style.removeProperty('position-anchor');
      this.style.removeProperty('--ef-badge-anchor-offset-block');
      this.style.removeProperty('--ef-badge-anchor-offset-inline');
      return;
    }

    // If both are set, anchorName wins
    if (this.anchorElement && this.anchorName) {
      this.warnOnce('invalidAnchor',
        `"anchorElement" and "anchorName" are present. Using "anchorName".`
      );
    }

    // Resolve anchor name (valid CSS identifier)
    const anchorName = this.anchorName ?? `--${this.efId}`;
    this.style.setProperty('position-anchor', anchorName as string);

    // Resolve anchor element if using selector mode
    let anchorEl: HTMLElement | null = null;

    if (!this.anchorName && this.anchorElement) {
      anchorEl = document.querySelector(this.anchorElement as string);
      if (!anchorEl) {
        this.warnOnce('invalidAnchorElement',
          `"anchorElement" selector "${this.anchorElement}" matched no elements.`
        );
        return;
      }
    }

    // Clean up old anchor
    if (this.previousAnchorEl && this.previousAnchorEl !== anchorEl) {
      this.previousAnchorEl.style.removeProperty('anchor-name');
    }

    // Apply anchor-name to target element
    if (anchorEl) {
      anchorEl.style.setProperty('anchor-name', anchorName as string);
      this.previousAnchorEl = anchorEl;
    }

    // Offsets (no validation)
    if (this.anchorOffsetBlock && this.anchorOffsetBlock != "1rem")
      this.style.setProperty('--ef-anchor-offset-block', this.anchorOffsetBlock as string);

    if (this.anchorOffsetInline && this.anchorOffsetInline != "1rem")
      this.style.setProperty('--ef-anchor-offset-inline', this.anchorOffsetInline as string);
  }
};