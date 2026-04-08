"use client";

import React from "react";
import { useDocumentContext } from "@/context/DocumentContext";

export const CoverForm = () => {
  const { state, updateCover } = useDocumentContext();
  const { cover } = state;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateCover({ [e.target.name]: e.target.value });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      updateCover({ logoUrl: result });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Dados da Capa</h3>

      {/* Logo Section */}
      <div className="p-4 bg-neutral-900/50 border border-neutral-800 rounded-lg space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-neutral-300 uppercase">Incluir Logo</label>
          <button
            onClick={() => updateCover({ showLogo: !cover.showLogo })}
            className={`w-10 h-5 rounded-full transition-colors relative ${cover.showLogo ? 'bg-blue-600' : 'bg-neutral-700'}`}
          >
            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${cover.showLogo ? 'left-6' : 'left-1'}`}></div>
          </button>
        </div>

        {cover.showLogo && (
          <>
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-neutral-500 uppercase">Upload ou URL</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <button className="w-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[10px] font-bold py-2 rounded border border-neutral-700 uppercase">
                    Upload
                  </button>
                </div>
                <input
                  type="text"
                  name="logoUrl"
                  value={cover.logoUrl?.startsWith('data:') ? 'Imagem carregada' : (cover.logoUrl || "")}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="flex-[2] bg-neutral-950 border border-neutral-700 rounded-md px-3 py-1.5 text-xs text-white outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-neutral-500 mb-1 uppercase">Alinhamento</label>
              <div className="grid grid-cols-3 gap-1">
                {(['left', 'center', 'right'] as const).map((pos) => (
                  <button
                    key={pos}
                    type="button"
                    onClick={() => updateCover({ logoPosition: pos })}
                    className={`py-1 text-[10px] uppercase font-bold rounded border ${
                      cover.logoPosition === pos 
                        ? 'bg-blue-600 border-blue-500 text-white' 
                        : 'bg-neutral-950 border-neutral-700 text-neutral-500 hover:text-neutral-300'
                    }`}
                  >
                    {pos === 'left' ? 'Esq' : pos === 'center' ? 'Centro' : 'Dir'}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {[
        { name: "institution", label: "Instituição" },
        { name: "course", label: "Curso" },
        { name: "author", label: "Autor(es)", type: "textarea" },
        { name: "title", label: "Título do Trabalho" },
        { name: "subtitle", label: "Subtítulo (Opcional)" },
        { name: "city", label: "Cidade" },
        { name: "year", label: "Ano" },
      ].map((field) => (
        <div key={field.name}>
          <label className="block text-xs font-medium text-neutral-400 mb-1">
            {field.label}
          </label>
          {field.type === "textarea" ? (
            <textarea
              name={field.name}
              value={(cover[field.name as keyof typeof cover] as string) || ""}
              onChange={handleChange}
              rows={3}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2 text-sm text-white placeholder-neutral-600 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
              placeholder="Insira um autor por linha"
            />
          ) : (
            <input
              type="text"
              name={field.name}
              value={(cover[field.name as keyof typeof cover] as string) || ""}
              onChange={handleChange}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2 text-sm text-white placeholder-neutral-600 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder={`Insira ${field.label.toLowerCase()}`}
            />
          )}
        </div>
      ))}
    </div>
  );
};
