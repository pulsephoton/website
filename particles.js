class ParticleWave {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.time = 0;
        
        // Configuration
        this.config = {
            particleCount: 150,
            maxDistance: 150,
            waveAmplitude: 80,
            waveFrequency: 0.008,
            speed: 0.02,
            particleSize: 2,
            lineOpacity: 0.4,
            particleOpacity: 0.8,
            mouseRadius: 100,
            colors: {
                particles: 'rgba(255, 215, 0, ',
                lines: 'rgba(255, 193, 7, ',
                glow: 'rgba(255, 215, 0, '
            }
        };
        
        this.init();
        this.bindEvents();
        this.animate();
    }
    
    init() {
        this.resize();
        this.createParticles();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
    }
    
    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.config.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                originalX: Math.random() * this.width,
                originalY: Math.random() * this.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * this.config.particleSize + 1,
                opacity: Math.random() * 0.5 + 0.5,
                phase: Math.random() * Math.PI * 2,
                frequency: Math.random() * 0.02 + 0.01
            });
        }
    }
    
    bindEvents() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createParticles();
        });
        
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        // Touch support
        window.addEventListener('touchmove', (e) => {
            if (e.touches[0]) {
                this.mouse.x = e.touches[0].clientX;
                this.mouse.y = e.touches[0].clientY;
            }
        });
    }
    
    updateParticles() {
        this.time += this.config.speed;
        
        this.particles.forEach((particle, index) => {
            // Wave motion
            const waveX = Math.sin(this.time + particle.phase + particle.y * this.config.waveFrequency) * this.config.waveAmplitude;
            const waveY = Math.cos(this.time * 0.7 + particle.phase + particle.x * this.config.waveFrequency * 0.5) * this.config.waveAmplitude * 0.5;
            
            // Mouse interaction
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            let mouseInfluenceX = 0;
            let mouseInfluenceY = 0;
            
            if (distance < this.config.mouseRadius) {
                const force = (this.config.mouseRadius - distance) / this.config.mouseRadius;
                mouseInfluenceX = (dx / distance) * force * 20;
                mouseInfluenceY = (dy / distance) * force * 20;
            }
            
            // Update position
            particle.x = particle.originalX + waveX + mouseInfluenceX + particle.vx * this.time;
            particle.y = particle.originalY + waveY + mouseInfluenceY + particle.vy * this.time;
            
            // Wrap around screen
            if (particle.x < -50) particle.originalX = this.width + 50;
            if (particle.x > this.width + 50) particle.originalX = -50;
            if (particle.y < -50) particle.originalY = this.height + 50;
            if (particle.y > this.height + 50) particle.originalY = -50;
            
            // Update opacity based on wave
            particle.currentOpacity = particle.opacity * (0.7 + 0.3 * Math.sin(this.time * 2 + particle.phase));
        });
    }
    
    drawConnections() {
        this.ctx.strokeStyle = this.config.colors.lines + this.config.lineOpacity + ')';
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const particle1 = this.particles[i];
                const particle2 = this.particles[j];
                
                const dx = particle1.x - particle2.x;
                const dy = particle1.y - particle2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.config.maxDistance) {
                    const opacity = (1 - distance / this.config.maxDistance) * this.config.lineOpacity;
                    this.ctx.strokeStyle = this.config.colors.lines + opacity + ')';
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle1.x, particle1.y);
                    this.ctx.lineTo(particle2.x, particle2.y);
                    this.ctx.stroke();
                }
            }
        }
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            // Particle glow
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.size * 3
            );
            gradient.addColorStop(0, this.config.colors.glow + particle.currentOpacity + ')');
            gradient.addColorStop(1, this.config.colors.glow + '0)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Particle core
            this.ctx.fillStyle = this.config.colors.particles + particle.currentOpacity + ')';
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    
    drawWaveLines() {
        // Draw flowing wave lines across the screen
        this.ctx.strokeStyle = this.config.colors.lines + '0.2)';
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i < 5; i++) {
            this.ctx.beginPath();
            const offsetY = this.height * (i / 5);
            const amplitude = 30 + i * 10;
            const frequency = 0.01 + i * 0.002;
            
            for (let x = 0; x <= this.width; x += 5) {
                const y = offsetY + Math.sin(x * frequency + this.time * (1 + i * 0.3)) * amplitude;
                
                if (x === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            }
            this.ctx.stroke();
        }
    }
    
    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Set canvas composite mode for glow effects
        this.ctx.globalCompositeOperation = 'lighter';
        
        // Draw wave lines
        this.drawWaveLines();
        
        // Draw connections between particles
        this.drawConnections();
        
        // Draw particles
        this.drawParticles();
        
        // Reset composite mode
        this.ctx.globalCompositeOperation = 'source-over';
    }
    
    animate() {
        this.updateParticles();
        this.render();
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize particle system when page loads
document.addEventListener('DOMContentLoaded', () => {
    new ParticleWave();
});

// Handle page visibility changes to optimize performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when tab is not visible
    } else {
        // Resume animations when tab becomes visible
    }
}); 