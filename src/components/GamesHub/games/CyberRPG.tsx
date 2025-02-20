import React from 'react';
import { Sword } from 'lucide-react';

export const CyberRPG: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <Sword className="w-6 h-6 text-cyan-400 mr-2" />
        <h2 className="text-xl font-semibold text-cyan-400">Cyber Security RPG</h2>
      </div>
      <div className="glass p-6 rounded-xl text-center">
        <h3 className="text-lg font-medium text-cyan-300 mb-4">Coming Soon!</h3>
        <p className="text-gray-400">
          Level up your security skills in this role-playing adventure.
          Complete security-themed quests and become a cyber security master!
        </p>
      </div>
    </div>
  );
};