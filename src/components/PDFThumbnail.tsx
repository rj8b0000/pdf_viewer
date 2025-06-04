import React from 'react';

interface PDFThumbnailProps {
  pageNumber: number;
  isActive: boolean;
  thumbnailUrl: string | undefined;
  onClick: () => void;
}

const PDFThumbnail: React.FC<PDFThumbnailProps> = ({ 
  pageNumber, 
  isActive, 
  thumbnailUrl,
  onClick 
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        relative cursor-pointer rounded overflow-hidden border
        ${isActive 
          ? 'border-blue-500 ring-2 ring-blue-300 dark:ring-blue-700' 
          : 'border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500'
        }
        transition-all duration-200
      `}
    >
      <div className="relative pb-[141%]">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={`Page ${pageNumber} thumbnail`}
            className="absolute top-0 left-0 w-full h-full object-contain bg-white dark:bg-slate-700"
          />
        ) : (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-700">
            <div className="w-6 h-6 border-2 border-slate-400 dark:border-slate-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-800/80 text-center py-1 text-xs">
        Page {pageNumber}
      </div>
    </div>
  );
};

export default PDFThumbnail;