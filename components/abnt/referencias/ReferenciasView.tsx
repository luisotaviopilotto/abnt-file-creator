"use client";

import React, { useEffect, useState } from "react";
import { useDocumentContext } from "@/context/DocumentContext";
import { A4Page } from "../A4Page";
import { ReferenceData } from "@/types/abnt";

export const ReferenciasView = () => {
  const { state, totalPages } = useDocumentContext();
  const { references } = state;
  const [pages, setPages] = useState<ReferenceData[][]>([]);

  useEffect(() => {
    let tempDiv: HTMLDivElement | null = null;

    const measureAndPaginate = () => {
      if (references.length === 0) {
        setPages([]);
        return;
      }

      const MAX_HEIGHT_PX = 930;
      const newPages: ReferenceData[][] = [[]];

      tempDiv = document.createElement("div");
      tempDiv.style.width = "16cm";
      tempDiv.style.position = "fixed";
      tempDiv.style.top = "0";
      tempDiv.style.left = "-9999px";
      tempDiv.style.visibility = "hidden";
      tempDiv.style.fontSize = "12pt";
      tempDiv.style.lineHeight = "1.5";
      tempDiv.style.fontFamily = state.settings.fontFamily === "Arial" ? "Arial, sans-serif" : "'Times New Roman', Times, serif";
      document.body.appendChild(tempDiv);

      const title = document.createElement("h1");
      title.innerText = "REFERÊNCIAS";
      title.style.textAlign = "center";
      title.style.fontWeight = "bold";
      title.style.marginBottom = "3rem";
      tempDiv.appendChild(title);

      references.forEach((ref) => {
        const div = tempDiv;
        if (!div) return;
        const item = document.createElement("div");
        item.style.textAlign = "justify";
        item.style.marginBottom = "1rem";
        item.innerText = ref.text;
        div.appendChild(item);

        if (div.scrollHeight > MAX_HEIGHT_PX) {
          div.removeChild(item);
          if (newPages[newPages.length - 1].length > 0) {
            newPages.push([ref]);
            div.innerHTML = "";
            div.appendChild(item);
          } else {
            newPages[newPages.length - 1].push(ref);
          }
        } else {
          newPages[newPages.length - 1].push(ref);
        }
      });

      if (tempDiv.parentNode === document.body) {
        document.body.removeChild(tempDiv);
      }
      tempDiv = null;
      setPages(newPages);
    };

    const timer = setTimeout(measureAndPaginate, 100);
    return () => {
      clearTimeout(timer);
      // Cleanup if effect re-runs before setTimeout fires
      if (tempDiv && tempDiv.parentNode === document.body) {
        document.body.removeChild(tempDiv);
      }
    };
  }, [references, state.settings.fontFamily]);

  if (references.length === 0) return null;

  return (
    <>
      {pages.map((pageRefs, pageIdx) => (
        <A4Page key={pageIdx} showPageNumber pageNumber={5 + totalPages + pageIdx}>
          <div className="flex flex-col w-full h-full text-[12pt] leading-[1.5]">
            {pageIdx === 0 && (
              <h1 className="text-center font-bold uppercase text-[12pt] mb-12">
                REFERÊNCIAS
              </h1>
            )}
            <div className="flex flex-col gap-4 w-full text-justify">
              {pageRefs.map((ref) => (
                <div key={ref.id} className="w-full">
                  {ref.text}
                </div>
              ))}
            </div>
          </div>
        </A4Page>
      ))}
    </>
  );
};
