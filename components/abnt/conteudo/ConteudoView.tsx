"use client";

import React, { useEffect, useState } from "react";
import { useDocumentContext } from "@/context/DocumentContext";
import { A4Page } from "../A4Page";
import { ContentBlock } from "@/types/abnt";
import { calculateHeadingNumbering } from "@/lib/abnt/utils";

export const ConteudoView = () => {
  const { state, setHeadingPages, setTotalPages } = useDocumentContext();
  const { content } = state;
  const [pages, setPages] = useState<ContentBlock[][]>([]);

  const numberingMap = calculateHeadingNumbering(content);

  useEffect(() => {
    let tempDiv: HTMLDivElement | null = null;

    const measureAndPaginate = () => {
      if (content.length === 0) {
        setPages([]);
        setHeadingPages({});
        setTotalPages(0);
        return;
      }

      const MAX_HEIGHT_PX = 930; // 24.7cm útil
      const newPages: ContentBlock[][] = [[]];
      const newHeadingPages: Record<string, number> = {};
      
      tempDiv = document.createElement("div");
      tempDiv.style.width = "16cm";
      tempDiv.style.position = "fixed";
      tempDiv.style.top = "0";
      tempDiv.style.left = "-100vw";
      tempDiv.style.visibility = "hidden";
      tempDiv.style.fontSize = "12pt";
      tempDiv.style.lineHeight = "1.5";
      tempDiv.style.fontFamily = state.settings.fontFamily === "Arial" ? "Arial, sans-serif" : "'Times New Roman', Times, serif";
      document.body.appendChild(tempDiv);

      const applyBlockStyle = (item: HTMLDivElement, block: ContentBlock, index: number) => {
        item.style.textAlign = "justify";
        item.style.width = "100%";
        if (block.type === "h1") {
          item.style.fontWeight = "bold";
          item.style.textTransform = "uppercase";
          item.style.marginBottom = "1.5rem";
          if (index > 0) item.style.marginTop = "3rem";
        } else if (block.type === "h2") {
          item.style.textTransform = "uppercase";
          item.style.marginBottom = "1rem";
          item.style.marginTop = "2rem";
        } else if (block.type === "h3") {
          item.style.fontWeight = "bold";
          item.style.marginBottom = "1rem";
          item.style.marginTop = "1.5rem";
        } else if (block.type === "quote") {
          item.style.fontSize = "10pt";
          item.style.lineHeight = "1.0";
          item.style.marginLeft = "4cm";
          item.style.marginTop = "1rem";
          item.style.marginBottom = "1rem";
        } else if (block.type === "paragraph") {
          item.style.textIndent = block.isContinuation ? "0" : "1.25cm";
          item.style.marginBottom = "1rem";
        } else if (block.type === "image" || block.type === "table") {
          item.style.textAlign = "center";
          item.style.marginBottom = "1.5rem";
          item.style.marginTop = "1.5rem";
        }
      };

      const processBlocks = (blocksToProcess: ContentBlock[]) => {
        let i = 0;
        const queue = [...blocksToProcess];

        while (i < queue.length) {
          const block = queue[i];
          const item = document.createElement("div");
          applyBlockStyle(item, block, i);
          
          if (block.type === 'image') {
            item.innerHTML = `
              <div style="font-size: 10pt; margin-bottom: 0.5rem">${block.imageData?.caption}</div>
              <img src="${block.imageData?.url || ''}" style="max-width: 100%; max-height: 10cm; object-fit: contain" />
              <div style="font-size: 10pt; margin-top: 0.5rem">${block.imageData?.source}</div>
            `;
          } else if (block.type === 'table') {
            const tableHtml = `
              <table style="width: 100%; border-collapse: collapse; font-size: 10pt">
                ${block.tableData?.rows.map(row => `
                  <tr>${row.map(cell => `<td style="border: 1px solid black; padding: 4px">${cell}</td>`).join('')}</tr>
                `).join('')}
              </table>
            `;
            item.innerHTML = `
              <div style="font-size: 10pt; margin-bottom: 0.5rem">${block.tableData?.caption}</div>
              ${tableHtml}
              <div style="font-size: 10pt; margin-top: 0.5rem">${block.tableData?.source}</div>
            `;
          } else {
            item.innerText = block.content;
          }

          tempDiv.appendChild(item);

          if (tempDiv.scrollHeight > MAX_HEIGHT_PX) {
            tempDiv.removeChild(item);

            if (block.type === "paragraph" || block.type === "quote") {
              const words = block.content.split(" ");
              let currentPart = "";
              let remainingPart = "";
              
              const subItem = document.createElement("div");
              applyBlockStyle(subItem, block, i);
              tempDiv.appendChild(subItem);

              let wordIdx = 0;
              while (wordIdx < words.length) {
                const testText = currentPart + (currentPart ? " " : "") + words[wordIdx];
                subItem.innerText = testText;
                if (tempDiv.scrollHeight > MAX_HEIGHT_PX) {
                  remainingPart = words.slice(wordIdx).join(" ");
                  break;
                }
                currentPart = testText;
                wordIdx++;
              }

              if (currentPart) {
                newPages[newPages.length - 1].push({ 
                  ...block, 
                  content: currentPart, 
                  isContinued: true 
                });
              }
              
              if (remainingPart) {
                newPages.push([]);
                tempDiv.innerHTML = "";
                const remainingBlock: ContentBlock = { 
                  ...block, 
                  id: crypto.randomUUID(), 
                  content: remainingPart,
                  isContinuation: true 
                };
                queue.splice(i + 1, 0, remainingBlock);
              }
            } else {
              // Outros blocos (Títulos, Imagens, Tabelas): move integramente
              if (newPages[newPages.length - 1].length > 0) {
                newPages.push([block]);
                tempDiv.innerHTML = "";
                const newItem = document.createElement("div");
                applyBlockStyle(newItem, block, 0);
                // Re-populate newItem based on type
                if (block.type === 'image') {
                  newItem.innerHTML = item.innerHTML;
                } else if (block.type === 'table') {
                  newItem.innerHTML = item.innerHTML;
                } else {
                  newItem.innerText = block.content;
                }
                tempDiv.appendChild(newItem);
              } else {
                newPages[newPages.length - 1].push(block);
              }
            }
          } else {
            newPages[newPages.length - 1].push(block);
          }

          if (block.type === "h1" || block.type === "h2" || block.type === "h3") {
            newHeadingPages[block.id] = 5 + newPages.length - 1;
          }
          i++;
        }
      };

      processBlocks(content);
      if (tempDiv.parentNode === document.body) {
        document.body.removeChild(tempDiv);
      }
      tempDiv = null;
      setPages(newPages);
      setHeadingPages(newHeadingPages);
      setTotalPages(newPages.length);
    };

    const timer = setTimeout(measureAndPaginate, 100);
    return () => {
      clearTimeout(timer);
      if (tempDiv && tempDiv.parentNode === document.body) {
        document.body.removeChild(tempDiv);
      }
    };
  }, [content, state.settings.fontFamily, setHeadingPages, setTotalPages]);

  if (content.length === 0) return null;

  return (
    <div className="pages-wrapper flex flex-col gap-10">
      {pages.map((pageBlocks, pageIdx) => (
        <A4Page key={pageIdx} showPageNumber pageNumber={5 + pageIdx}>
          <div className="w-full h-full text-[12pt] leading-[1.5]">
            {pageBlocks.map((block) => {
              const autoNumber = numberingMap[block.id] || "";
              const style: React.CSSProperties = {
                textAlignLast: block.isContinued ? "justify" : "auto"
              };

              switch (block.type) {
                case "h1":
                  return (
                    <h1 key={block.id} className={`font-bold uppercase text-left mb-6 mt-12 first:mt-0`}>
                      {autoNumber ? `${autoNumber} ` : ""}{block.content}
                    </h1>
                  );
                case "h2":
                  return (
                    <h2 key={block.id} className="uppercase text-left mb-4 mt-8">
                      {autoNumber ? `${autoNumber} ` : ""}{block.content}
                    </h2>
                  );
                case "h3":
                  return (
                    <h3 key={block.id} className="font-bold text-left mb-4 mt-6">
                      {autoNumber ? `${autoNumber} ` : ""}{block.content}
                    </h3>
                  );
                case "paragraph":
                  return (
                    <p key={block.id} className="text-justify mb-4" style={{ ...style, textIndent: block.isContinuation ? "0" : "1.25cm" }}>
                      {block.content}
                    </p>
                  );
                case "quote":
                  return (
                    <div key={block.id} className="text-justify mb-4 text-[10pt] leading-[1.0]" style={{ ...style, marginLeft: "4cm", marginTop: "1rem", marginBottom: "1rem" }}>
                      {block.content}
                    </div>
                  );
                case "image":
                  return (
                    <div key={block.id} className="flex flex-col items-center my-6 w-full">
                      <div className="text-[10pt] mb-2 w-full text-center">{block.imageData?.caption}</div>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={block.imageData?.url} alt={block.imageData?.caption} className="max-w-full max-h-[10cm] object-contain" />
                      <div className="text-[10pt] mt-2 w-full text-center">{block.imageData?.source}</div>
                    </div>
                  );
                case "table":
                  return (
                    <div key={block.id} className="flex flex-col items-center my-6 w-full break-inside-avoid">
                      <div className="text-[10pt] mb-2 w-full text-left font-bold">{block.tableData?.caption}</div>
                      <table className="w-full border-collapse text-[10pt] border-t-2 border-b-2 border-black">
                        <thead>
                          {block.tableData?.hasHeaderRow && (
                            <tr className="border-b border-black">
                              {block.tableData?.rows[0]?.map((cell, idx) => (
                                <th key={idx} className={`p-2 text-center font-bold border-x-0 ${block.tableData?.hasHeaderCol && idx === 0 ? 'border-r border-black/20' : ''}`}>{cell}</th>
                              ))}
                            </tr>
                          )}
                        </thead>
                        <tbody>
                          {(block.tableData?.hasHeaderRow ? block.tableData.rows.slice(1) : block.tableData?.rows || []).map((row, rIdx) => (
                            <tr key={rIdx} className="border-b border-neutral-200 last:border-b-0">
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} className={`p-2 text-center border-x-0 ${
                                  block.tableData?.hasHeaderCol && cIdx === 0 ? 'font-bold border-r border-black/20' : ''
                                }`}>
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="text-[10pt] mt-2 w-full text-left">{block.tableData?.source}</div>
                    </div>
                  );
                default:
                  return null;
              }
            })}
          </div>
        </A4Page>
      ))}
    </div>
  );
};
