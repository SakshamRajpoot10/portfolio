/* =============================================
   SAKSHAM RAJPOOT - 3D PORTFOLIO JS
   ============================================= */

// ---- PRELOADER ----
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('preloader').classList.add('hide');
  }, 1200);
});

// ---- THREE.JS 3D BACKGROUND ----
(function initThreeScene() {
  const canvas = document.getElementById('three-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Floating particles
  const particlesCount = 300;
  const positions = new Float32Array(particlesCount * 3);
  const colors = new Float32Array(particlesCount * 3);
  for (let i = 0; i < particlesCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 80;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 80;
    const c = new THREE.Color();
    c.setHSL(0.75 + Math.random() * 0.15, 0.8, 0.6);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const particleMat = new THREE.PointsMaterial({ size: 0.15, vertexColors: true, transparent: true, opacity: 0.7 });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // Wireframe shapes
  const shapes = [];
  const geoTypes = [
    new THREE.IcosahedronGeometry(2, 0),
    new THREE.OctahedronGeometry(1.8, 0),
    new THREE.TorusGeometry(1.5, 0.4, 8, 16),
    new THREE.TetrahedronGeometry(1.5, 0),
    new THREE.DodecahedronGeometry(1.5, 0)
  ];
  for (let i = 0; i < 8; i++) {
    const geo = geoTypes[i % geoTypes.length];
    const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color().setHSL(0.75 + Math.random() * 0.2, 0.7, 0.5), wireframe: true, transparent: true, opacity: 0.15 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set((Math.random() - 0.5) * 50, (Math.random() - 0.5) * 50, (Math.random() - 0.5) * 30);
    mesh.userData = { rotSpeed: { x: (Math.random() - 0.5) * 0.01, y: (Math.random() - 0.5) * 0.01 }, floatSpeed: Math.random() * 0.005 + 0.002, floatOffset: Math.random() * Math.PI * 2 };
    scene.add(mesh);
    shapes.push(mesh);
  }

  // Mouse interaction
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    const t = Date.now() * 0.001;
    particles.rotation.y += 0.0003;
    particles.rotation.x += 0.0001;
    shapes.forEach((s) => {
      s.rotation.x += s.userData.rotSpeed.x;
      s.rotation.y += s.userData.rotSpeed.y;
      s.position.y += Math.sin(t * s.userData.floatSpeed * 100 + s.userData.floatOffset) * 0.01;
    });
    camera.position.x += (mouseX * 3 - camera.position.x) * 0.02;
    camera.position.y += (-mouseY * 3 - camera.position.y) * 0.02;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();

// ---- CUSTOM CURSOR ----
(function initCursor() {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring || window.innerWidth < 768) return;
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
  function updateCursor() {
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(updateCursor);
  }
  updateCursor();
  document.querySelectorAll('a, button, .skill-item, .project-card').forEach(el => {
    el.addEventListener('mouseenter', () => { ring.style.width = '50px'; ring.style.height = '50px'; ring.style.borderColor = '#a855f7'; });
    el.addEventListener('mouseleave', () => { ring.style.width = '36px'; ring.style.height = '36px'; ring.style.borderColor = ''; });
  });
})();

// ---- TYPING ANIMATION ----
(function initTyping() {
  const el = document.getElementById('typingText');
  if (!el) return;
  const roles = ['Full Stack Developer', 'Java Full Stack Developer', 'Full Stack Web Developer'];
  let roleIndex = 0, charIndex = 0, isDeleting = false;
  function type() {
    const current = roles[roleIndex];
    el.textContent = isDeleting ? current.substring(0, charIndex--) : current.substring(0, charIndex++);
    let speed = isDeleting ? 40 : 80;
    if (!isDeleting && charIndex === current.length + 1) { speed = 2000; isDeleting = true; }
    if (isDeleting && charIndex < 0) { isDeleting = false; roleIndex = (roleIndex + 1) % roles.length; speed = 400; }
    setTimeout(type, speed);
  }
  setTimeout(type, 1000);
})();

// ---- NAVBAR ----
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-link');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
    });
  });

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 100;
    sections.forEach(sec => {
      const top = sec.offsetTop, height = sec.offsetHeight, id = sec.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        const active = document.querySelector('.nav-link[href="#' + id + '"]');
        if (active) active.classList.add('active');
      }
    });
  });
})();

// ---- THEME TOGGLE ----
(function initTheme() {
  const toggle = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');
  const saved = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  icon.className = saved === 'dark' ? 'fas fa-moon' : 'fas fa-sun';

  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    icon.className = next === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    localStorage.setItem('theme', next);
  });
})();

// ---- SCROLL ANIMATIONS ----
(function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 100);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
})();

// ---- COUNTER ANIMATION ----
(function initCounters() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'));
        let current = 0;
        const step = Math.max(1, Math.floor(target / 40));
        const timer = setInterval(() => {
          current += step;
          if (current >= target) { current = target; clearInterval(timer); }
          el.textContent = current + (target === 100 ? '%' : '+');
        }, 30);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-number').forEach(el => observer.observe(el));
})();

// ---- PROJECT FILTERS ----
(function initFilters() {
  const btns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      cards.forEach(card => {
        const cat = card.getAttribute('data-category') || '';
        if (filter === 'all' || cat.includes(filter)) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
  // Add fadeIn keyframe
  const style = document.createElement('style');
  style.textContent = '@keyframes fadeIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}';
  document.head.appendChild(style);
})();

// ---- CONTACT FORM ----
(function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<span>Message Sent!</span> <i class="fas fa-check"></i>';
    btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.style.background = '';
      form.reset();
    }, 3000);
  });
})();

// ---- BACK TO TOP ----
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 500);
  });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// ---- HERO PARTICLES (CSS) ----
(function initHeroParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.style.cssText = `
      position:absolute; width:${Math.random() * 4 + 1}px; height:${Math.random() * 4 + 1}px;
      background:rgba(168,85,247,${Math.random() * 0.4 + 0.1}); border-radius:50%;
      left:${Math.random() * 100}%; top:${Math.random() * 100}%;
      animation:float ${Math.random() * 6 + 4}s ease-in-out ${Math.random() * 4}s infinite;
    `;
    container.appendChild(p);
  }
})();
