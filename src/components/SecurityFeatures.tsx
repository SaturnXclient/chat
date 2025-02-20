import React, { useEffect, useCallback } from 'react';
import { AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useStore } from '../store/useStore';

export const SecurityFeatures: React.FC = () => {
  const { clearAllData } = useStore();

  // Handle keyboard shortcut (Ctrl + Alt + X)
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (event.ctrlKey && event.altKey && event.key.toLowerCase() === 'x') {
      clearAllData();
      toast.success('Emergency clear activated!');
    }
  }, [clearAllData]);

  // Handle screenshot detection
  const handleScreenCapture = useCallback(() => {
    document.body.classList.add('screenshot-protection');
    toast.error('Screenshot detected! Content protected.');
    
    setTimeout(() => {
      document.body.classList.remove('screenshot-protection');
    }, 1000);
  }, []);

  useEffect(() => {
    // Listen for keyboard shortcuts
    window.addEventListener('keydown', handleKeyPress);
    
    // Listen for screenshot attempts
    window.addEventListener('keyup', (e) => {
      if ((e.key === 'PrintScreen') || 
          (e.ctrlKey && e.key === 'p') || 
          (e.metaKey && e.shiftKey && e.key === '4')) {
        handleScreenCapture();
      }
    });

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress, handleScreenCapture]);

  return (
    <button
      onClick={clearAllData}
      className="fixed bottom-4 right-4 md:hidden glass p-3 rounded-full cyber-hover text-red-400 z-50 shadow-lg border border-red-500/20"
      title="Emergency Clear (Ctrl + Alt + X)"
    >
      <AlertTriangle className="w-6 h-6" />
    </button>
  );
};