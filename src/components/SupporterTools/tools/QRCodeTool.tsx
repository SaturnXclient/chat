import React, { useState } from 'react';
import { QrCode, Copy, Download } from 'lucide-react';
import toast from 'react-hot-toast';

export const QRCodeTool: React.FC = () => {
  const [text, setText] = useState('');
  const [size, setSize] = useState(200);
  const [color, setColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');

  const getQRCodeUrl = () => {
    const encoded = encodeURIComponent(text);
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}&color=${color.replace('#', '')}&bgcolor=${bgColor.replace('#', '')}`;
  };

  const copyQRLink = () => {
    navigator.clipboard.writeText(text);
    toast.success('Link copied to clipboard!');
  };

  const downloadQR = async () => {
    try {
      const response = await fetch(getQRCodeUrl());
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'qrcode.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('QR Code downloaded!');
    } catch (error) {
      toast.error('Failed to download QR Code');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <QrCode className="w-6 h-6 text-purple-400 mr-2" />
        <h2 className="text-xl font-semibold text-purple-400">QR Code Generator</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">
              Text or URL
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-32"
              placeholder="Enter text or URL to generate QR code..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">
              Size (px)
            </label>
            <input
              type="range"
              min="100"
              max="500"
              step="50"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-sm text-gray-400 mt-1">{size}px</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">
                QR Color
              </label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full h-10 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">
                Background
              </label>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-full h-10 rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center space-y-4">
          {text && (
            <>
              <div className="bg-white p-4 rounded-lg">
                <img
                  src={getQRCodeUrl()}
                  alt="Generated QR Code"
                  className="max-w-full h-auto"
                />
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={copyQRLink}
                  className="btn btn-secondary flex items-center gap-2"
                >
                  <Copy className="w-5 h-5" />
                  <span>Copy Link</span>
                </button>
                <button
                  onClick={downloadQR}
                  className="btn btn-primary flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  <span>Download</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};