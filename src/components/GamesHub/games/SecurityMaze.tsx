import React from 'react';
import { Haze as Maze } from 'lucide-react';

export const SecurityMaze: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <Maze className="w-6 h-6 text-cyan-400 mr-2" />
        <h2 className="text-xl font-semibold text-cyan-400">Security Maze</h2>
      </div>
      <div className="glass p-6 rounded-xl text-center">
        <h3 className="text-lg font-medium text-cyan-300 mb-4">Coming Soon!</h3>
        <p className="text-gray-400">
          Navigate through a maze while avoiding security threats and collecting security tools.
          Learn about network security concepts in this exciting arcade game!
        </p>
      </div>
    </div>
  );
};