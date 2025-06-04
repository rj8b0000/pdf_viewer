import { create } from 'zustand';
import { PDFDocumentProxy } from 'pdfjs-dist';

export type ViewMode = 'single' | 'continuous' | 'fit-width';
export type AnnotationMode = 'none' | 'highlight' | 'draw' | 'text';
export type AnnotationColor = string;

interface PDFState {
  pdf: PDFDocumentProxy | null;
  currentPage: number;
  totalPages: number;
  zoom: number;
  rotation: number;
  viewMode: ViewMode;
  annotationMode: AnnotationMode;
  annotationColor: AnnotationColor;
  searchQuery: string;
  searchResults: number[];
  currentSearchIndex: number;
  
  // Actions
  setPdf: (pdf: PDFDocumentProxy) => void;
  setCurrentPage: (page: number) => void;
  setTotalPages: (pages: number) => void;
  setZoom: (zoom: number) => void;
  setRotation: (rotation: number) => void;
  setViewMode: (mode: ViewMode) => void;
  setAnnotationMode: (mode: AnnotationMode) => void;
  setAnnotationColor: (color: AnnotationColor) => void;
  setSearchQuery: (query: string) => void;
  setSearchResults: (results: number[]) => void;
  setCurrentSearchIndex: (index: number) => void;
  nextSearchResult: () => void;
  prevSearchResult: () => void;
  nextPage: () => void;
  prevPage: () => void;
  rotateClockwise: () => void;
  rotateCounterClockwise: () => void;
}

export const usePDFStore = create<PDFState>((set, get) => ({
  pdf: null,
  currentPage: 1,
  totalPages: 0,
  zoom: 1,
  rotation: 0,
  viewMode: 'single',
  annotationMode: 'none',
  annotationColor: '#FFFF00',
  searchQuery: '',
  searchResults: [],
  currentSearchIndex: -1,
  
  setPdf: (pdf) => set({ pdf }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setTotalPages: (pages) => set({ totalPages: pages }),
  setZoom: (zoom) => set({ zoom }),
  setRotation: (rotation) => set({ rotation }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setAnnotationMode: (mode) => set({ annotationMode: mode }),
  setAnnotationColor: (color) => set({ annotationColor: color }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSearchResults: (results) => set({ searchResults: results, currentSearchIndex: results.length > 0 ? 0 : -1 }),
  setCurrentSearchIndex: (index) => set({ currentSearchIndex: index }),
  
  nextSearchResult: () => {
    const { searchResults, currentSearchIndex } = get();
    if (searchResults.length === 0) return;
    
    const nextIndex = (currentSearchIndex + 1) % searchResults.length;
    set({ 
      currentSearchIndex: nextIndex,
      currentPage: searchResults[nextIndex]
    });
  },
  
  prevSearchResult: () => {
    const { searchResults, currentSearchIndex } = get();
    if (searchResults.length === 0) return;
    
    const prevIndex = (currentSearchIndex - 1 + searchResults.length) % searchResults.length;
    set({ 
      currentSearchIndex: prevIndex,
      currentPage: searchResults[prevIndex]
    });
  },
  
  nextPage: () => {
    const { currentPage, totalPages } = get();
    if (currentPage < totalPages) {
      set({ currentPage: currentPage + 1 });
    }
  },
  
  prevPage: () => {
    const { currentPage } = get();
    if (currentPage > 1) {
      set({ currentPage: currentPage - 1 });
    }
  },
  
  rotateClockwise: () => {
    const { rotation } = get();
    set({ rotation: (rotation + 90) % 360 });
  },
  
  rotateCounterClockwise: () => {
    const { rotation } = get();
    set({ rotation: (rotation - 90 + 360) % 360 });
  }
}));