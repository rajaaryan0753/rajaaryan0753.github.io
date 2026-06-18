(function () {
    'use strict';

    /* ── Theme toggle ── */
    const root = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');

    function applyTheme(theme) {
        root.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        if (themeToggle) {
            const isDark = theme === 'dark';
            themeToggle.setAttribute(
                'aria-label',
                isDark ? 'Switch to light mode' : 'Switch to dark mode'
            );
            themeToggle.title = isDark ? 'Light mode' : 'Dark mode';
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            applyTheme(next);
        });
        applyTheme(root.getAttribute('data-theme') || 'dark');
    }

    /* ── Boot sequence ── */
    const bootLines = [
        { text: '$ ssh raj@portfolio.dev', cls: 'cmd-line' },
        { text: '› Establishing secure connection', cls: 'info-line' },
        { text: '✓ Authenticated as raj', cls: 'ok-line' },
        { text: '$ load-portfolio --mode=production', cls: 'cmd-line' },
        { text: '› Compiling ~4 years of backend engineering', cls: 'info-line' },
        { text: '✓ Ready. Welcome.', cls: 'ok-line' },
    ];

    const bootScreen = document.getElementById('boot-screen');
    const bootLog = document.getElementById('boot-log');
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function runBoot() {
        if (!bootScreen || !bootLog) return;

        if (prefersReduced || sessionStorage.getItem('boot-seen')) {
            bootScreen.remove();
            return;
        }

        document.body.classList.add('booting');
        let i = 0;

        function addLine() {
            if (i >= bootLines.length) {
                setTimeout(hideBoot, 600);
                return;
            }
            const line = bootLines[i];
            const p = document.createElement('p');
            p.className = line.cls;
            p.textContent = line.text;
            bootLog.appendChild(p);
            i++;
            setTimeout(addLine, i === 1 ? 400 : 280);
        }

        addLine();
    }

    function hideBoot() {
        if (!bootScreen) return;
        bootScreen.classList.add('hidden');
        document.body.classList.remove('booting');
        sessionStorage.setItem('boot-seen', '1');
        setTimeout(() => bootScreen.remove(), 600);
    }

    runBoot();

    /* ── Blog list (by section) ── */
    const blogSectionsEl = document.getElementById('blog-sections');

    function formatBlogDate(isoDate) {
        const d = new Date(isoDate + 'T00:00:00');
        return d.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    }

    function createBlogCard(post) {
        const card = document.createElement('a');
        card.className = 'blog-card';
        card.href = post.url;
        if (post.external) {
            card.target = '_blank';
            card.rel = 'noopener noreferrer';
        }

        const top = document.createElement('div');
        top.className = 'blog-card-top';

        const title = document.createElement('h3');
        title.textContent = post.title;

        const arrow = document.createElement('span');
        arrow.className = 'blog-arrow';
        arrow.setAttribute('aria-hidden', 'true');
        arrow.textContent = '↗';

        top.append(title, arrow);

        const meta = document.createElement('p');
        meta.className = 'blog-meta';
        meta.textContent = `${formatBlogDate(post.date)} · ${post.readTime}`;

        const excerpt = document.createElement('p');
        excerpt.textContent = post.excerpt;

        const tags = document.createElement('div');
        tags.className = 'tags';
        post.tags.forEach(tag => {
            const span = document.createElement('span');
            span.className = 'tag';
            span.textContent = tag;
            tags.appendChild(span);
        });

        card.append(top, meta, excerpt, tags);
        return card;
    }

    function renderBlogSections() {
        if (!blogSectionsEl || typeof BLOG_POSTS === 'undefined') return;

        const sections = typeof BLOG_SECTIONS !== 'undefined' ? BLOG_SECTIONS : [];
        const posts = [...BLOG_POSTS].sort(
            (a, b) => new Date(b.date) - new Date(a.date)
        );

        if (sections.length === 0 && posts.length === 0) {
            blogSectionsEl.innerHTML =
                '<p class="blog-empty">No posts yet. Add sections and entries in <code>blogs.js</code>.</p>';
            return;
        }

        blogSectionsEl.innerHTML = '';

        const groups = sections.length
            ? sections.map(section => ({
                section,
                posts: posts.filter(p => p.category === section.id),
            }))
            : [{ section: null, posts }];

        let rendered = 0;

        groups.forEach(({ section, posts: sectionPosts }) => {
            const block = document.createElement('div');
            block.className = 'blog-category';

            if (section) {
                block.id = 'blog-' + section.id;

                const heading = document.createElement('h3');
                heading.className = 'blog-category-title';
                heading.textContent = section.title;

                const desc = document.createElement('p');
                desc.className = 'blog-category-desc';
                desc.textContent = section.description;

                block.append(heading, desc);
            }

            const grid = document.createElement('div');
            grid.className = 'blog-grid';

            if (sectionPosts.length === 0) {
                const empty = document.createElement('p');
                empty.className = 'blog-empty blog-empty--inline';
                empty.textContent = section
                    ? `No ${section.title.toLowerCase()} posts yet.`
                    : 'No posts yet.';
                grid.appendChild(empty);
            } else {
                sectionPosts.forEach(post => {
                    grid.appendChild(createBlogCard(post));
                });
                rendered += sectionPosts.length;
            }

            block.appendChild(grid);
            blogSectionsEl.appendChild(block);
        });

        if (rendered === 0 && posts.length > 0) {
            const orphan = posts.filter(
                p => !sections.some(s => s.id === p.category)
            );
            if (orphan.length) {
                console.warn(
                    '[blog] Posts missing a valid category:',
                    orphan.map(p => p.title)
                );
            }
        }
    }

    renderBlogSections();

    /* ── Mobile nav ── */
    const toggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (toggle && navLinks) {
        toggle.addEventListener('click', () => {
            const open = navLinks.classList.toggle('open');
            toggle.setAttribute('aria-expanded', open);
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    /* ── Active nav link on scroll ── */
    const sections = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.nav-links a');

    if (sections.length && navAnchors.length) {
        function onScroll() {
            let current = '';
            sections.forEach(section => {
                const top = section.offsetTop - 120;
                if (window.scrollY >= top) {
                    current = section.getAttribute('id');
                }
            });
            navAnchors.forEach(a => {
                a.classList.toggle('is-active', a.getAttribute('href') === '#' + current);
            });
        }

        window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* ── Scroll hint follows page scroll ── */
    const scrollHint = document.querySelector('.scroll-hint');
    const heroSection = document.querySelector('.hero');

    if (scrollHint && heroSection && !prefersReduced) {
        function updateScrollHint() {
            const heroHeight = heroSection.offsetHeight;
            const progress = Math.min(window.scrollY / Math.max(heroHeight * 0.75, 1), 1);

            scrollHint.style.transform = `translateX(-50%) translateY(${progress * 48}px)`;
            scrollHint.style.opacity = String(1 - progress);

            if (progress >= 1) {
                scrollHint.style.visibility = 'hidden';
                scrollHint.style.pointerEvents = 'none';
            } else {
                scrollHint.style.visibility = 'visible';
                scrollHint.style.pointerEvents = '';
            }
        }

        window.addEventListener('scroll', updateScrollHint, { passive: true });
        window.addEventListener('resize', updateScrollHint, { passive: true });
        updateScrollHint();
    }

    const phrases = [
        'Software Development Engineer @ Jio Platforms',
        '20K+ Orders/Day · Order Lifecycle Microservices',
        'Camunda BPM · Kafka · Spring Boot',
        'Elasticsearch · Kubernetes · Observability',
        'Distributed Systems & System Design',
    ];

const rotatingText = document.getElementById('rotating-text');

if (rotatingText) {

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {

        const currentPhrase = phrases[phraseIndex];

        if (!isDeleting) {
            rotatingText.textContent =
                currentPhrase.substring(0, charIndex + 1);

            charIndex++;

            if (charIndex === currentPhrase.length) {
                isDeleting = true;
                setTimeout(typeEffect, 1800);
                return;
            }

        } else {

            rotatingText.textContent =
                currentPhrase.substring(0, charIndex - 1);

            charIndex--;

            if (charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
            }
        }

        setTimeout(typeEffect, isDeleting ? 40 : 80);
    }

    typeEffect();
}
})();
