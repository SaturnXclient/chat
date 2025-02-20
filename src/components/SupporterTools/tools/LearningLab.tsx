import React, { useState, useEffect } from 'react';
import { Shield, Book, Award, ChevronRight, Lock, Key, RefreshCw, Filter, Trophy, Star } from 'lucide-react';
import toast from 'react-hot-toast';

interface Lesson {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'master';
  content: string;
  exercise: {
    question: string;
    hints: string[];
    answer: string;
  };
  requiresCompletion?: string[];
}

const regularLessons = [
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
  },
  {
    id: 'hash',
    title: 'Hash Functions',
    description: 'One-way cryptographic functions',
    difficulty: 'beginner',
    content: `Hash functions are one-way mathematical functions that convert input data into a fixed-size string.
    Key properties:
    - Deterministic: Same input always produces same output
    - Quick to compute
    - Infeasible to reverse
    - Small changes in input create large changes in output`,
    exercise: {
      question: 'Can you decrypt a hash value back to its original input?',
      hints: [
        'Think about the "one-way" property',
        'Consider what makes hash functions secure',
        'Remember the difference between encryption and hashing'
      ],
      answer: 'NO'
    }
  },
  {
    id: 'digital-signatures',
    title: 'Digital Signatures',
    description: 'Ensuring authenticity and integrity',
    difficulty: 'intermediate',
    content: `Digital signatures combine hashing and asymmetric encryption to:
    1. Verify the identity of the sender
    2. Ensure message hasn't been tampered with
    3. Provide non-repudiation`,
    exercise: {
      question: 'Which key (public or private) is used to create a digital signature?',
      hints: [
        'Think about who needs to verify the signature',
        'Consider which key proves identity',
        'Remember asymmetric key properties'
      ],
      answer: 'PRIVATE'
    }
  },
  {
    id: 'perfect-forward-secrecy',
    title: 'Perfect Forward Secrecy',
    description: 'Protecting past communications',
    difficulty: 'advanced',
    content: `Perfect Forward Secrecy (PFS) ensures that session keys will not be compromised
    even if the long-term keys are compromised in the future.
    
    This is achieved through ephemeral key exchange protocols like:
    - Diffie-Hellman Ephemeral (DHE)
    - Elliptic Curve Diffie-Hellman Ephemeral (ECDHE)`,
    exercise: {
      question: 'If a server\'s private key is compromised, can past communications be decrypted if PFS was used?',
      hints: [
        'Think about the "forward" in forward secrecy',
        'Consider the purpose of ephemeral keys',
        'Remember each session uses unique keys'
      ],
      answer: 'NO'
    }
  },
  {
    id: 'zero-knowledge-proofs',
    title: 'Zero-Knowledge Proofs',
    description: 'Proving without revealing',
    difficulty: 'advanced',
    content: `Zero-knowledge proofs allow one party (the prover) to prove to another party (the verifier)
    that a statement is true without revealing any information beyond the validity of the statement.
    
    Properties:
    1. Completeness: If statement is true, honest verifier will be convinced
    2. Soundness: False statement cannot be proven
    3. Zero-knowledge: Verifier learns nothing except statement validity`,
    exercise: {
      question: 'In a zero-knowledge proof, does the verifier learn the actual information being proven?',
      hints: [
        'Consider the "zero-knowledge" property',
        'Think about what information is actually shared',
        'Remember the main purpose of ZKP'
      ],
      answer: 'NO'
    }
  },
  {
    id: 'quantum-cryptography',
    title: 'Quantum Cryptography',
    description: 'Future-proof encryption',
    difficulty: 'advanced',
    content: `Quantum cryptography uses principles of quantum mechanics to achieve:
    - Unconditionally secure key distribution
    - Detection of eavesdropping attempts
    - Quantum-resistant algorithms
    
    Key concepts:
    - Quantum Key Distribution (QKD)
    - No-cloning theorem
    - Quantum superposition`,
    exercise: {
      question: 'What happens to a quantum state when it is measured by an eavesdropper?',
      hints: [
        'Think about the observer effect in quantum mechanics',
        'Consider the no-cloning theorem',
        'Remember why QKD is secure'
      ],
      answer: 'COLLAPSES'
    }
  },
  {
    id: 'blockchain',
    title: 'Blockchain Cryptography',
    description: 'Decentralized security',
    difficulty: 'intermediate',
    content: `Blockchain technology combines multiple cryptographic concepts:
    - Hash functions for block linking
    - Digital signatures for transaction authentication
    - Merkle trees for efficient verification
    - Consensus mechanisms for agreement`,
    exercise: {
      question: 'What cryptographic primitive is used to link blocks in a blockchain?',
      hints: [
        'Think about what makes blocks immutable',
        'Consider how blocks reference previous blocks',
        'Remember properties of cryptographic functions'
      ],
      answer: 'HASH'
    }
  },
  {
    id: 'homomorphic',
    title: 'Homomorphic Encryption',
    description: 'Computing on encrypted data',
    difficulty: 'advanced',
    content: `Homomorphic encryption allows computations to be performed on encrypted data
    without decrypting it first. Types include:
    - Partially homomorphic encryption (PHE)
    - Somewhat homomorphic encryption (SHE)
    - Fully homomorphic encryption (FHE)`,
    exercise: {
      question: 'Does homomorphic encryption require data to be decrypted before performing calculations?',
      hints: [
        'Think about the main purpose of homomorphic encryption',
        'Consider the privacy implications',
        'Remember what makes it special'
      ],
      answer: 'NO'
    }
  }
];

