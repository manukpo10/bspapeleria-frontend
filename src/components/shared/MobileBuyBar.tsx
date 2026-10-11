import { useEffect, useState, type ReactNode } from 'react';
import { cn } from '../../lib/utils';

/** Bottom padding that keeps the end of a page clear of the bar: its height plus a little air and the safe area */
export const mobileBuyBarClearance = 'max-lg:pb-[calc(6.75rem+env(safe-area-inset-bottom))]';

interface MobileBuyBarProps {
  /** The page's own main call to action. The bar is shown while that element is out of view */
  watch: HTMLElement | null;
  /** The same main action as the page's: a button or link that fills its slot */
  action: ReactNode;
  /** Price (and compare price) beside the button. Leave it out to give the whole bar to the button */
  price?: ReactNode;
}

// The sticky header (h-20 plus its border) covers the top of the viewport: a button under it is not on screen
const HEADER_MARGIN = '-81px 0px 0px 0px';

/** Calls `onChange` with whether any part of `target` is inside the viewport; returns the cleanup */
function observeVisibility(target: Element, onChange: (visible: boolean) => void, rootMargin?: string) {
  const observer = new IntersectionObserver((entries) => onChange(entries[entries.length - 1].isIntersecting), {
    rootMargin,
  });
  observer.observe(target);
  return () => observer.disconnect();
}

/*
 * Buy bar fixed to the bottom of phones and tablets (below lg). It slides in once the page's main call to action
 * scrolls out of view and slides out again when that button is back on screen or the footer comes into view.
 * Its z-index stays under the header (z-50), the mobile menu scrim (z-40) and every dialog or drawer (z-60 and up).
 */
export function MobileBuyBar({ watch, action, price }: MobileBuyBarProps) {
  // Assume the button is on screen until the observer says otherwise, so the bar does not flash in on load
  const [watchVisible, setWatchVisible] = useState(true);
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => (watch ? observeVisibility(watch, setWatchVisible, HEADER_MARGIN) : undefined), [watch]);

  useEffect(() => {
    // The site footer is the sibling that follows <main> in MainLayout
    const footer = document.querySelector('main ~ footer');
    return footer ? observeVisibility(footer, setFooterVisible) : undefined;
  }, []);

  const visible = watch !== null && !watchVisible && !footerVisible;

  return (
    // inert keeps the hidden bar out of the tab order and out of the accessibility tree
    <div
      inert={!visible}
      className={cn(
        'fixed inset-x-0 bottom-0 z-30 border-t border-sand/70 bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-12px_32px_-16px_rgb(111_79_216/0.25)] transition-[translate,opacity] duration-300 ease-out motion-reduce:transition-none lg:hidden',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0',
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
        {price && <div className="shrink-0">{price}</div>}
        {/* On tablets the button keeps a sensible width instead of stretching across the whole row */}
        <div className="min-w-0 flex-1 sm:ml-auto sm:max-w-xs">{action}</div>
      </div>
    </div>
  );
}
