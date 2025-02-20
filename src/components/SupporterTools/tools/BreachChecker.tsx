import React, { useState } from 'react';
import { AlertTriangle, Shield, Mail, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

export const BreachChecker: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    breached: boolean;
    breaches?: number;
    firstBreach?: string;
    lastBreach?: string;
  } | null>(null);

  const checkBreaches = async () => {
    if (!email) {
      toast.error('Please enter an email address');
      return;
    }

    setLoading(true);
    try {
      // Using the public haveibeenpwned API endpoint
      const response = await fetch(`https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}`, {
        headers: {
          'User-Agent': 'RSA Secure Chat'
        }
      });

      if (response.status === 404) {
        setResult({ breached: false });
        toast.success('Good news! No breaches found.');
      } else if (response.status === 200) {
        const data = await response.json();
        setResult({
          breached: true,
          breaches: data.length,
          firstBreach: new Date(data[0].BreachDate).toLocaleDateString(),
          lastBreach: new Date(data[data.length - 1].BreachDate).toLocaleDateString()
        });
        toast.error('Breaches found! Please check the details below.');
      } else {
        throw new Error('Failed to check breaches');
      }
    } catch (error) {
      toast.error('Failed to check breaches. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <AlertTriangle className="w-6 h-6 text-purple-400 mr-2" />
        <h2 className="text-xl font-semibold text-purple-400">Breach Checker</h2>
      </div>

      <div className="card space-y-4">
        <div>
          <label className="block text-sm font-medium text-purple-300 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-purple-500/50" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10"
              placeholder="Enter your email address"
            />
          </div>
        </div>

        <button
          onClick={checkBreaches}
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? 'Checking...' : 'Check for Breaches'}
        </button>
      </div>

      {result && (
        <div className={`card ${
          result.breached ? 'border-red-500/20' : 'border-green-500/20'
        }`}>
          <div className="flex items-center mb-4">
            {result.breached ? (
              <X className="w-8 h-8 text-red-400 mr-3" />
            ) : (
              <Check className="w-8 h-8 text-green-400 mr-3" />
            )}
            <div>
              <h3 className={`text-lg font-semibold ${
                result.breached ? 'text-red-400' : 'text-green-400'
              }`}>
                {result.breached ? 'Breaches Found!' : 'No Breaches Found'}
              </h3>
              <p className="text-purple-300 text-sm">
                {result.breached
                  ? `This email appears in ${result.breaches} known data breaches`
                  : 'Your email appears to be secure'}
              </p>
            </div>
          </div>

          {result.breached && (
            <div className="space-y-2 mt-4">
              <div className="flex justify-between">
                <span className="text-purple-300">First breach:</span>
                <span className="text-red-400">{result.firstBreach}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-300">Latest breach:</span>
                <span className="text-red-400">{result.lastBreach}</span>
              </div>
              <div className="mt-4 p-4 bg-red-500/10 rounded-lg">
                <div className="flex items-start">
                  <Shield className="w-5 h-5 text-red-400 mr-2 mt-1" />
                  <div className="text-sm text-red-400">
                    Recommended actions:
                    <ul className="list-disc ml-5 mt-2 space-y-1">
                      <li>Change your password immediately</li>
                      <li>Enable two-factor authentication</li>
                      <li>Check for suspicious activity</li>
                      <li>Use unique passwords for each account</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};