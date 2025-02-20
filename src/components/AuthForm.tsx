import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateKeyPair } from '../crypto';
import { useStore } from '../store/useStore';
import { Lock, User, Mail, Wrench, Crown, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { pb } from '../pocketbaseClient';

// Test user credentials
const TEST_USER = {
  email: 'sxedra@gmail.com',
  password: 'asa123'
};

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showSupporterInput, setShowSupporterInput] = useState(false);
  const [supporterCode, setSupporterCode] = useState('');
  const navigate = useNavigate();
  const { setUser, setKeyPair, initializeAnonymousUser, validateSupporterCode, setSupporterCode: setStoredSupporterCode } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const keyPair = generateKeyPair();
      
      if (isLogin) {
        // Check for test user
        if (email === TEST_USER.email && password === TEST_USER.password) {
          setUser({
            id: 'test-user',
            username: 'Test User',
            publicKey: keyPair.publicKey,
          });
          setKeyPair(keyPair);
          toast.success('Welcome Test User!');
          navigate('/chat');
          return;
        }

        const authData = await pb.collection('users').authWithPassword(email, password);
        
        setUser({
          id: authData.record.id,
          username: authData.record.username,
          publicKey: authData.record.publicKey,
        });
        
        setKeyPair({
          publicKey: authData.record.publicKey,
          privateKey: authData.record.privateKey,
        });
      } else {
        const data = {
          username,
          email,
          password,
          passwordConfirm: password,
          publicKey: keyPair.publicKey,
          privateKey: keyPair.privateKey,
        };

        const record = await pb.collection('users').create(data);
        await pb.collection('users').authWithPassword(email, password);

        setUser({
          id: record.id,
          username: record.username,
          publicKey: record.publicKey,
        });
        
        setKeyPair(keyPair);
      }

      toast.success(isLogin ? 'Welcome back!' : 'Account created successfully!');
      navigate('/chat');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleAnonymousAccess = () => {
    initializeAnonymousUser();
    toast.success('Entered as anonymous user');
    navigate('/chat');
  };

  const handleSupporterCode = () => {
    if (validateSupporterCode(supporterCode)) {
      setStoredSupporterCode(supporterCode);
      toast.success('Early supporter access granted!');
      navigate('/supporter-tools');
    } else {
      toast.error('Invalid supporter code');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="glass p-8 rounded-xl border border-cyan-500/20 backdrop-blur-lg">
        <h2 className="text-2xl font-bold text-cyan-400 mb-6 text-center">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-cyan-300 mb-1">Email</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-cyan-500/20 rounded-lg focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent text-cyan-300"
                placeholder="Enter your email"
                required
              />
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-cyan-500/50" />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-cyan-300 mb-1">Username</label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-cyan-500/20 rounded-lg focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent text-cyan-300"
                  placeholder="Choose a username"
                  required
                />
                <User className="absolute left-3 top-3.5 h-5 w-5 text-cyan-500/50" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-cyan-300 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-cyan-500/20 rounded-lg focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent text-cyan-300"
                placeholder="Enter your password"
                required
              />
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-cyan-500/50" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20"
          >
            <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-6 space-y-4">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-cyan-400 hover:text-cyan-300 text-sm w-full text-center"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-cyan-500/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-cyan-400">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={handleAnonymousAccess}
              className="flex items-center justify-center space-x-2 px-4 py-3 border border-cyan-500/20 rounded-lg bg-gray-900/50 text-cyan-400 hover:bg-cyan-900/30 transition duration-200"
            >
              <User className="w-5 h-5" />
              <span>Anonymous Access</span>
            </button>

            <button
              onClick={() => navigate('/tools')}
              className="flex items-center justify-center space-x-2 px-4 py-3 border border-cyan-500/20 rounded-lg bg-gray-900/50 text-cyan-400 hover:bg-cyan-900/30 transition duration-200"
            >
              <Wrench className="w-5 h-5" />
              <span>Security Tools</span>
            </button>

            <button
              onClick={() => setShowSupporterInput(!showSupporterInput)}
              className="flex items-center justify-center space-x-2 px-4 py-3 border border-cyan-500/20 rounded-lg bg-gray-900/50 text-cyan-400 hover:bg-cyan-900/30 transition duration-200"
            >
              <Crown className="w-5 h-5" />
              <span>Early Supporter Access</span>
            </button>
          </div>

          {showSupporterInput && (
            <div className="space-y-2 animate-fade-in">
              <div className="relative">
                <input
                  type="text"
                  value={supporterCode}
                  onChange={(e) => setSupporterCode(e.target.value)}
                  placeholder="Enter supporter code"
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-cyan-500/20 rounded-lg focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent text-cyan-300"
                />
                <Crown className="absolute left-3 top-3.5 h-5 w-5 text-cyan-500/50" />
              </div>
              <button
                onClick={handleSupporterCode}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center space-x-2"
              >
                <span>Verify Code</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}