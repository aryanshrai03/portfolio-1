
document.addEventListener('DOMContentLoaded', function() {
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');
    const heroTitleDynamic = document.querySelector('.hero-title-dynamic');
    const statNumbers = document.querySelectorAll('.stat-number');
    const skillItems = document.querySelectorAll('.skill-item');
    const contactForm = document.getElementById('contactForm');
    const themeToggle = document.querySelector('.theme-toggle');

    let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0, followerX = 0, followerY = 0;

    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            createThemeParticles();
        });
    }

    function createThemeParticles() {
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            const size = Math.random() * 10 + 5;
            particle.style.cssText = 'position: fixed; width: ' + size + 'px; height: ' + size + 'px; background: hsl(250, 100%, 65%); border-radius: 50%; pointer-events: none; z-index: 10001; left: 50%; top: 50%;';
            document.body.appendChild(particle);
            const angle = (Math.PI * 2 / 20) * i;
            const velocity = Math.random() * 200 + 100;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            let x = window.innerWidth / 2, y = window.innerHeight / 2, opacity = 1;
            function animateParticle() {
                x += vx * 0.016; y += vy * 0.016; opacity -= 0.02;
                particle.style.left = x + 'px'; particle.style.top = y + 'px'; particle.style.opacity = opacity; particle.style.transform = 'scale(' + opacity + ')';
                if (opacity > 0) requestAnimationFrame(animateParticle); else particle.remove();
            }
            setTimeout(animateParticle, i * 20);
        }
    }

    document.addEventListener('mousemove', function(e) { mouseX = e.clientX; mouseY = e.clientY; });

    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.2; cursorY += (mouseY - cursorY) * 0.2;
        followerX += (mouseX - followerX) * 0.1; followerY += (mouseY - followerY) * 0.1;
        cursor.style.left = cursorX + 'px'; cursor.style.top = cursorY + 'px';
        cursorFollower.style.left = followerX - 20 + 'px'; cursorFollower.style.top = followerY - 20 + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    document.querySelectorAll('a, button, .skill-item, .contact-link').forEach(function(el) {
        el.addEventListener('mouseenter', function() { cursor.style.transform = 'scale(2)'; cursorFollower.style.transform = 'scale(1.5)'; cursorFollower.style.borderColor = 'hsl(250, 100%, 65%)'; });
        el.addEventListener('mouseleave', function() { cursor.style.transform = 'scale(1)'; cursorFollower.style.transform = 'scale(1)'; cursorFollower.style.borderColor = 'hsla(250, 100%, 65%, 0.5)'; });
    });

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) navbar.classList.add('scrolled'); else navbar.classList.remove('scrolled');
        const scrolled = window.scrollY;
        document.querySelectorAll('.gradient-orb').forEach(function(el, index) { el.style.transform = 'translateY(' + (scrolled * (index + 1) * 0.05) + 'px)'; });
        document.querySelectorAll('.shape').forEach(function(shape, index) { shape.style.transform = 'translateY(' + (scrolled * (index + 1) * 0.03) + 'px) rotate(' + (scrolled * 0.1) + 'deg)'; });
    });

    menuToggle.addEventListener('click', function() { menuToggle.classList.toggle('active'); navLinksContainer.classList.toggle('active'); });
    navLinks.forEach(function(link) { link.addEventListener('click', function() { menuToggle.classList.remove('active'); navLinksContainer.classList.remove('active'); }); });

    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(function(section) { if (scrollY >= section.offsetTop - 200) current = section.getAttribute('id'); });
        navLinks.forEach(function(link) { link.classList.remove('active'); if (link.getAttribute('href') === '#' + current) link.classList.add('active'); });
    });

    // Snowfall Effect with Footer Settling
    const snowCanvas = document.getElementById('snowfall-canvas');
    const snowCtx = snowCanvas.getContext('2d');
    const footer = document.getElementById('footer');
    const snowPile = document.getElementById('snow-pile');
    let snowflakes = [];
    let settledSnow = [];

    function resizeSnowCanvas() {
        snowCanvas.width = window.innerWidth;
        snowCanvas.height = window.innerHeight;
    }
    resizeSnowCanvas();
    window.addEventListener('resize', resizeSnowCanvas);

    class Snowflake {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * snowCanvas.width;
            this.y = -10;
            this.radius = Math.random() * 3 + 1;
            this.speed = Math.random() * 1.5 + 0.5;
            this.wind = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.6 + 0.4;
            this.swing = Math.random() * 2;
            this.swingSpeed = Math.random() * 0.02 + 0.01;
        }
        update() {
            this.y += this.speed;
            this.x += this.wind + Math.sin(this.y * this.swingSpeed) * this.swing;
            const footerRect = footer.getBoundingClientRect();
            if (this.y > footerRect.top - 5) {
                settledSnow.push({ x: this.x, y: footerRect.top, radius: this.radius, opacity: 0.8, fadeStart: Date.now() });
                this.reset();
            }
            if (this.x < -10 || this.x > snowCanvas.width + 10 || this.y > snowCanvas.height + 10) this.reset();
        }
        draw() {
            snowCtx.beginPath();
            snowCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            snowCtx.fillStyle = 'rgba(255, 255, 255, ' + this.opacity + ')';
            snowCtx.fill();
        }
    }

    for (let i = 0; i < 80; i++) {
        const flake = new Snowflake();
        flake.y = Math.random() * snowCanvas.height;
        snowflakes.push(flake);
    }

    function drawSettledSnow() {
        const now = Date.now();
        settledSnow = settledSnow.filter(function(snow) {
            const elapsed = now - snow.fadeStart;
            const fadeTime = 4000;
            if (elapsed > fadeTime) return false;
            const opacity = snow.opacity * (1 - elapsed / fadeTime);
            snowCtx.beginPath();
            snowCtx.arc(snow.x, snow.y, snow.radius * 1.3, 0, Math.PI * 2);
            snowCtx.fillStyle = 'rgba(255, 255, 255, ' + opacity + ')';
            snowCtx.fill();
            return true;
        });
    }

    function animateSnow() {
        snowCtx.clearRect(0, 0, snowCanvas.width, snowCanvas.height);
        snowflakes.forEach(function(flake) { flake.update(); flake.draw(); });
        drawSettledSnow();
        requestAnimationFrame(animateSnow);
    }
    animateSnow();

    function animateStats() {
        statNumbers.forEach(function(stat) {
            const target = parseInt(stat.getAttribute('data-target')); const duration = 2000; const increment = target / (duration / 16); let current = 0;
            function updateStat() { current += increment; if (current < target) { stat.textContent = Math.floor(current); requestAnimationFrame(updateStat); } else stat.textContent = target; }
            updateStat();
        });
    }

    const aboutSection = document.querySelector('.about');
    let statsAnimated = false;
    const statsObserver = new IntersectionObserver(function(entries) { entries.forEach(function(entry) { if (entry.isIntersecting && !statsAnimated) { statsAnimated = true; animateStats(); } }); }, { threshold: 0.5 });
    if (aboutSection) statsObserver.observe(aboutSection);

    const skillsSection = document.querySelector('.skills');
    let skillsAnimated = false;
    const skillsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting && !skillsAnimated) { skillsAnimated = true; skillItems.forEach(function(item, index) { setTimeout(function() { item.style.opacity = '1'; item.style.transform = 'translateX(0)'; }, index * 100); }); }
        });
    }, { threshold: 0.3 });
    if (skillsSection) skillsObserver.observe(skillsSection);
    skillItems.forEach(function(item) { item.style.opacity = '0'; item.style.transform = 'translateX(-20px)'; item.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'; });

    const revealElements = document.querySelectorAll('.section-header, .about-content, .skill-category, .contact-wrapper');
    const revealObserver = new IntersectionObserver(function(entries) { entries.forEach(function(entry) { if (entry.isIntersecting) entry.target.classList.add('reveal', 'active'); }); }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    revealElements.forEach(function(el) { el.classList.add('reveal'); revealObserver.observe(el); });

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = contactForm.querySelector('button'); const originalText = btn.innerHTML;
            btn.innerHTML = '<span>Sending...</span>'; btn.disabled = true;
            setTimeout(function() {
                btn.innerHTML = '<span>Message Sent!</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>';
                btn.style.background = 'linear-gradient(135deg, hsl(150, 80%, 50%), hsl(180, 70%, 50%))';
                setTimeout(function() { btn.innerHTML = originalText; btn.style.background = ''; btn.disabled = false; contactForm.reset(); }, 3000);
            }, 1500);
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - 80, behavior: 'smooth' });
        });
    });

    document.querySelectorAll('.skill-category, .contact-form').forEach(function(el) {
        el.addEventListener('mousemove', function(e) {
            const rect = el.getBoundingClientRect();
            el.style.transform = 'perspective(1000px) rotateX(' + ((e.clientY - rect.top - rect.height / 2) / 20) + 'deg) rotateY(' + ((rect.width / 2 - (e.clientX - rect.left)) / 20) + 'deg) translateY(-5px)';
        });
        el.addEventListener('mouseleave', function() { el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)'; });
    });

    document.querySelectorAll('.btn').forEach(function(btn) {
        btn.addEventListener('mousemove', function(e) { const rect = btn.getBoundingClientRect(); btn.style.transform = 'translate(' + ((e.clientX - rect.left - rect.width / 2) * 0.3) + 'px, ' + ((e.clientY - rect.top - rect.height / 2) * 0.3) + 'px)'; });
        btn.addEventListener('mouseleave', function() { btn.style.transform = 'translate(0, 0)'; });
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span'); ripple.classList.add('ripple');
            const rect = btn.getBoundingClientRect(); const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px'; ripple.style.left = (e.clientX - rect.left - size / 2) + 'px'; ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
            btn.appendChild(ripple); setTimeout(function() { ripple.remove(); }, 600);
        });
    });

    document.querySelectorAll('.btn-primary').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            for (let i = 0; i < 15; i++) setTimeout(function() {
                const particle = document.createElement('div');
                particle.style.cssText = 'position: fixed; width: 5px; height: 5px; background: hsl(250, 100%, 65%); border-radius: 50%; pointer-events: none; z-index: 9998;';
                particle.style.left = e.clientX + 'px'; particle.style.top = e.clientY + 'px';
                document.body.appendChild(particle);
                const angle = Math.random() * Math.PI * 2; const velocity = Math.random() * 50 + 20;
                let opacity = 1, posX = e.clientX, posY = e.clientY;
                function animate() {
                    posX += Math.cos(angle) * velocity * 0.02; posY += Math.sin(angle) * velocity * 0.02; opacity -= 0.02;
                    particle.style.left = posX + 'px'; particle.style.top = posY + 'px'; particle.style.opacity = opacity;
                    if (opacity > 0) requestAnimationFrame(animate); else particle.remove();
                }
                animate();
            }, i * 30);
        });
    });

    const heroGreeting = document.querySelector('.hero-greeting');
    if (heroGreeting) heroGreeting.classList.add('text-shimmer');

    (function createFloatingParticles() {
        const hero = document.querySelector('.hero-bg'); if (!hero) return;
        for (let i = 0; i < 30; i++) {
            const dot = document.createElement('div'); const size = Math.random() * 4 + 2;
            dot.style.cssText = 'position: absolute; width: ' + size + 'px; height: ' + size + 'px; background: hsl(250, 100%, 65%); border-radius: 50%; opacity: ' + (Math.random() * 0.3 + 0.1) + '; left: ' + (Math.random() * 100) + '%; top: ' + (Math.random() * 100) + '%; animation: floatDot ' + (Math.random() * 10 + 10) + 's ease-in-out infinite; animation-delay: ' + (Math.random() * -20) + 's;';
            hero.appendChild(dot);
        }
        const style = document.createElement('style');
        style.textContent = '@keyframes floatDot { 0%, 100% { transform: translate(0, 0); } 25% { transform: translate(20px, -30px); } 50% { transform: translate(-10px, 10px); } 75% { transform: translate(30px, 20px); } }';
        document.head.appendChild(style);
    })();

    document.querySelectorAll('.section-label').forEach(function(label) {
        label.addEventListener('mouseenter', function() { this.style.transform = 'scale(1.05)'; this.style.boxShadow = '0 0 20px hsl(250, 100%, 65%, 0.5)'; });
        label.addEventListener('mouseleave', function() { this.style.transform = 'scale(1)'; this.style.boxShadow = 'none'; });
    });

    // GitHub Projects Integration
    const GITHUB_USERNAME = 'aryanshrai03';
    const projectsGrid = document.getElementById('projects-grid');
    const projectTemplate = document.getElementById('project-card-template');
    const readmeCache = {};

    const languageColors = { JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5', Java: '#b07219', 'C++': '#f34b7d', C: '#555555', 'C#': '#239120', Ruby: '#701516', Go: '#00ADD8', Rust: '#dea584', PHP: '#4F5D95', Swift: '#F05138', Kotlin: '#A97BFF', HTML: '#e34c26', CSS: '#563d7c', SCSS: '#c6538c', Vue: '#41b883', Shell: '#89e051', Dart: '#00B4AB', R: '#198CE7' };

    async function fetchGitHubRepos() {
        const response = await fetch('https://api.github.com/users/' + GITHUB_USERNAME + '/repos?sort=updated&per_page=30');
        if (!response.ok) throw new Error('Failed to fetch repositories');
        return (await response.json()).filter(function(repo) { return !repo.fork && !repo.private; });
    }

    async function fetchReadme(repoName) {
        if (readmeCache[repoName]) return readmeCache[repoName];
        try {
            const response = await fetch('https://api.github.com/repos/' + GITHUB_USERNAME + '/' + repoName + '/readme');
            if (!response.ok) return null;
            const data = await response.json();
            const htmlContent = parseMarkdown(atob(data.content));
            readmeCache[repoName] = htmlContent;
            return htmlContent;
        } catch (error) { return null; }
    }

    function parseMarkdown(markdown) {
        let html = markdown.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/^#### (.*$)/gim, '<h4>$1</h4>').replace(/^### (.*$)/gim, '<h3>$1</h3>').replace(/^## (.*$)/gim, '<h2>$1</h2>').replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>').replace(/__(.*?)__/gim, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/gim, '<em>$1</em>').replace(/_(.*?)_/gim, '<em>$1</em>')
            .replace(/```[\w]*\n([\s\S]*?)```/gim, '<pre><code>$1</code></pre>').replace(/`(.*?)`/gim, '<code>$1</code>')
            .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank" rel="noopener">$1</a>')
            .replace(/!\[(.*?)\]\((.*?)\)/gim, '<img src="$2" alt="$1" />')
            .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
            .replace(/^\- (.*$)/gim, '<li>$1</li>').replace(/^\* (.*$)/gim, '<li>$1</li>')
            .replace(/\n/gim, '<br />');
        html = html.replace(/<br \/><br \/>/g, '</p><p>');
        html = '<p>' + html + '</p>';
        html = html.replace(/<p><\/p>/g, '').replace(/<p><h/g, '<h').replace(/<\/h(\d)><\/p>/g, '</h$1>').replace(/<p><pre>/g, '<pre>').replace(/<\/pre><\/p>/g, '</pre>').replace(/<p><blockquote>/g, '<blockquote>').replace(/<\/blockquote><\/p>/g, '</blockquote>');
        return html;
    }

    function createProjectCard(repo) {
        const card = projectTemplate.content.cloneNode(true);
        card.querySelector('.project-name').textContent = repo.name;
        card.querySelector('.project-desc').textContent = repo.description || 'No description provided';
        card.querySelector('.project-link').href = repo.html_url;
        if (repo.language) {
            card.querySelector('.language-name').textContent = repo.language;
            card.querySelector('.language-dot').style.background = languageColors[repo.language] || 'hsl(var(--primary))';
        } else card.querySelector('.project-language').style.display = 'none';
        card.querySelector('.stars-count').textContent = repo.stargazers_count;

        const toggleBtn = card.querySelector('.toggle-readme');
        const readmeContainer = card.querySelector('.readme-container');
        const readmeContent = card.querySelector('.readme-content');
        let readmeLoaded = false;

        toggleBtn.addEventListener('click', async function() {
            if (readmeContainer.classList.contains('open')) {
                readmeContainer.classList.remove('open'); toggleBtn.classList.remove('active'); toggleBtn.querySelector('span').textContent = 'Show Details';
            } else {
                toggleBtn.classList.add('active'); toggleBtn.querySelector('span').textContent = 'Hide Details';
                if (!readmeLoaded) {
                    readmeContent.innerHTML = '<div class="readme-loading"><div class="loading-spinner"></div><span>Loading README...</span></div>';
                    readmeContainer.classList.add('open');
                    const readme = await fetchReadme(repo.name);
                    readmeContent.innerHTML = readme ? readme : '<p class="readme-fallback">No README.md file found for this project.</p>';
                    readmeLoaded = true;
                } else readmeContainer.classList.add('open');
            }
        });
        return card;
    }

    function showError(message) {
        projectsGrid.innerHTML = '<div class="projects-error"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><p>' + message + '</p></div>';
    }

    (async function loadProjects() {
        try {
            const repos = await fetchGitHubRepos();
            if (repos.length === 0) { showError('No public repositories found.'); return; }
            projectsGrid.innerHTML = '';
            repos.forEach(function(repo) { projectsGrid.appendChild(createProjectCard(repo)); });
        } catch (error) { showError('Failed to load projects. Please try again later.'); }
    })();
});
  
