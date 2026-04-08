"use client";

import React from "react";
import { useDocumentContext } from "@/context/DocumentContext";

export const FolhaRostoView = () => {
  const { state } = useDocumentContext();
  const { titlePage, cover } = state;

  return (
    <div className="flex flex-col h-full items-center text-center justify-between">
      {/* Topo: Autor (Puxado da Capa) */}
      <div className="w-full uppercase whitespace-pre-line">
        <span>{cover.author}</span>
      </div>

      {/* Título: 5 linhas abaixo (Puxado da Capa) */}
      <div className="flex flex-col items-center w-full mt-24">
        <h1 className="uppercase font-bold text-[12pt] leading-relaxed">
          {cover.title}
        </h1>
        {cover.subtitle && (
          <h2 className="text-[12pt] leading-relaxed mt-1 uppercase">
            {cover.subtitle}
          </h2>
        )}
      </div>

      {/* Natureza / Objetivo: Recuo de 7.5cm da margem esquerda */}
      <div className="w-full flex justify-end mt-24">
        <div style={{ marginLeft: "4.5cm" }} className="text-justify text-[12pt] leading-snug font-normal">
          <p>{titlePage.objective}</p>
          <p className="mt-4 font-bold">{titlePage.advisor}</p>
        </div>
      </div>
      
      {/* Espaço flexível para empurrar pro fim */}
      <div className="flex-1"></div>

      {/* Rodapé: Local e Ano (Puxados da Capa) */}
      <div className="flex flex-col w-full mb-0 uppercase">
        <span>{cover.city}</span>
        <span>{cover.year}</span>
      </div>
    </div>
  );
};
