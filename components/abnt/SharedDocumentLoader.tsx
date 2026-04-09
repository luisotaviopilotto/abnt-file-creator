"use client";

import { useEffect, useRef, useState } from "react";
import { useDocumentContext } from "@/context/DocumentContext";
import { IconLoader2 } from "@tabler/icons-react";

interface Props {
  docId: string;
}

export function SharedDocumentLoader({ docId }: Props) {
  const { importConfig, setDocId, markLoadedFromDb } = useDocumentContext();
  const loaded = useRef(false);
  const [status, setStatus] = useState<"loading" | "done" | "error">("loading");

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;

    fetch(`/api/documents/${docId}`)
      .then((r) => {
        if (!r.ok) throw new Error("not found");
        return r.json();
      })
      .then((state) => {
        importConfig(JSON.stringify(state));
        setDocId(docId);
        setTimeout(() => {
          markLoadedFromDb();
          setStatus("done");
        }, 0);
      })
      .catch(() => setStatus("error"));
  }, [docId, importConfig, setDocId, markLoadedFromDb]);

  if (status === "error") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950">
        <div className="text-center">
          <p className="text-red-400 font-medium mb-4">Documento não encontrado.</p>
          <a href="/" className="text-sm text-blue-400 hover:underline">Voltar ao início</a>
        </div>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-neutral-950 gap-4">
        <IconLoader2 size={36} className="text-blue-500 animate-spin" />
        <p className="text-sm text-neutral-400">Carregando documento...</p>
      </div>
    );
  }

  return null;
}
