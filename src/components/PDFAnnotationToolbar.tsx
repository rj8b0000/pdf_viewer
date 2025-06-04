import React from 'react';
import { 
  Highlighter, 
  Pencil, 
  Type, 
  X,
  Square,
  Circle,
  ArrowRight
} from 'lucide-react';
import { usePDFStore } from '../store/pdfStore';
import { HexColorPicker } from 'react-colorful';

interface PDFAnnotationToolbarProps {
  onClose: () => void;
}

const PDFAnnotationToolbar: React.FC<PDFAnnotationToolbarProps> = ({ onClose }) => {
  const { 
    annotationMode, 
    annotationColor,
    setAnnotationMode,
    setAnnotationColor
  } = usePDFStore();
  
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  return (
    <div className="w-64 border-l border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex flex-col">
      <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-700">
        <h3 className="font-medium">Annotation Tools</h3>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
          aria-label="Close annotation toolbar"
        >
          <X size={18} />
        </button>
      </div>
      
      <div className="p-4">
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2 text-slate-600 dark:text-slate-300">Tool Selection</h4>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setAnnotationMode('highlight')}
              className={`p-2 rounded flex flex-col items-center justify-center text-xs ${
                annotationMode === 'highlight' 
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                  : 'hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Highlighter size={18} className="mb-1" />
              Highlight
            </button>
            
            <button
              onClick={() => setAnnotationMode('draw')}
              className={`p-2 rounded flex flex-col items-center justify-center text-xs ${
                annotationMode === 'draw' 
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                  : 'hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Pencil size={18} className="mb-1" />
              Draw
            </button>
            
            <button
              onClick={() => setAnnotationMode('text')}
              className={`p-2 rounded flex flex-col items-center justify-center text-xs ${
                annotationMode === 'text' 
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                  : 'hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Type size={18} className="mb-1" />
              Text
            </button>
            
            <button
              onClick={() => setAnnotationMode('rectangle')}
              className={`p-2 rounded flex flex-col items-center justify-center text-xs ${
                annotationMode === 'rectangle' 
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                  : 'hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Square size={18} className="mb-1" />
              Rectangle
            </button>
            
            <button
              onClick={() => setAnnotationMode('circle')}
              className={`p-2 rounded flex flex-col items-center justify-center text-xs ${
                annotationMode === 'circle' 
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                  : 'hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Circle size={18} className="mb-1" />
              Circle
            </button>
            
            <button
              onClick={() => setAnnotationMode('arrow')}
              className={`p-2 rounded flex flex-col items-center justify-center text-xs ${
                annotationMode === 'arrow' 
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                  : 'hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <ArrowRight size={18} className="mb-1" />
              Arrow
            </button>
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2 text-slate-600 dark:text-slate-300">Color Selection</h4>
          <div className="relative">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded flex items-center"
            >
              <div 
                className="w-6 h-6 rounded mr-2 border border-slate-300 dark:border-slate-600" 
                style={{ backgroundColor: annotationColor }}
              />
              <span>{annotationColor}</span>
            </button>
            
            {showColorPicker && (
              <div className="absolute z-10 mt-2 bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
                <HexColorPicker 
                  color={annotationColor} 
                  onChange={setAnnotationColor} 
                />
                <div className="grid grid-cols-5 gap-1 mt-2">
                  {['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', 
                    '#00FFFF', '#FFA500', '#800080', '#008000', '#000000'].map(color => (
                    <button
                      key={color}
                      onClick={() => {
                        setAnnotationColor(color);
                        setShowColorPicker(false);
                      }}
                      className="w-6 h-6 rounded border border-slate-300 dark:border-slate-600"
                      style={{ backgroundColor: color }}
                      aria-label={`Select color ${color}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-6">
          <button
            onClick={() => setAnnotationMode('none')}
            className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Clear Selection
          </button>
          <button
            onClick={() => {
              // This would normally save annotations
              alert('Annotations saved');
            }}
            className="w-full mt-2 py-2 border border-slate-300 dark:border-slate-600 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            Save Annotations
          </button>
        </div>
      </div>
    </div>
  );
};

export default PDFAnnotationToolbar;