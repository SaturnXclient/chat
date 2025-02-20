import React from 'react';

interface BackgroundEffectProps {
  theme: 'cyber' | 'sakura' | 'meme' | 'chill';
}

export const BackgroundEffect: React.FC<BackgroundEffectProps> = ({ theme }) => {
  if (theme === 'cyber') {
    return <MatrixEffect />;
  } else if (theme === 'sakura') {
    return <SakuraEffect />;
  } else if (theme === 'chill') {
    return <ChillEffect />;
  }
  return <MemeEffect />;
};

const MatrixEffect = () => (
  <div className="matrix-background">
    {/* Matrix rain is handled by CSS */}
  </div>
);

const SakuraEffect = () => (
  <div className="sakura-background">
    {Array.from({ length: 20 }).map((_, i) => (
      <div key={i} className="sakura-petal" style={{
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 10}s`,
        animationDuration: `${10 + Math.random() * 10}s`
      }} />
    ))}
  </div>
);

const ChillEffect = () => (
  <div className="chill-background">
    {Array.from({ length: 50 }).map((_, i) => (
      <div key={i} className="star" style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`
      }} />
    ))}
  </div>
);

const MemeEffect = () => (
  <div className="meme-background">
    {Array.from({ length: 15 }).map((_, i) => (
      <div key={i} className="doge-coin" style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`
      }}>
        🚀
      </div>
    ))}
  </div>
);