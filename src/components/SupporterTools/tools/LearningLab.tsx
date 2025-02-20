import React, { useState } from 'react';
import { Shield, Book, Award, ChevronRight, Lock, Key, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

interface Lesson {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  content: string;
  exercise: {
    question: string;
    hints: string[];
    answer: string;
  };
}

const lessons: Lesson[] = [
  {
    id: 'caesar',
    title: 'Caesar Cipher',
    description: 'Learn about the classic substitution cipher',
    difficulty: 'beginner',
    content: `The Caesar cipher is one of the simplest and most widely known encryption techniques. 
    It works by shifting each letter in the plaintext by a fixed number of positions down the alphabet.
    
    For example, with a shift of 3:
    - A becomes D
    - B becomes E
    - C becomes F
    And so on...`,
    exercise: {
      question: 'Decrypt this message (shift of 3): KHOOR ZRUOG',
      hints: [
        'Remember to shift backwards',
        'H shifted back 3 becomes E',
        'Try writing out the alphabet'
      ],
      answer: 'HELLO WORLD'
    }
  },
  {
    id: 'symmetric',
    title: 'Symmetric Encryption',
    description: 'Understanding shared key encryption',
    difficulty: 'beginner',
    content: `Symmetric encryption uses the same key for both encryption and decryption.
    Think of it like a lockbox where both parties have the same key.
    
    Common algorithms include:
    - AES (Advanced Encryption Standard)
    - ChaCha20
    - Blowfish`,
    exercise: {
      question: 'If Alice and Bob use symmetric encryption, how many keys do they need in total?',
      hints: [
        'They both need to use the same key',
        'Think about the "shared" nature of the key',
        'Count the unique keys needed'
      ],
      answer: '1'
    }
  },
  {
    id: 'asymmetric',
    title: 'Asymmetric Encryption',
    description: 'Public and private key cryptography',
    difficulty: 'intermediate',
    content: `Asymmetric encryption uses two different but mathematically related keys:
    - A public key for encryption
    - A private key for decryption
    
    This solves the key distribution problem of symmetric encryption.
    Common algorithms include RSA and ECC.`,
    exercise: {
      question: 'If Alice wants to send encrypted messages to both Bob and Carol using asymmetric encryption, how many private keys does she need?',
      hints: [
        'Alice only needs to decrypt messages sent TO her',
        'She uses others\' public keys to send messages',
        'Private keys are for receiving, not sending'
      ],
      answer: '1'
    }
  }
];

export const LearningLab: React.FC = () => {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [hasCompleted, setHasCompleted] = useState<Record<string, boolean>>({});

  const checkAnswer = () => {
    if (userAnswer.trim().toUpperCase() === selectedLesson?.exercise.answer.toUpperCase()) {
      toast.success('Correct! Well done!');
      setHasCompleted(prev => ({ ...prev, [selectedLesson.id]: true }));
    } else {
      toast.error('Not quite right. Try again!');
    }
  };

  const showNextHint = () => {
    if (!selectedLesson) return;
    if (currentHintIndex < selectedLesson.exercise.hints.length - 1) {
      setCurrentHintIndex(prev => prev + 1);
    }
    setShowHint(true);
  };

  const resetExercise = () => {
    setUserAnswer('');
    setShowHint(false);
    setCurrentHintIndex(0);
  };

  const getDifficultyColor = (difficulty: Lesson['difficulty']) => {
    switch (difficulty) {
      case 'beginner':
        return 'text-green-400';
      case 'intermediate':
        return 'text-yellow-400';
      case 'advanced':
        return 'text-red-400';
      default:
        return 'text-purple-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <Shield className="w-6 h-6 text-purple-400 mr-2" />
        <h2 className="text-xl font-semibold text-purple-400">Encryption Learning Lab</h2>
      </div>

      {!selectedLesson ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lessons.map(lesson => (
            <button
              key={lesson.id}
              onClick={() => setSelectedLesson(lesson)}
              className="glass p-6 rounded-xl text-left hover:border-purple-500/50 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Book className="w-5 h-5 text-purple-400 mr-2" />
                  <h3 className="text-lg font-medium text-purple-300">{lesson.title}</h3>
                </div>
                {hasCompleted[lesson.id] && (
                  <Award className="w-5 h-5 text-yellow-400" />
                )}
              </div>
              <p className="text-gray-400 text-sm mb-2">{lesson.description}</p>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${getDifficultyColor(lesson.difficulty)}`}>
                  {lesson.difficulty.charAt(0).toUpperCase() + lesson.difficulty.slice(1)}
                </span>
                <ChevronRight className="w-4 h-4 text-purple-400" />
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <button
            onClick={() => setSelectedLesson(null)}
            className="text-purple-400 hover:text-purple-300 flex items-center"
          >
            ← Back to Lessons
          </button>

          <div className="glass p-6 rounded-xl">
            <h3 className="text-xl font-semibold text-purple-300 mb-4">{selectedLesson.title}</h3>
            <div className="prose text-gray-300 whitespace-pre-wrap mb-6">
              {selectedLesson.content}
            </div>
          </div>

          <div className="glass p-6 rounded-xl">
            <h4 className="text-lg font-medium text-purple-300 mb-4">Practice Exercise</h4>
            <p className="text-gray-300 mb-4">{selectedLesson.exercise.question}</p>
            
            <div className="space-y-4">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="w-full"
                placeholder="Enter your answer..."
              />

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={checkAnswer}
                  className="btn btn-primary flex items-center space-x-2"
                >
                  <Lock className="w-5 h-5" />
                  <span>Check Answer</span>
                </button>

                <button
                  onClick={showNextHint}
                  className="btn btn-secondary flex items-center space-x-2"
                >
                  <Key className="w-5 h-5" />
                  <span>Show Hint</span>
                </button>

                <button
                  onClick={resetExercise}
                  className="btn btn-secondary flex items-center space-x-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>Reset</span>
                </button>
              </div>

              {showHint && (
                <div className="bg-gray-900/50 p-4 rounded-lg">
                  <p className="text-purple-300">
                    Hint {currentHintIndex + 1}: {selectedLesson.exercise.hints[currentHintIndex]}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};