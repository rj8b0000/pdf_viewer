import React, { useEffect, useRef, useState } from 'react';
import { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';
import { usePDFStore } from '../store/pdfStore';

interface PDFPageProps {
  pageNumber: number;
  pdf: PDFDocumentProxy;
  visible: boolean;
}

const PDFPage: React.FC<PDFPageProps> = ({ pageNumber, pdf, visible }) => {
  const [page, setPage] = useState<PDFPageProxy | null>(null);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const annotationLayerRef = useRef<HTMLDivElement>(null);
  const textLayerRef = useRef<HTMLDivElement>(null);
  
  const { zoom, rotation, annotationMode, annotationColor } = usePDFStore();
  
  // Load the page
  useEffect(() => {
    if (!pdf || !visible) return;
    
    const loadPage = async () => {
      try {
        const pdfPage = await pdf.getPage(pageNumber);
        setPage(pdfPage);
      } catch (err) {
        console.error(`Error loading page ${pageNumber}:`, err);
        setError(`Failed to load page ${pageNumber}`);
      }
    };
    
    loadPage();
    
    // Cleanup
    return () => {
      if (page) {
        page.cleanup();
      }
    };
  }, [pdf, pageNumber, visible]);
  
  // Render the page
  useEffect(() => {
    if (!page || !canvasRef.current) return;
    
    const renderPage = async () => {
      const canvas = canvasRef.current!;
      const context = canvas.getContext('2d')!;
      
      // Calculate viewport with zoom and rotation
      const viewport = page.getViewport({ 
        scale: zoom, 
        rotation 
      });
      
      // Set canvas dimensions
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      
      // Render the page
      await page.render({
        canvasContext: context,
        viewport
      }).promise;
      
      // Text layer rendering would be added here
      // Annotation layer would be added here
    };
    
    renderPage();
  }, [page, zoom, rotation]);
  
  // Handle annotations
  useEffect(() => {
    if (!page || !annotationLayerRef.current || annotationMode === 'none') return;
    
    const annotationLayer = annotationLayerRef.current!;
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    
    const startDrawing = (e: MouseEvent) => {
      if (annotationMode === 'none') return;
      
      isDrawing = true;
      const rect = annotationLayer.getBoundingClientRect();
      lastX = e.clientX - rect.left;
      lastY = e.clientY - rect.top;
      
      if (annotationMode === 'highlight') {
        const highlight = document.createElement('div');
        highlight.className = 'absolute opacity-40';
        highlight.style.backgroundColor = annotationColor;
        highlight.style.left = `${lastX}px`;
        highlight.style.top = `${lastY}px`;
        highlight.dataset.type = 'highlight';
        annotationLayer.appendChild(highlight);
      }
    };
    
    const draw = (e: MouseEvent) => {
      if (!isDrawing) return;
      
      const rect = annotationLayer.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;
      
      if (annotationMode === 'highlight') {
        const highlight = annotationLayer.lastChild as HTMLDivElement;
        const width = Math.abs(currentX - lastX);
        const height = Math.abs(currentY - lastY);
        const left = Math.min(lastX, currentX);
        const top = Math.min(lastY, currentY);
        
        highlight.style.width = `${width}px`;
        highlight.style.height = `${height}px`;
        highlight.style.left = `${left}px`;
        highlight.style.top = `${top}px`;
      } else if (annotationMode === 'draw') {
        const line = document.createElement('div');
        line.className = 'absolute';
        line.style.backgroundColor = annotationColor;
        line.style.width = '2px';
        line.style.height = '2px';
        line.style.left = `${currentX}px`;
        line.style.top = `${currentY}px`;
        line.dataset.type = 'draw';
        annotationLayer.appendChild(line);
      }
    };
    
    const stopDrawing = () => {
      isDrawing = false;
    };
    
    annotationLayer.addEventListener('mousedown', startDrawing);
    annotationLayer.addEventListener('mousemove', draw);
    annotationLayer.addEventListener('mouseup', stopDrawing);
    annotationLayer.addEventListener('mouseleave', stopDrawing);
    
    return () => {
      annotationLayer.removeEventListener('mousedown', startDrawing);
      annotationLayer.removeEventListener('mousemove', draw);
      annotationLayer.removeEventListener('mouseup', stopDrawing);
      annotationLayer.removeEventListener('mouseleave', stopDrawing);
    };
  }, [page, annotationMode, annotationColor]);
  
  if (error) {
    return (
      <div className="bg-white dark:bg-slate-800 shadow-md rounded p-4 mb-4">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }
  
  if (!visible) {
    return null;
  }
  
  return (
    <div className="relative bg-white dark:bg-slate-800 shadow-md rounded overflow-hidden mb-4">
      <div className="absolute top-0 left-0 p-2 text-sm text-slate-500 dark:text-slate-400 bg-white/70 dark:bg-slate-800/70 rounded-br">
        Page {pageNumber}
      </div>
      <div className="relative">
        <canvas ref={canvasRef} className="block max-w-full" />
        <div 
          ref={annotationLayerRef} 
          className="absolute top-0 left-0 w-full h-full pointer-events-auto" 
        />
        <div 
          ref={textLayerRef} 
          className="absolute top-0 left-0 w-full h-full pointer-events-none" 
        />
      </div>
    </div>
  );
};

export default PDFPage;