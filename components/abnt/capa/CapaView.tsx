"use client";

import React from "react";
import { useDocumentContext } from "@/context/DocumentContext";

export const CapaView = () => {
  const { state } = useDocumentContext();
  const { cover } = state;

  // Em ABNT com fonte 12pt e entrelinha 1.5, uma "linha" tem aprox 18pt (1.5em).
  // 3 linhas = 4.5em
  // 5 linhas = 7.5em

  return (
    <div className="flex flex-col h-full items-center text-center uppercase">
      {/* Logo Section */}
      {cover.showLogo && cover.logoUrl && (
        <div 
          className="w-full mb-8 flex"
          style={{ 
            justifyContent: cover.logoPosition === 'left' ? 'flex-start' : cover.logoPosition === 'right' ? 'flex-end' : 'center' 
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={cover.logoUrl} 
            alt="Logo Instituição" 
            className="max-h-24 max-w-[200px] object-contain"
          />
        </div>
      )}

      {/* Topo: Instituição e Curso (Negrito, Maiúsculas) */}
      <div className="flex flex-col w-full font-bold">
        <span>{cover.institution}</span>
        <span>{cover.course}</span>
      </div>

      {/* Nome do Autor: 3 linhas abaixo (Maiúsculas, Sem Negrito) */}
      <div className="w-full font-normal whitespace-pre-line" style={{ marginTop: "4.5em" }}>
        <span>{cover.author}</span>
      </div>

      {/* Título: 5 linhas abaixo (Negrito, Maiúsculas) */}
      <div className="flex flex-col items-center w-full" style={{ marginTop: "7.5em" }}>
        <h1 className="font-bold text-[12pt] leading-relaxed">
          {cover.title}
        </h1>
        {/* Subtítulo: Logo abaixo (Maiúsculas, Sem Negrito) */}
        {cover.subtitle && (
          <h2 className="font-normal text-[12pt] leading-relaxed">
            {cover.subtitle}
          </h2>
        )}
      </div>

      {/* Spacer para empurrar Local e Ano para o fim da folha */}
      <div className="flex-1"></div>

      {/* Rodapé: Local (penúltima linha) e Ano (última linha) - Sem Negrito */}
      <div className="flex flex-col w-full font-normal">
        <span>{cover.city}</span>
        <span>{cover.year}</span>
      </div>
    </div>
  );
};
