import React from 'react';
import { Key } from 'lucide-react';

export const PasswordDefense: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <Key className="w-6 h-6 text-cyan-400 mr-2" />
        <h2 className="text-xl font-semibold text-cyan-400">Password Defense</h2>
      </div>
      <div className="glass p-6 rounded-xl text-center">
        <h3 className="text-lg font-medium text-cyan-300 mb-4">Coming Soon!</h3>
        <p className="text-gray-400">
          Defend against password cracking attempts in this tower defense-style game.
          Learn about password security best practices while having fun!
        </p>
      </div>
    </div>
  );
};