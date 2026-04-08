"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { DocumentState, ContentBlock, ReferenceData, DocumentSettings } from "@/types/abnt";

interface DocumentContextType {
  state: DocumentState;
  docId: string | null;
  setDocId: (id: string) => void;
  headingPages: Record<string, number>;
  setHeadingPages: (pages: Record<string, number>) => void;
  totalPages: number;
  setTotalPages: (pages: number) => void;
  updateCover: (data: Partial<DocumentState["cover"]>) => void;
  updateTitlePage: (data: Partial<DocumentState["titlePage"]>) => void;
  updateAbstract: (data: Partial<DocumentState["abstract"]>) => void;
  addContentBlock: (block: ContentBlock) => void;
  updateContentBlock: (id: string, content: Partial<ContentBlock>) => void;
  removeContentBlock: (id: string) => void;
  setContentBlocks: (blocks: ContentBlock[]) => void;
  addReference: (ref: ReferenceData) => void;
  updateReference: (id: string, text: string) => void;
  removeReference: (id: string) => void;
  updateSettings: (settings: Partial<DocumentSettings>) => void;
  exportConfig: () => void;
  importConfig: (json: string) => void;
  resetToDefault: () => void;
}

const STORAGE_KEY = "abnt_generator_state";

const initialState: DocumentState = {
  cover: {
    institution: "NOME DA INSTITUIÇÃO",
    course: "NOME DO CURSO",
    author: "NOME DO AUTOR",
    title: "TÍTULO DO TRABALHO",
    subtitle: "Subtítulo do trabalho (opcional)",
    city: "Cidade",
    year: new Date().getFullYear().toString(),
    showLogo: false,
    logoUrl: "",
    logoPosition: "center",
  },
  titlePage: {
    author: "NOME DO AUTOR",
    title: "TÍTULO DO TRABALHO",
    subtitle: "Subtítulo do trabalho (opcional)",
    objective:
      "Trabalho de Conclusão de Curso apresentado ao [Curso] da [Instituição], como requisito parcial para obtenção do título de [Título].",
    advisor: "Orientador: Prof. Dr. Nome do Orientador",
    city: "Cidade",
    year: new Date().getFullYear().toString(),
  },
  abstract: {
    text: "O resumo deve ressaltar o objetivo, o método, os resultados e as conclusões do documento. A ordem e a extensão destes itens dependem do tipo de resumo (informativo ou indicativo) e do tratamento que cada item recebe no documento original. O resumo deve ser precedido da referência do documento, com exceção do resumo inserido no próprio documento. O resumo deve ser composto de uma sequência de frases concisas, afirmativas e não de enumeração de tópicos. Recomenda-se o uso de parágrafo único.",
    keywords: "Palavra 1; Palavra 2; Palavra 3.",
  },
  content: [],
  references: [],
  settings: {
    fontFamily: "Arial",
  },
};

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export const DocumentProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<DocumentState>(initialState);
  const [docId, setDocId] = useState<string | null>(null);
  const [headingPages, setHeadingPages] = useState<Record<string, number>>({});
  const [totalPages, setTotalPages] = useState(0);
  const isMounted = React.useRef(false);

  // Load from localStorage on mount
  useEffect(() => {
    const loadSavedState = () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          setState(JSON.parse(saved));
        } catch (err) {
          console.error("Failed to parse saved state", err);
        }
      }
      isMounted.current = true;
    };

    // Use a small delay or requestAnimationFrame to ensure this happens after hydration
    // and to avoid the strict synchronous setState lint error
    const timeoutId = setTimeout(loadSavedState, 0);
    return () => clearTimeout(timeoutId);
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    if (isMounted.current) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  // Auto-save to DB when in shared mode (debounced 1s)
  useEffect(() => {
    if (!isMounted.current || !docId) return;
    const timer = setTimeout(() => {
      fetch(`/api/documents/${docId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      }).catch(console.error);
    }, 1000);
    return () => clearTimeout(timer);
  }, [state, docId]);

  const updateCover = (data: Partial<DocumentState["cover"]>) =>
    setState((prev) => ({ ...prev, cover: { ...prev.cover, ...data } }));

  const updateTitlePage = (data: Partial<DocumentState["titlePage"]>) =>
    setState((prev) => ({ ...prev, titlePage: { ...prev.titlePage, ...data } }));

  const updateAbstract = (data: Partial<DocumentState["abstract"]>) =>
    setState((prev) => ({ ...prev, abstract: { ...prev.abstract, ...data } }));

  const addContentBlock = (block: ContentBlock) =>
    setState((prev) => ({ ...prev, content: [...prev.content, block] }));

  const updateContentBlock = (id: string, updated: Partial<ContentBlock>) =>
    setState((prev) => ({
      ...prev,
      content: prev.content.map((b) => (b.id === id ? { ...b, ...updated } : b)),
    }));

  const removeContentBlock = (id: string) =>
    setState((prev) => ({
      ...prev,
      content: prev.content.filter((b) => b.id !== id),
    }));

  const setContentBlocks = (blocks: ContentBlock[]) =>
    setState((prev) => ({ ...prev, content: blocks }));

  const addReference = (ref: ReferenceData) =>
    setState((prev) => ({ ...prev, references: [...prev.references, ref] }));

  const updateReference = (id: string, text: string) =>
    setState((prev) => ({
      ...prev,
      references: prev.references.map((r) => (r.id === id ? { ...r, text } : r)),
    }));

  const removeReference = (id: string) =>
    setState((prev) => ({
      ...prev,
      references: prev.references.filter((r) => r.id !== id),
    }));

  const updateSettings = (settings: Partial<DocumentSettings>) =>
    setState((prev) => ({ ...prev, settings: { ...prev.settings, ...settings } }));

  const exportConfig = () => {
    const dataStr = JSON.stringify(state, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'ABNT_CONFIG.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importConfig = (json: string) => {
    try {
      const parsed = JSON.parse(json);
      setState(parsed);
    } catch {
      alert("Arquivo de configuração inválido.");
    }
  };

  const resetToDefault = () => {
    if (confirm("Tem certeza que deseja resetar todas as configurações?")) {
      setState(initialState);
    }
  };

  return (
    <DocumentContext.Provider
      value={{
        state,
        docId,
        setDocId,
        headingPages,
        setHeadingPages,
        totalPages,
        setTotalPages,
        updateCover,
        updateTitlePage,
        updateAbstract,
        addContentBlock,
        updateContentBlock,
        removeContentBlock,
        setContentBlocks,
        addReference,
        updateReference,
        removeReference,
        updateSettings,
        exportConfig,
        importConfig,
        resetToDefault,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocumentContext = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error("useDocumentContext must be used within a DocumentProvider");
  }
  return context;
};
