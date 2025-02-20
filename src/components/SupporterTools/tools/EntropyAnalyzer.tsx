import React, { useState } from 'react';
import { Activity, AlertCircle } from 'lucide-react';

export const EntropyAnalyzer: React.FC = () => {
  const [text, setText] = useState('');
  const [results, setResults] = useState<{
    entropy: number;
    strength: string;
    distribution: Record<string, number>;
  } | null>(null);

  const calculateEntropy = (input: string) => {
    if (!input) return;

    // Calculate character frequency
    const freq: Record<string, number> = {};
    for (let char of input) {
      freq[char] = (freq[char] || 0) + 1;
    }

    // Calculate entropy
    let entropy = 0;
    const len = input.length;
    for (let char in freq) {
      const probability = freq[char] / len;
      entropy -= probability * Math.log2(probability);
    }

    // Determine strength
    let strength = 'Weak';
    if (entropy > 3) strength = 'Moderate';
    if (entropy > 4) strength = 'Strong';
    if (entropy > 5) strength = 'Very Strong';

    setResults({
      entropy: Number(entropy.toFixed(2)),
      strength,
      distribution: freq
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <Activity className="w-6 h-6 text-purple-400 mr-2" />
        <h2 className="text-xl font-semibold text-purple-400">Entropy Analyzer</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-purple-300 mb-2">
            Text to Analyze
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-32"
            placeholder="Enter text to analyze entropy..."
          />
        </div>

        <button
          onClick={() => calculateEntropy(text)}
          className="btn btn-primary w-full"
        >
          Analyze Entropy
        </button>

        {results && (
          <div className="space-y-4">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <span className="text-purple-300">Entropy Score:</span>
                <span className="text-2xl font-bold text-purple-400">
                  {results.entropy} bits
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-purple-300">Strength:</span>
                <span className={`font-semibold ${
                  results.strength === 'Weak' ? 'text-red-400' :
                  results.strength === 'Moderate' ? 'text-yellow-400' :
                  results.strength === 'Strong' ? 'text-green-400' :
                  'text-purple-400'
                }`}>
                  {results.strength}
                </span>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-purple-300 mb-4">
                Character Distribution
              </h3>
              <div className="grid grid-cols-8 gap-2">
                {Object.entries(results.distribution).map(([char, count]) => (
                  <div
                    key={char}
                    className="flex flex-col items-center p-2 bg-gray-800 rounded"
                  >
                    <span className="text-purple-400 font-mono">{char}</span>
                    <span className="text-sm text-purple-300">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};