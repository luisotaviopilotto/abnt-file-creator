"use client";

import React from "react";
import { useDocumentContext } from "@/context/DocumentContext";

export const TitlePageForm = () => {
  const { state, updateTitlePage } = useDocumentContext();
  const { titlePage } = state;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateTitlePage({ [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-4">
      <div className="p-3 bg-blue-900/10 border border-blue-900/30 rounded-md mb-6">
        <p className="text-[10px] text-blue-400 leading-relaxed uppercase font-bold tracking-wider">
          Informação Sincronizada
        </p>
        <p className="text-[11px] text-neutral-400 mt-1">
          Autor, Título, Subtítulo, Cidade e Ano são herdados automaticamente da aba <strong>Capa</strong>.
        </p>
      </div>

      <h3 className="text-sm font-semibold text-white mb-4">Dados Específicos (Rosto)</h3>

      <div>
        <label className="block text-xs font-medium text-neutral-400 mb-1 uppercase tracking-tight">
          Objetivo / Natureza do Trabalho
        </label>
        <textarea
          name="objective"
          value={titlePage.objective}
          onChange={handleChange}
          rows={5}
          className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2 text-sm text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
          placeholder="Ex: Trabalho de Conclusão de Curso apresentado ao..."
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-neutral-400 mb-1 uppercase tracking-tight">
          Nome do Orientador
        </label>
        <input
          type="text"
          name="advisor"
          value={titlePage.advisor}
          onChange={handleChange}
          className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2 text-sm text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
          placeholder="Ex: Prof. Dr. Fulano de Tal"
        />
      </div>
    </div>
  );
};
