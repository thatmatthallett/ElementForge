import { EfElement } from '../lib/ef-element';
import { type anchorPositionBlockSet, type anchorPositionInlineSet } from '../types/anchorPositions';

type Constructor<T = {}> = new (...args: any[]) => T;

export const AnchorPositioning = <T extends Constructor<EfElement>>(Base: T) => class extends Base {
  static properties = {
    anchor: { state: true },
    anchorElement: { type: String },
    anchorName: { type: String, reflect: true },
    anchorOffsetBlock: { type: String },
    anchorOffsetInline: { type: String },
    anchorPositionArea: { type: String },
    anchorPositionBlock: { type: String },
    anchorPositionInline: { type: String },
  };

  anchor: HTMLElement | null = null;
  anchorElement?: string;
  anchorName?: string;
  anchorOffsetBlock = '1rem';
  anchorOffsetInline = '1rem';
  anchorPositionArea: string | null = null;
  anchorPositionBlock: anchorPositionBlockSet = 'top-inside';
  anchorPositionInline: anchorPositionInlineSet = 'right-outside';

  private previousAnchorEl?: HTMLElement;

  updated(changedProps: Map<string, unknown>) {
    super.updated(changedProps);
    
    // anchor updating
    if (changedProps.has('anchorElement') ||
      changedProps.has('anchorName') ||
      changedProps.has('anchorOffsetBlock') ||
      changedProps.has('anchorOffsetInline') ||
      changedProps.has('anchorPositionArea') ||
      changedProps.has('anchorPositionBlock') ||
      changedProps.has('anchorPositionInline')) {
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
    this.anchor = null;

    if (!this.anchorName && this.anchorElement) {
      this.anchor = document.querySelector(this.anchorElement as string);
      if (!this.anchor) {
        this.warnOnce('invalidAnchorElement',
          `"anchorElement" selector "${this.anchorElement}" matched no elements.`
        );
        this.anchor = null;
        return;
      }
    }

    // Clean up old anchor
    if (this.previousAnchorEl && this.previousAnchorEl !== this.anchor) {
      this.previousAnchorEl.style.removeProperty('anchor-name');
    }

    // Apply anchor-name to target element
    if (this.anchor) {
      this.anchor.style.setProperty('anchor-name', anchorName as string);
      this.previousAnchorEl = this.anchor;
    }

    const blockWasSet = this.hasAttribute('anchorPositionBlock');
    const inlineWasSet = this.hasAttribute('anchorPositionInline');

    if (this.anchorPositionArea && (blockWasSet || inlineWasSet)) {
      this.warnOnce('invalidAnchorPositioning',
        `"anchorPostionArea" cannot be used with "anchorPositionBlock" or "anchorPositionInline" directly.
         "anchorPositionBlock" and "anchorPositionInline" are removed when "anchorPositionArea" is set.`
      );
    }

    if (this.anchorPositionArea) {
      if (!CSS.supports('position-area', this.anchorPositionArea)) {
        this.warnOnce('invalidAnchorPositioning',
          `"anchorPostionArea" value "${this.anchorPositionArea}" is not supported.`
        );
        this.style.removeProperty('position-area');
      } else {
        this.removeAttribute('anchorPositionBlock');
        this.removeAttribute('anchorPositionInline');
        this.style.setProperty('position-area', this.anchorPositionArea as string);
      }
    } 

    if (this.anchorOffsetBlock && this.anchorOffsetBlock != "1rem")
      this.style.setProperty('--ef-anchor-offset-block', this.anchorOffsetBlock as string);

    if (this.anchorOffsetInline && this.anchorOffsetInline != "1rem")
      this.style.setProperty('--ef-anchor-offset-inline', this.anchorOffsetInline as string);
  }
};