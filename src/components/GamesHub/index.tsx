import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gamepad2, ArrowLeft, Trophy, Star, Brain, Shield, Lock, Haze as Maze, Key, Search, Sword } from 'lucide-react';
import { LearningLab } from '../SecurityTools/tools/LearningLab';
import { CardGame } from './games/CardGame';
import { EncryptionPuzzle } from './games/EncryptionPuzzle';
import { SecurityMaze } from './games/SecurityMaze';
import { PasswordDefense } from './games/PasswordDefense';
import { PrivacyDetective } from './games/PrivacyDetective';
import { CyberRPG } from './games/CyberRPG';
import { useStore } from '../../store/useStore';

interface Game {
  id: string;
  title: string;
  description: string;
  icon: React.FC<{ className?: string }>;
  component: React.FC;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'educational' | 'arcade' | 'strategy' | 'puzzle';
  comingSoon?: boolean;
}

const games: Game[] = [
  {
    id: 'learning-lab',
    title: 'Learning Lab',
    description: 'Interactive cryptography lessons and challenges',
    icon: Brain,
    component: LearningLab,
    difficulty: 'beginner',
    category: 'educational'
  },
  {
    id: 'card-game',
    title: 'Privacy Card Game',
    description: 'Match security concepts and learn while playing',
    icon: Shield,
    component: CardGame,
    difficulty: 'beginner',
    category: 'educational'
  },
  {
    id: 'encryption-puzzle',
    title: 'Encryption Puzzle',
    description: 'Solve cryptographic puzzles with increasing difficulty',
    icon: Lock,
    component: EncryptionPuzzle,
    difficulty: 'intermediate',
    category: 'puzzle'
  },
  {
    id: 'security-maze',
    title: 'Security Maze',
    description: 'Navigate through security challenges in this maze game',
    icon: Maze,
    component: SecurityMaze,
    difficulty: 'intermediate',
    category: 'arcade',
    comingSoon: true
  },
  {
    id: 'password-defense',
    title: 'Password Defense',
    description: 'Tower defense game with password security mechanics',
    icon: Key,
    component: PasswordDefense,
    difficulty: 'intermediate',
    category: 'strategy',
    comingSoon: true
  },
  {
    id: 'privacy-detective',
    title: 'Privacy Detective',
    description: 'Investigate and solve privacy breach cases',
    icon: Search,
    component: PrivacyDetective,
    difficulty: 'advanced',
    category: 'puzzle',
    comingSoon: true
  },
  {
    id: 'cyber-rpg',
    title: 'Cyber Security RPG',
    description: 'Level up your security skills in this role-playing adventure',
    icon: Sword,
    component: CyberRPG,
    difficulty: 'advanced',
    category: 'strategy',
    comingSoon: true
  }
];

export const GamesHub: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [filter, setFilter] = useState<{
    difficulty: string;
    category: string;
  }>({
    difficulty: 'all',
    category: 'all'
  });
  const navigate = useNavigate();
  const { theme } = useStore();

  const filteredGames = games.filter(game => {
    if (filter.difficulty !== 'all' && game.difficulty !== filter.difficulty) return false;
    if (filter.category !== 'all' && game.category !== filter.category) return false;
    return true;
  });

  const getDifficultyColor = (difficulty: Game['difficulty']) => {
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

  const getCategoryColor = (category: Game['category']) => {
    switch (category) {
      case 'educational':
        return 'text-blue-400';
      case 'arcade':
        return 'text-purple-400';
      case 'strategy':
        return 'text-orange-400';
      case 'puzzle':
        return 'text-pink-400';
      default:
        return 'text-cyan-400';
    }
  };

  return (
    <div className="min-h-screen cyber-gradient">
      <div className="glass p-4 flex items-center border-b border-cyan-500/20 sticky top-0 z-50">
        <button 
          onClick={() => selectedGame ? setSelectedGame(null) : navigate('/')}
          className="text-cyan-400 hover:opacity-80 mr-4 p-2 rounded-lg active:scale-95 transition-all"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center">
          <Gamepad2 className="w-6 h-6 text-cyan-400 mr-2" />
          <h1 className="text-xl font-bold text-cyan-400">
            {selectedGame ? selectedGame.title : 'Security Games'}
          </h1>
        </div>
        {!selectedGame && (
          <div className="ml-auto flex space-x-4">
            <select
              value={filter.difficulty}
              onChange={(e) => setFilter(prev => ({ ...prev, difficulty: e.target.value }))}
              className="bg-gray-800 text-cyan-300 rounded-lg border border-cyan-500/20"
            >
              <option value="all">All Difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            <select
              value={filter.category}
              onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value }))}
              className="bg-gray-800 text-cyan-300 rounded-lg border border-cyan-500/20"
            >
              <option value="all">All Categories</option>
              <option value="educational">Educational</option>
              <option value="arcade">Arcade</option>
              <option value="strategy">Strategy</option>
              <option value="puzzle">Puzzle</option>
            </select>
          </div>
        )}
      </div>

      <div className="container-fluid py-8">
        {selectedGame ? (
          <div className="glass-card p-6">
            <selectedGame.component />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGames.map(game => (
              <button
                key={game.id}
                onClick={() => !game.comingSoon && setSelectedGame(game)}
                className={`glass p-6 rounded-xl text-left hover:border-cyan-500/50 transition-all relative overflow-hidden ${
                  game.comingSoon ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {game.comingSoon && (
                  <div className="absolute top-2 right-2 bg-yellow-600 text-white text-xs px-2 py-1 rounded-full">
                    Coming Soon
                  </div>
                )}
                <div className="flex items-center mb-4">
                  <game.icon className="w-8 h-8 text-cyan-400 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-cyan-300">{game.title}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`text-sm ${getDifficultyColor(game.difficulty)}`}>
                        {game.difficulty}
                      </span>
                      <span className="text-gray-500">•</span>
                      <span className={`text-sm ${getCategoryColor(game.category)}`}>
                        {game.category}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-400 text-sm">{game.description}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};