import { ContentBlock } from "@/types/abnt";

/**
 * Calcula a numeração ABNT para títulos (1, 1.1, 1.1.1, etc)
 * com base na ordem dos blocos no array de conteúdo.
 */
export const calculateHeadingNumbering = (content: ContentBlock[]) => {
  const numberingMap: Record<string, string> = {};
  let h1Count = 0;
  let h2Count = 0;
  let h3Count = 0;

  content.forEach((block) => {
    if (block.type === "h1") {
      h1Count++;
      h2Count = 0;
      h3Count = 0;
      numberingMap[block.id] = `${h1Count}`;
    } else if (block.type === "h2") {
      h2Count++;
      h3Count = 0;
      numberingMap[block.id] = `${h1Count}.${h2Count}`;
    } else if (block.type === "h3") {
      h3Count++;
      numberingMap[block.id] = `${h1Count}.${h2Count}.${h3Count}`;
    }
  });

  return numberingMap;
};
