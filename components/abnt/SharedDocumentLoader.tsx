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
  const [error, setError] = useState(false);

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
        // Mark as loaded AFTER state is set — auto-save only fires after this point
        setTimeout(() => markLoadedFromDb(), 0);
      })
      .catch(() => setError(true));
  }, [docId, importConfig, setDocId]);

  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950">
        <div className="text-center">
          <p className="text-red-400 font-medium mb-4">Documento não encontrado.</p>
          <a href="/" className="text-sm text-blue-400 hover:underline">Voltar ao início</a>
        </div>
      </div>
    );
  }

  return null;
}
