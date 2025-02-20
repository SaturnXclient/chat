import React, { useState } from 'react';
import { Dice5, RefreshCw } from 'lucide-react';

export const RandomGenerator: React.FC = () => {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [result, setResult] = useState<number | null>(null);
  const [diceResult, setDiceResult] = useState<number[]>([]);

  const generateNumber = () => {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    const range = max - min + 1;
    setResult(Math.floor(array[0] / (0xffffffff + 1) * range) + min);
  };

  const rollDice = (count: number) => {
    const array = new Uint32Array(count);
    crypto.getRandomValues(array);
    const results = Array.from(array).map(n => (n % 6) + 1);
    setDiceResult(results);
  };

  return (
    <div className="glass p-6 rounded-xl">
      <div className="flex items-center mb-4">
        <Dice5 className="w-6 h-6 text-cyan-400 mr-2" />
        <h2 className="text-xl font-semibold text-cyan-400">Random Generator</h2>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-cyan-300 font-semibold">Number Generator</h3>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-cyan-300 mb-2">Min</label>
              <input
                type="number"
                value={min}
                onChange={(e) => setMin(Number(e.target.value))}
                className="w-full bg-gray-900/50 rounded-lg p-2 text-cyan-400"
              />
            </div>
            <div className="flex-1">
              <label className="block text-cyan-300 mb-2">Max</label>
              <input
                type="number"
                value={max}
                onChange={(e) => setMax(Number(e.target.value))}
                className="w-full bg-gray-900/50 rounded-lg p-2 text-cyan-400"
              />
            </div>
          </div>
          <button
            onClick={generateNumber}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            Generate Number
          </button>
          {result !== null && (
            <div className="text-center">
              <span className="text-2xl font-bold text-cyan-400">{result}</span>
            </div>
          )}
        </div>

        <div className="border-t border-cyan-800 my-6"></div>

        <div className="space-y-4">
          <h3 className="text-cyan-300 font-semibold">Dice Roller</h3>
          <div className="flex space-x-4">
            {[1, 3, 5].map(count => (
              <button
                key={count}
                onClick={() => rollDice(count)}
                className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
              >
                Roll {count} {count === 1 ? 'Die' : 'Dice'}
              </button>
            ))}
          </div>
          {diceResult.length > 0 && (
            <div className="flex justify-center space-x-4 mt-4">
              {diceResult.map((value, index) => (
                <div
                  key={index}
                  className="w-12 h-12 bg-cyan-900/50 rounded-lg flex items-center justify-center text-xl font-bold text-cyan-400 border border-cyan-500/30"
                >
                  {value}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};