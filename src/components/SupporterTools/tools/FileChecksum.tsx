import React, { useState, useRef } from 'react';
import { FileDigit, Copy, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

export const FileChecksum: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [algorithm, setAlgorithm] = useState<'SHA-256' | 'SHA-512'>('SHA-256');
  const [checksum, setChecksum] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const calculateChecksum = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest(algorithm, buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setLoading(true);

    try {
      const hash = await calculateChecksum(selectedFile);
      setChecksum(hash);
      toast.success('Checksum calculated successfully!');
    } catch (error) {
      toast.error('Failed to calculate checksum');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(checksum);
    toast.success('Checksum copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <FileDigit className="w-6 h-6 text-purple-400 mr-2" />
        <h2 className="text-xl font-semibold text-purple-400">File Checksum</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-purple-300 mb-2">
            Hash Algorithm
          </label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value as 'SHA-256' | 'SHA-512')}
            className="w-full"
          >
            <option value="SHA-256">SHA-256</option>
            <option value="SHA-512">SHA-512</option>
          </select>
        </div>

        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-purple-500/20 rounded-lg">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Upload className="w-12 h-12 text-purple-400 mb-4" />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn btn-primary"
          >
            Select File
          </button>
          {file && (
            <p className="mt-4 text-purple-300">
              Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </p>
          )}
        </div>

        {loading && (
          <div className="text-center text-purple-300">
            Calculating checksum...
          </div>
        )}

        {checksum && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-purple-300">
              {algorithm} Checksum
            </label>
            <div className="relative">
              <input
                type="text"
                value={checksum}
                readOnly
                className="w-full font-mono text-sm pr-10"
              />
              <button
                onClick={copyToClipboard}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-300"
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};