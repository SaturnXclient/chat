import React, { useState } from 'react';
import { Key, Hash, FileText, Dice5, Eye, ArrowLeft, Lock, Book } from 'lucide-react';
import { PasswordGenerator } from './PasswordGenerator';
import { HashGenerator } from './HashGenerator';
import { TextObfuscator } from './TextObfuscator';
import { RandomGenerator } from './RandomGenerator';
import { SecureNotes } from './SecureNotes';
import { LearningLab } from './tools/LearningLab';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';

const tools = [
  { id: 'password', name: 'Password Generator', icon: Key, component: PasswordGenerator },
  { id: 'hash', name: 'Hash Generator', icon: Hash, component: HashGenerator },
  { id: 'obfuscator', name: 'Text Obfuscator', icon: FileText, component: TextObfuscator },
  { id: 'random', name: 'Random Generator', icon: Dice5, component: RandomGenerator },
  { id: 'notes', name: 'Secure Notes', icon: Lock, component: SecureNotes },
  { id: 'learning', name: 'Learning Lab', icon: Book, component: LearningLab },
];

export const SecurityTools: React.FC = () => {
  const [activeTool, setActiveTool] = useState(tools[0].id);
  const [showToolbar, setShowToolbar] = useState(false);
  const navigate = useNavigate();
  const { theme } = useStore();
  const ActiveComponent = tools.find(tool => tool.id === activeTool)?.component;
  const activeToolName = tools.find(tool => tool.id === activeTool)?.name;

  return (
    <div className={`min-h-screen ${theme === 'cyber' ? 'cyber-gradient' : 'bg-gray-900'}`}>
      <div className="glass p-4 flex items-center border-b border-cyan-500/20 sticky top-0 z-50">
        <button 
          onClick={() => navigate('/')}
          className="text-cyan-400 hover:opacity-80 mr-4 p-2 rounded-lg active:scale-95 transition-all"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center">
          <Lock className="w-6 h-6 text-cyan-400 mr-2" />
          <h1 className="text-xl font-bold text-cyan-400 truncate">
            {activeToolName || 'Security Tools'}
          </h1>
        </div>
        <button
          onClick={() => setShowToolbar(!showToolbar)}
          className="ml-auto p-2 rounded-lg text-cyan-400 hover:bg-cyan-900/30 sm:hidden"
        >
          <Eye className={`w-5 h-5 transform transition-transform ${showToolbar ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <div className={`sm:hidden ${showToolbar ? 'block' : 'hidden'}`}>
        <div className="glass border-b border-cyan-500/20 p-4">
          <div className="flex flex-col gap-2">
            {tools.map(tool => (
              <button
                key={tool.id}
                onClick={() => {
                  setActiveTool(tool.id);
                  setShowToolbar(false);
                }}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg whitespace-nowrap transition-all ${
                  activeTool === tool.id
                    ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20'
                    : 'glass text-cyan-400 hover:bg-cyan-900/30'
                }`}
              >
                <tool.icon className="w-5 h-5" />
                <span>{tool.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        <div className="hidden sm:flex overflow-x-auto gap-2 mb-6 pb-2 custom-scrollbar">
          {tools.map(tool => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg whitespace-nowrap transition-all ${
                activeTool === tool.id
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20'
                  : 'glass text-cyan-400 hover:bg-cyan-900/30'
              }`}
            >
              <tool.icon className="w-5 h-5" />
              <span>{tool.name}</span>
            </button>
          ))}
        </div>

        <div className="glass-card p-4 sm:p-6 rounded-xl border border-cyan-500/20 animate-glow">
          {ActiveComponent && <ActiveComponent />}
        </div>
      </div>
    </div>
  );
};