import React, { useEffect, useState } from 'react';

interface DecryptingTextProps {
  text: string;
  className?: string;
  performanceMode?: boolean;
}

export const DecryptingText: React.FC<DecryptingTextProps> = ({ text, className = '', performanceMode = false }) => {
  const [displayText, setDisplayText] = useState('');
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';

  useEffect(() => {
    if (performanceMode) {
      setDisplayText(text);
      return;
    }

    let currentText = '';
    const finalText = text;
    let iteration = 0;
    
    const scramble = () => {
      const scrambledText = finalText.split('').map((char, index) => {
        if (index < iteration / 2) { // Reduced iterations
          return finalText[index];
        }
        return characters[Math.floor(Math.random() * characters.length)];
      }).join('');
      
      setDisplayText(scrambledText);
      iteration += 1;

      if (iteration < finalText.length * 2) { // Reduced total iterations
        setTimeout(scramble, 70); // Slowed down the animation
      } else {
        setDisplayText(finalText);
      }
    };

    scramble();
  }, [text, performanceMode]);

  return <span className={className}>{displayText}</span>;
};