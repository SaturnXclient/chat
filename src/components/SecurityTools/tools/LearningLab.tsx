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
    id: 'intro',
    title: 'Introduction to Cryptography',
    description: 'Learn the basics of cryptography and encryption',
    difficulty: 'beginner',
    content: `Cryptography is the practice of securing communication from third-party observers.
    
Key concepts:
- Encryption: Converting plaintext into ciphertext
- Decryption: Converting ciphertext back to plaintext
- Key: A piece of information used to encrypt/decrypt messages`,
    exercise: {
      question: 'What is the main purpose of cryptography?',
      hints: [
        'Think about privacy',
        'Consider communication security',
        'What are we protecting against?'
      ],
      answer: 'SECURE COMMUNICATION'
    }
  },
  {
    id: 'symmetric',
    title: 'Symmetric Encryption',
    description: 'Understanding shared key encryption',
    difficulty: 'beginner',
    content: `Symmetric encryption uses the same key for both encryption and decryption.
    
Common algorithms:
- AES (Advanced Encryption Standard)
- DES (Data Encryption Standard)
- ChaCha20

Advantages:
- Fast and efficient
- Simple key management for single user

Disadvantages:
- Key distribution problem
- Scales poorly with multiple users`,
    exercise: {
      question: 'In symmetric encryption, how many keys are needed for two parties to communicate?',
      hints: [
        'Think about encryption and decryption',
        'Consider what "symmetric" means',
        'Both parties need to encrypt and decrypt'
      ],
      answer: '1'
    }
  },
  {
    id: 'asymmetric',
    title: 'Asymmetric Encryption',
    description: 'Public and private key cryptography',
    difficulty: 'intermediate',
    content: `Asymmetric encryption uses different keys for encryption and decryption:
- Public key: Shared openly, used for encryption
- Private key: Kept secret, used for decryption

Common algorithms:
- RSA
- ECC (Elliptic Curve Cryptography)

Key features:
- Solves key distribution problem
- Enables digital signatures
- More computationally intensive`,
    exercise: {
      question: 'Which key is used to encrypt a message in asymmetric encryption?',
      hints: [
        'One key is shared publicly',
        'Think about which key the sender needs',
        'The recipient needs to decrypt'
      ],
      answer: 'PUBLIC'
    }
  },
  {
    id: 'hashing',
    title: 'Cryptographic Hashing',
    description: 'One-way functions and data integrity',
    difficulty: 'intermediate',
    content: `Hashing is a one-way function that converts input into a fixed-size output.

Properties:
- Deterministic: Same input always produces same output
- One-way: Cannot reverse the process
- Collision resistant: Hard to find two inputs with same output

Common algorithms:
- SHA-256
- SHA-3
- Blake2`,
    exercise: {
      question: 'Can a hash function be reversed to get the original input?',
      hints: [
        'Think about "one-way" property',
        'Consider data recovery',
        'Is it mathematically possible?'
      ],
      answer: 'NO'
    }
  },
  {
    id: 'digital-signatures',
    title: 'Digital Signatures',
    description: 'Message authentication and non-repudiation',
    difficulty: 'advanced',
    content: `Digital signatures provide:
- Authentication: Verify sender's identity
- Integrity: Detect message tampering
- Non-repudiation: Sender cannot deny sending

Process:
1. Hash the message
2. Encrypt hash with private key
3. Attach encrypted hash to message`,
    exercise: {
      question: 'Which key is used to create a digital signature?',
      hints: [
        'Think about proving identity',
        'Consider who needs to verify',
        'Public key must verify signature'
      ],
      answer: 'PRIVATE'
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
    if (!selectedLesson) return;

    if (userAnswer.trim().toUpperCase() === selectedLesson.exercise.answer) {
      setHasCompleted(prev => ({ ...prev, [selectedLesson.id]: true }));
      toast.success('Correct! Well done!');
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
        return 'text-cyan-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <Shield className="w-6 h-6 text-cyan-400 mr-2" />
        <h2 className="text-xl font-semibold text-cyan-400">Learning Lab</h2>
      </div>

      {!selectedLesson ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lessons.map(lesson => (
            <button
              key={lesson.id}
              onClick={() => setSelectedLesson(lesson)}
              className="glass p-6 rounded-xl text-left hover:border-cyan-500/50 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Book className="w-5 h-5 text-cyan-400 mr-2" />
                  <h3 className="text-lg font-medium text-cyan-300">{lesson.title}</h3>
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
                <ChevronRight className="w-4 h-4 text-cyan-400" />
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <button
            onClick={() => setSelectedLesson(null)}
            className="text-cyan-400 hover:text-cyan-300 flex items-center"
          >
            ← Back to Lessons
          </button>

          <div className="glass p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-cyan-300">{selectedLesson.title}</h3>
              <span className={`px-3 py-1 rounded-full text-sm ${getDifficultyColor(selectedLesson.difficulty)} bg-gray-800`}>
                {selectedLesson.difficulty}
              </span>
            </div>
            <div className="prose text-gray-300 whitespace-pre-wrap mb-6">
              {selectedLesson.content}
            </div>
          </div>

          <div className="glass p-6 rounded-xl">
            <h4 className="text-lg font-medium text-cyan-300 mb-4">Practice Exercise</h4>
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
                  <p className="text-cyan-300">
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