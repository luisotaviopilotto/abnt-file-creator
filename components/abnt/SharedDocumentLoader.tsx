"use client";

import { useEffect, useRef } from "react";
import { useDocumentContext } from "@/context/DocumentContext";

interface Props {
  docId: string;
}

export function SharedDocumentLoader({ docId }: Props) {
  const { importConfig, setDocId } = useDocumentContext();
  const loaded = useRef(false);

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
      })
      .catch(() => alert("Documento não encontrado ou link inválido."));
  }, [docId, importConfig, setDocId]);

  return null;
}
