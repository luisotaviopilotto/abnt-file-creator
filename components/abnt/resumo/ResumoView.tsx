"use client";

import React from "react";
import { useDocumentContext } from "@/context/DocumentContext";

export const ResumoView = () => {
  const { state } = useDocumentContext();
  const { abstract } = state;

  return (
    <div className="flex flex-col h-full w-full">
      {/* Título: "RESUMO" centralizado, negrito, maiúsculas */}
      <h1 className="text-center font-bold uppercase text-[12pt] mb-12">
        RESUMO
      </h1>

      {/* Corpo do Resumo: bloco maciço, justificado, sem parágrafo inicial */}
      <div className="text-justify text-[12pt] leading-[1.5]">
        <p>{abstract.text}</p>
      </div>

      {/* Palavras-chave: 1 linha abaixo */}
      <div className="mt-8 text-[12pt] text-justify leading-[1.5]">
        <p>
          <span className="font-bold">Palavras-chave: </span>
          {abstract.keywords}
        </p>
      </div>
    </div>
  );
};
