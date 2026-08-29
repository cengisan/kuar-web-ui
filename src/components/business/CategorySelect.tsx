"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";
import {
  filterCategoryGroups,
  getCategoryLabel,
  getSortedCategoryGroups,
  type ProductLanguage,
} from "@/config/productCategories";

export interface CategorySelectProps {
  id?: string;
  value: string;
  onChange: (categoryId: string) => void;
  language: ProductLanguage;
  placeholder: string;
  searchPlaceholder: string;
  noResultsText: string;
}

export function CategorySelect({
  id,
  value,
  onChange,
  language,
  placeholder,
  searchPlaceholder,
  noResultsText,
}: CategorySelectProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const allGroups = useMemo(
    () => getSortedCategoryGroups(language),
    [language]
  );

  const filteredGroups = useMemo(
    () => filterCategoryGroups(allGroups, searchQuery),
    [allGroups, searchQuery]
  );

  const selectedLabel = value ? getCategoryLabel(value, language) : "";

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  useEffect(() => {
    if (open) {
      setSearchQuery("");
      requestAnimationFrame(() => searchInputRef.current?.focus());
    }
  }, [open]);

  const handleSelect = (categoryId: string) => {
    onChange(categoryId);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-lg border border-[var(--border)] bg-card px-3 py-2 text-sm text-foreground",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
        )}
      >
        <span className={cn("line-clamp-1 text-left", !selectedLabel && "text-[var(--muted-foreground)]")}>
          {selectedLabel || placeholder}
        </span>
        <ChevronDown className={cn("size-4 shrink-0 opacity-60 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border border-[var(--border)] bg-card text-foreground shadow-md">
          <div className="border-b border-[var(--border)] p-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="h-9 pl-8"
                aria-label={searchPlaceholder}
              />
            </div>
          </div>

          <div
            role="listbox"
            className="max-h-64 overflow-y-auto p-1"
          >
            {filteredGroups.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                {noResultsText}
              </p>
            ) : (
              filteredGroups.map((group) => (
                <div key={group.title}>
                  <div className="px-2 py-1.5 text-sm font-semibold text-foreground">
                    {group.title}
                  </div>
                  {group.items.map((item) => {
                    const isSelected = item.id === value;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => handleSelect(item.id)}
                        className={cn(
                          "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
                          "hover:bg-[var(--muted)] focus:bg-[var(--muted)]",
                          isSelected && "bg-[var(--muted)]"
                        )}
                      >
                        {isSelected && (
                          <span className="absolute left-2 flex size-3.5 items-center justify-center">
                            <Check className="size-4" />
                          </span>
                        )}
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
