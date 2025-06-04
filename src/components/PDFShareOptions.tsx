import React, { useState } from 'react';
import { 
  Share2, 
  Copy, 
  QrCode, 
  X, 
  Mail, 
  Link as LinkIcon
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface PDFShareOptionsProps {
  fileName: string;
  onClose: () => void;
}

const PDFShareOptions: React.FC<PDFShareOptionsProps> = ({ fileName, onClose }) => {
  const [shareUrl, setShareUrl] = useState<string>('https://example.com/shared-pdf');
  const [isPasswordProtected, setIsPasswordProtected] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [showQRCode, setShowQRCode] = useState<boolean>(false);
  
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: fileName,
          text: `Check out this PDF: ${fileName}`,
          url: shareUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      alert('Web Share API not supported in your browser');
    }
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        alert('Link copied to clipboard');
      })
      .catch(err => {
        console.error('Failed to copy link:', err);
      });
  };
  
  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Shared PDF: ${fileName}`);
    const body = encodeURIComponent(`Check out this PDF: ${shareUrl}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };
  
  const handleGenerateLink = () => {
    // This would normally generate a real sharing link
    const newUrl = `https://example.com/shared-pdf?id=${Date.now()}${isPasswordProtected ? '&protected=true' : ''}`;
    setShareUrl(newUrl);
    alert('Shareable link generated');
  };
  
  return (
    <div className="w-64 border-l border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex flex-col">
      <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-700">
        <h3 className="font-medium">Share Options</h3>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
          aria-label="Close share options"
        >
          <X size={18} />
        </button>
      </div>
      
      <div className="p-4 overflow-y-auto">
        {showQRCode ? (
          <div className="text-center">
            <h4 className="text-sm font-medium mb-4 text-slate-600 dark:text-slate-300">Scan QR Code</h4>
            <div className="bg-white p-4 rounded-lg inline-block mb-4">
              <QRCodeSVG value={shareUrl} size={200} />
            </div>
            <button
              onClick={() => setShowQRCode(false)}
              className="w-full py-2 border border-slate-300 dark:border-slate-600 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              Back to Share Options
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2 text-slate-600 dark:text-slate-300">Sharing Link</h4>
              <div className="flex items-center">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 p-2 border border-slate-300 dark:border-slate-600 rounded-l bg-slate-50 dark:bg-slate-700"
                />
                <button
                  onClick={handleCopyLink}
                  className="p-2 bg-blue-500 text-white rounded-r hover:bg-blue-600 transition-colors"
                  aria-label="Copy link"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2 text-slate-600 dark:text-slate-300">Password Protection</h4>
              <label className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={isPasswordProtected}
                  onChange={(e) => setIsPasswordProtected(e.target.checked)}
                  className="mr-2"
                />
                <span>Protect with password</span>
              </label>
              
              {isPasswordProtected && (
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700"
                />
              )}
            </div>
            
            <div className="mb-4">
              <button
                onClick={handleGenerateLink}
                className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <LinkIcon size={16} />
                Generate Shareable Link
              </button>
            </div>
            
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2 text-slate-600 dark:text-slate-300">Share via</h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleNativeShare}
                  className="p-2 rounded border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex flex-col items-center justify-center"
                >
                  <Share2 size={20} className="mb-1" />
                  <span className="text-xs">Share</span>
                </button>
                
                <button
                  onClick={handleEmailShare}
                  className="p-2 rounded border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex flex-col items-center justify-center"
                >
                  <Mail size={20} className="mb-1" />
                  <span className="text-xs">Email</span>
                </button>
                
                <button
                  onClick={() => setShowQRCode(true)}
                  className="p-2 rounded border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex flex-col items-center justify-center"
                >
                  <QrCode size={20} className="mb-1" />
                  <span className="text-xs">QR Code</span>
                </button>
                
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Check out this PDF: ${shareUrl}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex flex-col items-center justify-center"
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" className="mb-1">
                    <path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span className="text-xs">WhatsApp</span>
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PDFShareOptions;