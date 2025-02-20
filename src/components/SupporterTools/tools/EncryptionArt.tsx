import React, { useState, useRef, useEffect } from 'react';
import { Palette, Download, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export const EncryptionArt: React.FC = () => {
  const [text, setText] = useState('');
  const [pattern, setPattern] = useState<string[][]>([]);
  const [colorScheme, setColorScheme] = useState('cyber');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const colorSchemes = {
    cyber: ['#06b6d4', '#3b82f6', '#6366f1'],
    neon: ['#f0abfc', '#818cf8', '#34d399'],
    sunset: ['#f43f5e', '#fb923c', '#facc15'],
    matrix: ['#22c55e', '#16a34a', '#15803d']
  };

  const generatePattern = () => {
    if (!text) {
      toast.error('Please enter some text to visualize');
      return;
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const pattern: string[][] = [];
    const colors = colorSchemes[colorScheme as keyof typeof colorSchemes];

    for (let i = 0; i < data.length; i += 3) {
      const row: string[] = [];
      for (let j = 0; j < 3 && i + j < data.length; j++) {
        const value = data[i + j];
        const colorIndex = Math.floor((value / 255) * colors.length);
        row.push(colors[colorIndex]);
      }
      pattern.push(row);
    }

    setPattern(pattern);
    renderCanvas(pattern);
  };

  const renderCanvas = (pattern: string[][]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 600;
    const cellSize = size / Math.max(pattern.length, pattern[0]?.length || 1);

    canvas.width = size;
    canvas.height = size;
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, size, size);

    pattern.forEach((row, i) => {
      row.forEach((color, j) => {
        ctx.fillStyle = color;
        ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
      });
    });
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'encryption-art.png';
    link.href = canvas.toDataURL();
    link.click();
    toast.success('Image downloaded successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <Palette className="w-6 h-6 text-purple-400 mr-2" />
        <h2 className="text-xl font-semibold text-purple-400">Encryption Art</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-purple-300 mb-2">
            Text to Visualize
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-32"
            placeholder="Enter text to create an artistic visualization..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-purple-300 mb-2">
            Color Scheme
          </label>
          <select
            value={colorScheme}
            onChange={(e) => setColorScheme(e.target.value)}
            className="w-full"
          >
            <option value="cyber">Cyberpunk</option>
            <option value="neon">Neon Dreams</option>
            <option value="sunset">Digital Sunset</option>
            <option value="matrix">Matrix</option>
          </select>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={generatePattern}
            className="btn btn-primary flex-1 flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Generate Art</span>
          </button>
          
          <button
            onClick={downloadImage}
            className="btn btn-secondary flex-1 flex items-center justify-center gap-2"
            disabled={!pattern.length}
          >
            <Download className="w-5 h-5" />
            <span>Download</span>
          </button>
        </div>

        {pattern.length > 0 && (
          <div className="flex justify-center mt-6">
            <canvas
              ref={canvasRef}
              className="border border-purple-500/20 rounded-lg max-w-full"
            />
          </div>
        )}
      </div>
    </div>
  );
};