import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

/**
 * Shell de modal responsive: bottom sheet en móvil, tarjeta centrada en desktop.
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  headerActions,
  children,
  footer,
  maxWidth = "sm:max-w-lg",
  bodyClassName = "",
}) {
  const panelRef = useRef(null);
  const lastFocusedRef = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    lastFocusedRef.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      panelRef.current?.focus({ preventScroll: true });
    }, 0);

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      if (lastFocusedRef.current instanceof HTMLElement) {
        lastFocusedRef.current.focus({ preventScroll: true });
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center overflow-hidden bg-stone-950/45 px-0 pt-[max(0.5rem,env(safe-area-inset-top))] backdrop-blur-[2px] animate-fade-in sm:items-center sm:p-4 print:static print:block print:bg-white print:p-0"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={`animate-sheet-in flex max-h-[calc(100dvh-0.5rem-env(safe-area-inset-top))] w-full flex-col overflow-hidden rounded-t-[28px] border border-stone-200 bg-white shadow-2xl outline-none sm:max-h-[92vh] sm:rounded-3xl print:max-h-none print:w-full print:rounded-none print:border-0 print:shadow-none ${maxWidth}`}
      >
        <div className="mx-auto mt-2 h-1 w-9 shrink-0 rounded-full bg-stone-200 sm:hidden" />
        <div className="flex items-center justify-between gap-3 border-b border-stone-100 px-4 pb-3 pt-2 sm:px-5 sm:py-4 print:hidden">
          <div className="flex min-w-0 items-center gap-3">
            {icon ? (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-amber-200/70 bg-amber-100 text-stone-900">
                {icon}
              </div>
            ) : null}
            <div className="min-w-0">
              <h2 className="truncate text-[15px] font-bold leading-tight text-stone-900 sm:text-base">
                {title}
              </h2>
              {subtitle ? (
                <p className="mt-0.5 truncate text-[11px] text-stone-500 sm:text-xs">{subtitle}</p>
              ) : null}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            {headerActions}
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="-mr-1 flex h-10 w-10 items-center justify-center rounded-full text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className={`flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-5 sm:py-5 print:overflow-visible print:p-0 ${bodyClassName}`}>
          {children}
        </div>

        {footer ? (
          <div className="border-t border-stone-100 bg-white px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 sm:px-5 sm:pb-4 print:hidden">
            {footer}
          </div>
        ) : (
          <div className="pb-[env(safe-area-inset-bottom)] sm:hidden" />
        )}
      </div>
    </div>
  );
}
