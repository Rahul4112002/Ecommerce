/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://leehiteyewear.live',
    generateRobotsTxt: true,
    generateIndexSitemap: false,
    exclude: [
        '/admin/*',
        '/api/*',
        '/account/*',
        '/checkout/*',
        '/order-success/*',
        '/(auth)/*',
    ],
    robotsTxtOptions: {
        policies: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin', '/api', '/account', '/checkout', '/(auth)'],
            },
        ],
    },
    changefreq: 'daily',
    priority: 0.7,
    transform: async (config, path) => {
        // Custom priority for important pages
        let priority = 0.7;
        let changefreq = 'daily';

        if (path === '/') {
            priority = 1.0;
            changefreq = 'daily';
        } else if (path.includes('/products')) {
            priority = 0.9;
            changefreq = 'daily';
        } else if (path === '/about' || path === '/contact') {
            priority = 0.6;
            changefreq = 'weekly';
        }

        return {
            loc: path,
            changefreq,
            priority,
            lastmod: new Date().toISOString(),
        };
    },
};
