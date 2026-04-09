"use client";

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { IconLayoutSidebar, IconX, IconEye } from "@tabler/icons-react";

interface Props {
  docId: string;
  children: React.ReactNode; // PreviewPane
}

export function MobileEditor({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [view, setView] = useState<"preview" | "editor">("preview");

  return (
    <>
      {/* ── DESKTOP: two-column layout ── */}
      <main className="hidden md:flex h-screen w-full">
        <div className="w-[400px] flex-shrink-0 bg-neutral-950 border-r border-neutral-800 overflow-y-auto">
          <Sidebar />
        </div>
        <div id="preview-desktop" className="flex-1 bg-neutral-800 overflow-y-auto relative">
          {children}
        </div>
      </main>

      {/* ── MOBILE: stacked layout with tab switcher ── */}
      <main className="flex md:hidden flex-col h-screen w-full overflow-hidden">

        {/* Mobile top bar */}
        <div className="h-12 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between px-4 shrink-0 z-20">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 bg-blue-600 rounded-sm" />
            <span className="text-sm font-bold text-white tracking-tight">ABNT_GEN</span>
          </div>

          {/* Tab switcher */}
          <div className="flex items-center bg-neutral-900 rounded-lg p-0.5 gap-0.5">
            <button
              onClick={() => setView("preview")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                view === "preview"
                  ? "bg-neutral-700 text-white"
                  : "text-neutral-400"
              }`}
            >
              <IconEye size={13} /> Preview
            </button>
            <button
              onClick={() => setView("editor")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                view === "editor"
                  ? "bg-neutral-700 text-white"
                  : "text-neutral-400"
              }`}
            >
              <IconLayoutSidebar size={13} /> Editor
            </button>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-hidden relative">
          {/* Preview */}
          <div id="preview-mobile" className={`absolute inset-0 transition-opacity duration-200 ${view === "preview" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
            {children}
          </div>

          {/* Editor / Sidebar */}
          <div className={`absolute inset-0 bg-neutral-950 overflow-y-auto transition-opacity duration-200 ${view === "editor" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
            <Sidebar />
          </div>
        </div>
      </main>

      {/* Overlay for sidebar on mobile (unused but kept for future drawer pattern) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}
