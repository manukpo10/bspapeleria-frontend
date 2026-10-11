import { useEffect, useRef, type ReactNode, type RefObject } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// The query also matches elements inside collapsed sections (`hidden`, display: none), which cannot take focus
const isVisible = (el: HTMLElement) => !el.closest('[hidden]') && el.getClientRects().length > 0;

// The page behind the scrim must not scroll while the dialog is open; the previous value is restored on close/unmount
function useBodyScrollLock(open: boolean) {
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);
}

/*
 * A modal has to behave like one: focus moves into it when it opens (to the element marked `data-autofocus`, or the
 * first focusable one), Tab cycles inside it, Escape closes it, and focus goes back to whatever opened it.
 */
function useDialogFocus(open: boolean, panelRef: RefObject<HTMLElement | null>, onClose: () => void) {
  // Kept in a ref so a new onClose on every render does not re-run the effect, which would steal focus
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const panel = panelRef.current;
    if (!open || !panel) return;

    const active = document.activeElement;
    const opener = active instanceof HTMLElement && active !== document.body ? active : null;
    const initial = panel.querySelector<HTMLElement>('[data-autofocus]') ?? panel.querySelector<HTMLElement>(FOCUSABLE);
    initial?.focus({ preventScroll: true });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab') return;

      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(isVisible);
      if (focusable.length === 0) {
        // Nothing to cycle through: keep focus on the panel so Tab cannot reach the page behind
        e.preventDefault();
        panel.focus({ preventScroll: true });
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const current = document.activeElement;

      if (!panel.contains(current) || (e.shiftKey && current === first)) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      } else if (!e.shiftKey && current === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      // The opener can be gone by now, so check before using it
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, [open, panelRef]);
}

interface DialogProps {
  open: boolean;
  onClose: () => void;
  /** id of the element that names the dialog */
  labelledBy: string;
  /** 'center' is a modal; 'left' is a drawer that slides in from the left edge */
  placement?: 'center' | 'left';
  /** Extra classes for the scrim, for example `lg:hidden` for a drawer that only exists on small screens */
  scrimClassName?: string;
  /** Classes for the panel itself */
  className?: string;
  children: ReactNode;
}

export function Dialog({ open, onClose, labelledBy, placement = 'center', scrimClassName, className, children }: DialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  useDialogFocus(open, panelRef, onClose);
  useBodyScrollLock(open);
  const isDrawer = placement === 'left';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="dialog"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          // Only a press on the scrim itself closes it, not one that bubbles up from the panel
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          className={cn(
            'fixed inset-0 z-[60] bg-dark/45 backdrop-blur-sm',
            isDrawer ? 'flex justify-start' : 'flex overflow-y-auto p-4',
            scrimClassName,
          )}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            tabIndex={-1}
            initial={isDrawer ? { x: '-100%' } : { opacity: 0, scale: 0.96, y: 8 }}
            animate={isDrawer ? { x: 0 } : { opacity: 1, scale: 1, y: 0 }}
            exit={isDrawer ? { x: '-100%' } : { opacity: 0, scale: 0.96, y: 8 }}
            transition={isDrawer ? { type: 'spring', damping: 28, stiffness: 240 } : { duration: 0.2 }}
            className={cn(
              // The panel only takes focus from code (see useDialogFocus), so it needs no ring of its own
              'outline-none',
              // m-auto centres the modal and, unlike place-items, never pushes the top of a tall panel out of reach
              isDrawer ? 'flex h-full w-[90vw] max-w-sm flex-col overflow-y-auto bg-white shadow-lift' : 'm-auto w-full max-w-md',
              className,
            )}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
