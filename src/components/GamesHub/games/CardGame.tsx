import React, { useState, useEffect } from 'react';
import { Shield, RefreshCw, Trophy } from 'lucide-react';
import toast from 'react-hot-toast';

interface Card {
  id: string;
  concept: string;
  description: string;
  matched?: boolean;
  flipped?: boolean;
}

const securityConcepts: Card[] = [
  {
    id: '1',
    concept: 'Encryption',
    description: 'Process of encoding information to keep it secure'
  },
  {
    id: '2',
    concept: 'Authentication',
    description: 'Verifying the identity of a user or system'
  },
  {
    id: '3',
    concept: 'Firewall',
    description: 'Security system that monitors and controls network traffic'
  },
  {
    id: '4',
    concept: 'Phishing',
    description: 'Fraudulent attempt to obtain sensitive information'
  },
  {
    id: '5',
    concept: 'VPN',
    description: 'Virtual Private Network that encrypts internet traffic'
  },
  {
    id: '6',
    concept: 'Two-Factor',
    description: 'Additional security layer beyond password'
  },
  {
    id: '7',
    concept: 'Malware',
    description: 'Software designed to harm computer systems'
  },
  {
    id: '8',
    concept: 'Backup',
    description: 'Copy of data stored separately for safety'
  }
];

export const CardGame: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<Card[]>([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  const initializeGame = () => {
    // Create pairs of cards (concept + description)
    const gameDeck = [...securityConcepts].flatMap(concept => [
      { ...concept, id: `${concept.id}-concept` },
      { id: `${concept.id}-desc`, concept: concept.description, description: concept.concept }
    ]);
    
    // Shuffle the deck
    const shuffledDeck = gameDeck.sort(() => Math.random() - 0.5);
    setCards(shuffledDeck);
    setFlippedCards([]);
    setMatches(0);
    setMoves(0);
    setGameComplete(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleCardClick = (card: Card) => {
    if (flippedCards.length === 2 || card.matched || flippedCards.find(c => c.id === card.id)) {
      return;
    }

    const newFlippedCards = [...flippedCards, card];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      // Check for match
      const [first, second] = newFlippedCards;
      const isMatch = first.id.split('-')[0] === second.id.split('-')[0];

      if (isMatch) {
        setMatches(prev => prev + 1);
        setCards(prev => prev.map(c => 
          c.id === first.id || c.id === second.id ? { ...c, matched: true } : c
        ));
        setFlippedCards([]);
        
        if (matches + 1 === securityConcepts.length) {
          setGameComplete(true);
          toast.success('Congratulations! You\'ve completed the game!');
        }
      } else {
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Shield className="w-6 h-6 text-cyan-400 mr-2" />
          <h2 className="text-xl font-semibold text-cyan-400">Privacy Card Game</h2>
        </div>
        <button
          onClick={initializeGame}
          className="btn btn-secondary flex items-center space-x-2"
        >
          <RefreshCw className="w-5 h-5" />
          <span>New Game</span>
        </button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="text-cyan-300">Moves: {moves}</div>
        <div className="text-cyan-300">Matches: {matches}/{securityConcepts.length}</div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {cards.map(card => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card)}
            className={`aspect-[3/4] rounded-lg transition-all duration-300 transform perspective-1000 ${
              card.matched || flippedCards.find(c => c.id === card.id)
                ? 'rotate-y-180'
                : ''
            }`}
            disabled={card.matched}
          >
            <div className="relative w-full h-full">
              {/* Card Front */}
              <div
                className={`absolute inset-0 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-lg p-4 flex items-center justify-center text-white text-center transform ${
                  card.matched || flippedCards.find(c => c.id === card.id)
                    ? 'rotate-y-180 opacity-0'
                    : ''
                }`}
              >
                <Shield className="w-8 h-8" />
              </div>

              {/* Card Back */}
              <div
                className={`absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg p-4 flex items-center justify-center text-white text-center transform ${
                  card.matched || flippedCards.find(c => c.id === card.id)
                    ? ''
                    : 'rotate-y-180 opacity-0'
                }`}
              >
                <span className="text-sm">{card.concept}</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {gameComplete && (
        <div className="mt-8 text-center">
          <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-cyan-400 mb-2">
            Game Complete!
          </h3>
          <p className="text-cyan-300">
            You completed the game in {moves} moves!
          </p>
          <button
            onClick={initializeGame}
            className="btn btn-primary mt-4"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};