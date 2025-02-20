import React, { useState } from 'react';
import { Eye, Copy, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export const TextObfuscator: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [method, setMethod] = useState<'base64' | 'caesar' | 'reverse'>('base64');
  const [shift, setShift] = useState(3);

  const obfuscate = () => {
    if (!input) return;

    let result = '';
    switch (method) {
      case 'base64':
        result = btoa(input);
        break;
      case 'caesar':
        result = input
          .split('')
          .map(char => {
            if (char.match(/[a-z]/i)) {
              const code = char.charCodeAt(0);
              const isUpperCase = code >= 65 && code <= 90;
              const base = isUpperCase ? 65 : 97;
              return String.fromCharCode(((code - base + shift) % 26) + base);
            }
            return char;
          })
          .join('');
        break;
      case 'reverse':
        result = input.split('').reverse().join('');
        break;
    }
    setOutput(result);
  };

  const deobfuscate = () => {
    if (!output) return;

    let result = '';
    switch (method) {
      case 'base64':
        try {
          result = atob(output);
        } catch {
          toast.error('Invalid Base64 string');
          return;
        }
        break;
      case 'caesar':
        result = output
          .split('')
          .map(char => {
            if (char.match(/[a-z]/i)) {
              const code = char.charCodeAt(0);
              const isUpperCase = code >= 65 && code <= 90;
              const base = isUpperCase ? 65 : 97;
              return String.fromCharCode(((code - base - shift + 26) % 26) + base);
            }
            return char;
          })
          .join('');
        break;
      case 'reverse':
        result = output.split('').reverse().join('');
        break;
    }
    setInput(result);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="glass p-6 rounded-xl">
      <div className="flex items-center mb-4">
        <Eye className="w-6 h-6 text-cyan-400 mr-2" />
        <h2 className="text-xl font-semibold text-cyan-400">Text Obfuscator</h2>
      </div>

      <div className="space-y-4">
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-cyan-300 mb-2">Method</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as 'base64' | 'caesar' | 'reverse')}
              className="w-full bg-gray-900/50 rounded-lg p-2 text-cyan-400"
            >
              <option value="base64">Base64</option>
              <option value="caesar">Caesar Cipher</option>
              <option value="reverse">Reverse</option>
            </select>
          </div>
          {method === 'caesar' && (
            <div className="flex-1">
              <label className="block text-cyan-300 mb-2">Shift</label>
              <input
                type="number"
                min="1"
                max="25"
                value={shift}
                onChange={(e) => setShift(Number(e.target.value))}
                className="w-full bg-gray-900/50 rounded-lg p-2 text-cyan-400"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-cyan-300 mb-2">Input Text</label>
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-gray-900/50 rounded-lg p-3 text-cyan-400 h-24"
              placeholder="Enter text to obfuscate..."
            />
            <button
              onClick={() => copyToClipboard(input)}
              className="absolute right-3 top-3 text-cyan-400 hover:text-cyan-300"
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={obfuscate}
            className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            Obfuscate ↓
          </button>
          <button
            onClick={deobfuscate}
            className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            Deobfuscate ↑
          </button>
        </div>

        <div>
          <label className="block text-cyan-300 mb-2">Output Text</label>
          <div className="relative">
            <textarea
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              className="w-full bg-gray-900/50 rounded-lg p-3 text-cyan-400 h-24"
              placeholder="Obfuscated text will appear here..."
            />
            <button
              onClick={() => copyToClipboard(output)}
              className="absolute right-3 top-3 text-cyan-400 hover:text-cyan-300"
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};