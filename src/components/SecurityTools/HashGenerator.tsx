import React, { useState, useCallback } from 'react';
import { Hash, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

export const HashGenerator: React.FC = () => {
  const [input, setInput] = useState('');
  const [algorithm, setAlgorithm] = useState<'SHA-256' | 'SHA-512'>('SHA-256');
  const [hash, setHash] = useState('');

  const generateHash = useCallback(async () => {
    if (!input) return;

    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest(algorithm, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    setHash(hashHex);
  }, [input, algorithm]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(hash);
    toast.success('Hash copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <Hash className="w-6 h-6 text-cyan-400 mr-2" />
        <h2 className="text-xl font-semibold text-cyan-400">Hash Generator</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-cyan-300 mb-2">Algorithm</label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value as 'SHA-256' | 'SHA-512')}
            className="w-full bg-gray-900/50 rounded-lg p-2 text-cyan-400"
          >
            <option value="SHA-256">SHA-256</option>
            <option value="SHA-512">SHA-512</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-cyan-300 mb-2">Input Text</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full bg-gray-900/50 rounded-lg p-3 text-cyan-400 h-24"
            placeholder="Enter text to hash..."
          />
        </div>

        <button
          onClick={generateHash}
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          Generate Hash
        </button>

        {hash && (
          <div className="relative">
            <label className="block text-sm font-medium text-cyan-300 mb-2">Generated Hash</label>
            <div className="relative">
              <input
                type="text"
                value={hash}
                readOnly
                className="w-full bg-gray-900/50 rounded-lg p-3 text-cyan-400 font-mono text-sm"
              />
              <button
                onClick={copyToClipboard}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-cyan-300"
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