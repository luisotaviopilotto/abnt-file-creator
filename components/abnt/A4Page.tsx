"use client";

import React, { ReactNode } from "react";
import { useDocumentContext } from "@/context/DocumentContext";

interface A4PageProps {
  children: ReactNode;
  showPageNumber?: boolean;
  pageNumber?: number;
  isContinuous?: boolean;
}

export const A4Page = ({ children, showPageNumber, pageNumber }: A4PageProps) => {
  const { state } = useDocumentContext();

  return (
    <div
      className="a4-page-container relative bg-white text-black shadow-2xl mx-auto mb-10 overflow-hidden print:shadow-none print:mb-0 shrink-0"
      style={{
        width: "21cm",
        minWidth: "21cm",
        maxWidth: "21cm",
        height: "29.7cm",
        minHeight: "29.7cm",
        maxHeight: "29.7cm",
        paddingTop: "3cm",
        paddingRight: "2cm",
        paddingBottom: "2cm",
        paddingLeft: "3cm",
        boxSizing: "border-box",
        fontSize: "12pt",
        lineHeight: "1.5",
        fontFamily: state.settings.fontFamily === "Arial" ? "Arial, sans-serif" : "'Times New Roman', Times, serif",
      }}
    >
      {/* ABNT Page Numbering: top right, within the content area at 2cm from top edge */}
      {showPageNumber && pageNumber && (
        <div
          className="absolute text-right"
          style={{
            top: "-1cm",
            right: "0cm",
            fontSize: "10pt",
            fontFamily: "Arial, sans-serif",
            lineHeight: "1",
          }}
        >
          {pageNumber}
        </div>
      )}
      
      {/* Content wrapper: Exactly 16cm x 24.7cm due to padding and box-sizing */}
      <div className="w-full h-full text-justify relative overflow-hidden">
        {children}
      </div>
    </div>
  );
};
