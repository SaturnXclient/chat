import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { encryptMessage, decryptMessage } from '../crypto';
import { Key, Lock, Unlock, Copy, ArrowLeft, Palette, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { BackgroundEffect } from './BackgroundEffect';

const themes = {
  cyber: {
    primary: 'text-cyan-400',
    secondary: 'text-purple-400',
    accent: 'text-green-400',
    bg: 'cyber-gradient',
    buttonPrimary: 'bg-cyan-600 hover:bg-cyan-700',
    buttonSecondary: 'bg-purple-600 hover:bg-purple-700',
  },
  sakura: {
    primary: 'text-pink-400',
    secondary: 'text-rose-400',
    accent: 'text-red-400',
    bg: 'sakura-gradient',
    buttonPrimary: 'bg-pink-600 hover:bg-pink-700',
    buttonSecondary: 'bg-rose-600 hover:bg-rose-700',
  },
  meme: {
    primary: 'text-yellow-400',
    secondary: 'text-orange-400',
    accent: 'text-red-400',
    bg: 'meme-gradient',
    buttonPrimary: 'bg-yellow-600 hover:bg-yellow-700',
    buttonSecondary: 'bg-orange-600 hover:bg-orange-700',
  },
  chill: {
    primary: 'text-blue-400',
    secondary: 'text-indigo-400',
    accent: 'text-violet-400',
    bg: 'chill-gradient',
    buttonPrimary: 'bg-blue-600 hover:bg-blue-700',
    buttonSecondary: 'bg-indigo-600 hover:bg-indigo-700',
  },
};

const expirationOptions = [
  { label: '5 minutes', value: 5 },
  { label: '15 minutes', value: 15 },
  { label: '30 minutes', value: 30 },
  { label: '1 hour', value: 60 },
  { label: '24 hours', value: 1440 },
];

export function ChatInterface() {
  const { user, keyPair, theme, setTheme } = useStore();
  const [message, setMessage] = useState('');
  const [recipientPublicKey, setRecipientPublicKey] = useState('');
  const [encryptedMessage, setEncryptedMessage] = useState('');
  const [decryptedMessage, setDecryptedMessage] = useState('');
  const [expirationMinutes, setExpirationMinutes] = useState(1440); // Default to 24 hours
  const navigate = useNavigate();
  const currentTheme = themes[theme];

  const handleEncrypt = () => {
    try {
      if (!message || !recipientPublicKey) {
        toast.error('Please enter both message and recipient public key');
        return;
      }
      const encrypted = encryptMessage(message, recipientPublicKey, expirationMinutes);
      setEncryptedMessage(encrypted);
      toast.success('Message encrypted successfully!');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDecrypt = () => {
    try {
      if (!encryptedMessage || !keyPair?.privateKey) {
        toast.error('Please enter an encrypted message');
        return;
      }
      const decrypted = decryptMessage(encryptedMessage, keyPair.privateKey);
      setDecryptedMessage(decrypted);
      toast.success('Message decrypted successfully!');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const cycleTheme = () => {
    const themes: Array<'cyber' | 'sakura' | 'meme' | 'chill'> = ['cyber', 'sakura', 'meme', 'chill'];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
    toast.success(`Theme changed to ${nextTheme}!`);
  };

  return (
    <div className={`min-h-screen ${currentTheme.bg} text-white relative`}>
      <BackgroundEffect theme={theme} />
      <div className="relative z-10">
        {/* Header */}
        <div className="glass p-4 flex items-center justify-between border-b border-opacity-30">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/')}
              className={`${currentTheme.primary} hover:opacity-80 mr-4 cyber-hover`}
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className={`text-xl font-bold ${currentTheme.primary}`}>RSA Encryption Demo</h1>
              <p className={`text-sm ${currentTheme.secondary}`}>Logged in as: {user?.username}</p>
            </div>
          </div>
          <button
            onClick={cycleTheme}
            className={`${currentTheme.primary} hover:opacity-80 p-2 rounded-full cyber-hover`}
            title="Change theme"
          >
            <Palette className="w-6 h-6" />
          </button>
        </div>

        <div className="max-w-4xl mx-auto p-4 space-y-6 md:p-6">
          {/* Key Information */}
          <div className="glass rounded-lg p-4 md:p-6 animated-border">
            <h2 className={`text-xl font-semibold mb-4 flex items-center ${currentTheme.primary}`}>
              <Key className="w-6 h-6 mr-2" />
              Your Keys
            </h2>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${currentTheme.secondary} mb-2`}>Your Public Key</label>
                <div className="relative">
                  <textarea
                    readOnly
                    value={keyPair?.publicKey || ''}
                    className="w-full h-24 bg-gray-900/50 rounded-lg p-3 text-sm font-mono border border-opacity-30 focus:border-opacity-100 focus:ring-1"
                  />
                  <button
                    onClick={() => copyToClipboard(keyPair?.publicKey || '', 'Public key')}
                    className={`absolute top-2 right-2 ${currentTheme.primary} hover:opacity-80 cyber-hover`}
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium ${currentTheme.secondary} mb-2`}>Your Private Key (Keep this secret!)</label>
                <div className="relative">
                  <textarea
                    readOnly
                    value={keyPair?.privateKey || ''}
                    className="w-full h-24 bg-gray-900/50 rounded-lg p-3 text-sm font-mono border border-opacity-30 focus:border-opacity-100 focus:ring-1"
                  />
                  <button
                    onClick={() => copyToClipboard(keyPair?.privateKey || '', 'Private key')}
                    className={`absolute top-2 right-2 ${currentTheme.primary} hover:opacity-80 cyber-hover`}
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Encryption Section */}
          <div className="glass rounded-lg p-4 md:p-6 animated-border">
            <h2 className={`text-xl font-semibold mb-4 flex items-center ${currentTheme.primary}`}>
              <Lock className="w-6 h-6 mr-2" />
              Encrypt Message
            </h2>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${currentTheme.secondary} mb-2`}>Recipient's Public Key</label>
                <textarea
                  value={recipientPublicKey}
                  onChange={(e) => setRecipientPublicKey(e.target.value)}
                  placeholder="Paste recipient's public key here..."
                  className="w-full h-24 bg-gray-900/50 rounded-lg p-3 text-sm font-mono border border-opacity-30 focus:border-opacity-100 focus:ring-1"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${currentTheme.secondary} mb-2`}>Message to Encrypt</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter your message..."
                  className="w-full h-24 bg-gray-900/50 rounded-lg p-3 border border-opacity-30 focus:border-opacity-100 focus:ring-1"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${currentTheme.secondary} mb-2 flex items-center`}>
                  <Clock className="w-4 h-4 mr-2" />
                  Message Expiration
                </label>
                <select
                  value={expirationMinutes}
                  onChange={(e) => setExpirationMinutes(Number(e.target.value))}
                  className="w-full bg-gray-900/50 rounded-lg p-2 border border-opacity-30 focus:border-opacity-100 focus:ring-1"
                >
                  {expirationOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleEncrypt}
                className={`w-full ${currentTheme.buttonPrimary} text-white font-semibold py-2 px-4 rounded-lg transition duration-200 cyber-hover`}
              >
                Encrypt Message
              </button>
              {encryptedMessage && (
                <div>
                  <label className={`block text-sm font-medium ${currentTheme.secondary} mb-2`}>Encrypted Message</label>
                  <div className="relative">
                    <textarea
                      readOnly
                      value={encryptedMessage}
                      className="w-full h-24 bg-gray-900/50 rounded-lg p-3 text-sm font-mono border border-opacity-30"
                    />
                    <button
                      onClick={() => copyToClipboard(encryptedMessage, 'Encrypted message')}
                      className={`absolute top-2 right-2 ${currentTheme.primary} hover:opacity-80 cyber-hover`}
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Decryption Section */}
          <div className="glass rounded-lg p-4 md:p-6 animated-border">
            <h2 className={`text-xl font-semibold mb-4 flex items-center ${currentTheme.primary}`}>
              <Unlock className="w-6 h-6 mr-2" />
              Decrypt Message
            </h2>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${currentTheme.secondary} mb-2`}>Encrypted Message</label>
                <textarea
                  value={encryptedMessage}
                  onChange={(e) => setEncryptedMessage(e.target.value)}
                  placeholder="Paste encrypted message here..."
                  className="w-full h-24 bg-gray-900/50 rounded-lg p-3 text-sm font-mono border border-opacity-30 focus:border-opacity-100 focus:ring-1"
                />
              </div>
              <button
                onClick={handleDecrypt}
                className={`w-full ${currentTheme.buttonSecondary} text-white font-semibold py-2 px-4 rounded-lg transition duration-200 cyber-hover`}
              >
                Decrypt Message
              </button>
              {decryptedMessage && (
                <div>
                  <label className={`block text-sm font-medium ${currentTheme.secondary} mb-2`}>Decrypted Message</label>
                  <div className="relative">
                    <textarea
                      readOnly
                      value={decryptedMessage}
                      className="w-full h-24 bg-gray-900/50 rounded-lg p-3 border border-opacity-30"
                    />
                    <button
                      onClick={() => copyToClipboard(decryptedMessage, 'Decrypted message')}
                      className={`absolute top-2 right-2 ${currentTheme.primary} hover:opacity-80 cyber-hover`}
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}