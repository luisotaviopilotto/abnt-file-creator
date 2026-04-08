"use client";

import React, { useState } from "react";
import { A4Page } from "./A4Page";
import { CapaView } from "./capa/CapaView";
import { FolhaRostoView } from "./folha-rosto/FolhaRostoView";
import { ResumoView } from "./resumo/ResumoView";
import { SumarioView } from "./sumario/SumarioView";
import { ConteudoView } from "./conteudo/ConteudoView";
import { ReferenciasView } from "./referencias/ReferenciasView";
import { useDocumentContext } from "@/context/DocumentContext";
import { exportToPdf } from "@/lib/abnt/exportPdf";
import { IconFileTypePdf, IconShare2, IconCheck } from "@tabler/icons-react";

interface Props {
  docId?: string;
}

export const PreviewPane = ({ docId }: Props) => {
  const [zoom, setZoom] = useState(0.8);
  const [exporting, setExporting] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [copied, setCopied] = useState(false);
  const { state, setDocId } = useDocumentContext();

  const handleExportPdf = async () => {
    setExporting(true);
    try {
      await exportToPdf();
    } finally {
      setExporting(false);
    }
  };

  const handleShare = async () => {
    setSharing(true);
    try {
      // If already shared, just copy the current link
      const existingId = docId;
      if (existingId) {
        const url = `${window.location.origin}/doc/${existingId}`;
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
      }

      // Create new shared document
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });
      const { id } = await res.json();
      setDocId(id);

      const url = `${window.location.origin}/doc/${id}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

      // Update the browser URL without a full navigation
      window.history.replaceState(null, "", `/doc/${id}`);
    } catch (err) {
      console.error(err);
      alert("Erro ao compartilhar documento.");
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Toolbar */}
      <div className="h-14 border-b border-neutral-700 bg-neutral-900 flex items-center justify-between px-6 sticky top-0 z-30 shrink-0">
        <h2 className="text-sm font-semibold tracking-wider text-neutral-400 uppercase">Live Preview</h2>

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
      <div className="flex-1 overflow-auto bg-neutral-800/50 p-10 flex flex-col items-center">
        <div
          className="flex flex-col gap-10 origin-top transition-transform duration-200"
          style={{ transform: `scale(${zoom})` }}
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
  );
};
