"use client";

import { useEffect } from "react";

export function PdfViewerModal({ url, title, onClose }: { url: string; title: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[120] flex flex-col p-3 md:p-8">
      <div onClick={onClose} aria-hidden className="absolute inset-0 bg-charcoal/70 backdrop-blur-sm" />

      <div role="dialog" aria-modal="true" aria-label={title} className="relative z-10 mx-auto flex h-full w-full max-w-4xl flex-col overflow-hidden rounded-lg bg-ivory shadow-2xl">
        <div className="flex items-center justify-between border-b border-stone px-5 py-3">
          <p className="truncate text-sm font-semibold text-charcoal">{title}</p>
          <div className="flex items-center gap-1">
            <a href={url} download aria-label="Download PDF" className="flex h-9 w-9 items-center justify-center rounded-full text-charcoal/60 transition hover:bg-ivory-soft hover:text-charcoal">
              <i className="ri-download-line" />
            </a>
            <a href={url} target="_blank" rel="noopener" aria-label="Open in new tab" className="flex h-9 w-9 items-center justify-center rounded-full text-charcoal/60 transition hover:bg-ivory-soft hover:text-charcoal">
              <i className="ri-external-link-line" />
            </a>
            <button type="button" onClick={onClose} aria-label="Close" className="flex h-9 w-9 items-center justify-center rounded-full text-charcoal/60 transition hover:bg-ivory-soft hover:text-charcoal">
              <i className="ri-close-line" />
            </button>
          </div>
        </div>
        <iframe src={url} title={title} className="w-full flex-1 bg-white" />
      </div>
    </div>
  );
}
