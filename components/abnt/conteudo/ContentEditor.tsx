"use client";

import React from "react";
import { useDocumentContext } from "@/context/DocumentContext";
import { ContentBlock } from "@/types/abnt";
import { 
  IconHeading, 
  IconTypography, 
  IconQuote, 
  IconTrash, 
  IconChevronUp, 
  IconChevronDown,
  IconPlus,
  IconEraser,
  IconChevronRight,
  IconPhoto,
  IconTable,
  IconRowInsertBottom,
  IconColumnInsertRight
} from "@tabler/icons-react";
import { calculateHeadingNumbering } from "@/lib/abnt/utils";

export const ContentEditor = () => {
  const { state, addContentBlock, updateContentBlock, removeContentBlock, setContentBlocks } = useDocumentContext();
  const { content } = state;
  const [collapsedIds, setCollapsedIds] = React.useState<Set<string>>(new Set());

  const numberingMap = calculateHeadingNumbering(content);

  const toggleCollapse = (id: string) => {
    const newCollapsed = new Set(collapsedIds);
    if (newCollapsed.has(id)) {
      newCollapsed.delete(id);
    } else {
      newCollapsed.add(id);
    }
    setCollapsedIds(newCollapsed);
  };

  const handleAddBlock = (type: ContentBlock["type"]) => {
    const newBlock: ContentBlock = {
      id: crypto.randomUUID(),
      type,
      content: "",
    };

    if (type === 'table') {
      newBlock.tableData = {
        rows: [['Item 1', 'Item 2'], ['', '']],
        caption: 'Título da Tabela',
        source: 'Fonte: Do autor (2026).',
        hasHeaderRow: true,
        hasHeaderCol: false,
      };
    } else if (type === 'image') {
      newBlock.imageData = {
        url: '',
        caption: 'Título da Figura',
        source: 'Fonte: Do autor (2026).'
      };
    }

    addContentBlock(newBlock);
  };

  const updateTable = (id: string, updates: Partial<NonNullable<ContentBlock['tableData']>>) => {
    const block = content.find(b => b.id === id);
    if (block?.tableData) {
      updateContentBlock(id, { tableData: { ...block.tableData, ...updates } });
    }
  };

  const updateImage = (id: string, updates: Partial<NonNullable<ContentBlock['imageData']>>) => {
    const block = content.find(b => b.id === id);
    if (block?.imageData) {
      updateContentBlock(id, { imageData: { ...block.imageData, ...updates } });
    }
  };

  const handleImageUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      updateImage(id, { url: event.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  const addTableRow = (id: string) => {
    const block = content.find(b => b.id === id);
    if (block?.tableData) {
      const colCount = block.tableData.rows[0]?.length || 1;
      const newRow = new Array(colCount).fill("");
      updateTable(id, { rows: [...block.tableData.rows, newRow] });
    }
  };

  const addTableCol = (id: string) => {
    const block = content.find(b => b.id === id);
    if (block?.tableData) {
      const newRows = block.tableData.rows.map(row => [...row, ""]);
      updateTable(id, { rows: newRows });
    }
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newContent = [...content];
    const temp = newContent[index - 1];
    newContent[index - 1] = newContent[index];
    newContent[index] = temp;
    setContentBlocks(newContent);
  };

  const moveDown = (index: number) => {
    if (index === content.length - 1) return;
    const newContent = [...content];
    const temp = newContent[index + 1];
    newContent[index + 1] = newContent[index];
    newContent[index] = temp;
    setContentBlocks(newContent);
  };

  const blockTypeStyles = {
    h1: "border-l-4 border-blue-500 bg-blue-500/5 ml-0",
    h2: "border-l-4 border-indigo-400 bg-indigo-400/5 ml-4",
    h3: "border-l-4 border-neutral-400 bg-neutral-400/5 ml-8",
    paragraph: "border-l-4 border-emerald-500 bg-emerald-500/5 ml-8",
    quote: "border-l-4 border-amber-500 bg-amber-500/5 ml-8",
    image: "border-l-4 border-purple-500 bg-purple-500/5 ml-8",
    table: "border-l-4 border-cyan-500 bg-cyan-500/5 ml-8",
  };

  const blockIcons = {
    h1: <IconHeading size={14} className="text-blue-500" />,
    h2: <IconHeading size={14} className="text-indigo-400" />,
    h3: <IconHeading size={14} className="text-neutral-400" />,
    paragraph: <IconTypography size={14} className="text-emerald-500" />,
    quote: <IconQuote size={14} className="text-amber-500" />,
    image: <IconPhoto size={14} className="text-purple-500" />,
    table: <IconTable size={14} className="text-cyan-500" />,
  };

  const getVisibleBlocks = () => {
    const visible: { block: ContentBlock; index: number }[] = [];
    let currentH1Collapsed = false;
    let currentH2Collapsed = false;

    content.forEach((block, index) => {
      if (block.type === "h1") {
        currentH1Collapsed = collapsedIds.has(block.id);
        currentH2Collapsed = false;
        visible.push({ block, index });
      } else if (block.type === "h2") {
        const isH2Collapsed = collapsedIds.has(block.id);
        if (!currentH1Collapsed) {
          visible.push({ block, index });
          currentH2Collapsed = isH2Collapsed;
        }
      } else {
        if (!currentH1Collapsed && !currentH2Collapsed) {
          visible.push({ block, index });
        }
      }
    });
    return visible;
  };

  const visibleBlocks = getVisibleBlocks();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Estrutura do Texto</h3>
        {content.length > 0 && (
          <button 
            onClick={() => { if(confirm("Limpar todo o conteúdo?")) setContentBlocks([]); }}
            className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1 uppercase font-bold tracking-tighter transition-colors"
          >
            <IconEraser size={12} /> Limpar
          </button>
        )}
      </div>

      <div className="sticky top-0 z-20 bg-neutral-950/80 backdrop-blur-md py-2 border-b border-neutral-800 -mx-2 px-2 mb-4">
        <div className="grid grid-cols-3 gap-1 mb-1">
          <button onClick={() => handleAddBlock("h1")} className="flex flex-col items-center gap-1 p-2 rounded-md hover:bg-neutral-800 transition-all border border-neutral-800/50 group">
            <IconHeading size={18} className="text-blue-500 group-hover:scale-110 transition-transform" />
            <span className="text-[9px] uppercase font-bold text-neutral-500">H1</span>
          </button>
          <button onClick={() => handleAddBlock("h2")} className="flex flex-col items-center gap-1 p-2 rounded-md hover:bg-neutral-800 transition-all border border-neutral-800/50 group">
            <IconHeading size={18} className="text-indigo-400 group-hover:scale-110 transition-transform" />
            <span className="text-[9px] uppercase font-bold text-neutral-500">H2</span>
          </button>
          <button onClick={() => handleAddBlock("h3")} className="flex flex-col items-center gap-1 p-2 rounded-md hover:bg-neutral-800 transition-all border border-neutral-800/50 group">
            <IconHeading size={18} className="text-neutral-400 group-hover:scale-110 transition-transform" />
            <span className="text-[9px] uppercase font-bold text-neutral-500">H3</span>
          </button>
        </div>
        <div className="grid grid-cols-4 gap-1">
          <button onClick={() => handleAddBlock("paragraph")} className="flex flex-col items-center gap-1 p-2 rounded-md hover:bg-neutral-800 transition-all border border-neutral-800/50 group">
            <IconTypography size={18} className="text-emerald-500 group-hover:scale-110 transition-transform" />
            <span className="text-[9px] uppercase font-bold text-neutral-500">Texto</span>
          </button>
          <button onClick={() => handleAddBlock("quote")} className="flex flex-col items-center gap-1 p-2 rounded-md hover:bg-neutral-800 transition-all border border-neutral-800/50 group">
            <IconQuote size={18} className="text-amber-500 group-hover:scale-110 transition-transform" />
            <span className="text-[9px] uppercase font-bold text-neutral-500">Citação</span>
          </button>
          <button onClick={() => handleAddBlock("image")} className="flex flex-col items-center gap-1 p-2 rounded-md hover:bg-neutral-800 transition-all border border-neutral-800/50 group">
            <IconPhoto size={18} className="text-purple-500 group-hover:scale-110 transition-transform" />
            <span className="text-[9px] uppercase font-bold text-neutral-500">Imagem</span>
          </button>
          <button onClick={() => handleAddBlock("table")} className="flex flex-col items-center gap-1 p-2 rounded-md hover:bg-neutral-800 transition-all border border-neutral-800/50 group">
            <IconTable size={18} className="text-cyan-500 group-hover:scale-110 transition-transform" />
            <span className="text-[9px] uppercase font-bold text-neutral-500">Tabela</span>
          </button>
        </div>
      </div>

      <div className="space-y-3 pb-20">
        {visibleBlocks.map(({ block, index }) => (
          <div key={block.id} className={`group p-3 rounded-lg border border-neutral-800 transition-all hover:border-neutral-700 ${blockTypeStyles[block.type as keyof typeof blockTypeStyles]}`}>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                {(block.type === "h1" || block.type === "h2") && (
                  <button onClick={() => toggleCollapse(block.id)} className="p-0.5 hover:bg-neutral-800 rounded transition-colors text-neutral-400">
                    {collapsedIds.has(block.id) ? <IconChevronRight size={14} /> : <IconChevronDown size={14} />}
                  </button>
                )}
                {blockIcons[block.type as keyof typeof blockIcons]}
                <span className="text-[9px] uppercase font-black text-neutral-500 tracking-widest">
                  {block.type === "h1" ? "Título 1" : block.type === "h2" ? "Título 2" : block.type === "quote" ? "Citação" : block.type === "image" ? "Figura" : block.type === "table" ? "Tabela" : "Parágrafo"}
                </span>
              </div>
              <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => moveUp(index)} disabled={index === 0} className="p-1 text-neutral-500 hover:text-white hover:bg-neutral-700 rounded disabled:opacity-30">
                  <IconChevronUp size={14} />
                </button>
                <button onClick={() => moveDown(index)} disabled={index === content.length - 1} className="p-1 text-neutral-500 hover:text-white hover:bg-neutral-700 rounded disabled:opacity-30">
                  <IconChevronDown size={14} />
                </button>
                <button onClick={() => removeContentBlock(block.id)} className="p-1 text-neutral-500 hover:text-red-400 hover:bg-red-400/10 rounded">
                  <IconTrash size={14} />
                </button>
              </div>
            </div>

            {(block.type === "h1" || block.type === "h2" || block.type === "h3") && (
              <div className="flex gap-2">
                <div className="w-12 bg-neutral-950/50 border border-neutral-800 rounded px-2 py-1.5 text-[10px] text-blue-400 font-mono flex items-center justify-center font-bold shrink-0">
                  {numberingMap[block.id]}
                </div>
                <input
                  type="text"
                  value={block.content}
                  onChange={(e) => updateContentBlock(block.id, { content: e.target.value })}
                  className="flex-1 bg-neutral-950/50 border border-neutral-800 rounded px-3 py-1.5 text-sm text-white outline-none focus:border-blue-500/50 placeholder-neutral-700"
                  placeholder="Título da seção..."
                />
              </div>
            )}

            {block.type === "image" && block.imageData && (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(block.id, e)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <button className="w-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[10px] font-bold py-2 rounded border border-neutral-700 uppercase">Upload</button>
                  </div>
                  <input
                    type="text"
                    value={block.imageData.url.startsWith('data:') ? 'Imagem carregada' : block.imageData.url}
                    onChange={(e) => updateImage(block.id, { url: e.target.value })}
                    className="flex-[2] bg-neutral-950 border border-neutral-700 rounded px-3 py-1 text-xs text-white outline-none"
                    placeholder="URL da imagem..."
                  />
                </div>
                <input
                  type="text"
                  value={block.imageData.caption}
                  onChange={(e) => updateImage(block.id, { caption: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded px-3 py-1.5 text-xs text-white outline-none"
                  placeholder="Título da Figura..."
                />
                <input
                  type="text"
                  value={block.imageData.source}
                  onChange={(e) => updateImage(block.id, { source: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded px-3 py-1.5 text-xs text-white outline-none"
                  placeholder="Fonte da Figura..."
                />
              </div>
            )}

            {block.type === "table" && block.tableData && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-neutral-500">Título / Legenda</label>
                  <input
                    type="text"
                    value={block.tableData.caption}
                    onChange={(e) => updateTable(block.id, { caption: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded px-3 py-1.5 text-xs text-white outline-none"
                    placeholder="Ex: Tabela 1 - Dados demográficos"
                  />
                </div>

                <div className="flex gap-4 p-2 bg-neutral-950/30 rounded border border-neutral-800">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={block.tableData.hasHeaderRow}
                      onChange={(e) => updateTable(block.id, { hasHeaderRow: e.target.checked })}
                      className="accent-blue-500"
                    />
                    <span className="text-[10px] uppercase font-bold text-neutral-400 group-hover:text-neutral-300">Cabeçalho (Linha)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={block.tableData.hasHeaderCol}
                      onChange={(e) => updateTable(block.id, { hasHeaderCol: e.target.checked })}
                      className="accent-blue-500"
                    />
                    <span className="text-[10px] uppercase font-bold text-neutral-400 group-hover:text-neutral-300">Cabeçalho (Coluna)</span>
                  </label>
                </div>

                <div className="max-h-64 overflow-auto border border-neutral-800 rounded bg-neutral-950/30">
                  <table className="w-full text-[10px]">
                    <tbody>
                      {block.tableData.rows.map((row, rIdx) => (
                        <tr key={rIdx}>
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className={`p-0 border border-neutral-800 ${
                              (rIdx === 0 && block.tableData?.hasHeaderRow) || (cIdx === 0 && block.tableData?.hasHeaderCol) 
                                ? 'bg-blue-500/10' 
                                : ''
                            }`}>
                              <input
                                type="text"
                                value={cell}
                                onChange={(e) => {
                                  const newRows = [...(block.tableData?.rows || [])];
                                  newRows[rIdx] = [...newRows[rIdx]];
                                  newRows[rIdx][cIdx] = e.target.value;
                                  updateTable(block.id, { rows: newRows });
                                }}
                                className="w-full bg-transparent outline-none text-white px-2 py-1.5 focus:bg-blue-500/5"
                              />
                            </td>
                          ))}
                          <td className="w-8 border-l border-neutral-800">
                            <button 
                              onClick={() => {
                                const newRows = block.tableData?.rows.filter((_, idx) => idx !== rIdx);
                                if (newRows && newRows.length > 0) updateTable(block.id, { rows: newRows });
                              }}
                              className="w-full h-full text-red-500/50 hover:text-red-500 flex items-center justify-center transition-colors"
                              title="Remover Linha"
                            >
                              <IconTrash size={12} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="flex gap-2">
                  <button onClick={() => addTableRow(block.id)} className="flex-1 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-[9px] uppercase font-bold text-neutral-300 rounded flex items-center justify-center gap-1 transition-colors">
                    <IconRowInsertBottom size={14} /> + Linha
                  </button>
                  <button onClick={() => addTableCol(block.id)} className="flex-1 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-[9px] uppercase font-bold text-neutral-300 rounded flex items-center justify-center gap-1 transition-colors">
                    <IconColumnInsertRight size={14} /> + Coluna
                  </button>
                  <button 
                    onClick={() => {
                      const newRows = block.tableData?.rows.map(row => row.slice(0, -1));
                      if (newRows && newRows[0].length > 0) updateTable(block.id, { rows: newRows });
                    }}
                    className="px-2 py-1.5 bg-neutral-800 hover:bg-red-900/20 text-red-400 rounded transition-colors"
                    title="Remover Última Coluna"
                  >
                    <IconTrash size={14} />
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-neutral-500">Fonte</label>
                  <input
                    type="text"
                    value={block.tableData.source}
                    onChange={(e) => updateTable(block.id, { source: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded px-3 py-1.5 text-xs text-white outline-none"
                    placeholder="Ex: Fonte: Do autor (2026)."
                  />
                </div>
              </div>
            )}

            {(block.type === "paragraph" || block.type === "quote") && (
              <textarea
                value={block.content}
                onChange={(e) => updateContentBlock(block.id, { content: e.target.value })}
                rows={block.type === "quote" ? 2 : 4}
                className="w-full bg-neutral-950/50 border border-neutral-800 rounded px-3 py-2 text-sm text-white outline-none focus:border-blue-500/50 resize-none placeholder-neutral-700 leading-relaxed"
                placeholder={block.type === "quote" ? "Insira a citação longa aqui..." : "Comece a escrever seu parágrafo..."}
              />
            )}
          </div>
        ))}

        {content.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-neutral-800 rounded-xl text-center space-y-4">
            <div className="p-3 bg-neutral-900 rounded-full text-neutral-600">
              <IconPlus size={32} />
            </div>
            <div>
              <p className="text-sm text-neutral-400 font-medium">Seu trabalho está em branco</p>
              <p className="text-[10px] text-neutral-600 mt-1 uppercase tracking-tighter">Use os botões acima para estruturar seu texto</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
