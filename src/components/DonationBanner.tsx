import React, { useState } from 'react';
import { Bitcoin, DollarSign, Heart, Shield, Gift } from 'lucide-react';
import toast from 'react-hot-toast';

export const DonationBanner: React.FC = () => {
  const [showDetails, setShowDetails] = useState(false);
  const btcAddress = 'bc1q5smt5dgre0qx5m65xmjtwwlvnm0zad2x7wr7vh';
  const paypalLink = 'https://paypal.me/BrendDono';

  const copyBTCAddress = () => {
    navigator.clipboard.writeText(btcAddress);
    toast.success('Bitcoin address copied to clipboard!');
  };

  return (
    <div className="mt-8 mb-12">
      <div className="glass rounded-xl p-6 border border-cyan-500/20 bg-gradient-to-r from-black/50 via-cyan-900/20 to-black/50 relative overflow-hidden">
        {/* Animated background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 animate-pulse"></div>
        
        {/* Content */}
        <div className="relative z-10">
          <div className="flex flex-col items-center space-y-4">
            {/* Icon */}
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-2xl"></div>
              <div className="relative bg-gradient-to-r from-cyan-500/20 to-blue-500/20 p-4 rounded-full border border-cyan-500/30">
                <Shield className="w-8 h-8 text-cyan-400" />
              </div>
            </div>

            {/* Title */}
            <div className="text-center">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 text-transparent bg-clip-text">
                Support Privacy Innovation
              </h2>
              <p className="text-cyan-300 mt-2">
                Help us develop more advanced encryption tools for a secure digital future
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-full max-w-md">
              <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                  style={{ width: '35%' }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <span className="text-cyan-400">$17,500 raised</span>
                <span className="text-cyan-400">$50,000 goal</span>
              </div>
            </div>

            {/* Donation buttons */}
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              <button
                onClick={copyBTCAddress}
                className="flex items-center space-x-2 bg-gradient-to-r from-yellow-600/30 to-yellow-800/30 hover:from-yellow-600/40 hover:to-yellow-800/40 text-yellow-400 px-6 py-3 rounded-lg transition-all duration-200 border border-yellow-500/30 hover:border-yellow-500/50 cyber-hover"
              >
                <Bitcoin className="w-5 h-5" />
                <span>Donate with Bitcoin</span>
              </button>

              <a
                href={paypalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600/30 to-blue-800/30 hover:from-blue-600/40 hover:to-blue-800/40 text-blue-400 px-6 py-3 rounded-lg transition-all duration-200 border border-blue-500/30 hover:border-blue-500/50 cyber-hover"
              >
                <DollarSign className="w-5 h-5" />
                <span>Donate with PayPal</span>
              </a>
            </div>

            {/* Supporter benefits */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200 mt-2"
            >
              {showDetails ? 'Hide supporter benefits' : 'View supporter benefits'}
            </button>

            {showDetails && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 w-full">
                <div className="glass p-4 rounded-lg border border-cyan-500/20">
                  <Gift className="w-5 h-5 text-cyan-400 mb-2" />
                  <h3 className="text-cyan-400 font-semibold">Early Access</h3>
                  <p className="text-cyan-300 text-sm">Preview new security features before release</p>
                </div>
                <div className="glass p-4 rounded-lg border border-cyan-500/20">
                  <Shield className="w-5 h-5 text-cyan-400 mb-2" />
                  <h3 className="text-cyan-400 font-semibold">Priority Support</h3>
                  <p className="text-cyan-300 text-sm">Direct access to our development team</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};