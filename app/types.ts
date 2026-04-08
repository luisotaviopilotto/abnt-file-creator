// app/types.ts

export interface CoverData {
  institution: string;
  course: string;
  author: string;
  title: string;
  subtitle: string;
  city: string;
  year: string;
}

export interface TitlePageData {
  author: string;
  title: string;
  subtitle: string;
  objective: string;
  advisor: string;
  local: string;
  year: string;
}

export interface AbstractData {
  text: string;
  keywords: string[];
}

export interface ContentSection {
  id: string;
  title: string;
  content: string;
  subsections: Subsection[];
}

export interface Subsection {
  id: string;
  title: string;
  content: string;
  topics?: Topic[];
}

export interface Topic {
  id: string;
  title: string;
  content: string;
}

export interface ContentData {
  introduction: string;
  development: {
    sections: ContentSection[];
  };
  conclusion: string;
}

export interface Reference {
  id: string;
  type: 'book' | 'article' | 'thesis' | 'website';
  authors: string[];
  title: string;
  year: string;
  publisher?: string;
  journal?: string;
  volume?: string;
  pages?: string;
  url?: string;
  accessDate?: string;
}

export interface TechnicalSettings {
  font: 'Arial' | 'Times New Roman';
  fontSize: number;
  lineSpacing: number;
  margins: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

export interface DocumentData {
  cover: CoverData;
  titlePage: TitlePageData;
  abstract: AbstractData;
  content: ContentData;
  references: Reference[];
  settings: TechnicalSettings;
}