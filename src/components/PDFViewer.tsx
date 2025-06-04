import React, { useState, useEffect, useRef } from 'react';
import * as PDFJS from 'pdfjs-dist';
import PDFToolbar from './PDFToolbar';
import PDFPage from './PDFPage';
import PDFSidebar from './PDFSidebar';
import PDFAnnotationToolbar from './PDFAnnotationToolbar';
import PDFShareOptions from './PDFShareOptions';
import { usePDFStore } from '../store/pdfStore';

// Initialize PDF.js worker
PDFJS.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  file: File;
  onClose: () => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ file, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showAnnotationTools, setShowAnnotationTools] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  
  const viewerRef = useRef<HTMLDivElement>(null);
  
  const { 
    pdf, 
    totalPages, 
    currentPage, 
    zoom, 
    rotation,
    viewMode,
    setPdf,
    setTotalPages
  } = usePDFStore();

  // Load the PDF
  useEffect(() => {
    const loadPDF = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Convert file to ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        
        // Load PDF document
        const loadingTask = PDFJS.getDocument({ data: arrayBuffer });
        const pdfDocument = await loadingTask.promise;
        
        setPdf(pdfDocument);
        setTotalPages(pdfDocument.numPages);
        setLoading(false);
      } catch (err) {
        console.error('Error loading PDF:', err);
        setError('Failed to load the PDF file. The file may be corrupted or password protected.');
        setLoading(false);
      }
    };
    
    loadPDF();
    
    // Cleanup
    return () => {
      if (pdf) {
        pdf.destroy();
      }
    };
  }, [file, setPdf, setTotalPages]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const { key, ctrlKey } = e;
      
      // Prevent default behavior for certain key combinations
      if (
        (key === 'ArrowLeft' || key === 'ArrowRight' || key === 'ArrowUp' || key === 'ArrowDown') ||
        (ctrlKey && (key === '+' || key === '-'))
      ) {
        e.preventDefault();
      }
      
      // Navigation
      if (key === 'ArrowLeft' || key === 'PageUp') {
        usePDFStore.getState().setCurrentPage(Math.max(1, currentPage - 1));
      } else if (key === 'ArrowRight' || key === 'PageDown') {
        usePDFStore.getState().setCurrentPage(Math.min(totalPages, currentPage + 1));
      } else if (key === 'Home') {
        usePDFStore.getState().setCurrentPage(1);
      } else if (key === 'End') {
        usePDFStore.getState().setCurrentPage(totalPages);
      }
      
      // Zoom
      if (ctrlKey && key === '+') {
        usePDFStore.getState().setZoom(Math.min(4, zoom + 0.1));
      } else if (ctrlKey && key === '-') {
        usePDFStore.getState().setZoom(Math.max(0.25, zoom - 0.1));
      } else if (ctrlKey && key === '0') {
        usePDFStore.getState().setZoom(1);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentPage, totalPages, zoom]);

  if (loading) {
    return (
      <div className="h-[calc(100vh-180px)] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg">Loading PDF...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[calc(100vh-180px)] flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <div className="text-red-500 text-xl mb-2">Error</div>
          <p className="mb-4">{error}</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Upload a Different File
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-180px)] flex flex-col">
      <PDFToolbar 
        fileName={file.name}
        onToggleSidebar={() => setShowSidebar(!showSidebar)}
        onToggleAnnotationTools={() => setShowAnnotationTools(!showAnnotationTools)}
        onToggleShareOptions={() => setShowShareOptions(!showShareOptions)}
        onClose={onClose}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {showSidebar && (
          <PDFSidebar />
        )}
        
        <div className="flex-1 overflow-auto bg-slate-200 dark:bg-slate-800" ref={viewerRef}>
          <div 
            className={`mx-auto transition-all duration-200 ${
              viewMode === 'single' ? 'space-y-4' : ''
            }`}
            style={{
              maxWidth: viewMode === 'fit-width' ? '100%' : '1000px',
              padding: '1rem',
            }}
          >
            {pdf && Array.from(new Array(totalPages), (_, i) => (
              <PDFPage 
                key={`page_${i + 1}`} 
                pageNumber={i + 1} 
                pdf={pdf}
                visible={viewMode === 'continuous' || i + 1 === currentPage}
              />
            ))}
          </div>
        </div>
        
        {showAnnotationTools && (
          <PDFAnnotationToolbar onClose={() => setShowAnnotationTools(false)} />
        )}
        
        {showShareOptions && (
          <PDFShareOptions 
            fileName={file.name} 
            onClose={() => setShowShareOptions(false)} 
          />
        )}
      </div>
    </div>
  );
};

export default PDFViewer;