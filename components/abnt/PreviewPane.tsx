"use client";

import { useRouter } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import { A4Page } from "./A4Page";
import { CapaView } from "./capa/CapaView";
import { FolhaRostoView } from "./folha-rosto/FolhaRostoView";
import { ResumoView } from "./resumo/ResumoView";
import { SumarioView } from "./sumario/SumarioView";
import { ConteudoView } from "./conteudo/ConteudoView";
import { ReferenciasView } from "./referencias/ReferenciasView";
import { useDocumentContext } from "@/context/DocumentContext";
import { exportToPdf } from "@/lib/abnt/exportPdf";
import { IconFileTypePdf, IconShare2, IconCheck, IconTrash, IconMinus, IconPlus } from "@tabler/icons-react";

// A4 page width in px at 96dpi: 21cm ≈ 794px
const A4_PX = 794;

interface Props {
  docId?: string;
}

export const PreviewPane = ({ docId }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pagesRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(0.8);
  const [naturalHeight, setNaturalHeight] = useState(0);
  const [exporting, setExporting] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { syncStatus } = useDocumentContext();
  const router = useRouter();

  // Auto-fit zoom to container width on mount and resize
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const fit = () => {
      const available = el.clientWidth - 40; // 20px padding each side
      const fitted = Math.min(Math.max(available / A4_PX, 0.3), 1.5);
      setZoom(parseFloat(fitted.toFixed(2)));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Track natural height for margin compensation
  useEffect(() => {
    const el = pagesRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setNaturalHeight(el.scrollHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const handleExportPdf = async () => {
    setExporting(true);
    try { await exportToPdf(); }
    finally { setExporting(false); }
  };

  const handleDelete = async () => {
    if (!docId || !confirm("Tem certeza que deseja excluir este documento?")) return;
    setDeleting(true);
    try {
      await fetch(`/api/documents/${docId}`, { method: "DELETE" });
      router.push("/");
    } catch {
      alert("Erro ao excluir documento.");
      setDeleting(false);
    }
  };

  const handleShare = async () => {
    setSharing(true);
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/doc/${docId}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Erro ao copiar link.");
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Toolbar */}
      <div className="h-12 md:h-14 border-b border-neutral-700 bg-neutral-900 flex items-center justify-between px-3 md:px-6 sticky top-0 z-30 shrink-0 gap-2">

        {/* Left: title (hidden on mobile — shown in MobileEditor top bar) */}
        <h2 className="hidden md:block text-sm font-semibold tracking-wider text-neutral-400 uppercase shrink-0">
          Live Preview
        </h2>

        {/* Center: sync status */}
        {syncStatus !== "idle" && (
          <span className={`text-[10px] font-medium shrink-0 ${
            syncStatus === "saving" ? "text-neutral-500" :
            syncStatus === "saved"  ? "text-emerald-500" : "text-red-500"
          }`}>
            {syncStatus === "saving" ? "Salvando..." : syncStatus === "saved" ? "Salvo" : "Erro"}
          </span>
        )}

        <div className="flex items-center gap-1.5 ml-auto">
          {/* Action buttons */}
          <div className="flex items-center gap-1 md:gap-2 pr-2 md:pr-4 border-r border-neutral-700">
            <button
              onClick={handleExportPdf}
              disabled={exporting}
              className="flex items-center gap-1 text-[10px] font-bold uppercase bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white px-2 md:px-3 py-1.5 rounded transition-all disabled:opacity-50"
            >
              <IconFileTypePdf size={13} />
              <span className="hidden sm:inline">{exporting ? "Gerando..." : "PDF"}</span>
            </button>

            <button
              onClick={handleShare}
              disabled={sharing}
              className="flex items-center gap-1 text-[10px] font-bold uppercase bg-emerald-600/10 hover:bg-emerald-600 text-emerald-500 hover:text-white px-2 md:px-3 py-1.5 rounded transition-all disabled:opacity-50"
            >
              {copied ? <IconCheck size={13} /> : <IconShare2 size={13} />}
              <span className="hidden sm:inline">{copied ? "Copiado!" : "Link"}</span>
            </button>

            <button
              onClick={handleDelete}
              disabled={deleting || !docId}
              className="flex items-center gap-1 text-[10px] font-bold uppercase bg-red-900/10 hover:bg-red-700 text-red-500 hover:text-white px-2 md:px-3 py-1.5 rounded transition-all disabled:opacity-50"
            >
              <IconTrash size={13} />
              <span className="hidden sm:inline">{deleting ? "Excluindo..." : "Excluir"}</span>
            </button>
          </div>

          {/* Zoom controls */}
          <button
            className="w-7 h-7 flex items-center justify-center bg-neutral-800 hover:bg-neutral-700 rounded text-neutral-300"
            onClick={() => setZoom(z => parseFloat(Math.max(0.3, z - 0.1).toFixed(2)))}
          >
            <IconMinus size={12} />
          </button>
          <span className="text-[10px] font-mono text-neutral-400 w-8 text-center tabular-nums">
            {Math.round(zoom * 100)}%
          </span>
          <button
            className="w-7 h-7 flex items-center justify-center bg-neutral-800 hover:bg-neutral-700 rounded text-neutral-300"
            onClick={() => setZoom(z => parseFloat(Math.min(1.5, z + 0.1).toFixed(2)))}
          >
            <IconPlus size={12} />
          </button>
        </div>
      </div>

      {/* A4 Container */}
      <div ref={containerRef} className="flex-1 overflow-auto bg-neutral-800/50">
        <div className="flex flex-col items-center py-6 md:py-10">
          <div
            ref={pagesRef}
            className="flex flex-col gap-6 md:gap-10 transition-transform duration-200"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "top center",
              marginBottom: naturalHeight > 0 ? `${naturalHeight * (zoom - 1)}px` : 0,
            }}
          >
            <A4Page><CapaView /></A4Page>
            <A4Page><FolhaRostoView /></A4Page>
            <A4Page><ResumoView /></A4Page>
            <A4Page><SumarioView /></A4Page>
            <ConteudoView />
            <ReferenciasView />
          </div>
        </div>
      </div>
    </div>
  );
};
