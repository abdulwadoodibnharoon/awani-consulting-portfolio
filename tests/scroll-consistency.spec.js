import { test, expect } from '@playwright/test';

test.describe('Scroll Consistency Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('scroll speed should be consistent from top to bottom', async ({ page }) => {
    // Measure scroll performance in different sections
    const measurements = [];

    // Test scroll in hero section (top)
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);

    const heroScrollTime = await page.evaluate(async () => {
      const start = performance.now();
      window.scrollBy({ top: 500, behavior: 'smooth' });
      await new Promise(resolve => setTimeout(resolve, 800));
      return performance.now() - start;
    });

    measurements.push({ section: 'hero', time: heroScrollTime });
    console.log('Hero section scroll time:', heroScrollTime, 'ms');

    // Test scroll in middle section (services/pricing)
    await page.evaluate(() => {
      const servicesSection = document.querySelector('#services');
      servicesSection.scrollIntoView({ behavior: 'instant' });
    });
    await page.waitForTimeout(500);

    const middleScrollTime = await page.evaluate(async () => {
      const start = performance.now();
      window.scrollBy({ top: 500, behavior: 'smooth' });
      await new Promise(resolve => setTimeout(resolve, 800));
      return performance.now() - start;
    });

    measurements.push({ section: 'middle', time: middleScrollTime });
    console.log('Middle section scroll time:', middleScrollTime, 'ms');

    // Test scroll in bottom section (contact/footer)
    await page.evaluate(() => {
      const contactSection = document.querySelector('#contact');
      contactSection.scrollIntoView({ behavior: 'instant' });
    });
    await page.waitForTimeout(500);

    const bottomScrollTime = await page.evaluate(async () => {
      const start = performance.now();
      window.scrollBy({ top: 500, behavior: 'smooth' });
      await new Promise(resolve => setTimeout(resolve, 800));
      return performance.now() - start;
    });

    measurements.push({ section: 'bottom', time: bottomScrollTime });
    console.log('Bottom section scroll time:', bottomScrollTime, 'ms');

    // Calculate variance - times should be similar (within 30% variance)
    const times = measurements.map(m => m.time);
    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    const maxVariance = avgTime * 0.3; // Allow 30% variance

    console.log('Average scroll time:', avgTime, 'ms');
    console.log('Max allowed variance:', maxVariance, 'ms');

    // All times should be within acceptable variance
    times.forEach((time, index) => {
      const variance = Math.abs(time - avgTime);
      console.log(`${measurements[index].section} variance:`, variance, 'ms');
      expect(variance).toBeLessThan(maxVariance);
    });
  });

  test('FPS should be consistent during scroll', async ({ page }) => {
    // Measure FPS during scroll in different sections
    const measureFPS = async (sectionSelector) => {
      return await page.evaluate(async (selector) => {
        // Scroll to section
        if (selector) {
          const section = document.querySelector(selector);
          section.scrollIntoView({ behavior: 'instant' });
          await new Promise(resolve => setTimeout(resolve, 300));
        }

        let frameCount = 0;
        let lastTime = performance.now();
        const duration = 1000; // Measure for 1 second

        const countFrames = () => {
          frameCount++;
          if (performance.now() - lastTime < duration) {
            requestAnimationFrame(countFrames);
          }
        };

        requestAnimationFrame(countFrames);

        // Scroll while measuring
        window.scrollBy({ top: 1000, behavior: 'smooth' });

        await new Promise(resolve => setTimeout(resolve, duration));

        const fps = frameCount;
        return fps;
      }, sectionSelector);
    };

    // Measure FPS in different sections
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);

    const heroFPS = await measureFPS(null);
    console.log('Hero section FPS:', heroFPS);

    const middleFPS = await measureFPS('#services');
    console.log('Middle section FPS:', middleFPS);

    const bottomFPS = await measureFPS('#contact');
    console.log('Bottom section FPS:', bottomFPS);

    // FPS should be above 30 for smooth scrolling
    expect(heroFPS).toBeGreaterThan(30);
    expect(middleFPS).toBeGreaterThan(30);
    expect(bottomFPS).toBeGreaterThan(30);

    // FPS variance should be reasonable (within 40%)
    const fpsList = [heroFPS, middleFPS, bottomFPS];
    const avgFPS = fpsList.reduce((a, b) => a + b, 0) / fpsList.length;
    const maxVariance = avgFPS * 0.4;

    fpsList.forEach(fps => {
      const variance = Math.abs(fps - avgFPS);
      console.log('FPS variance:', variance);
      expect(variance).toBeLessThan(maxVariance);
    });
  });

  test('backdrop filters should not cause excessive lag', async ({ page }) => {
    // Scroll through sections with glass cards
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);

    const scrollThroughGlassCards = await page.evaluate(async () => {
      const startTime = performance.now();

      // Scroll through services (has glass cards)
      window.scrollBy({ top: 800, behavior: 'smooth' });
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Scroll through pricing (has glass cards)
      window.scrollBy({ top: 1000, behavior: 'smooth' });
      await new Promise(resolve => setTimeout(resolve, 1000));

      return performance.now() - startTime;
    });

    console.log('Glass card scroll time:', scrollThroughGlassCards, 'ms');

    // Should complete in reasonable time (under 2.5 seconds)
    expect(scrollThroughGlassCards).toBeLessThan(2500);
  });

  test('orb animations should not block scrolling', async ({ page }) => {
    // Check orbs exist
    const orbCount = await page.locator('.orb').count();
    expect(orbCount).toBe(3);

    // Scroll rapidly through hero section
    const rapidScrollTime = await page.evaluate(async () => {
      window.scrollTo(0, 0);
      await new Promise(resolve => setTimeout(resolve, 100));

      const startTime = performance.now();

      for (let i = 0; i < 5; i++) {
        window.scrollBy({ top: 200, behavior: 'smooth' });
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      return performance.now() - startTime;
    });

    console.log('Rapid scroll through hero time:', rapidScrollTime, 'ms');

    // Should be responsive (complete within 1 second)
    expect(rapidScrollTime).toBeLessThan(1000);
  });

  test('smooth scroll from top to bottom should be fluid', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);

    // Scroll from top to bottom
    const fullScrollTime = await page.evaluate(async () => {
      const startTime = performance.now();
      const scrollHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      const targetScroll = scrollHeight - viewportHeight;

      window.scrollTo({ top: targetScroll, behavior: 'smooth' });

      // Wait for scroll to complete
      await new Promise(resolve => {
        let lastScrollY = window.scrollY;
        const checkScroll = setInterval(() => {
          if (Math.abs(window.scrollY - lastScrollY) < 1) {
            clearInterval(checkScroll);
            resolve();
          }
          lastScrollY = window.scrollY;
        }, 100);

        // Timeout after 5 seconds
        setTimeout(() => {
          clearInterval(checkScroll);
          resolve();
        }, 5000);
      });

      return performance.now() - startTime;
    });

    console.log('Full page scroll time:', fullScrollTime, 'ms');

    // Full page scroll should complete within 3 seconds
    expect(fullScrollTime).toBeLessThan(3000);
  });

  test('logo click scroll to top should be consistent', async ({ page }) => {
    // Scroll to different sections and test scroll-to-top
    const sections = ['#services', '#pricing', '#contact'];

    for (const section of sections) {
      // Scroll to section
      await page.locator(section).scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      const scrollY = await page.evaluate(() => window.scrollY);
      expect(scrollY).toBeGreaterThan(200);

      // Click logo to scroll to top
      const scrollToTopTime = await page.evaluate(async () => {
        const startTime = performance.now();
        document.querySelector('.logo-container').click();

        // Wait for scroll to complete
        await new Promise(resolve => {
          const checkScroll = setInterval(() => {
            if (window.scrollY < 10) {
              clearInterval(checkScroll);
              resolve();
            }
          }, 50);

          setTimeout(() => {
            clearInterval(checkScroll);
            resolve();
          }, 2000);
        });

        return performance.now() - startTime;
      });

      console.log(`Scroll to top from ${section} time:`, scrollToTopTime, 'ms');

      // Should scroll to top within 1.5 seconds
      expect(scrollToTopTime).toBeLessThan(1500);

      // Verify we're at top
      const finalScrollY = await page.evaluate(() => window.scrollY);
      expect(finalScrollY).toBeLessThan(10);
    }
  });
});
