import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    
    // Validate file type
    if (file.type !== 'application/pdf') {
      setError('Only PDF files are supported');
      return;
    }
    
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError('File size exceeds the maximum limit of 50MB');
      return;
    }

    setError(null);
    onFileSelect(file);
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxSize: MAX_FILE_SIZE,
    multiple: false,
  });

  // Update isDragging state when drag state changes
  React.useEffect(() => {
    setIsDragging(isDragActive);
  }, [isDragActive]);

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-180px)]">
      <div
        {...getRootProps()}
        className={`
          w-full max-w-2xl p-10 border-2 border-dashed rounded-lg text-center
          transition-all duration-200 ease-in-out cursor-pointer
          ${isDragging 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-slate-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600'
          }
          dark:bg-slate-800/50
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Upload PDF File</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-4">
              Drag & drop your PDF here, or click to browse
            </p>
            <span className="inline-block px-4 py-2 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 transition-colors">
              Browse Files
            </span>
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Maximum file size: 50MB
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 text-red-500 flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;