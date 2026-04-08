// app/components/Sidebar.tsx
"use client";

import { useState } from "react";
import { DocumentData } from "../types";
import CoverConfig from "./CoverConfig";
import TitlePageConfig from "./TitlePageConfig";
import AbstractConfig from "./AbstractConfig";
import ContentEditor from "./ContentEditor";
import ReferencesConfig from "./ReferencesConfig";
import SettingsConfig from "./SettingsConfig";

interface SidebarProps {
  documentData: DocumentData;
  setDocumentData: (data: DocumentData) => void;
}

const sidebarSections = [
  { id: "cover", label: "Capa", component: CoverConfig },
  { id: "titlePage", label: "Folha de Rosto", component: TitlePageConfig },
  { id: "abstract", label: "Resumo", component: AbstractConfig },
  { id: "content", label: "Conteúdo", component: ContentEditor },
  { id: "references", label: "Referências", component: ReferencesConfig },
  { id: "settings", label: "Configurações", component: SettingsConfig },
];

export default function Sidebar({ documentData, setDocumentData }: SidebarProps) {
  const [activeSection, setActiveSection] = useState("cover");

  const ActiveComponent = sidebarSections.find(
    (section) => section.id === activeSection
  )?.component;

  return (
    <div className="w-96 bg-white shadow-lg flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-gray-800">
          Configuração ABNT
        </h2>
      </div>
      
      <div className="flex-1 flex">
        <div className="w-48 bg-gray-50 border-r">
          {sidebarSections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full text-left p-3 hover:bg-gray-100 transition-colors ${
                activeSection === section.id
                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                  : "text-gray-700"
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto">
          {ActiveComponent && (
            <ActiveComponent
              data={documentData}
              setData={setDocumentData}
            />
          )}
        </div>
      </div>
    </div>
  );
}