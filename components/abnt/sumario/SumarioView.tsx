"use client";

import React from "react";
import { useDocumentContext } from "@/context/DocumentContext";
import { calculateHeadingNumbering } from "@/lib/abnt/utils";

export const SumarioView = () => {
  const { state, headingPages, totalPages } = useDocumentContext();
  const { content, references } = state;

  // Filtra os títulos do conteúdo
  const headings = content.filter((block) => block.type === "h1" || block.type === "h2" || block.type === "h3");
  const numberingMap = calculateHeadingNumbering(content);

  if (headings.length === 0) return null;

  // Referências começam logo após a última página de conteúdo
  const referencesPage = 5 + totalPages;

  return (
    <div className="flex flex-col h-full w-full">
      <h1 className="text-center font-bold uppercase text-[12pt] mb-12">
        SUMÁRIO
      </h1>

      <div className="flex flex-col gap-2 w-full text-[12pt] leading-[1.5]">
        {headings.map((heading) => {
          const isH1 = heading.type === "h1";
          const isH2 = heading.type === "h2";
          const isH3 = heading.type === "h3";
          const autoNumber = numberingMap[heading.id];

          return (
            <div key={heading.id} className="flex justify-between items-end w-full">
              <div 
                className={`flex gap-2 bg-white pr-2 ${
                  isH1 ? "font-bold uppercase" : 
                  isH2 ? "font-normal uppercase" : 
                  isH3 ? "font-bold normal-case" : ""
                }`}
              >
                {autoNumber && <span>{autoNumber}</span>}
                <span className={isH3 ? "first-letter:uppercase" : ""}>
                  {heading.content}
                </span>
              </div>
              
              {/* Leader dots */}
              <div className="flex-1 border-b-[2px] border-dotted border-black/30 mb-[4px] mx-2"></div>
              
              {/* Real page number from detection */}
              <div className="bg-white pl-2">
                {headingPages[heading.id] || "..."}
              </div>
            </div>
          );
        })}

        {/* Elemento Pós-Textual: REFERÊNCIAS */}
        {references.length > 0 && (
          <div className="flex justify-between items-end w-full mt-2">
            <div className="bg-white pr-2 font-bold uppercase">
              REFERÊNCIAS
            </div>
            <div className="flex-1 border-b-[2px] border-dotted border-black/30 mb-[4px] mx-2"></div>
            <div className="bg-white pl-2">
              {referencesPage}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
