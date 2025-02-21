import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateKeyPair } from '../crypto';
import { useStore } from '../store/useStore';
import { Lock, User, Mail, Wrench, Crown, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../supabaseClient';

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSupporterInput, setShowSupporterInput] = useState(false);
  const [supporterCode, setSupporterCode] = useState('');
  const navigate = useNavigate();
  const { setUser, setKeyPair, initializeAnonymousUser, validateSupporterCode, setSupporterCode: setStoredSupporterCode } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const keyPair = generateKeyPair();
      
      if (isLogin) {
        const { data: { user: authUser }, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (authError) throw authError;

        // Get user profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser?.id)
          .single();

        if (profileError) throw profileError;

        setUser({
          id: authUser?.id || '',
          username: profile.username,
          publicKey: profile.public_key,
          email: authUser?.email
        });
        
        setKeyPair({
          publicKey: profile.public_key,
          privateKey: profile.private_key,
        });

      } else {
        const { data: { user: authUser }, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username,
            }
          }
        });

        if (signUpError) throw signUpError;

        // Create user profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authUser?.id,
            username,
            public_key: keyPair.publicKey,
            private_key: keyPair.privateKey,
          });

        if (profileError) throw profileError;

        setUser({
          id: authUser?.id || '',
          username,
          publicKey: keyPair.publicKey,
          email: authUser?.email
        });
        
        setKeyPair(keyPair);
      }

      toast.success(isLogin ? 'Welcome back!' : 'Account created successfully!');
      navigate('/chat');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
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
      <div className="glass p-8 rounded-xl">
        <h2 className="text-2xl font-bold text-slate-200 mb-6 text-center">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10"
                placeholder="Enter your email"
                required
              />
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Username</label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10"
                  placeholder="Choose a username"
                  required
                />
                <User className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10"
                placeholder="Enter your password"
                required
                minLength={8}
              />
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-6 space-y-4">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-slate-400 hover:text-slate-200 text-sm w-full text-center"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-950 text-slate-400">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={handleAnonymousAccess}
              className="flex items-center justify-center space-x-2 px-4 py-3 border border-slate-800 rounded-lg bg-slate-900/50 text-slate-200 hover:bg-slate-800/50 transition duration-200"
            >
              <User className="w-5 h-5" />
              <span>Anonymous Access</span>
            </button>

            <button
              onClick={() => navigate('/tools')}
              className="flex items-center justify-center space-x-2 px-4 py-3 border border-slate-800 rounded-lg bg-slate-900/50 text-slate-200 hover:bg-slate-800/50 transition duration-200"
            >
              <Wrench className="w-5 h-5" />
              <span>Security Tools</span>
            </button>

            <button
              onClick={() => setShowSupporterInput(!showSupporterInput)}
              className="flex items-center justify-center space-x-2 px-4 py-3 border border-slate-800 rounded-lg bg-slate-900/50 text-slate-200 hover:bg-slate-800/50 transition duration-200"
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
                  className="w-full pl-10"
                />
                <Crown className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
              </div>
              <button
                onClick={handleSupporterCode}
                className="btn btn-primary w-full flex items-center justify-center space-x-2"
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