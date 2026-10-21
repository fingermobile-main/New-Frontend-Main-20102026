import { useEffect, useRef } from 'react';

const NeuralBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      if (!canvas || !ctx) return;
  if (!canvas || !ctx) return;
  canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Neural particles
    const neuralParticles: any[] = [];
    const neuralCount = 80;
    const neuralDistance = 120;

    class NeuralParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.size = Math.random() * 1.5;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        ctx.fillStyle = 'rgba(255, 215, 0, 0.4)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Initialize particles
    for (let i = 0; i < neuralCount; i++) {
      neuralParticles.push(new NeuralParticle());
    }

    // Animation loop
    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      neuralParticles.forEach((particle, i) => {
        particle.update();
        particle.draw();

        for (let j = i + 1; j < neuralParticles.length; j++) {
          const dx = neuralParticles[j].x - particle.x;
          const dy = neuralParticles[j].y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < neuralDistance) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 215, 0, ${0.15 * (1 - distance / neuralDistance)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(neuralParticles[j].x, neuralParticles[j].y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="neural-canvas"
      className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none"
      style={{ opacity: 0.3 }}
    />
  );
};

export default NeuralBackground;