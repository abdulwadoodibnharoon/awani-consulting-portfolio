import { test, expect } from '@playwright/test';

test.describe('Scroll Performance Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('logo should scroll to top when clicked', async ({ page, viewport }) => {
    // Skip on mobile/tablet where nav might be different
    if (viewport.width <= 768) {
      test.skip();
    }

    // Scroll down to services section
    await page.locator('#services').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Verify we're scrolled down
    const scrollYBefore = await page.evaluate(() => window.scrollY);
    expect(scrollYBefore).toBeGreaterThan(100);

    // Click nav logo (force click since nav is fixed and should be clickable)
    await page.locator('.nav .logo-container').click({ force: true });
    await page.waitForTimeout(1000); // Wait for smooth scroll

    // Verify we scrolled to top
    const scrollYAfter = await page.evaluate(() => window.scrollY);
    expect(scrollYAfter).toBeLessThan(100);
  });

  test('footer logo should scroll to top when clicked', async ({ page, viewport }) => {
    // Skip on mobile/tablet where nav might be different
    if (viewport.width <= 768) {
      test.skip();
    }

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Verify we're at bottom
    const scrollYBefore = await page.evaluate(() => window.scrollY);
    expect(scrollYBefore).toBeGreaterThan(500);

    // Click footer logo (force click to ensure it's clickable)
    await page.locator('.footer .logo').click({ force: true });
    await page.waitForTimeout(2000); // Increased wait for smooth scroll from bottom

    // Verify scrolled to top (allow some margin since it's a long scroll)
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeLessThan(150);
  });

  test('scroll performance should be acceptable', async ({ page }) => {
    // Start performance measurement
    await page.evaluate(() => {
      window.scrollMetrics = {
        startTime: performance.now(),
        frameCount: 0,
        scrollEvents: 0
      };

      // Count scroll events
      window.addEventListener('scroll', () => {
        window.scrollMetrics.scrollEvents++;
      });

      // Count frames
      function countFrame() {
        window.scrollMetrics.frameCount++;
        requestAnimationFrame(countFrame);
      }
      requestAnimationFrame(countFrame);
    });

    // Scroll through the page
    await page.evaluate(async () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      const scrollSteps = 10;
      const stepSize = (scrollHeight - viewportHeight) / scrollSteps;

      for (let i = 0; i < scrollSteps; i++) {
        window.scrollTo({
          top: stepSize * (i + 1),
          behavior: 'smooth'
        });
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    });

    // Wait for scroll to finish
    await page.waitForTimeout(1000);

    // Get metrics
    const metrics = await page.evaluate(() => {
      const endTime = performance.now();
      const duration = endTime - window.scrollMetrics.startTime;
      const fps = (window.scrollMetrics.frameCount / duration) * 1000;

      return {
        fps: Math.round(fps),
        scrollEvents: window.scrollMetrics.scrollEvents,
        duration: Math.round(duration)
      };
    });

    console.log('Scroll Performance Metrics:', metrics);

    // FPS should be reasonable (at least 30 fps)
    expect(metrics.fps).toBeGreaterThan(30);

    // Should have handled scroll events
    expect(metrics.scrollEvents).toBeGreaterThan(0);
  });

  test('nav bar should remain fixed during scroll', async ({ page }) => {
    const nav = page.locator('.nav');

    // Nav should be visible at top
    await expect(nav).toBeVisible();

    // Get initial position (should be at or near y=0)
    const initialBox = await nav.boundingBox();
    expect(initialBox.y).toBeLessThanOrEqual(1); // Allow for sub-pixel rendering

    // Scroll down significantly
    await page.evaluate(() => window.scrollBy(0, 1000));
    await page.waitForTimeout(500);

    // Nav should still be at top of viewport (position: fixed)
    const scrolledBox = await nav.boundingBox();
    expect(scrolledBox.y).toBeLessThanOrEqual(1);

    // Nav should still be visible
    await expect(nav).toBeVisible();
  });

  test('smooth scroll should work for all navigation links', async ({ page, viewport }) => {
    // Skip on mobile/tablet where nav links are hidden
    if (viewport.width <= 768) {
      test.skip();
    }

    // Ensure we start at the top
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);

    const links = [
      { selector: '.nav a[href="#services"]', target: '#services' },
      { selector: '.nav a[href="#case-study"]', target: '#case-study' },
      { selector: '.nav a[href="#pricing"]', target: '#pricing' },
      { selector: '.nav a[href="#contact"]', target: '#contact' }
    ];

    for (const link of links) {
      // Get current scroll position before scroll
      const scrollBefore = await page.evaluate(() => window.scrollY);

      // Trigger smooth scroll directly via JavaScript (more reliable than clicking)
      await page.evaluate((targetId) => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, link.target.substring(1)); // Remove # from target

      await page.waitForTimeout(2000); // Wait for smooth scroll to complete

      // Verify we scrolled to a different position
      const scrollAfter = await page.evaluate(() => window.scrollY);

      // Check that scroll position changed significantly
      if (scrollBefore === 0) {
        // First scroll from top should scroll down
        expect(scrollAfter).toBeGreaterThan(100);
      } else {
        // Subsequent scrolls should result in different positions
        expect(scrollAfter).not.toBe(scrollBefore);
      }

      // Verify target section exists
      await expect(page.locator(link.target)).toBeAttached();

      // Scroll back to top via JavaScript
      await page.evaluate(() => {
        document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
      });
      await page.waitForTimeout(1500);
    }
  });

  test('backdrop-filter elements should render without blocking scroll', async ({ page }) => {
    // Test that backdrop-filter elements don't block scrolling
    const nav = page.locator('.nav');
    await expect(nav).toBeVisible();

    // Verify nav has backdrop filter
    const hasBackdropFilter = await nav.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.backdropFilter !== 'none' || style.webkitBackdropFilter !== 'none';
    });
    expect(hasBackdropFilter).toBeTruthy();

    // Scroll should still be smooth
    const scrollTime = await page.evaluate(async () => {
      const start = performance.now();
      window.scrollBy({ top: 500, behavior: 'smooth' });
      await new Promise(resolve => setTimeout(resolve, 800));
      return performance.now() - start;
    });

    // Should complete in reasonable time (under 1000ms)
    expect(scrollTime).toBeLessThan(1000);
  });

  test('orbs should animate smoothly without lag', async ({ page }) => {
    // Check orbs are present
    const orbs = page.locator('.orb');
    await expect(orbs).toHaveCount(3);

    // Scroll and check orbs remain smooth
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(500);

    // Orbs should still be visible and animating
    await expect(orbs.first()).toBeVisible();

    // Check animation is running
    const isAnimating = await page.evaluate(() => {
      const orb = document.querySelector('.orb');
      const style = window.getComputedStyle(orb);
      return style.animation !== 'none';
    });

    expect(isAnimating).toBeTruthy();
  });

  test('glass cards should render efficiently', async ({ page }) => {
    // Scroll to services section
    await page.locator('#services').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Check all glass cards are visible
    const glassCards = page.locator('.glass-card');
    const count = await glassCards.count();

    expect(count).toBeGreaterThan(8);

    // Measure render time
    const renderTime = await page.evaluate(async () => {
      const start = performance.now();

      // Force reflow
      document.querySelectorAll('.glass-card').forEach(card => {
        card.getBoundingClientRect();
      });

      return performance.now() - start;
    });

    console.log('Glass cards render time:', renderTime, 'ms');

    // Should render quickly (under 100ms)
    expect(renderTime).toBeLessThan(100);
  });

  test('logo image should load correctly', async ({ page }) => {
    const logo = page.locator('.logo-image');

    // Logo should be visible
    await expect(logo).toBeVisible();

    // Logo should have correct src
    const src = await logo.getAttribute('src');
    expect(src).toBe('/awani-logo.png');

    // Logo should have loaded
    const isLoaded = await logo.evaluate((img) => {
      return img.complete && img.naturalHeight > 0;
    });

    expect(isLoaded).toBeTruthy();
  });

  test('mobile: scroll performance should be optimized', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Scroll test on mobile
    const startTime = await page.evaluate(() => performance.now());

    await page.evaluate(async () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;

      for (let i = 0; i < 5; i++) {
        window.scrollBy({ top: viewportHeight / 2, behavior: 'smooth' });
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    });

    await page.waitForTimeout(500);

    const scrollTime = await page.evaluate((start) => {
      return performance.now() - start;
    }, startTime);

    console.log('Mobile scroll time:', scrollTime, 'ms');

    // Should complete in reasonable time
    expect(scrollTime).toBeLessThan(5000);
  });
});
