import React, { useState, useEffect } from 'react';
import { Lock, Key, RefreshCw, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

interface Puzzle {
  id: string;
  encrypted: string;
  hint: string;
  solution: string;
  cipher: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const puzzles: Puzzle[] = [
  {
    id: '1',
    encrypted: 'KHOOR',
    hint: 'Caesar cipher with shift of 3',
    solution: 'HELLO',
    cipher: 'caesar',
    difficulty: 'easy'
  },
  {
    id: '2',
    encrypted: '.... . .-.. .-.. ---',
    hint: 'Dots and dashes',
    solution: 'HELLO',
    cipher: 'morse',
    difficulty: 'easy'
  },
  {
    id: '3',
    encrypted: '01001000 01101001',
    hint: 'Computer language',
    solution: 'HI',
    cipher: 'binary',
    difficulty: 'medium'
  },
  {
    id: '4',
    encrypted: '53 6F 73',
    hint: 'Hexadecimal encoding',
    solution: 'SOS',
    cipher: 'hex',
    difficulty: 'medium'
  },
  {
    id: '5',
    encrypted: 'VGVzdA==',
    hint: 'Common web encoding',
    solution: 'TEST',
    cipher: 'base64',
    difficulty: 'hard'
  }
];

export const EncryptionPuzzle: React.FC = () => {
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle>(puzzles[0]);
  const [answer, setAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const checkAnswer = () => {
    setAttempts(prev => prev + 1);
    
    if (answer.toUpperCase() === currentPuzzle.solution) {
      const points = {
        easy: 10,
        medium: 20,
        hard: 30
      }[currentPuzzle.difficulty];
      
      setScore(prev => prev + points);
      toast.success(`Correct! +${points} points`);
      
      // Move to next puzzle
      const currentIndex = puzzles.findIndex(p => p.id === currentPuzzle.id);
      if (currentIndex < puzzles.length - 1) {
        setCurrentPuzzle(puzzles[currentIndex + 1]);
        setAnswer('');
        setShowHint(false);
      } else {
        toast.success('Congratulations! You\'ve completed all puzzles!');
      }
    } else {
      toast.error('Incorrect answer. Try again!');
    }
  };

  const resetGame = () => {
    setCurrentPuzzle(puzzles[0]);
    setAnswer('');
    setShowHint(false);
    setScore(0);
    setAttempts(0);
  };

  const getDifficultyColor = (difficulty: Puzzle['difficulty']) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-400';
      case 'medium':
        return 'text-yellow-400';
      case 'hard':
        return 'text-red-400';
      default:
        return 'text-cyan-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Lock className="w-6 h-6 text-cyan-400 mr-2" />
          <h2 className="text-xl font-semibold text-cyan-400">Encryption Puzzle</h2>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-cyan-300">Score: {score}</div>
          <button
            onClick={resetGame}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      <div className="glass p-6 rounded-xl space-y-6">
        <div className="flex items-center justify-between">
          <span className={`text-sm font-medium ${getDifficultyColor(currentPuzzle.difficulty)}`}>
            {currentPuzzle.difficulty.toUpperCase()}
          </span>
          <span className="text-cyan-300 text-sm">
            Puzzle {currentPuzzle.id} of {puzzles.length}
          </span>
        </div>

        <div className="text-center py-8">
          <div className="text-2xl font-mono text-cyan-400 mb-4">
            {currentPuzzle.encrypted}
          </div>
          {showHint && (
            <div className="text-sm text-cyan-300 animate-fade-in">
              Hint: {currentPuzzle.hint}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-cyan-300 mb-2">
              Your Answer
            </label>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full"
              placeholder="Enter your solution..."
            />
          </div>

          <div className="flex space-x-4">
            <button
              onClick={checkAnswer}
              className="btn btn-primary flex-1 flex items-center justify-center space-x-2"
            >
              <Key className="w-5 h-5" />
              <span>Check Answer</span>
            </button>
            <button
              onClick={() => setShowHint(true)}
              className="btn btn-secondary flex-1"
              disabled={showHint}
            >
              Show Hint
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {puzzles.map((puzzle, index) => (
          <div
            key={puzzle.id}
            className={`h-1 rounded-full ${
              index < parseInt(currentPuzzle.id) - 1
                ? 'bg-cyan-400'
                : index === parseInt(currentPuzzle.id) - 1
                ? 'bg-cyan-600 animate-pulse'
                : 'bg-gray-700'
            }`}
          />
        ))}
      </div>

      <div className="text-center text-sm text-cyan-300">
        Attempts: {attempts}
      </div>
    </div>
  );
};