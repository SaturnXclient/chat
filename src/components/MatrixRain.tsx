import React, { useEffect, useRef } from 'react';

export const MatrixRain: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const columnsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const fontSize = 16;
    const columns = Math.floor(window.innerWidth / fontSize);
    let drops: number[] = new Array(columns).fill(0);

    const createRainDrop = (index: number) => {
      // Remove existing column if it exists
      if (columnsRef.current[index] && columnsRef.current[index].parentNode) {
        container.removeChild(columnsRef.current[index]);
      }

      const column = document.createElement('div');
      column.className = 'matrix-column';
      column.style.left = `${(index * fontSize)}px`;
      column.style.animationDelay = `${Math.random() * 2}s`;
      
      const length = 20 + Math.floor(Math.random() * 30);
      const content = Array.from({ length }, () => 
        characters[Math.floor(Math.random() * characters.length)]
      ).join('\n');
      
      column.textContent = content;
      container.appendChild(column);
      columnsRef.current[index] = column;

      // Auto-remove after animation
      setTimeout(() => {
        if (column.parentNode === container) {
          container.removeChild(column);
        }
      }, 8000);
    };

    // Create initial drops with reduced frequency
    const interval = setInterval(() => {
      for (let i = 0; i < drops.length; i++) {
        if (Math.random() < 0.03) { // Reduced frequency
          createRainDrop(i);
        }
      }
    }, 150); // Increased interval

    // Handle window resize
    const handleResize = () => {
      // Clear existing columns
      columnsRef.current.forEach(column => {
        if (column && column.parentNode === container) {
          container.removeChild(column);
        }
      });
      columnsRef.current = [];
      drops = new Array(Math.floor(window.innerWidth / fontSize)).fill(0);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
      // Clean up remaining columns
      columnsRef.current.forEach(column => {
        if (column && column.parentNode === container) {
          container.removeChild(column);
        }
      });
    };
  }, []);

  return <div ref={containerRef} className="matrix-background" />;
};