const masterChallenge: Lesson = {
  id: 'master-challenge',
  title: 'Master Cryptographer Challenge',
  description: 'The ultimate test of your cryptographic knowledge',
  difficulty: 'master',
  requiresCompletion: regularLessons.map(l => l.id),
  content: `Congratulations on making it to the Master Challenge! 
  This challenge combines concepts from all previous lessons.
  
  Your task is to decrypt a message that has been secured using multiple layers of encryption:
  1. The message was first encoded using a Caesar cipher
  2. Then encrypted using RSA
  3. Finally, the result was hashed using SHA-256
  
  You'll need to apply your knowledge in reverse order to solve this.`,
  exercise: {
    question: `Decrypt this multi-layered message:
    
    Layer 1 (Hash): 8a7b5c3d2e1f...
    Layer 2 (RSA): MIIBIjANBgkqhkiG9w0B...
    Layer 3 (Caesar): NKRRU IURLK
    
    Hint: Start with the Caesar cipher (shift: 3)`,
    hints: [
      'Remember to work backwards through the layers',
      'The Caesar cipher shift is the same as in the first lesson',
      'Use your knowledge of RSA from the asymmetric encryption lesson',
      'The hash is there to verify your answer'
    ],
    answer: 'HELLO WORLD'
  }
};

const lessons = [...regularLessons, masterChallenge];

export const LearningLab: React.FC = () => {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [hasCompleted, setHasCompleted] = useState<Record<string, boolean>>({});
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced' | 'master'>('all');
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completionType, setCompletionType] = useState<'lesson' | 'master' | null>(null);

  const filteredLessons = lessons.filter(lesson => {
    if (difficultyFilter === 'all') return true;
    if (lesson.difficulty === 'master') {
      return difficultyFilter === 'master' && 
        lesson.requiresCompletion?.every(id => hasCompleted[id]);
    }
    return lesson.difficulty === difficultyFilter;
  });

  const checkAnswer = () => {
    if (!selectedLesson) return;

    if (userAnswer.trim().toUpperCase() === selectedLesson.exercise.answer.toUpperCase()) {
      const isNewCompletion = !hasCompleted[selectedLesson.id];
      setHasCompleted(prev => ({ ...prev, [selectedLesson.id]: true }));
      
      if (isNewCompletion) {
        if (selectedLesson.difficulty === 'master') {
          setCompletionType('master');
        } else {
          setCompletionType('lesson');
        }
        setShowCompletionModal(true);
      } else {
        toast.success('Correct! Well done!');
      }
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
      case 'master':
        return 'text-purple-400';
      default:
        return 'text-purple-400';
    }
  };

  const CompletionModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 p-8 rounded-xl border border-purple-500/20 max-w-md w-full mx-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-cyan-500/10 to-purple-500/10 animate-pulse"></div>
        
        <div className="relative z-10">
          {completionType === 'master' ? (
            <>
              <div className="flex justify-center mb-6">
                <Trophy className="w-16 h-16 text-yellow-400 animate-bounce" />
              </div>
              <h3 className="text-2xl font-bold text-center mb-4 bg-gradient-to-r from-yellow-400 via-purple-400 to-yellow-400 text-transparent bg-clip-text">
                Master Cryptographer!
              </h3>
              <p className="text-purple-300 text-center mb-6">
                Congratulations! You've completed all challenges and proven yourself a true master of cryptography!
              </p>
            </>
          ) : (
            <>
              <div className="flex justify-center mb-6">
                <Star className="w-16 h-16 text-purple-400 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-center mb-4 text-purple-400">
                Challenge Complete!
              </h3>
              <p className="text-purple-300 text-center mb-6">
                Well done! Keep going to unlock the Master Challenge!
              </p>
            </>
          )}
          
          <div className="flex justify-center">
            <button
              onClick={() => setShowCompletionModal(false)}
              className="btn btn-primary"
            >
              Continue Learning
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Shield className="w-6 h-6 text-purple-400 mr-2" />
          <h2 className="text-xl font-semibold text-purple-400">Encryption Learning Lab</h2>
        </div>
        {!selectedLesson && (
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-purple-400" />
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value as typeof difficultyFilter)}
              className="bg-gray-800 text-purple-300 rounded-lg border border-purple-500/20"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              {regularLessons.every(lesson => hasCompleted[lesson.id]) && (
                <option value="master">Master Challenge</option>
              )}
            </select>
          </div>
        )}
      </div>

      {!selectedLesson ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredLessons.map(lesson => (
            <button
              key={lesson.id}
              onClick={() => setSelectedLesson(lesson)}
              className={`glass p-6 rounded-xl text-left hover:border-purple-500/50 transition-all ${
                lesson.difficulty === 'master' ? 'col-span-full bg-gradient-to-r from-purple-500/10 to-cyan-500/10' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  {lesson.difficulty === 'master' ? (
                    <Trophy className="w-5 h-5 text-yellow-400 mr-2" />
                  ) : (
                    <Book className="w-5 h-5 text-purple-400 mr-2" />
                  )}
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
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-purple-300">{selectedLesson.title}</h3>
              <span className={`px-3 py-1 rounded-full text-sm ${getDifficultyColor(selectedLesson.difficulty)} bg-gray-800`}>
                {selectedLesson.difficulty}
              </span>
            </div>
            <div className="prose text-gray-300 whitespace-pre-wrap mb-6">
              {selectedLesson.content}
            </div>
          </div>

          <div className="glass p-6 rounded-xl">
            <h4 className="text-lg font-medium text-purple-300 mb-4">Practice Exercise</h4>
            <p className="text-gray-300 mb-4 whitespace-pre-wrap">{selectedLesson.exercise.question}</p>
            
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

      {showCompletionModal && <CompletionModal />}
    </div>
  );
};