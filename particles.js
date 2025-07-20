class MinimalParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.time = 0;
        this.isVisible = true;
        this.animationFrame = null;
        this.lastTime = 0;
        
        // Minimal configuration for clean aesthetics
        this.config = {
            particleCount: 20, // Reduced for minimal look
            maxDistance: 100, // Shorter connections for cleaner appearance
            waveAmplitude: 30, // Subtle wave motion
            waveFrequency: 0.004, // Slower, more elegant movement
            speed: 0.02, // Smooth animation speed
            particleSize: 1, // Small, subtle particles
            lineOpacity: 0.08, // Very subtle connection lines
            particleOpacity: 0.6, // Soft particle visibility
            mouseRadius: 80, // Smaller interaction area
            colors: {
                background: '#1D1043',
                particles: 'rgba(24, 240, 255, ', // Cyan
                lines: 'rgba(24, 240, 255, ', // Cyan  
                waveLines: 'rgba(255, 181, 74, ', // Amber
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
                vx: (Math.random() - 0.5) * 0.2, // Slower base movement
                vy: (Math.random() - 0.5) * 0.2,
                size: Math.random() * this.config.particleSize + 0.5,
                opacity: Math.random() * 0.3 + this.config.particleOpacity,
                phase: Math.random() * Math.PI * 2,
                energyLevel: 0.5 // Base energy level
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
    
    updateParticles(deltaTime) {
        this.time += this.config.speed * deltaTime;
        
        this.particles.forEach((particle) => {
            // Gentle wave motion
            const waveX = Math.sin(this.time + particle.phase + particle.y * this.config.waveFrequency) * this.config.waveAmplitude;
            const waveY = Math.cos(this.time * 0.7 + particle.phase + particle.x * this.config.waveFrequency * 0.5) * this.config.waveAmplitude * 0.5;
            
            // Subtle mouse interaction
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distanceSquared = dx * dx + dy * dy;
            
            let mouseInfluenceX = 0;
            let mouseInfluenceY = 0;
            
            if (distanceSquared < this.config.mouseRadius * this.config.mouseRadius) {
                const distance = Math.sqrt(distanceSquared);
                const force = (this.config.mouseRadius - distance) / this.config.mouseRadius;
                mouseInfluenceX = (dx / distance) * force * 15; // Gentle influence
                mouseInfluenceY = (dy / distance) * force * 15;
                particle.energyLevel = Math.min(1, particle.energyLevel + force * 0.05);
            }
            
            // Update position
            particle.x = particle.originalX + waveX + mouseInfluenceX + particle.vx * this.time;
            particle.y = particle.originalY + waveY + mouseInfluenceY + particle.vy * this.time;
            
            // Screen wrapping
            if (particle.x < -50) particle.originalX = this.width + 50;
            else if (particle.x > this.width + 50) particle.originalX = -50;
            if (particle.y < -50) particle.originalY = this.height + 50;
            else if (particle.y > this.height + 50) particle.originalY = -50;
            
            // Gentle energy decay
            particle.energyLevel = Math.max(0.3, particle.energyLevel * 0.998);
            
            // Current opacity with subtle pulsing
            particle.currentOpacity = particle.opacity * (0.8 + 0.2 * Math.sin(this.time + particle.phase));
        });
    }
    
    drawConnections() {
        // Optimized connection drawing with minimal visual impact
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const particle1 = this.particles[i];
                const particle2 = this.particles[j];
                
                const dx = particle1.x - particle2.x;
                const dy = particle1.y - particle2.y;
                const distanceSquared = dx * dx + dy * dy;
                const maxDistanceSquared = this.config.maxDistance * this.config.maxDistance;
                
                if (distanceSquared < maxDistanceSquared) {
                    const distance = Math.sqrt(distanceSquared);
                    const opacity = (1 - distance / this.config.maxDistance) * this.config.lineOpacity;
                    const energyFactor = (particle1.energyLevel + particle2.energyLevel) / 2;
                    
                    // Simple line color
                    this.ctx.strokeStyle = this.config.colors.lines + (opacity * energyFactor) + ')';
                    this.ctx.lineWidth = 0.5;
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
            const size = particle.size * (1 + particle.energyLevel * 0.3);
            
            // Simple particle rendering
            this.ctx.fillStyle = this.config.colors.particles + particle.currentOpacity + ')';
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Subtle glow for energized particles
            if (particle.energyLevel > 0.7) {
                this.ctx.fillStyle = this.config.colors.waveLines + (particle.currentOpacity * 0.3) + ')';
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, size * 2, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });
    }
    
    drawWaveLines() {
        // Minimal background wave lines - only 2 for clean look
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i < 2; i++) {
            const opacity = 0.06 - i * 0.02; // Very subtle
            const amplitude = 20 + i * 10;
            const frequency = 0.006 + i * 0.002;
            const phase = this.time * (0.5 + i * 0.2);
            
            this.ctx.strokeStyle = this.config.colors.lines + opacity + ')';
            this.ctx.beginPath();
            
            const offsetY = this.height * (0.3 + i * 0.4);
            
            for (let x = 0; x <= this.width; x += 8) {
                const y = offsetY + Math.sin(x * frequency + phase) * amplitude;
                
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
        if (!this.isVisible) return;
        
        // Clear with background color
        this.ctx.fillStyle = this.config.colors.background;
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Light composite mode for subtle glow
        this.ctx.globalCompositeOperation = 'lighter';
        
        // Draw minimal elements
        this.drawWaveLines();
        this.drawConnections();
        this.drawParticles();
        
        // Reset composite mode
        this.ctx.globalCompositeOperation = 'source-over';
    }
    
    animate(currentTime = 0) {
        if (!this.isVisible) {
            this.animationFrame = requestAnimationFrame((time) => this.animate(time));
            return;
        }
        
        // Frame rate control for 60fps
        const deltaTime = Math.min((currentTime - this.lastTime) / 16.67, 2);
        this.lastTime = currentTime;
        
        this.updateParticles(deltaTime);
        this.render();
        
        this.animationFrame = requestAnimationFrame((time) => this.animate(time));
    }
    
    pause() {
        this.isVisible = false;
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }
    
    resume() {
        this.isVisible = true;
        this.lastTime = performance.now();
        this.animate();
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    const particleSystem = new MinimalParticleSystem();
    
    // Handle page visibility changes for performance
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            particleSystem.pause();
        } else {
            particleSystem.resume();
        }
    });
    
    // Add smooth scroll behavior for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add intersection observer for tech feature animations
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe tech features for scroll animations
    document.querySelectorAll('.tech-feature').forEach(feature => {
        observer.observe(feature);
    });
}); 