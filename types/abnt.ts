export interface CoverData {
  institution: string;
  course: string;
  author: string;
  title: string;
  subtitle: string;
  city: string;
  year: string;
  showLogo?: boolean;
  logoUrl?: string;
  logoPosition?: 'left' | 'center' | 'right';
}

export interface TitlePageData {
  author: string;
  title: string;
  subtitle: string;
  objective: string;
  advisor: string;
  city: string;
  year: string;
}

export interface AbstractData {
  text: string;
  keywords: string;
}

export interface TableData {
  rows: string[][];
  caption: string;
  source: string;
  hasHeaderRow?: boolean;
  hasHeaderCol?: boolean;
}

export interface ImageData {
  url: string;
  caption: string;
  source: string;
}

export interface ContentBlock {
  id: string;
  type: 'h1' | 'h2' | 'h3' | 'paragraph' | 'quote' | 'image' | 'table';
  content: string; // Used for text blocks
  tableData?: TableData;
  imageData?: ImageData;
  numbering?: string;
  isContinued?: boolean;
  isContinuation?: boolean;
}

export interface ReferenceData {
  id: string;
  text: string;
}

export interface DocumentSettings {
  fontFamily: 'Arial' | 'Times New Roman';
}

export interface DocumentState {
  cover: CoverData;
  titlePage: TitlePageData;
  abstract: AbstractData;
  content: ContentBlock[];
  references: ReferenceData[];
  settings: DocumentSettings;
}
