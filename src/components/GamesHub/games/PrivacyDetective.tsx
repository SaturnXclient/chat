import React from 'react';
import { Search } from 'lucide-react';

export const PrivacyDetective: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <Search className="w-6 h-6 text-cyan-400 mr-2" />
        <h2 className="text-xl font-semibold text-cyan-400">Privacy Detective</h2>
      </div>
      <div className="glass p-6 rounded-xl text-center">
        <h3 className="text-lg font-medium text-cyan-300 mb-4">Coming Soon!</h3>
        <p className="text-gray-400">
          Investigate privacy breaches and security vulnerabilities in this detective game.
          Learn about privacy laws and regulations while solving cases!
        </p>
      </div>
    </div>
  );
};