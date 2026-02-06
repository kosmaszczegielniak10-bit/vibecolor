'use client';

import { useEffect, useRef } from 'react';

export default function InteractiveBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const particlesRef = useRef<Array<{
        x: number;
        y: number;
        baseX: number;
        baseY: number;
        color: string;
        size: number;
        opacity: number;
    }>>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        // ULTRA VIBRANT color palette - 32 COLORS!
        const colors = [
            // Hot Pinks & Magentas
            '#FF1493', '#FF69B4', '#FF00FF', '#C71585', '#E91E63',
            // Reds & Oranges  
            '#FF4500', '#FF6347', '#FF8C00', '#FF5722', '#F44336',
            // Yellows & Golds
            '#FFD700', '#FFEB3B', '#FFC107', '#FFFF00', '#F9A825',
            // Greens
            '#7FFF00', '#00FA9A', '#ADFF2F', '#32CD32', '#4CAF50', '#00E676',
            // Cyans & Teals
            '#00FFFF', '#00CED1', '#00BCD4', '#00ACC1', '#26C6DA',
            // Blues
            '#1E90FF', '#00BFFF', '#2196F3', '#448AFF',
            // Purples & Violets
            '#9370DB', '#DA70D6', '#BA68C8', '#9C27B0', '#E040FB', '#7C4DFF'
        ];

        // Initialize particles with BALANCED color coverage
        const initParticles = () => {
            particlesRef.current = [];
            // 3× more particles than original (was /15000, now /5000)
            const particleCount = Math.floor((canvas.width * canvas.height) / 5000);

            for (let i = 0; i < particleCount; i++) {
                particlesRef.current.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    baseX: Math.random() * canvas.width,
                    baseY: Math.random() * canvas.height,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    size: Math.random() * 4 + 2, // Balanced size (2-6px)
                    opacity: Math.random() * 0.4 + 0.2 // Balanced visibility (0.2-0.6)
                });
            }
        };

        // Mouse move handler
        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particlesRef.current.forEach(particle => {
                // Calculate distance from mouse
                const dx = mouseRef.current.x - particle.x;
                const dy = mouseRef.current.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = 200;

                // Move particle away from mouse
                if (distance < maxDistance) {
                    const force = (maxDistance - distance) / maxDistance;
                    particle.x -= (dx / distance) * force * 5;
                    particle.y -= (dy / distance) * force * 5;
                } else {
                    // Return to base position
                    particle.x += (particle.baseX - particle.x) * 0.05;
                    particle.y += (particle.baseY - particle.y) * 0.05;
                }

                // Draw particle
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.globalAlpha = particle.opacity;
                ctx.fill();

                // Draw connections
                particlesRef.current.forEach(otherParticle => {
                    const dx2 = particle.x - otherParticle.x;
                    const dy2 = particle.y - otherParticle.y;
                    const distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

                    if (distance2 < 100) {
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(otherParticle.x, otherParticle.y);
                        ctx.strokeStyle = particle.color;
                        ctx.globalAlpha = (1 - distance2 / 100) * 0.3;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                });
            });

            ctx.globalAlpha = 1;
            requestAnimationFrame(animate);
        };

        resize();
        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', handleMouseMove);
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none"
            style={{ zIndex: 0 }}
        />
    );
}
