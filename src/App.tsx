import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthForm } from './components/AuthForm';
import { ChatInterface } from './components/ChatInterface';
import { SecurityTools } from './components/SecurityTools';
import { Shield, Lock, Key, Zap, Eye, ChevronDown, ChevronUp, Gamepad2 } from 'lucide-react';
import { MatrixRain } from './components/MatrixRain';
import { DecryptingText } from './components/DecryptingText';
import { SecurityFeatures } from './components/SecurityFeatures';
import { DonationBanner } from './components/DonationBanner';
import { useStore } from './store/useStore';
import { SupporterTools } from './components/SupporterTools';
import { CircuitBackground } from './components/CircuitBackground';
import { GamesHub } from './components/GamesHub';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { supporterCode, validateSupporterCode } = useStore();
  
  if (!supporterCode || !validateSupporterCode(supporterCode)) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Separate WelcomeScreen into its own component to use hooks properly
const WelcomeScreenContent = () => {
  const { performanceMode, togglePerformanceMode } = useStore();
  const [showFeatures, setShowFeatures] = useState(false);
  const navigate = useNavigate();

  const securityFeatures = [
    {
      icon: Lock,
      title: "Military-Grade Encryption",
      description: "AES-256 with ChaCha20 encryption for maximum security",
      color: "text-cyan-400"
    },
    {
      icon: Key,
      title: "Multi-Layer Security",
      description: "Triple-layer RSA + AES + ChaCha20 encryption protocol",
      color: "text-cyan-400"
    },
    {
      icon: Eye,
      title: "Message Privacy",
      description: "End-to-end encrypted messages with expiration timers",
      color: "text-cyan-400"
    }
  ];

  return (
    <div className="min-h-screen cyber-gradient relative overflow-hidden">
      {!performanceMode && <CircuitBackground />}
      <div className="fixed top-0 left-0 right-0 z-20">
        <div className="glass border-b border-cyan-500/20">
          <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
            <h2 className="text-cyan-400 font-semibold">RSA Secure Chat</h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/games')}
                className="glass px-4 py-2 rounded-lg flex items-center space-x-2 cyber-hover border border-cyan-500/20"
              >
                <Gamepad2 className="w-5 h-5 text-cyan-400" />
                <span className="text-cyan-400">Games</span>
              </button>
              <button
                onClick={() => setShowFeatures(!showFeatures)}
                className="glass px-4 py-2 rounded-lg flex items-center space-x-2 cyber-hover border border-cyan-500/20"
              >
                <Shield className="w-5 h-5 text-cyan-400" />
                <span className="text-cyan-400">
                  {showFeatures ? 'Hide Features' : 'See Features'}
                </span>
                {showFeatures ? (
                  <ChevronUp className="w-4 h-4 text-cyan-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-cyan-400" />
                )}
              </button>
              <button
                onClick={togglePerformanceMode}
                className="glass px-4 py-2 rounded-lg flex items-center space-x-2 cyber-hover border border-cyan-500/20"
                title={performanceMode ? "Enable effects" : "Disable effects for better performance"}
              >
                <Zap className={`w-5 h-5 ${performanceMode ? 'text-gray-400' : 'text-cyan-400'}`} />
                <span className={performanceMode ? 'text-gray-400' : 'text-cyan-400'}>
                  {performanceMode ? 'Effects Off' : 'Effects On'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center p-4 min-h-screen pt-28">
        <div className="max-w-4xl w-full">
          <div className="glass p-8 rounded-2xl animated-border">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-cyan-500 rounded-full blur-xl opacity-50"></div>
                  <Shield className="w-24 h-24 text-cyan-400 pulse relative" />
                </div>
              </div>
              <h1 className="text-5xl font-bold mb-6 tracking-tight glitch-text">
                <DecryptingText 
                  text="Secure RSA Encryption"
                  className="text-cyan-400"
                  performanceMode={performanceMode}
                />
              </h1>
              <p className="text-cyan-300 text-xl mb-8 max-w-2xl mx-auto leading-relaxed neon-text">
                <DecryptingText 
                  text="Military-grade Triple-Layer Encryption for Absolute Privacy"
                  performanceMode={performanceMode}
                />
              </p>

              {showFeatures && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                  {securityFeatures.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div
                        key={index}
                        className="glass p-6 rounded-xl border border-cyan-500/20 bg-gradient-to-br from-black/30 to-cyan-900/10"
                      >
                        <Icon className={`w-10 h-10 ${feature.color} mb-4 mx-auto`} />
                        <h3 className={`text-lg font-semibold ${feature.color} mb-2`}>
                          {feature.title}
                        </h3>
                        <p className="text-cyan-300 text-sm">
                          {feature.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}

              <DonationBanner />

              <div className="max-w-md mx-auto mt-12">
                <AuthForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Wrap WelcomeScreen with Router context
function WelcomeScreen() {
  return <WelcomeScreenContent />;
}

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/chat" element={<ChatInterface />} />
          <Route path="/tools" element={<SecurityTools />} />
          <Route path="/games" element={<GamesHub />} />
          <Route 
            path="/supporter-tools" 
            element={
              <ProtectedRoute>
                <SupporterTools />
              </ProtectedRoute>
            } 
          />
        </Routes>
        <SecurityFeatures />
      </BrowserRouter>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#001',
            color: '#0ff',
            border: '1px solid rgba(0, 255, 255, 0.3)',
            boxShadow: '0 0 10px rgba(0, 255, 255, 0.2)',
          },
        }}
      />
    </>
  );
}

export default App;