"use client";

import { useEffect, useRef } from 'react';

export default function AnimatedBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0, y: 0, radius: 150 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Mouse tracking
        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current.x = e.clientX;
            mouseRef.current.y = e.clientY;
        };
        window.addEventListener('mousemove', handleMouseMove);

        // Orb class for floating gradient circles
        class Orb {
            x: number;
            y: number;
            radius: number;
            vx: number;
            vy: number;
            color: string;
            originalVx: number;
            originalVy: number;
            colorRGB: { r: number, g: number, b: number };

            constructor() {
                this.x = Math.random() * canvas!.width;
                this.y = Math.random() * canvas!.height;
                this.radius = Math.random() * 200 + 100;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.originalVx = this.vx;
                this.originalVy = this.vy;
                
                // Generate random gradient colors
                const colorOptions = [
                    { color: 'rgba(99, 102, 241, 0.2)', rgb: { r: 99, g: 102, b: 241 } },   // Indigo
                    { color: 'rgba(168, 85, 247, 0.2)', rgb: { r: 168, g: 85, b: 247 } },   // Purple
                    { color: 'rgba(236, 72, 153, 0.2)', rgb: { r: 236, g: 72, b: 153 } },   // Pink
                    { color: 'rgba(59, 130, 246, 0.2)', rgb: { r: 59, g: 130, b: 246 } },   // Blue
                    { color: 'rgba(14, 165, 233, 0.2)', rgb: { r: 14, g: 165, b: 233 } },   // Sky
                ];
                const selected = colorOptions[Math.floor(Math.random() * colorOptions.length)];
                this.color = selected.color;
                this.colorRGB = selected.rgb;
            }

            update(mouse: { x: number, y: number, radius: number }) {
                // Calculate distance to mouse
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Mouse interaction - repel or attract
                if (distance < mouse.radius) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    const angle = Math.atan2(dy, dx);
                    // Repel from mouse
                    this.vx = this.originalVx - Math.cos(angle) * force * 2;
                    this.vy = this.originalVy - Math.sin(angle) * force * 2;
                } else {
                    // Return to original velocity
                    this.vx += (this.originalVx - this.vx) * 0.05;
                    this.vy += (this.originalVy - this.vy) * 0.05;
                }

                this.x += this.vx;
                this.y += this.vy;

                // Bounce off edges
                if (canvas) {
                    if (this.x < -this.radius || this.x > canvas.width + this.radius) {
                        this.vx *= -1;
                        this.originalVx *= -1;
                    }
                    if (this.y < -this.radius || this.y > canvas.height + this.radius) {
                        this.vy *= -1;
                        this.originalVy *= -1;
                    }
                }
            }

            draw(mouse: { x: number, y: number, radius: number }) {
                if (!ctx) return;

                // Calculate distance to mouse for glow effect
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const glowIntensity = distance < mouse.radius ? 1 - (distance / mouse.radius) : 0;

                const gradient = ctx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, this.radius
                );
                
                // Add extra glow when near mouse
                const baseOpacity = 0.2;
                const enhancedOpacity = baseOpacity + (glowIntensity * 0.3);
                
                gradient.addColorStop(0, `rgba(${this.colorRGB.r}, ${this.colorRGB.g}, ${this.colorRGB.b}, ${enhancedOpacity})`);
                gradient.addColorStop(0.5, `rgba(${this.colorRGB.r}, ${this.colorRGB.g}, ${this.colorRGB.b}, ${enhancedOpacity * 0.5})`);
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Create orbs
        const orbs: Orb[] = [];
        const orbCount = 6;
        for (let i = 0; i < orbCount; i++) {
            orbs.push(new Orb());
        }

        // Draw connections between orbs and mouse
        const drawConnections = () => {
            if (!ctx) return;

            const connectionDistance = 400;
            const mouse = mouseRef.current;

            // Connect orbs to each other
            for (let i = 0; i < orbs.length; i++) {
                for (let j = i + 1; j < orbs.length; j++) {
                    const dx = orbs[i].x - orbs[j].x;
                    const dy = orbs[i].y - orbs[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        const opacity = (1 - distance / connectionDistance) * 0.2;
                        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(orbs[i].x, orbs[i].y);
                        ctx.lineTo(orbs[j].x, orbs[j].y);
                        ctx.stroke();
                    }
                }

                // Connect orbs to mouse
                const dx = orbs[i].x - mouse.x;
                const dy = orbs[i].y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouse.radius + 100) {
                    const opacity = (1 - distance / (mouse.radius + 100)) * 0.4;
                    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(orbs[i].x, orbs[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }

            // Draw mouse cursor glow
            // const gradient = ctx.createRadialGradient(
            //     mouse.x, mouse.y, 0,
            //     mouse.x, mouse.y, mouse.radius
            // );
            // gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
            // gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            // ctx.fillStyle = gradient;
            // ctx.beginPath();
            // ctx.arc(mouse.x, mouse.y, mouse.radius, 0, Math.PI * 2);
            // ctx.fill();
        };

        // Animation loop
        let animationFrameId: number;
        const animate = () => {
            // Create blur effect by not clearing canvas completely
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const mouse = mouseRef.current;

            // Draw connections first (behind orbs)
            drawConnections();

            // Update and draw orbs
            orbs.forEach(orb => {
                orb.update(mouse);
                orb.draw(mouse);
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        // Cleanup
        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full cursor-crosshair"
            />
            {/* Additional gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20 pointer-events-none" />
        </div>
    );
}