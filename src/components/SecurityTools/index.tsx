import React, { useState } from 'react';
import { Key, Hash, FileText, Dice5, Eye, ArrowLeft } from 'lucide-react';
import { PasswordGenerator } from './PasswordGenerator';
import { HashGenerator } from './HashGenerator';
import { SecureNotes } from './SecureNotes';
import { RandomGenerator } from './RandomGenerator';
import { TextObfuscator } from './TextObfuscator';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';

const tools = [
  { id: 'password', name: 'Password Generator', icon: Key, component: PasswordGenerator },
  { id: 'hash', name: 'Hash Generator', icon: Hash, component: HashGenerator },
  { id: 'notes', name: 'Secure Notes', icon: FileText, component: SecureNotes },
  { id: 'random', name: 'Random Generator', icon: Dice5, component: RandomGenerator },
  { id: 'obfuscator', name: 'Text Obfuscator', icon: Eye, component: TextObfuscator },
];

export const SecurityTools: React.FC = () => {
  const [activeTool, setActiveTool] = useState(tools[0].id);
  const navigate = useNavigate();
  const { theme } = useStore();
  const ActiveComponent = tools.find(tool => tool.id === activeTool)?.component || tools[0].component;

  const currentTheme = {
    primary: theme === 'cyber' ? 'text-cyan-400' : 
            theme === 'sakura' ? 'text-pink-400' :
            theme === 'meme' ? 'text-yellow-400' : 'text-blue-400',
    bg: theme === 'cyber' ? 'cyber-gradient' :
        theme === 'sakura' ? 'sakura-gradient' :
        theme === 'meme' ? 'meme-gradient' : 'chill-gradient',
  };

  return (
    <div className={`min-h-screen ${currentTheme.bg}`}>
      <div className="glass p-4 flex items-center border-b border-opacity-30">
        <button 
          onClick={() => navigate('/')}
          className={`${currentTheme.primary} hover:opacity-80 mr-4 cyber-hover`}
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className={`text-xl font-bold ${currentTheme.primary}`}>Security Tools</h1>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        <div className="flex overflow-x-auto space-x-4 mb-6 pb-2">
          {tools.map(tool => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  activeTool === tool.id
                    ? 'bg-cyan-600 text-white'
                    : 'glass text-cyan-400 hover:bg-cyan-900/30'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tool.name}</span>
              </button>
            );
          })}
        </div>

        <ActiveComponent />
      </div>
    </div>
  );
};