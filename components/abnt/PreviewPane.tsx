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
import { IconFileTypePdf, IconShare2, IconCheck, IconTrash } from "@tabler/icons-react";

interface Props {
  docId?: string;
}

export const PreviewPane = ({ docId }: Props) => {
  const [zoom, setZoom] = useState(0.8);
  const [naturalHeight, setNaturalHeight] = useState(0);
  const pagesRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { syncStatus } = useDocumentContext();
  const router = useRouter();

  // Track natural (unscaled) height of the pages wrapper to compensate for scale()
  useEffect(() => {
    const el = pagesRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setNaturalHeight(el.scrollHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const handleExportPdf = async () => {
    setExporting(true);
    try {
      await exportToPdf();
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = async () => {
    if (!docId || !confirm("Tem certeza que deseja excluir este documento? Esta ação não pode ser desfeita.")) return;
    setDeleting(true);
    try {
      await fetch(`/api/documents/${docId}`, { method: "DELETE" });
      router.push("/");
    } catch {
      alert("Erro ao excluir documento.");
      setDeleting(false);
    }
  };

  const handleShare = async () => {    setSharing(true);
    try {
      const url = `${window.location.origin}/doc/${docId}`;
      await navigator.clipboard.writeText(url);
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
      <div className="h-14 border-b border-neutral-700 bg-neutral-900 flex items-center justify-between px-6 sticky top-0 z-30 shrink-0">
        <h2 className="text-sm font-semibold tracking-wider text-neutral-400 uppercase">Live Preview</h2>

        {/* Sync status indicator — only visible when document is shared */}
        {syncStatus !== "idle" && (
          <span className={`text-[10px] font-medium transition-all ${
            syncStatus === "saving" ? "text-neutral-500" :
            syncStatus === "saved"  ? "text-emerald-500" :
            "text-red-500"
          }`}>
            {syncStatus === "saving" ? "Salvando..." : syncStatus === "saved" ? "Salvo" : "Erro ao salvar"}
          </span>
        )}

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 mr-4 border-r border-neutral-700 pr-4">
            <button
              onClick={handleExportPdf}
              disabled={exporting}
              className="flex items-center gap-1.5 text-[10px] font-bold uppercase bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white px-3 py-1.5 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <IconFileTypePdf size={14} /> {exporting ? "Gerando..." : "PDF"}
            </button>

            <button
              onClick={handleShare}
              disabled={sharing}
              className="flex items-center gap-1.5 text-[10px] font-bold uppercase bg-emerald-600/10 hover:bg-emerald-600 text-emerald-500 hover:text-white px-3 py-1.5 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {copied ? <IconCheck size={14} /> : <IconShare2 size={14} />}
              {copied ? "Copiado!" : sharing ? "Salvando..." : "Compartilhar"}
            </button>

            <button
              onClick={handleDelete}
              disabled={deleting || !docId}
              className="flex items-center gap-1.5 text-[10px] font-bold uppercase bg-red-900/10 hover:bg-red-700 text-red-500 hover:text-white px-3 py-1.5 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <IconTrash size={14} />
              {deleting ? "Excluindo..." : "Excluir"}
            </button>
          </div>

          <button
            className="text-xs bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 rounded text-neutral-300"
            onClick={() => setZoom(z => Math.max(0.4, z - 0.1))}
          >
            Zoom Out
          </button>
          <span className="text-xs font-mono text-neutral-400 w-10 text-center">{(zoom * 100).toFixed(0)}%</span>
          <button
            className="text-xs bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 rounded text-neutral-300"
            onClick={() => setZoom(z => Math.min(1.5, z + 0.1))}
          >
            Zoom In
          </button>
        </div>
      </div>

      {/* A4 Container */}
      <div className="flex-1 overflow-auto bg-neutral-800/50">
        <div className="flex flex-col items-center py-10">
          <div
            ref={pagesRef}
            className="flex flex-col gap-10 transition-transform duration-200"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "top center",
              marginBottom: naturalHeight > 0 ? `${naturalHeight * (zoom - 1)}px` : 0,
            }}
          >
          <A4Page>
            <CapaView />
          </A4Page>

          <A4Page>
            <FolhaRostoView />
          </A4Page>

          <A4Page>
            <ResumoView />
          </A4Page>

          <A4Page>
            <SumarioView />
          </A4Page>

          <ConteudoView />

          <ReferenciasView />
          </div>
        </div>
      </div>
    </div>
  );
};
