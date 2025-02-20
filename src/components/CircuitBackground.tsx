import React, { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface Connection {
  start: Point;
  end: Point;
  progress: number;
  speed: number;
}

export const CircuitBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const connectionsRef = useRef<Connection[]>([]);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const initPoints = () => {
      const points: Point[] = [];
      const numPoints = Math.floor((canvas.width * canvas.height) / 25000);
      
      for (let i = 0; i < numPoints; i++) {
        points.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5
        });
      }
      
      pointsRef.current = points;
    };

    const createConnection = (start: Point, end: Point) => {
      return {
        start,
        end,
        progress: 0,
        speed: 0.02 + Math.random() * 0.03
      };
    };

    const updateConnections = () => {
      const maxConnections = 50;
      const connections = connectionsRef.current;
      const points = pointsRef.current;

      // Remove completed connections
      connectionsRef.current = connections.filter(c => c.progress < 1);

      // Add new connections if needed
      while (connections.length < maxConnections) {
        const start = points[Math.floor(Math.random() * points.length)];
        const possibleEnds = points.filter(p => {
          const distance = Math.hypot(p.x - start.x, p.y - start.y);
          return distance > 50 && distance < 200;
        });

        if (possibleEnds.length > 0) {
          const end = possibleEnds[Math.floor(Math.random() * possibleEnds.length)];
          connections.push(createConnection(start, end));
        }
      }
    };

    const drawCircuit = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update points
      pointsRef.current.forEach(point => {
        point.x += point.vx;
        point.y += point.vy;

        // Bounce off edges
        if (point.x < 0 || point.x > canvas.width) point.vx *= -1;
        if (point.y < 0 || point.y > canvas.height) point.vy *= -1;

        // Draw point
        ctx.beginPath();
        ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 255, 255, 0.5)';
        ctx.fill();
      });

      // Update and draw connections
      connectionsRef.current.forEach(conn => {
        conn.progress += conn.speed;
        
        const dx = conn.end.x - conn.start.x;
        const dy = conn.end.y - conn.start.y;
        const currentX = conn.start.x + dx * conn.progress;
        const currentY = conn.start.y + dy * conn.progress;

        ctx.beginPath();
        ctx.moveTo(conn.start.x, conn.start.y);
        ctx.lineTo(currentX, currentY);
        ctx.strokeStyle = `rgba(0, 255, 255, ${0.2 + Math.sin(conn.progress * Math.PI) * 0.3})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Mouse interaction
      const mouseRadius = 100;
      pointsRef.current.forEach(point => {
        const dx = mouseRef.current.x - point.x;
        const dy = mouseRef.current.y - point.y;
        const distance = Math.hypot(dx, dy);

        if (distance < mouseRadius) {
          const angle = Math.atan2(dy, dx);
          const force = (1 - distance / mouseRadius) * 0.2;
          point.vx += Math.cos(angle) * force;
          point.vy += Math.sin(angle) * force;
        }
      });

      updateConnections();
      requestAnimationFrame(drawCircuit);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY
      };
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    
    resizeCanvas();
    initPoints();
    drawCircuit();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
};