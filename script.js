// Small script: set year and run a lightweight particle background on the canvas
(function () {
    // year
    const y = new Date().getFullYear();
    const el = document.getElementById('year');
    if (el) el.textContent = y;

    // canvas background - moving soft particles
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, particles = [];

    function resize() {
        const dpr = window.devicePixelRatio || 1;
        w = canvas.width = Math.max(300, window.innerWidth * dpr);
        h = canvas.height = Math.max(300, window.innerHeight * dpr);
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';
    }

    function rand(min, max) { return Math.random() * (max - min) + min }

    function initParticles(count) {
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push({
                x: rand(0, w), y: rand(0, h), r: rand(40, 160),
                vx: rand(-0.1, 0.1), vy: rand(-0.05, 0.05),
                hue: rand(190, 220), alpha: rand(0.06, 0.18)
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, w, h);
        for (const p of particles) {
            p.x += p.vx; p.y += p.vy;
            if (p.x < -p.r) p.x = w + p.r;
            if (p.x > w + p.r) p.x = -p.r;
            if (p.y < -p.r) p.y = h + p.r;
            if (p.y > h + p.r) p.y = -p.r;

            const grad = ctx.createRadialGradient(p.x, p.y, p.r * 0.1, p.x, p.y, p.r);
            grad.addColorStop(0, `hsla(${p.hue},70%,65%,${p.alpha})`);
            grad.addColorStop(0.3, `hsla(${p.hue + 20},60%,45%,${p.alpha * 0.8})`);
            grad.addColorStop(1, 'rgba(2,6,23,0)');

            ctx.beginPath();
            ctx.fillStyle = grad;
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    let raf;
    function loop() { draw(); raf = requestAnimationFrame(loop); }

    function start() {
        resize();
        initParticles(Math.max(6, Math.floor((window.innerWidth / 300) * 2)));
        cancelAnimationFrame(raf);
        loop();
    }

    window.addEventListener('resize', () => {
        resize();
    });

    // Start after small delay to ensure layout stable
    setTimeout(start, 120);
})();
