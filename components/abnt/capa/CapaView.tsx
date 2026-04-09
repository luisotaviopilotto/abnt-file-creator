"use client";

import React from "react";
import { useDocumentContext } from "@/context/DocumentContext";

// ABNT: fonte 12pt, entrelinha 1.5 → 1 linha = 1.5em = 18pt
// 3 linhas de espaço = 4.5em
// 5 linhas de espaço = 7.5em

export const CapaView = () => {
  const { state } = useDocumentContext();
  const { cover } = state;

  return (
    <div
      className="flex flex-col h-full items-center text-center uppercase"
      style={{ fontSize: "12pt", lineHeight: "1.5" }}
    >
      {/* Logo */}
      {cover.showLogo && cover.logoUrl && (
        <div
          className="w-full flex"
          style={{
            justifyContent:
              cover.logoPosition === "left"
                ? "flex-start"
                : cover.logoPosition === "right"
                ? "flex-end"
                : "center",
            marginBottom: "1.5em",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cover.logoUrl}
            alt="Logo Instituição"
            style={{ maxHeight: "3cm", maxWidth: "5cm", objectFit: "contain" }}
          />
        </div>
      )}

      {/* Instituição e Curso — topo, negrito, maiúsculas */}
      <div className="flex flex-col w-full font-bold" style={{ lineHeight: "1.5" }}>
        <span>{cover.institution}</span>
        <span>{cover.course}</span>
      </div>

      {/* Autor — 3 linhas abaixo */}
      <div
        className="w-full font-normal whitespace-pre-line"
        style={{ marginTop: "4.5em", lineHeight: "1.5" }}
      >
        <span>{cover.author}</span>
      </div>

      {/* Título — 5 linhas abaixo, negrito */}
      <div
        className="flex flex-col items-center w-full"
        style={{ marginTop: "7.5em", lineHeight: "1.5" }}
      >
        <h1 className="font-bold" style={{ fontSize: "12pt", lineHeight: "1.5" }}>
          {cover.title}
        </h1>
        {cover.subtitle && (
          <h2 className="font-normal" style={{ fontSize: "12pt", lineHeight: "1.5" }}>
            {cover.subtitle}
          </h2>
        )}
      </div>

      {/* Empurra Local/Ano para o rodapé */}
      <div className="flex-1" />

      {/* Local e Ano — última linha, sem negrito */}
      <div className="flex flex-col w-full font-normal" style={{ lineHeight: "1.5" }}>
        <span>{cover.city}</span>
        <span>{cover.year}</span>
      </div>
    </div>
  );
};
