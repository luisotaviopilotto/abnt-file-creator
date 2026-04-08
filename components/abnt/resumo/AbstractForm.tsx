"use client";

import React from "react";
import { useDocumentContext } from "@/context/DocumentContext";

export const AbstractForm = () => {
  const { state, updateAbstract } = useDocumentContext();
  const { abstract } = state;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    updateAbstract({ [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-white mb-4">Resumo</h3>

      <div>
        <label className="block text-xs font-medium text-neutral-400 mb-1">
          Texto do Resumo (100 a 500 palavras)
        </label>
        <textarea
          name="text"
          value={abstract.text}
          onChange={handleChange}
          rows={10}
          className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2 text-sm text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-justify"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-neutral-400 mb-1">
          Palavras-chave (separadas por ponto e vírgula)
        </label>
        <input
          type="text"
          name="keywords"
          value={abstract.keywords}
          onChange={handleChange}
          className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2 text-sm text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
          placeholder="Ex: Sustentabilidade; Meio ambiente; Economia."
        />
      </div>
    </div>
  );
};
