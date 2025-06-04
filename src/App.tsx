import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import PDFViewer from './components/PDFViewer';
import FileUpload from './components/FileUpload';

function App() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  return (
    <ThemeProvider>
      <Layout>
        {!pdfFile ? (
          <FileUpload onFileSelect={setPdfFile} />
        ) : (
          <PDFViewer file={pdfFile} onClose={() => setPdfFile(null)} />
        )}
      </Layout>
    </ThemeProvider>
  );
}

export default App;