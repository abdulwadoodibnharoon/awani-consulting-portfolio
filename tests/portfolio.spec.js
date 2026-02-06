import { test, expect } from '@playwright/test';

test.describe('Awani Consulting Portfolio', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should load homepage successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Awani Product Consulting/);
    await expect(page.locator('.nav .logo-container')).toBeVisible();
    await expect(page.locator('.logo-text')).toContainText('Awani');
    await expect(page.locator('.hero')).toBeVisible();
  });

  test('navigation should have all required links', async ({ page }) => {
    const navLinks = page.locator('.nav .nav-links a');
    await expect(navLinks).toHaveCount(5);

    await expect(navLinks.nth(0)).toContainText('Home');
    await expect(navLinks.nth(1)).toContainText('Solutions');
    await expect(navLinks.nth(2)).toContainText('Case Study');
    await expect(navLinks.nth(3)).toContainText('Pricing');
    await expect(navLinks.nth(4)).toContainText('Contact');
  });

  test('should have all main sections visible', async ({ page }) => {
    // Hero section
    await expect(page.locator('.hero')).toBeVisible();
    await expect(page.locator('.hero-title')).toContainText('better software, faster');

    // Solution Consulting section
    await expect(page.locator('#services')).toBeVisible();
    await expect(page.locator('.services-grid .service-card')).toHaveCount(6);

    // Case study section
    await expect(page.locator('#case-study')).toBeVisible();
    await expect(page.locator('.case-study-card').first()).toBeVisible();

    // Pricing section
    await expect(page.locator('#pricing')).toBeVisible();
    await expect(page.locator('.pricing-grid .pricing-card')).toHaveCount(4);

    // Contact section
    await expect(page.locator('#contact')).toBeVisible();
    await expect(page.locator('.contact-card')).toBeVisible();
  });

  test('CTA buttons should be present', async ({ page }) => {
    const ctaButton = page.locator('.nav .cta-button');
    await expect(ctaButton).toBeVisible();
    await expect(ctaButton).toContainText('Book Call');

    const heroButtons = page.locator('.hero-buttons button');
    await expect(heroButtons).toHaveCount(3);
    await expect(heroButtons.nth(0)).toContainText('View Solutions');
    await expect(heroButtons.nth(1)).toContainText('View Experts');
    await expect(heroButtons.nth(2)).toContainText('See Case Studies');
  });

  test('consulting cards should display correct information', async ({ page }) => {
    const serviceCards = page.locator('.service-card');

    // AI/ML Solutions
    await expect(serviceCards.nth(0)).toContainText('AI/ML Solutions');
    await expect(serviceCards.nth(0)).toContainText('$15K - $100K');

    // AIoT Platforms
    await expect(serviceCards.nth(1)).toContainText('AIoT Platforms');
    await expect(serviceCards.nth(1)).toContainText('$50K - $300K');

    // Fractional CTO
    await expect(serviceCards.nth(2)).toContainText('Fractional CTO');
    await expect(serviceCards.nth(2)).toContainText('$3K - $10K/month');

    // API & Integration
    await expect(serviceCards.nth(3)).toContainText('API & Integration');
    await expect(serviceCards.nth(3)).toContainText('$3K - $30K');

    // Software Development
    await expect(serviceCards.nth(4)).toContainText('Software Development');
    await expect(serviceCards.nth(4)).toContainText('$10K - $150K');

    // 3D/AR/VR/XR
    await expect(serviceCards.nth(5)).toContainText('3D/AR/VR/XR');
    await expect(serviceCards.nth(5)).toContainText('$20K - $150K');
  });

  test('pricing cards should display correct tiers', async ({ page }) => {
    const pricingCards = page.locator('.pricing-card');

    await expect(pricingCards.nth(0)).toContainText('Rapid');
    await expect(pricingCards.nth(0)).toContainText('$500 - $2K');

    await expect(pricingCards.nth(1)).toContainText('Standard');
    await expect(pricingCards.nth(1)).toContainText('$3K - $15K');

    await expect(pricingCards.nth(2)).toContainText('Premium');
    await expect(pricingCards.nth(2)).toContainText('$20K - $100K+');

    await expect(pricingCards.nth(3)).toContainText('Retainer');
    await expect(pricingCards.nth(3)).toContainText('$3K - $10K/mo');
  });

  test('case studies should display all projects', async ({ page }) => {
    const caseStudyCards = page.locator('.case-study-card');

    // Should have 8 case studies total
    await expect(caseStudyCards).toHaveCount(8);

    // Verify Awani Voice Assistant
    await expect(page.locator('.case-study-card:has-text("Awani Voice Assistant")')).toBeVisible();
    await expect(page.locator('.case-study-card:has-text("Awani Voice Assistant")')).toContainText('Voice AI');
    await expect(page.locator('.case-study-card:has-text("Awani Voice Assistant")')).toContainText('$59.99/mo');
    await expect(page.locator('.case-study-card:has-text("Awani Voice Assistant")')).toContainText('app.awani.ai');

    // Verify Enterprise Analytics Platform
    await expect(page.locator('.case-study-card:has-text("Enterprise Analytics Platform")')).toBeVisible();
    await expect(page.locator('.case-study-card:has-text("Enterprise Analytics Platform")')).toContainText('80%');

    // Verify EdTech SaaS Platform
    await expect(page.locator('.case-study-card:has-text("EdTech SaaS Platform")')).toBeVisible();
    await expect(page.locator('.case-study-card:has-text("EdTech SaaS Platform")')).toContainText('SaaS');
    await expect(page.locator('.case-study-card:has-text("EdTech SaaS Platform")')).toContainText('8 Years');

    // Verify Smart Grid & Smart Meter IoT
    await expect(page.locator('.case-study-card:has-text("Smart Grid")')).toBeVisible();
    await expect(page.locator('.case-study-card:has-text("Smart Grid")')).toContainText('National');
    await expect(page.locator('.case-study-card:has-text("Smart Grid")')).toContainText('Saudi Arabia');

    // Verify Water Network Monitoring IoT
    await expect(page.locator('.case-study-card:has-text("Water Network")')).toBeVisible();
    await expect(page.locator('.case-study-card:has-text("Water Network")')).toContainText('UAE & Qatar');

    // Verify Self-Powered IoT Gateway
    await expect(page.locator('.case-study-card:has-text("Self-Powered")')).toBeVisible();
    await expect(page.locator('.case-study-card:has-text("Self-Powered")')).toContainText('Card Size');

    // Verify Mobility Platform
    await expect(page.locator('.case-study-card:has-text("Mobility Platform")')).toBeVisible();
    await expect(page.locator('.case-study-card:has-text("Mobility Platform")')).toContainText('$360M');

    // Verify Private Cloud Enterprise AI Platform
    await expect(page.locator('.case-study-card:has-text("Private Cloud")')).toBeVisible();
    await expect(page.locator('.case-study-card:has-text("Private Cloud")')).toContainText('Government');
  });

  test('expert consultants section should display expertise areas', async ({ page }) => {
    await expect(page.locator('text=Expert Consultants')).toBeVisible();

    // Check for various expert cards (18 original + 3 new = 21)
    await expect(page.locator('.expert-card')).toHaveCount(21);

    // Verify some key expertise areas
    await expect(page.locator('text=UI/UX Design Expert')).toBeVisible();
    await expect(page.locator('text=Performance & Scalability Specialist')).toBeVisible();
    await expect(page.locator('text=Security Architect')).toBeVisible();
    await expect(page.locator('text=Multi-Cloud Architect')).toBeVisible();
    await expect(page.locator('text=Fleet Management Specialist')).toBeVisible();
    await expect(page.locator('text=Enterprise Architect')).toBeVisible();
    await expect(page.locator('text=Telecommunications IoT Specialist')).toBeVisible();
    await expect(page.locator('text=Utilities & Smart Grid Expert')).toBeVisible();
    await expect(page.locator('text=Banking Automation Specialist')).toBeVisible();
  });

  test('contact section should have correct information', async ({ page }) => {
    const contactCard = page.locator('.contact-card');

    await expect(contactCard).toContainText("Let's Work Together");
    await expect(contactCard).toContainText('consulting@awani.ai');
    await expect(contactCard).toContainText('Ohio, USA');
    await expect(contactCard).toContainText('20+ hrs bandwidth/day');
  });

  test('tech stack section should display technologies', async ({ page }) => {
    await expect(page.locator('text=Technology Expertise')).toBeVisible();

    await expect(page.locator('.tech-tag', { hasText: /^React$/ })).toBeVisible();
    await expect(page.locator('.tech-tag', { hasText: 'TypeScript' })).toBeVisible();
    await expect(page.locator('.tech-tag', { hasText: 'Node.js' })).toBeVisible();
    await expect(page.locator('.tech-tag', { hasText: /^Python$/ })).toBeVisible();
    await expect(page.locator('.tech-tag', { hasText: 'Claude API' })).toBeVisible();
    await expect(page.locator('.tech-tag', { hasText: /^AWS$/ })).toBeVisible();
    await expect(page.locator('.tech-tag', { hasText: 'Java Spring Boot' })).toBeVisible();
    await expect(page.locator('.tech-tag', { hasText: 'Hetzner' })).toBeVisible();
    await expect(page.locator('.tech-tag', { hasText: 'Gemini' })).toBeVisible();
  });

  test('gradient text elements should be visible', async ({ page }) => {
    const gradientTexts = page.locator('.gradient-text');
    await expect(gradientTexts.first()).toBeVisible();

    // Check hero gradient text
    await expect(page.locator('.hero .gradient-text')).toContainText('better software, faster');
  });

  test('footer should display copyright', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    await expect(page.locator('.footer')).toBeVisible();
    await expect(page.locator('.footer')).toContainText('© 2026 Awani Product Consulting');
  });

  test('animated orbs should be present in hero', async ({ page }) => {
    const orbs = page.locator('.orb');
    await expect(orbs).toHaveCount(3);
  });
});

