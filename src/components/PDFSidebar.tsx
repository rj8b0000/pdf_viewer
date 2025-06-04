import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/Tabs';
import { usePDFStore } from '../store/pdfStore';
import PDFThumbnail from './PDFThumbnail';

const PDFSidebar: React.FC = () => {
  const [thumbnails, setThumbnails] = useState<{ [key: number]: string }>({});
  const { pdf, totalPages, currentPage, setCurrentPage } = usePDFStore();
  
  // Generate thumbnails
  useEffect(() => {
    if (!pdf) return;
    
    const loadThumbnails = async () => {
      const newThumbnails: { [key: number]: string } = {};
      
      // Load thumbnails for visible pages first
      const visibleRange = 5;
      const start = Math.max(1, currentPage - Math.floor(visibleRange / 2));
      const end = Math.min(totalPages, start + visibleRange - 1);
      
      for (let i = start; i <= end; i++) {
        if (!thumbnails[i]) {
          try {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 0.2 });
            
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            
            await page.render({
              canvasContext: context!,
              viewport: viewport
            }).promise;
            
            newThumbnails[i] = canvas.toDataURL();
          } catch (error) {
            console.error(`Error generating thumbnail for page ${i}:`, error);
          }
        }
      }
      
      setThumbnails(prev => ({ ...prev, ...newThumbnails }));
      
      // Load remaining thumbnails in the background
      setTimeout(async () => {
        const remainingThumbnails: { [key: number]: string } = {};
        
        for (let i = 1; i <= totalPages; i++) {
          if (!thumbnails[i] && !newThumbnails[i]) {
            try {
              const page = await pdf.getPage(i);
              const viewport = page.getViewport({ scale: 0.2 });
              
              const canvas = document.createElement('canvas');
              const context = canvas.getContext('2d');
              canvas.width = viewport.width;
              canvas.height = viewport.height;
              
              await page.render({
                canvasContext: context!,
                viewport: viewport
              }).promise;
              
              remainingThumbnails[i] = canvas.toDataURL();
            } catch (error) {
              console.error(`Error generating thumbnail for page ${i}:`, error);
            }
          }
        }
        
        setThumbnails(prev => ({ ...prev, ...remainingThumbnails }));
      }, 100);
    };
    
    loadThumbnails();
  }, [pdf, currentPage, totalPages]);

  return (
    <div className="w-64 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex flex-col">
      <Tabs defaultValue="thumbnails" className="flex flex-col h-full">
        <TabsList className="grid grid-cols-2 p-1 m-2 bg-slate-100 dark:bg-slate-700 rounded">
          <TabsTrigger value="thumbnails">Thumbnails</TabsTrigger>
          <TabsTrigger value="outline">Outline</TabsTrigger>
        </TabsList>
        
        <TabsContent value="thumbnails" className="flex-1 overflow-y-auto p-2">
          <div className="space-y-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
              <PDFThumbnail
                key={pageNum}
                pageNumber={pageNum}
                isActive={pageNum === currentPage}
                thumbnailUrl={thumbnails[pageNum]}
                onClick={() => setCurrentPage(pageNum)}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="outline" className="flex-1 overflow-y-auto p-2">
          <div className="text-center text-slate-500 dark:text-slate-400 py-4">
            Outline information not available
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PDFSidebar;