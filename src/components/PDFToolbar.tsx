import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  RotateCcw,
  Download, 
  Printer, 
  Search, 
  Maximize, 
  Sidebar, 
  PenTool, 
  Share2, 
  X,
  Layout
} from 'lucide-react';
import { usePDFStore } from '../store/pdfStore';

interface PDFToolbarProps {
  fileName: string;
  onToggleSidebar: () => void;
  onToggleAnnotationTools: () => void;
  onToggleShareOptions: () => void;
  onClose: () => void;
}

const PDFToolbar: React.FC<PDFToolbarProps> = ({ 
  fileName, 
  onToggleSidebar, 
  onToggleAnnotationTools,
  onToggleShareOptions,
  onClose 
}) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { 
    currentPage, 
    totalPages, 
    zoom, 
    viewMode,
    setCurrentPage, 
    setZoom, 
    setViewMode,
    rotateClockwise, 
    rotateCounterClockwise,
    nextPage,
    prevPage
  } = usePDFStore();

  const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const page = parseInt(e.target.value);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleZoomIn = () => {
    setZoom(Math.min(4, zoom + 0.1));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(0.25, zoom - 0.1));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search functionality will be implemented in a separate component
    console.log('Searching for:', searchQuery);
  };

  const handleFullscreen = () => {
    const element = document.documentElement;
    
    if (!document.fullscreenElement) {
      element.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create a download link for the original file
    const url = URL.createObjectURL(new Blob([fileName], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 py-2 px-4 flex flex-wrap items-center gap-2">
      {/* Left section: Navigation controls */}
      <div className="flex items-center gap-1 mr-4">
        <button 
          onClick={prevPage}
          disabled={currentPage <= 1}
          className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          <ChevronLeft size={20} />
        </button>
        
        <div className="flex items-center">
          <input
            type="number"
            min={1}
            max={totalPages}
            value={currentPage}
            onChange={handlePageChange}
            className="w-12 text-center border border-slate-300 dark:border-slate-600 rounded p-1 dark:bg-slate-700"
            aria-label="Current page"
          />
          <span className="mx-1 text-slate-500 dark:text-slate-400">/ {totalPages}</span>
        </div>
        
        <button 
          onClick={nextPage}
          disabled={currentPage >= totalPages}
          className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      
      {/* Middle section: View controls */}
      <div className="flex items-center gap-1 mr-4">
        <button 
          onClick={handleZoomOut}
          className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
          aria-label="Zoom out"
        >
          <ZoomOut size={20} />
        </button>
        
        <span className="mx-1">
          {Math.round(zoom * 100)}%
        </span>
        
        <button 
          onClick={handleZoomIn}
          className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
          aria-label="Zoom in"
        >
          <ZoomIn size={20} />
        </button>
        
        <select
          value={viewMode}
          onChange={(e) => setViewMode(e.target.value as any)}
          className="ml-2 border border-slate-300 dark:border-slate-600 rounded p-1 bg-white dark:bg-slate-700"
          aria-label="View mode"
        >
          <option value="single">Single Page</option>
          <option value="continuous">Continuous</option>
          <option value="fit-width">Fit Width</option>
        </select>
      </div>
      
      {/* Rotation controls */}
      <div className="flex items-center gap-1 mr-4">
        <button 
          onClick={rotateCounterClockwise}
          className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
          aria-label="Rotate counterclockwise"
        >
          <RotateCcw size={20} />
        </button>
        
        <button 
          onClick={rotateClockwise}
          className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
          aria-label="Rotate clockwise"
        >
          <RotateCw size={20} />
        </button>
      </div>
      
      {/* Right section: Tools */}
      <div className="flex items-center gap-1 ml-auto">
        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
          aria-label="Search"
        >
          <Search size={20} />
        </button>
        
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
          aria-label="Toggle sidebar"
        >
          <Sidebar size={20} />
        </button>
        
        <button
          onClick={onToggleAnnotationTools}
          className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
          aria-label="Annotation tools"
        >
          <PenTool size={20} />
        </button>
        
        <button
          onClick={handleDownload}
          className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
          aria-label="Download"
        >
          <Download size={20} />
        </button>
        
        <button
          onClick={handlePrint}
          className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
          aria-label="Print"
        >
          <Printer size={20} />
        </button>
        
        <button
          onClick={onToggleShareOptions}
          className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
          aria-label="Share"
        >
          <Share2 size={20} />
        </button>
        
        <button
          onClick={handleFullscreen}
          className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
          aria-label="Fullscreen"
        >
          <Maximize size={20} />
        </button>
        
        <button
          onClick={onClose}
          className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>
      
      {/* Search bar (conditionally rendered) */}
      {searchOpen && (
        <div className="w-full mt-2">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in document..."
              className="flex-1 border border-slate-300 dark:border-slate-600 rounded-l p-2 dark:bg-slate-700"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-3 rounded-r hover:bg-blue-600 transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PDFToolbar;