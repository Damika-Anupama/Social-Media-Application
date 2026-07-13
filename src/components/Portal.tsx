'use client';

import { createPortal } from 'react-dom';

/**
 * Renders children at the end of <body>.
 *
 * Dialogs declared inside a page are nested in the dashboard layout's
 * `relative z-10` wrapper. z-index only competes *within* a stacking context,
 * so a dialog's z-50 is scoped to that z-10 box — and the mobile tab bar, a
 * sibling of the wrapper at z-40, painted straight over the top of it. On a
 * phone that meant the Save button of the edit-profile dialog was underneath
 * the tab bar and could not be tapped at all: you could not save your profile.
 *
 * Raising the z-index cannot fix that; the dialog has to leave the box. Only a
 * real iPhone run found it — every desktop viewport hides the tab bar entirely.
 */
export function Portal({ children }: { children: React.ReactNode }) {
  // Render into the DOM in the same commit, not after a mount effect.
  //
  // Deferring behind a `mounted` state flag means the dialog's element does not
  // exist yet when its owner's effects run — so useDialog captured a null ref
  // and the focus trap was silently inert. These dialogs only ever open in
  // response to a click, so there is no server render to protect against; the
  // document is always there.
  if (typeof document === 'undefined') return null;
  return createPortal(children, document.body);
}
