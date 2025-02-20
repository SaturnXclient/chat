import React, { useState } from 'react';
import { Key, Copy, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export const PasswordGenerator: React.FC = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [useUppercase, setUseUppercase] = useState(true);

  const generatePassword = () => {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let chars = lowercase;
    if (useUppercase) chars += uppercase;
    if (useNumbers) chars += numbers;
    if (useSymbols) chars += symbols;

    let result = '';
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length];
    }

    setPassword(result);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    toast.success('Password copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <Key className="w-6 h-6 text-cyan-400 mr-2" />
        <h2 className="text-xl font-semibold text-cyan-400">Password Generator</h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-cyan-300">Length: {length}</label>
          <input
            type="range"
            min="8"
            max="32"
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
            className="w-1/2"
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={useUppercase}
              onChange={(e) => setUseUppercase(e.target.checked)}
              className="mr-2"
            />
            <span className="text-cyan-300">Uppercase</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={useNumbers}
              onChange={(e) => setUseNumbers(e.target.checked)}
              className="mr-2"
            />
            <span className="text-cyan-300">Numbers</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={useSymbols}
              onChange={(e) => setUseSymbols(e.target.checked)}
              className="mr-2"
            />
            <span className="text-cyan-300">Symbols</span>
          </label>
        </div>

        <div className="relative">
          <input
            type="text"
            value={password}
            readOnly
            className="w-full bg-gray-900/50 rounded-lg p-3 text-cyan-400 font-mono"
            placeholder="Generated password will appear here"
          />
          {password && (
            <button
              onClick={copyToClipboard}
              className="absolute right-12 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-cyan-300"
            >
              <Copy className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={generatePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-cyan-300"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        <button
          onClick={generatePassword}
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          Generate Password
        </button>
      </div>
    </div>
  );
};