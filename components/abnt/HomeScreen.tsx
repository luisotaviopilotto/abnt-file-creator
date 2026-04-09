"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { IconFilePlus, IconFileUpload, IconLoader2 } from "@tabler/icons-react";
import { DocumentState } from "@/types/abnt";

const initialState: DocumentState = {
  cover: {
    institution: "NOME DA INSTITUIÇÃO",
    course: "NOME DO CURSO",
    author: "NOME DO AUTOR",
    title: "TÍTULO DO TRABALHO",
    subtitle: "",
    city: "Cidade",
    year: new Date().getFullYear().toString(),
    showLogo: false,
    logoUrl: "",
    logoPosition: "center",
  },
  titlePage: {
    author: "NOME DO AUTOR",
    title: "TÍTULO DO TRABALHO",
    subtitle: "",
    objective:
      "Trabalho de Conclusão de Curso apresentado ao [Curso] da [Instituição], como requisito parcial para obtenção do título de [Título].",
    advisor: "Orientador: Prof. Dr. Nome do Orientador",
    city: "Cidade",
    year: new Date().getFullYear().toString(),
  },
  abstract: { text: "", keywords: "" },
  content: [],
  references: [],
  settings: { fontFamily: "Arial" },
};

async function createDocument(state: DocumentState): Promise<string> {
  const res = await fetch("/api/documents", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(state),
  });
  if (!res.ok) throw new Error(await res.text());
  const { id } = await res.json();
  return id;
}

export function HomeScreen() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<"new" | "import" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleNew = async () => {
    setLoading("new");
    setError(null);
    try {
      const id = await createDocument(initialState);
      router.push(`/doc/${id}`);
    } catch {
      setError("Erro ao criar documento. Tente novamente.");
      setLoading(null);
    }
  };

  const handleImport = () => fileRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading("import");
    setError(null);
    try {
      const text = await file.text();
      const state: DocumentState = JSON.parse(text);
      const id = await createDocument(state);
      router.push(`/doc/${id}`);
    } catch {
      setError("Arquivo inválido. Certifique-se de usar um ABNT_CONFIG.json válido.");
      setLoading(null);
    }
    e.target.value = "";
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-8">
      <div className="mb-12 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="w-6 h-6 bg-blue-600 rounded-md inline-block" />
          <h1 className="text-3xl font-bold tracking-tight text-white">ABNT_GEN</h1>
        </div>
        <p className="text-neutral-400 text-sm">Automação de Trabalhos Acadêmicos</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <button
          onClick={handleNew}
          disabled={loading !== null}
          className="flex-1 flex flex-col items-center gap-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-600 rounded-xl p-8 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {loading === "new" ? (
            <IconLoader2 size={32} className="text-blue-500 animate-spin" />
          ) : (
            <IconFilePlus size={32} className="text-blue-500 group-hover:scale-110 transition-transform" />
          )}
          <span className="text-sm font-semibold text-white">Novo Documento</span>
          <span className="text-xs text-neutral-500 text-center">Começa com um documento em branco</span>
        </button>

        <button
          onClick={handleImport}
          disabled={loading !== null}
          className="flex-1 flex flex-col items-center gap-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-600 rounded-xl p-8 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {loading === "import" ? (
            <IconLoader2 size={32} className="text-emerald-500 animate-spin" />
          ) : (
            <IconFileUpload size={32} className="text-emerald-500 group-hover:scale-110 transition-transform" />
          )}
          <span className="text-sm font-semibold text-white">Importar JSON</span>
          <span className="text-xs text-neutral-500 text-center">Carrega um ABNT_CONFIG.json existente</span>
        </button>
      </div>

      {error && (
        <p className="mt-6 text-sm text-red-400 bg-red-900/20 border border-red-800 rounded-lg px-4 py-2">
          {error}
        </p>
      )}

      <input
        ref={fileRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
