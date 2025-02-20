import React, { useState, useRef } from 'react';
import { Hash, Play, Pause, Volume2, VolumeX } from 'lucide-react';

const MORSE_CODE: Record<string, string> = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
  '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
  '8': '---..', '9': '----.', '.': '.-.-.-', ',': '--..--', '?': '..--..',
  '!': '-.-.--', ' ': ' '
};

export const MorseConverter: React.FC = () => {
  const [text, setText] = useState('');
  const [morse, setMorse] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioContext = useRef<AudioContext | null>(null);
  const oscillator = useRef<OscillatorNode | null>(null);

  const textToMorse = (input: string) => {
    return input
      .toUpperCase()
      .split('')
      .map(char => MORSE_CODE[char] || char)
      .join(' ');
  };

  const morseToText = (input: string) => {
    const reverseMorse = Object.entries(MORSE_CODE).reduce((acc, [char, code]) => {
      acc[code] = char;
      return acc;
    }, {} as Record<string, string>);

    return input
      .split(' ')
      .map(code => reverseMorse[code] || code)
      .join('');
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    setMorse(textToMorse(newText));
  };

  const handleMorseChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMorse = e.target.value;
    setMorse(newMorse);
    setText(morseToText(newMorse));
  };

  const playMorse = () => {
    if (!audioContext.current) {
      audioContext.current = new AudioContext();
    }

    if (isPlaying) {
      setIsPlaying(false);
      if (oscillator.current) {
        oscillator.current.stop();
        oscillator.current = null;
      }
      return;
    }

    setIsPlaying(true);
    const dotDuration = 100;
    let currentTime = audioContext.current.currentTime;

    morse.split('').forEach((char, index) => {
      if (char === '.') {
        playTone(currentTime, dotDuration);
        currentTime += dotDuration * 1.5;
      } else if (char === '-') {
        playTone(currentTime, dotDuration * 3);
        currentTime += dotDuration * 3.5;
      } else if (char === ' ') {
        currentTime += dotDuration * 3.5;
      }
    });

    setTimeout(() => {
      setIsPlaying(false);
      if (oscillator.current) {
        oscillator.current.stop();
        oscillator.current = null;
      }
    }, (currentTime - audioContext.current.currentTime) * 1000);
  };

  const playTone = (startTime: number, duration: number) => {
    if (!audioContext.current || isMuted) return;

    oscillator.current = audioContext.current.createOscillator();
    const gainNode = audioContext.current.createGain();

    oscillator.current.connect(gainNode);
    gainNode.connect(audioContext.current.destination);

    oscillator.current.frequency.value = 600;
    gainNode.gain.value = 0.1;

    oscillator.current.start(startTime);
    oscillator.current.stop(startTime + duration / 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <Hash className="w-6 h-6 text-cyan-400 mr-2" />
        <h2 className="text-xl font-semibold text-cyan-400">Morse Code Converter</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-cyan-300 mb-2">Text</label>
          <textarea
            value={text}
            onChange={handleTextChange}
            className="w-full h-32"
            placeholder="Enter text to convert to Morse code..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-cyan-300 mb-2">Morse Code</label>
          <textarea
            value={morse}
            onChange={handleMorseChange}
            className="w-full h-32 font-mono"
            placeholder="Enter Morse code to convert to text..."
          />
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={playMorse}
          className="btn btn-primary flex items-center space-x-2"
          disabled={!morse}
        >
          {isPlaying ? (
            <>
              <Pause className="w-5 h-5" />
              <span>Stop</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              <span>Play</span>
            </>
          )}
        </button>

        <button
          onClick={() => setIsMuted(!isMuted)}
          className="btn btn-secondary flex items-center space-x-2"
        >
          {isMuted ? (
            <>
              <VolumeX className="w-5 h-5" />
              <span>Unmute</span>
            </>
          ) : (
            <>
              <Volume2 className="w-5 h-5" />
              <span>Mute</span>
            </>
          )}
        </button>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium text-cyan-300 mb-4">Timing Guide</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass p-4 rounded-lg text-center">
            <div className="w-2 h-2 bg-cyan-400 rounded-full mx-auto mb-2"></div>
            <span className="text-cyan-300">Dot (·)</span>
          </div>
          <div className="glass p-4 rounded-lg text-center">
            <div className="w-6 h-2 bg-cyan-400 rounded-full mx-auto mb-2"></div>
            <span className="text-cyan-300">Dash (-)</span>
          </div>
          <div className="glass p-4 rounded-lg text-center">
            <div className="w-4 h-2 bg-transparent border border-cyan-400 rounded-full mx-auto mb-2"></div>
            <span className="text-cyan-300">Letter Space</span>
          </div>
          <div className="glass p-4 rounded-lg text-center">
            <div className="w-8 h-2 bg-transparent border border-cyan-400 rounded-full mx-auto mb-2"></div>
            <span className="text-cyan-300">Word Space</span>
          </div>
        </div>
      </div>
    </div>
  );
};