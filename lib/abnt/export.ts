"use client";

import { DocumentState } from "@/types/abnt";
import { calculateHeadingNumbering } from "./utils";

/** Convert a base64 data URL to ArrayBuffer (browser-safe) */
const dataUrlToArrayBuffer = (dataUrl: string): ArrayBuffer | null => {
  const matches = dataUrl.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) return null;
  const binary = atob(matches[2]);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
};

/** Trigger a file download from an ArrayBuffer */
const downloadArrayBuffer = (buffer: ArrayBuffer, filename: string, mimeType: string) => {
  const blob = new Blob([buffer], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export const exportToDocx = async (state: DocumentState) => {
  // Dynamic import ensures docx only loads client-side
  const {
    Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel,
    Table, TableRow, TableCell, BorderStyle, PageBreak, WidthType, ImageRun,
  } = await import("docx");

  const numberingMap = calculateHeadingNumbering(state.content);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const children: any[] = [];

  // ── 1. CAPA ──────────────────────────────────────────────────────────────
  children.push(
    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: state.cover.institution, bold: true, size: 24, allCaps: true })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: state.cover.course, bold: true, size: 24, allCaps: true })] }),
  );

  if (state.cover.showLogo && state.cover.logoUrl) {
    const buf = dataUrlToArrayBuffer(state.cover.logoUrl);
    if (buf) {
      const align = state.cover.logoPosition === "left" ? AlignmentType.LEFT
        : state.cover.logoPosition === "right" ? AlignmentType.RIGHT
        : AlignmentType.CENTER;
      children.push(new Paragraph({ alignment: align, children: [new ImageRun({ data: buf, transformation: { width: 100, height: 100 } })] }));
    }
  }

  children.push(
    new Paragraph({ spacing: { before: 800 }, children: [new TextRun("")] }),
    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: state.cover.author, size: 24, allCaps: true })] }),
    new Paragraph({ spacing: { before: 1500 }, children: [new TextRun("")] }),
    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: state.cover.title, bold: true, size: 24, allCaps: true })] }),
  );
  if (state.cover.subtitle) {
    children.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: state.cover.subtitle, size: 24, allCaps: true })] }));
  }
  children.push(
    new Paragraph({ spacing: { before: 3000 }, children: [new TextRun("")] }),
    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: state.cover.city, size: 24, allCaps: true })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: state.cover.year, size: 24, allCaps: true })] }),
    new Paragraph({ children: [new PageBreak()] }),
  );

  // ── 2. FOLHA DE ROSTO ────────────────────────────────────────────────────
  children.push(
    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: state.cover.author, size: 24, allCaps: true })] }),
    new Paragraph({ spacing: { before: 1500 }, children: [new TextRun("")] }),
    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: state.cover.title, bold: true, size: 24, allCaps: true })] }),
    new Paragraph({ spacing: { before: 1000 }, children: [new TextRun("")] }),
    new Paragraph({ indent: { left: 4250 }, alignment: AlignmentType.JUSTIFY, children: [new TextRun({ text: state.titlePage.objective, size: 24 })] }),
    new Paragraph({ indent: { left: 4250 }, children: [new TextRun({ text: state.titlePage.advisor, bold: true, size: 24 })] }),
    new Paragraph({ spacing: { before: 2000 }, children: [new TextRun("")] }),
    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: state.cover.city, size: 24, allCaps: true })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: state.cover.year, size: 24, allCaps: true })] }),
    new Paragraph({ children: [new PageBreak()] }),
  );

  // ── 3. RESUMO ────────────────────────────────────────────────────────────
  children.push(
    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "RESUMO", bold: true, size: 24, allCaps: true })] }),
    new Paragraph({ spacing: { before: 400 }, children: [new TextRun("")] }),
    new Paragraph({ alignment: AlignmentType.JUSTIFY, children: [new TextRun({ text: state.abstract.text, size: 24 })] }),
    new Paragraph({ spacing: { before: 400 }, children: [new TextRun("")] }),
    new Paragraph({
      alignment: AlignmentType.JUSTIFY,
      children: [
        new TextRun({ text: "Palavras-chave: ", bold: true, size: 24 }),
        new TextRun({ text: state.abstract.keywords, size: 24 }),
      ],
    }),
    new Paragraph({ children: [new PageBreak()] }),
  );

  // ── 4. SUMÁRIO ───────────────────────────────────────────────────────────
  children.push(
    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "SUMÁRIO", bold: true, size: 24, allCaps: true })] }),
    new Paragraph({ spacing: { before: 400 }, children: [new TextRun("")] }),
    ...state.content
      .filter((b) => b.type === "h1" || b.type === "h2" || b.type === "h3")
      .map((b) => new Paragraph({
        alignment: AlignmentType.LEFT,
        children: [new TextRun({ text: `${numberingMap[b.id]} ${b.content}`, bold: b.type !== "h2", allCaps: b.type !== "h3", size: 24 })],
      })),
    new Paragraph({ children: [new PageBreak()] }),
  );

  // ── 5. CONTEÚDO ──────────────────────────────────────────────────────────
  for (const block of state.content) {
    const autoNumber = numberingMap[block.id] ? `${numberingMap[block.id]} ` : "";

    switch (block.type) {
      case "h1":
        children.push(new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: `${autoNumber}${block.content}`, bold: true, allCaps: true, size: 24 })], spacing: { before: 400, after: 200 } }));
        break;
      case "h2":
        children.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: `${autoNumber}${block.content}`, allCaps: true, size: 24 })], spacing: { before: 300, after: 200 } }));
        break;
      case "h3":
        children.push(new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun({ text: `${autoNumber}${block.content}`, bold: true, size: 24 })], spacing: { before: 200, after: 200 } }));
        break;
      case "paragraph":
        children.push(new Paragraph({ alignment: AlignmentType.JUSTIFY, indent: { firstLine: 708 }, children: [new TextRun({ text: block.content, size: 24 })], spacing: { line: 360 } }));
        break;
      case "quote":
        children.push(new Paragraph({ alignment: AlignmentType.JUSTIFY, indent: { left: 2268 }, children: [new TextRun({ text: block.content, size: 20 })], spacing: { line: 240 } }));
        break;
      case "image":
        if (block.imageData) {
          children.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: block.imageData.caption, size: 20 })] }));
          const imgBuf = dataUrlToArrayBuffer(block.imageData.url);
          if (imgBuf) {
            children.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new ImageRun({ data: imgBuf, transformation: { width: 400, height: 300 } })] }));
          }
          children.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: block.imageData.source, size: 20 })] }));
        }
        break;
      case "table":
        if (block.tableData) {
          children.push(new Paragraph({ children: [new TextRun({ text: block.tableData.caption, bold: true, size: 20 })] }));
          children.push(new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: block.tableData.rows.map((row, rIdx) => new TableRow({
              children: row.map((cell, cIdx) => {
                const isHeader = (rIdx === 0 && block.tableData?.hasHeaderRow) || (cIdx === 0 && block.tableData?.hasHeaderCol);
                return new TableCell({
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: cell, size: 20, bold: isHeader })] })],
                  borders: {
                    top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                    bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                    left: { style: BorderStyle.NONE, size: 0, color: "000000" },
                    right: { style: BorderStyle.NONE, size: 0, color: "000000" },
                  },
                });
              }),
            })),
          }));
          children.push(new Paragraph({ children: [new TextRun({ text: block.tableData.source, size: 20 })] }));
        }
        break;
    }
  }

  // ── 6. REFERÊNCIAS ───────────────────────────────────────────────────────
  if (state.references.length > 0) {
    children.push(new Paragraph({ children: [new PageBreak()] }));
    children.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "REFERÊNCIAS", bold: true, size: 24, allCaps: true })] }));
    for (const ref of state.references) {
      children.push(new Paragraph({ alignment: AlignmentType.JUSTIFY, children: [new TextRun({ text: ref.text, size: 24 })], spacing: { after: 200 } }));
    }
  }

  const doc = new Document({
    sections: [{
      properties: {
        page: { margin: { top: 1701, bottom: 1134, left: 1701, right: 1134 } },
      },
      children,
    }],
  });

  // toBuffer is more reliable than toBlob in browser bundles
  const buffer = await Packer.toBuffer(doc);
  downloadArrayBuffer(
    buffer,
    "Trabalho_ABNT.docx",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  );
};
