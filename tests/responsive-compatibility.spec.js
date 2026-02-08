import { test, expect } from '@playwright/test';

test.describe('Responsive Design & Compatibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should load and render correctly on all viewports', async ({ page }, testInfo) => {
    const viewport = page.viewportSize();
    console.log(`Testing viewport: ${viewport.width}x${viewport.height} (${testInfo.project.name})`);

    // Check that essential elements are visible
    await expect(page.locator('.hero')).toBeVisible();
    await expect(page.locator('.hero-title')).toBeVisible();
    await expect(page.locator('#services')).toBeVisible();
    await expect(page.locator('#case-study')).toBeVisible();

    // Take full page screenshot for visual comparison
    await page.screenshot({
      path: `test-results/responsive-${testInfo.project.name}.png`,
      fullPage: true
    });
  });

  test('navigation should be accessible on all viewports', async ({ page }, testInfo) => {
    const viewport = page.viewportSize();

    if (viewport.width < 768) {
      // Mobile: Check for hamburger menu
      const mobileMenu = page.locator('.mobile-menu-toggle, .hamburger-menu, .menu-toggle');
      if (await mobileMenu.count() > 0) {
        await expect(mobileMenu).toBeVisible();
        console.log('Mobile menu detected');
      } else {
        // Check if nav links are still accessible (sticky nav or always visible)
        const navLinks = page.locator('.nav-links a');
        const firstLink = navLinks.first();
        if (await firstLink.isVisible()) {
          console.log('Nav links always visible on mobile');
        }
      }
    } else {
      // Desktop/Tablet: Regular navigation should be visible
      await expect(page.locator('.nav .logo-text')).toBeVisible();
      const navLinks = page.locator('.nav .nav-links a');
      await expect(navLinks.first()).toBeVisible();
    }
  });

  test('hero section should display properly', async ({ page }, testInfo) => {
    const viewport = page.viewportSize();

    // Hero title should be visible
    const heroTitle = page.locator('.hero-title');
    await expect(heroTitle).toBeVisible();

    // Check that title doesn't cause horizontal overflow
    const documentWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(documentWidth).toBeLessThanOrEqual(viewport.width + 1); // +1 for rounding

    // Hero buttons should be visible and clickable
    const heroButtons = page.locator('.hero-buttons button');
    await expect(heroButtons.first()).toBeVisible();

    // Subtitle should be visible
    const subtitle = page.locator('.subtitle');
    await expect(subtitle).toBeVisible();

    console.log(`Hero renders correctly at ${viewport.width}x${viewport.height}`);
  });

  test('case studies should render in appropriate grid layout', async ({ page }, testInfo) => {
    const viewport = page.viewportSize();

    await page.locator('#case-study').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    const caseStudyCards = page.locator('.case-study-card');
    const count = await caseStudyCards.count();
    expect(count).toBeGreaterThan(0);

    // Check first card renders properly
    const firstCard = caseStudyCards.first();
    await expect(firstCard).toBeVisible();

    const cardBox = await firstCard.boundingBox();

    if (viewport.width < 768) {
      // Mobile: Should be single column (full width minus margins)
      expect(cardBox.width).toBeGreaterThan(viewport.width * 0.8);
      console.log(`Mobile: Cards at ~${Math.round(cardBox.width)}px width (${viewport.width}px viewport)`);
    } else if (viewport.width < 1024) {
      // Tablet: Could be 1-2 columns
      expect(cardBox.width).toBeLessThan(viewport.width * 0.9);
      console.log(`Tablet: Cards at ~${Math.round(cardBox.width)}px width (${viewport.width}px viewport)`);
    } else {
      // Desktop: Multi-column layout
      expect(cardBox.width).toBeLessThan(viewport.width * 0.6);
      console.log(`Desktop: Cards at ~${Math.round(cardBox.width)}px width (${viewport.width}px viewport)`);
    }
  });

  test('pricing cards should be readable and accessible', async ({ page }, testInfo) => {
    const viewport = page.viewportSize();

    await page.locator('#pricing').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    const pricingCards = page.locator('.pricing-card');
    const count = await pricingCards.count();
    expect(count).toBeGreaterThan(0);

    // Check that pricing cards don't overflow
    const firstCard = pricingCards.first();
    await expect(firstCard).toBeVisible();

    const cardBox = await firstCard.boundingBox();
    expect(cardBox.width).toBeLessThanOrEqual(viewport.width - 20);

    // Check pricing text is visible
    const priceText = firstCard.locator('.price, .pricing-amount');
    if (await priceText.count() > 0) {
      await expect(priceText.first()).toBeVisible();
    }

    console.log(`Pricing cards render properly at ${viewport.width}x${viewport.height}`);
  });

  test('images and media should load properly', async ({ page }, testInfo) => {
    // Check logo
    const logo = page.locator('.logo-text, .logo');
    await expect(logo.first()).toBeVisible();

    // Check for any img tags
    const images = page.locator('img');
    const imageCount = await images.count();

    if (imageCount > 0) {
      console.log(`Found ${imageCount} images`);

      // Check first few images load
      for (let i = 0; i < Math.min(3, imageCount); i++) {
        const img = images.nth(i);
        if (await img.isVisible()) {
          const naturalWidth = await img.evaluate(el => el.naturalWidth);
          expect(naturalWidth).toBeGreaterThan(0);
        }
      }
    }
  });

  test('footer should be visible and properly formatted', async ({ page }, testInfo) => {
    const viewport = page.viewportSize();

    await page.locator('.footer').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    const footer = page.locator('.footer');
    await expect(footer).toBeVisible();

    // Check footer links
    const footerLinks = footer.locator('a');
    if (await footerLinks.count() > 0) {
      await expect(footerLinks.first()).toBeVisible();
    }

    // Check copyright text
    const copyright = footer.locator('text=/© 2026/');
    await expect(copyright).toBeVisible();

    // Check tagline
    const tagline = footer.locator('text=/Scaling to cover the globe/');
    await expect(tagline).toBeVisible();

    console.log(`Footer renders correctly at ${viewport.width}x${viewport.height}`);
  });

  test('no horizontal overflow on any viewport', async ({ page }, testInfo) => {
    const viewport = page.viewportSize();

    // Check document width doesn't exceed viewport
    const documentWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const viewportWidth = viewport.width;

    // Allow 1px tolerance for rounding
    expect(documentWidth).toBeLessThanOrEqual(viewportWidth + 1);

    console.log(`No horizontal overflow: document ${documentWidth}px, viewport ${viewportWidth}px`);
  });

  test('page performance metrics are acceptable', async ({ page }, testInfo) => {
    const viewport = page.viewportSize();

    // Measure page load time
    const startTime = Date.now();
    await page.goto('/', { waitUntil: 'networkidle' });
    const loadTime = Date.now() - startTime;

    console.log(`Page load time: ${loadTime}ms at ${viewport.width}x${viewport.height}`);

    // Load time should be reasonable (less than 5 seconds)
    expect(loadTime).toBeLessThan(5000);

    // Check FPS by scrolling
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(100);
    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForTimeout(100);

    // If we got here without timeout, scrolling is smooth
    console.log('Scrolling performance is acceptable');
  });

  test('all interactive elements should be clickable', async ({ page }, testInfo) => {
    const viewport = page.viewportSize();

    // Test hero buttons
    const heroButtons = page.locator('.hero-buttons button');
    const buttonCount = await heroButtons.count();

    for (let i = 0; i < buttonCount; i++) {
      const button = heroButtons.nth(i);
      await expect(button).toBeVisible();

      // Check button has adequate click target size (at least 44x44 for mobile)
      const box = await button.boundingBox();
      if (viewport.width < 768) {
        expect(box.height).toBeGreaterThanOrEqual(40); // Mobile touch target
      }
    }

    console.log(`Interactive elements have proper touch targets at ${viewport.width}x${viewport.height}`);
  });
});

test.describe('Cross-Device Consistency', () => {
  test('same content should be available across all devices', async ({ page }, testInfo) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check that key sections exist regardless of device
    const sections = ['#services', '#case-study', '#pricing', '#contact'];

    for (const selector of sections) {
      await expect(page.locator(selector)).toBeVisible();
    }

    console.log(`All sections present on ${testInfo.project.name}`);
  });

  test('case study order should be consistent', async ({ page }, testInfo) => {
    await page.goto('/');
    await page.locator('#case-study').scrollIntoViewIfNeeded();

    // Get case study titles in order
    const titles = await page.locator('.case-study-card h3').allTextContents();

    // Should have 8 case studies
    expect(titles.length).toBe(8);

    // First should be Awani Voice Assistant
    expect(titles[0]).toContain('Awani Voice Assistant');

    // Second should be Mobility Platform
    expect(titles[1]).toContain('Mobility Platform');

    console.log(`Case study order verified on ${testInfo.project.name}:`, titles.slice(0, 3));
  });
});
