"use client";

import React, { useState } from "react";
import { useDocumentContext } from "@/context/DocumentContext";
import { CoverForm } from "./capa/CoverForm";
import { TitlePageForm } from "./folha-rosto/TitlePageForm";
import { AbstractForm } from "./resumo/AbstractForm";
import { ContentEditor } from "./conteudo/ContentEditor";
import { ReferencesForm } from "./referencias/ReferencesForm";

type Tab = "capa" | "rosto" | "resumo" | "conteudo" | "referencias" | "config";

export const Sidebar = () => {
  const [activeTab, setActiveTab] = useState<Tab>("capa");
  const { state, updateSettings, exportConfig, importConfig, resetToDefault } = useDocumentContext();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      importConfig(content);
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = "";
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "capa", label: "Capa" },
    { id: "rosto", label: "Folha de Rosto" },
    { id: "resumo", label: "Resumo" },
    { id: "conteudo", label: "Conteúdo" },
    { id: "referencias", label: "Referências" },
    { id: "config", label: "Ajustes" },
  ];

  return (
    <div className="flex flex-col h-full bg-neutral-950 border-r border-neutral-800 text-neutral-200">
      {/* ... header and tabs ... */}
      <div className="p-6 border-b border-neutral-800">
        <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
          <span className="w-4 h-4 bg-blue-600 rounded-sm inline-block"></span>
          ABNT_GEN
        </h1>
        <p className="text-xs text-neutral-500 mt-1">Automação de Trabalhos Acadêmicos</p>
      </div>

      <div className="flex flex-wrap gap-1 p-4 border-b border-neutral-800 bg-neutral-900/50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === tab.id
                ? "bg-neutral-800 text-white shadow-sm"
                : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-neutral-700">
        {activeTab === "capa" && <CoverForm />}
        {activeTab === "rosto" && <TitlePageForm />}
        {activeTab === "resumo" && <AbstractForm />}
        {activeTab === "conteudo" && <ContentEditor />}
        {activeTab === "referencias" && <ReferencesForm />}
        {activeTab === "config" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-white mb-4">Configurações Globais</h3>
              <label className="block text-xs font-medium text-neutral-400 mb-1">
                Fonte Principal
              </label>
              <select
                value={state.settings.fontFamily}
                onChange={(e) => updateSettings({ fontFamily: e.target.value as "Arial" | "Times New Roman" })}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2 text-sm text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="Arial">Arial</option>
                <option value="Times New Roman">Times New Roman</option>
              </select>
            </div>

            <div className="pt-6 border-t border-neutral-800 space-y-3">
              <h3 className="text-sm font-semibold text-white mb-2">Gerenciamento de Dados</h3>
              <p className="text-xs text-neutral-500 mb-4">
                As alterações são salvas automaticamente. Use as opções abaixo para mover seus dados.
              </p>
              
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={exportConfig}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium py-2 rounded-md transition-colors"
                >
                  Exportar ABNT_CONFIG.JSON
                </button>
                
                <div className="relative">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <button className="w-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium py-2 rounded-md border border-neutral-700 transition-colors">
                    Importar Configuração
                  </button>
                </div>

                <button
                  onClick={resetToDefault}
                  className="w-full bg-transparent hover:bg-red-900/20 text-red-500 text-[10px] uppercase font-bold tracking-wider py-2 mt-4 transition-colors"
                >
                  Resetar Documento
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
