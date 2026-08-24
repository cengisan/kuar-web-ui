"use client";

import { useState } from "react";

interface SidebarNavProps {
  categories: string[];
  accentColor: string;
}

export function SidebarNav({ categories, accentColor }: SidebarNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Menüyü aç"
        className="fixed left-4 top-4 z-50 flex flex-col gap-1.5 rounded-xl border bg-white p-3 shadow-sm"
        style={{ borderColor: "#ebe6dd" }}
      >
        <span className="block h-0.5 w-6 rounded-full bg-[#201e1b]" />
        <span className="block h-0.5 w-6 rounded-full bg-[#201e1b]" />
        <span className="block h-0.5 w-6 rounded-full bg-[#201e1b]" />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className="fixed left-0 top-0 z-50 h-full w-72 overflow-y-auto border-r pb-8 pt-6 transition-transform duration-300"
        style={{
          background: "#f4f1ea",
          borderColor: "#ebe6dd",
          transform: open ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        <div className="flex items-center justify-between px-5 pb-4 border-b" style={{ borderColor: "#ebe6dd" }}>
          <span className="font-semibold text-sm tracking-wide" style={{ color: "#8b867e" }}>
            KATEGORİLER
          </span>
          <button
            onClick={() => setOpen(false)}
            className="rounded-full p-1.5 hover:bg-black/5"
            aria-label="Kapat"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#201e1b" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="mt-3 px-2">
          {categories.map((cat) => {
            const key = cat.toLowerCase().replace(/\s/g, "-");
            return (
              <a
                key={cat}
                href={`#cat-${key}`}
                onClick={() => setOpen(false)}
                className="flex w-full items-center rounded-xl px-4 py-3 text-sm font-medium transition-colors hover:bg-white/60"
                style={{ color: "#201e1b" }}
              >
                <span
                  className="mr-3 h-1.5 w-1.5 rounded-full"
                  style={{ background: accentColor }}
                />
                {cat}
              </a>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
