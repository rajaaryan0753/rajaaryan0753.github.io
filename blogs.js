/**
 * Blog sections — define categories here, then tag each post with `category`.
 *
 * Post fields:
 *   category  — must match a section `id` below
 *   url       — "./blog/my-post.html" (on-site) or external URL
 *   external  — true for Medium, LinkedIn, etc.
 */
const BLOG_SECTIONS = [
    {
        id: 'design',
        title: 'Design',
        description: 'System design, architecture patterns, and low-level design write-ups.',
    },
    {
        id: 'equity-research',
        title: 'Equity Research',
        description: 'Company analysis, sector notes, and market perspectives.',
    },
];

const BLOG_POSTS = [
    {
        category: 'design',
        title: 'Designing a URL Shortener at Scale',
        excerpt: 'Hashing, Redis caching, and read-heavy traffic patterns — a walkthrough of the system design tradeoffs.',
        date: '2025-11-12',
        readTime: '6 min read',
        tags: ['System Design', 'Redis'],
        url: './blog/sample-post.html',
        external: false,
    },
    // {
    //     category: 'equity-research',
    //     title: 'Q3 Earnings: What the Numbers Signal',
    //     excerpt: 'Revenue mix, margin trajectory, and valuation vs peers.',
    //     date: '2025-10-20',
    //     readTime: '7 min read',
    //     tags: ['Earnings', 'Valuation'],
    //     url: './blog/q3-earnings-note.html',
    //     external: false,
    // },
    // {
    //     category: 'design',
    //     title: 'My Medium Article',
    //     excerpt: 'One-line summary for the card.',
    //     date: '2025-09-01',
    //     readTime: '4 min read',
    //     tags: ['Microservices'],
    //     url: 'https://medium.com/@your-handle/article-slug',
    //     external: true,
    // },
];
