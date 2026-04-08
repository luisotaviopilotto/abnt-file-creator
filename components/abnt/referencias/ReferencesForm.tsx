"use client";

import React from "react";
import { useDocumentContext } from "@/context/DocumentContext";
import { IconPlus, IconTrash, IconBooks } from "@tabler/icons-react";

export const ReferencesForm = () => {
  const { state, addReference, updateReference, removeReference } = useDocumentContext();
  const { references } = state;

  const handleAdd = () => {
    addReference({
      id: crypto.randomUUID(),
      text: "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Referências</h3>
        <button 
          onClick={handleAdd}
          className="text-[10px] bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded flex items-center gap-1 uppercase font-bold transition-colors"
        >
          <IconPlus size={12} /> Adicionar
        </button>
      </div>

      <div className="space-y-4">
        {references.map((ref, index) => (
          <div key={ref.id} className="p-3 bg-neutral-900 border border-neutral-800 rounded-lg group">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-1">
                <IconBooks size={12} /> Referência {index + 1}
              </span>
              <button 
                onClick={() => removeReference(ref.id)}
                className="p-1 text-neutral-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <IconTrash size={14} />
              </button>
            </div>
            <textarea
              value={ref.text}
              onChange={(e) => {
                updateReference(ref.id, e.target.value);
              }}
              className="w-full bg-neutral-950/50 border border-neutral-800 rounded px-3 py-2 text-sm text-white outline-none focus:border-blue-500/50 resize-none placeholder-neutral-700 min-h-[80px]"
              placeholder="SOBRENOME, Nome. Título do livro: subtítulo. Edição. Local: Editora, ano."
            />
          </div>
        ))}

        {references.length === 0 && (
          <div className="text-center p-8 border-2 border-dashed border-neutral-800 rounded-xl text-neutral-500 text-xs">
            Nenhuma referência adicionada.
          </div>
        )}
      </div>
    </div>
  );
};