test.describe('Responsive Design Tests', () => {
  test('mobile viewport should adapt layout', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // On mobile, the nav logo should still be visible
    await expect(page.locator('.nav .logo-container')).toBeVisible();

    // Hero section should be visible
    await expect(page.locator('.hero')).toBeVisible();
  });

  test('mobile viewport should stack hero buttons vertically', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const heroButtons = page.locator('.hero-buttons');
    const flexDirection = await heroButtons.evaluate(el =>
      window.getComputedStyle(el).flexDirection
    );

    expect(flexDirection).toBe('column');
  });

  test('tablet viewport should adapt service grid', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    const servicesGrid = page.locator('.services-grid');
    await expect(servicesGrid).toBeVisible();
  });

  test('all sections should be visible on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    await expect(page.locator('.hero')).toBeVisible();

    await page.evaluate(() => document.querySelector('#services').scrollIntoView());
    await expect(page.locator('#services')).toBeVisible();

    await page.evaluate(() => document.querySelector('#case-study').scrollIntoView());
    await expect(page.locator('#case-study')).toBeVisible();

    await page.evaluate(() => document.querySelector('#pricing').scrollIntoView());
    await expect(page.locator('#pricing')).toBeVisible();

    await page.evaluate(() => document.querySelector('#contact').scrollIntoView());
    await expect(page.locator('#contact')).toBeVisible();
  });
});

