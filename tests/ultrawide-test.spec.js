// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Ultrawide / Curved Monitor Viewport Tests
 * Tests the consulting portfolio across various curved and ultrawide resolutions
 */

const VIEWPORTS = [
  { name: '21:9 Ultrawide (2560x1080)', width: 2560, height: 1080 },
  { name: '21:9 Ultrawide QHD (3440x1440)', width: 3440, height: 1440 },
  { name: '32:9 Super Ultrawide (5120x1440)', width: 5120, height: 1440 },
  { name: '32:9 Super Ultrawide Budget (3840x1080)', width: 3840, height: 1080 },
  { name: 'Curved 27" QHD (2560x1440)', width: 2560, height: 1440 },
  { name: 'Curved 34" WQHD (3440x1440)', width: 3440, height: 1440 },
];

for (const vp of VIEWPORTS) {
  test.describe(`${vp.name}`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test.beforeEach(async ({ page }) => {
      await page.goto('/', { waitUntil: 'networkidle' });
      // Give animations time to settle
      await page.waitForTimeout(500);
    });

    test('no horizontal overflow', async ({ page }) => {
      const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
      const viewportWidth = vp.width;
      // Allow 1px tolerance for sub-pixel rendering
      expect(bodyScrollWidth).toBeLessThanOrEqual(viewportWidth + 1);

      // Also check documentElement
      const docScrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(docScrollWidth).toBeLessThanOrEqual(viewportWidth + 1);

      // Verify no horizontal scrollbar
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(hasHorizontalScroll).toBe(false);
    });

    test('nav is visible and fixed position', async ({ page }) => {
      const nav = page.locator('nav.nav');
      await expect(nav).toBeVisible();

      const navPosition = await nav.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return style.position;
      });
      expect(navPosition).toBe('fixed');

      // Nav should span full width
      const navBox = await nav.boundingBox();
      expect(navBox).not.toBeNull();
      expect(navBox.width).toBeGreaterThanOrEqual(vp.width - 2);

      // Nav content should be visible
      const logo = page.locator('.logo-text');
      await expect(logo).toBeVisible();

      const ctaButton = page.locator('nav .cta-button');
      await expect(ctaButton).toBeVisible();
    });

    test('hero section renders correctly', async ({ page }) => {
      const hero = page.locator('#home');
      await expect(hero).toBeVisible();

      // Title visible
      const heroTitle = page.locator('.hero-title');
      await expect(heroTitle).toBeVisible();

      // Subtitle visible
      const subtitle = page.locator('.subtitle');
      await expect(subtitle).toBeVisible();

      // Hero buttons visible
      const primaryButton = page.locator('.primary-button').first();
      await expect(primaryButton).toBeVisible();

      const secondaryButtons = page.locator('.hero-buttons .secondary-button');
      const count = await secondaryButtons.count();
      expect(count).toBeGreaterThanOrEqual(1);
      for (let i = 0; i < count; i++) {
        await expect(secondaryButtons.nth(i)).toBeVisible();
      }

      // Hero description visible
      const description = page.locator('.hero-description');
      await expect(description).toBeVisible();
    });

    test('content is centered and not stretched edge-to-edge', async ({ page }) => {
      // Check that .container elements have proper centering and max-width
      const containers = page.locator('.container');
      const containerCount = await containers.count();
      expect(containerCount).toBeGreaterThan(0);

      for (let i = 0; i < containerCount; i++) {
        const container = containers.nth(i);
        const isVisible = await container.isVisible();
        if (!isVisible) continue;

        const box = await container.boundingBox();
        if (!box) continue;

        // Container should not stretch to full viewport on ultrawide
        // It should have a max-width (typically 1200px from CSS)
        if (vp.width > 1400) {
          // On ultrawides, content should NOT fill the full width
          expect(box.width).toBeLessThan(vp.width * 0.95);
        }

        // Container should be roughly centered (left margin ~= right margin)
        if (box.width < vp.width * 0.95) {
          const leftMargin = box.x;
          const rightMargin = vp.width - (box.x + box.width);
          const marginDiff = Math.abs(leftMargin - rightMargin);
          // Allow some tolerance (50px) for centering
          expect(marginDiff).toBeLessThan(50);
        }
      }
    });

    test('all main sections are present', async ({ page }) => {
      const sections = ['#services', '#case-study', '#pricing', '#contact'];

      for (const sectionId of sections) {
        const section = page.locator(sectionId);
        await expect(section).toBeAttached();

        // Scroll to section and verify visibility
        await section.scrollIntoViewIfNeeded();
        await expect(section).toBeVisible();
      }
    });

    test('footer is visible with correct text', async ({ page }) => {
      const footer = page.locator('footer.footer');
      await footer.scrollIntoViewIfNeeded();
      await expect(footer).toBeVisible();

      // Check copyright text - use getByText to avoid strict mode violation
      // (there are multiple <p> in .footer-bottom, including a shariah-notice)
      const copyright = page.getByText('2026 Awani Product Consulting');
      await expect(copyright).toBeVisible();
      await expect(copyright).toContainText('All rights reserved');

      // Check email link
      const email = page.locator('.footer-email');
      await expect(email).toBeVisible();
      await expect(email).toHaveText('consulting@awani.ai');

      // Footer should span full width
      const footerBox = await footer.boundingBox();
      expect(footerBox).not.toBeNull();
      expect(footerBox.width).toBeGreaterThanOrEqual(vp.width - 2);
    });

    test('case study cards do not stretch too wide', async ({ page }) => {
      const caseStudySection = page.locator('#case-study');
      await caseStudySection.scrollIntoViewIfNeeded();

      const cards = page.locator('.case-study-card');
      const cardCount = await cards.count();
      expect(cardCount).toBeGreaterThan(0);

      // Max reasonable width for a card - should not exceed ~1200px
      // or should not be wider than the container
      const MAX_REASONABLE_CARD_WIDTH = 1300;

      for (let i = 0; i < cardCount; i++) {
        const card = cards.nth(i);
        const isVisible = await card.isVisible();
        if (!isVisible) {
          await card.scrollIntoViewIfNeeded();
        }

        const box = await card.boundingBox();
        if (!box) continue;

        expect(box.width).toBeLessThanOrEqual(MAX_REASONABLE_CARD_WIDTH);

        // Card should not stretch to full viewport width on ultrawide
        if (vp.width > 1400) {
          expect(box.width).toBeLessThan(vp.width * 0.85);
        }
      }
    });

    test('content container has a max-width constraint', async ({ page }) => {
      // Verify the CSS max-width is applied and effective
      const containers = page.locator('.container');
      const containerCount = await containers.count();
      expect(containerCount).toBeGreaterThan(0);

      let checkedAtLeastOne = false;

      for (let i = 0; i < containerCount; i++) {
        const container = containers.nth(i);
        const isVisible = await container.isVisible();
        if (!isVisible) continue;

        const styles = await container.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          return {
            maxWidth: computed.maxWidth,
            width: el.offsetWidth,
          };
        });

        // max-width should be set (not 'none')
        expect(styles.maxWidth).not.toBe('none');

        // The actual width should respect the max-width
        const maxWidthPx = parseFloat(styles.maxWidth);
        if (!isNaN(maxWidthPx)) {
          expect(styles.width).toBeLessThanOrEqual(maxWidthPx + 1);
        }

        checkedAtLeastOne = true;
      }

      expect(checkedAtLeastOne).toBe(true);

      // Also verify the nav-content has max-width or is constrained
      const navContent = page.locator('.nav-content');
      if (await navContent.isVisible()) {
        const navBox = await navContent.boundingBox();
        if (navBox && vp.width > 1400) {
          // Nav content should not stretch infinitely either
          expect(navBox.width).toBeLessThan(vp.width);
        }
      }
    });
  });
}
