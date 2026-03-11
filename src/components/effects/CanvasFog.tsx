"use client";

import { useEffect, useRef } from "react";

export default function CanvasFog() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let fogMouseX = 0.5, fogMouseY = 0.5;
    const particles: FogParticle[] = [];
    const PARTICLE_COUNT = 45;
    let animationFrameId: number;

    const resizeFogCanvas = () => {
      const main = canvas.parentElement;
      if (main) {
        canvas.width = main.offsetWidth;
        canvas.height = main.offsetHeight;
      }
    };
    resizeFogCanvas();
    window.addEventListener("resize", resizeFogCanvas);

    const handleMouseMove = (e: MouseEvent) => {
      fogMouseX = e.clientX / window.innerWidth;
      fogMouseY = e.clientY / window.innerHeight;
    };
    document.addEventListener("mousemove", handleMouseMove);

    class FogParticle {
      x!: number;
      y!: number;
      radius!: number;
      opacity!: number;
      speedX!: number;
      speedY!: number;
      life!: number;
      maxLife!: number;
      color!: string;

      constructor(initial = true) {
        this.reset(initial);
      }

      reset(initial: boolean) {
        this.x = Math.random() * canvas!.width;
        this.y = initial ? Math.random() * canvas!.height : canvas!.height + Math.random() * 100;
        this.radius = 80 + Math.random() * 200;
        this.opacity = 0.01 + Math.random() * 0.04;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = -(0.15 + Math.random() * 0.35);
        this.life = 0;
        this.maxLife = 400 + Math.random() * 300;
        const hue = 170 + Math.random() * 20;
        const sat = 40 + Math.random() * 30;
        const light = 30 + Math.random() * 25;
        this.color = `hsla(${hue}, ${sat}%, ${light}%, `;
      }

      update() {
        const mx = (fogMouseX - 0.5) * 30;
        const my = (fogMouseY - 0.5) * 15;
        this.x += this.speedX + mx * 0.003;
        this.y += this.speedY + my * 0.002;
        this.life++;

        if (this.life > this.maxLife || (canvas && this.y + this.radius < 0)) {
          this.reset(false);
        }
      }

      draw() {
        const fadeIn = Math.min(1, this.life / 80);
        const fadeOut = Math.max(0, 1 - (this.life - this.maxLife + 80) / 80);
        const alpha = this.opacity * fadeIn * (this.life > this.maxLife - 80 ? fadeOut : 1);

        const gradient = ctx!.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.radius
        );
        gradient.addColorStop(0, this.color + alpha + ")");
        gradient.addColorStop(0.5, this.color + (alpha * 0.4) + ")");
        gradient.addColorStop(1, this.color + "0)");

        ctx!.fillStyle = gradient;
        ctx!.fillRect(
          this.x - this.radius,
          this.y - this.radius,
          this.radius * 2,
          this.radius * 2
        );
      }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new FogParticle());
    }

    const animateFog = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animateFog);
    };
    animateFog();

    return () => {
      window.removeEventListener("resize", resizeFogCanvas);
      document.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="hero-fog"
      className="absolute inset-0 w-full h-full z-0 pointer-events-none"
    />
  );
}
