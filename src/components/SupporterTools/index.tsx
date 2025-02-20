import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Crown, Shield, ChevronDown } from 'lucide-react';
import { FileEncryption } from './tools/FileEncryption';
import { PasswordManager } from './tools/PasswordManager';
import { SecureNotes } from './tools/SecureNotes';
import { QRCodeTool } from './tools/QRCodeTool';
import { EntropyAnalyzer } from './tools/EntropyAnalyzer';
import { BreachChecker } from './tools/BreachChecker';

const tools = [
  { id: 'file-encryption', name: 'File Encryption', component: FileEncryption },
  { id: 'password-manager', name: 'Password Manager', component: PasswordManager },
  { id: 'secure-notes', name: 'Secure Notes', component: SecureNotes },
  { id: 'qr-code', name: 'QR Code Generator', component: QRCodeTool },
  { id: 'entropy-analyzer', name: 'Entropy Analyzer', component: EntropyAnalyzer },
  { id: 'breach-checker', name: 'Breach Checker', component: BreachChecker },
];

export const SupporterTools: React.FC = () => {
  const [activeTool, setActiveTool] = useState(tools[0].id);
  const [showToolbar, setShowToolbar] = useState(false);
  const navigate = useNavigate();
  const ActiveComponent = tools.find(tool => tool.id === activeTool)?.component;
  const activeToolName = tools.find(tool => tool.id === activeTool)?.name;

  return (
    <div className="min-h-screen cyber-gradient">
      <div className="glass p-4 flex items-center border-b border-purple-500/20 sticky top-0 z-50">
        <button 
          onClick={() => navigate('/')}
          className="text-purple-400 hover:opacity-80 mr-4 p-2 rounded-lg active:scale-95 transition-all"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center">
          <Crown className="w-6 h-6 text-purple-400 mr-2" />
          <h1 className="text-xl font-bold text-purple-400 truncate">
            {activeToolName || 'Early Access Tools'}
          </h1>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Shield className="w-5 h-5 text-purple-400" />
          <span className="text-purple-400 hidden sm:inline">Supporter Access</span>
          <button
            onClick={() => setShowToolbar(!showToolbar)}
            className="ml-2 p-2 rounded-lg text-purple-400 hover:bg-purple-900/30 sm:hidden"
          >
            <ChevronDown className={`w-5 h-5 transform transition-transform ${showToolbar ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      <div className={`sm:hidden ${showToolbar ? 'block' : 'hidden'}`}>
        <div className="glass border-b border-purple-500/20 p-4">
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
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                    : 'glass text-purple-400 hover:bg-purple-900/30'
                }`}
              >
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
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                  : 'glass text-purple-400 hover:bg-purple-900/30'
              }`}
            >
              <span>{tool.name}</span>
            </button>
          ))}
        </div>

        <div className="glass-card p-4 sm:p-6 rounded-xl border border-purple-500/20 animate-glow">
          {ActiveComponent && <ActiveComponent />}
        </div>
      </div>
    </div>
  );
};