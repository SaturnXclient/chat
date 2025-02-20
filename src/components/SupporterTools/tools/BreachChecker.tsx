import React, { useState } from 'react';
import { AlertTriangle, Shield, Mail, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface BreachResult {
  breached: boolean;
  breaches?: number;
  firstBreach?: string;
  lastBreach?: string;
  details?: {
    name: string;
    domain: string;
    breachDate: string;
    description: string;
  }[];
}

export const BreachChecker: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BreachResult | null>(null);

  const checkBreaches = async () => {
    if (!email) {
      toast.error('Please enter an email address');
      return;
    }

    setLoading(true);
    try {
      // Simulated breach check response for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Demo data - in a real app, this would come from an API
      const demoBreaches = [
        {
          name: "DemoBreachOne",
          domain: "demo1.com",
          breachDate: "2023-01-15",
          description: "This breach affected 1 million users and exposed email addresses and passwords."
        },
        {
          name: "DemoBreachTwo",
          domain: "demo2.com",
          breachDate: "2023-06-20",
          description: "This breach exposed user data including emails and personal information."
        }
      ];

      // Simulate a breach found for demo emails
      const isBreached = email.toLowerCase().includes('demo') || 
                        email.toLowerCase().includes('test') ||
                        Math.random() > 0.7;

      if (isBreached) {
        setResult({
          breached: true,
          breaches: demoBreaches.length,
          firstBreach: "2023-01-15",
          lastBreach: "2023-06-20",
          details: demoBreaches
        });
        toast.error('Breaches found! Please check the details below.');
      } else {
        setResult({ breached: false });
        toast.success('Good news! No breaches found.');
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

          {result.breached && result.details && (
            <div className="space-y-4 mt-4">
              {result.details.map((breach, index) => (
                <div key={index} className="p-4 bg-purple-900/20 rounded-lg">
                  <h4 className="text-purple-300 font-semibold mb-2">{breach.name}</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-purple-400">Domain:</span> {breach.domain}</p>
                    <p><span className="text-purple-400">Date:</span> {breach.breachDate}</p>
                    <p><span className="text-purple-400">Details:</span> {breach.description}</p>
                  </div>
                </div>
              ))}
              
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