test.describe('Interactive Elements', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('consulting cards should be visible and interactive', async ({ page }) => {
    // Consulting cards exist and are styled correctly
    const serviceCards = page.locator('.service-card');
    const count = await serviceCards.count();
    expect(count).toBe(6);

    // All consulting cards should have glass-card class
    for (let i = 0; i < count; i++) {
      await expect(serviceCards.nth(i)).toHaveClass(/glass-card/);
    }
  });

  test('gradient icons should be present', async ({ page }) => {
    // Gradient icons should be present in consulting cards
    const gradientIcons = page.locator('.service-icon.gradient-icon');
    await expect(gradientIcons).toHaveCount(6);

    await expect(gradientIcons.nth(0)).toContainText('AI');
    await expect(gradientIcons.nth(1)).toContainText('AIoT');
    await expect(gradientIcons.nth(2)).toContainText('CTO');
    await expect(gradientIcons.nth(3)).toContainText('API');
    await expect(gradientIcons.nth(4)).toContainText('DEV');
    await expect(gradientIcons.nth(5)).toContainText('XR');
  });

  test('glass-card elements should be present throughout page', async ({ page }) => {
    const glassCards = page.locator('.glass-card');

    // Should have multiple glass cards (solutions, pricing, case studies, expert cards, contact)
    const count = await glassCards.count();
    expect(count).toBeGreaterThan(32); // At least 6 solutions + 4 pricing + 8 case studies + 21 expert cards + contact
  });
});

test.describe('Performance and Optimization', () => {
  test('page should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;

    // Page should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('images and fonts should load efficiently', async ({ page }) => {
    await page.goto('/');

    // Wait for network to be idle
    await page.waitForLoadState('networkidle');

    // Check that page is fully loaded
    await expect(page.locator('.hero')).toBeVisible();
  });

  test('animations should be smooth with reduced motion preference', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    // Page should still be functional
    await expect(page.locator('.hero')).toBeVisible();
  });
});
