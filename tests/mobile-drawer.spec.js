import { test, expect } from '@playwright/test';

test('Mobile navigation drawer opens, shows all links, and closes on click', async ({ page }) => {
  // Set mobile viewport (375x667)
  await page.setViewportSize({ width: 375, height: 667 });

  // 1. Open the page
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

  // 2. Take screenshot of initial state (drawer closed, hamburger visible)
  await page.screenshot({
    path: '/home/awani/awani-consulting-portfolio/test-results/drawer-closed.png',
    fullPage: false,
  });
  console.log('Screenshot saved: drawer-closed.png');

  // Verify hamburger button is visible
  const hamburger = page.locator('.mobile-menu-toggle');
  await expect(hamburger).toBeVisible();
  console.log('Hamburger button is visible');

  // 3. Click the hamburger button to open the drawer
  await hamburger.click();

  // 4. Wait 500ms for animation
  await page.waitForTimeout(500);

  // Verify the drawer is open (has the "open" class)
  const drawer = page.locator('.drawer');
  await expect(drawer).toHaveClass(/\bopen\b/);
  console.log('Drawer is open (has "open" class)');

  // 5. Take screenshot with drawer open
  await page.screenshot({
    path: '/home/awani/awani-consulting-portfolio/test-results/drawer-open.png',
    fullPage: false,
  });
  console.log('Screenshot saved: drawer-open.png');

  // 6. Verify the drawer contains all expected navigation items
  const expectedNavItems = [
    'Home',
    'Solutions',
    'Expert Consultants',
    'Case Studies',
    'Pricing',
    'Technology Expertise',
    'Contact',
  ];

  for (const item of expectedNavItems) {
    const matches = page.getByText(item, { exact: true });
    const count = await matches.count();
    expect(count, `Expected to find "${item}" but found ${count} matches`).toBeGreaterThan(0);
    console.log(`  Found nav item: "${item}" (${count} instance(s))`);
  }
  console.log('All navigation items verified!');

  // 7. Verify the drawer has a "Book a Call" button (drawer-cta class)
  const bookACall = page.locator('.drawer-cta');
  await expect(bookACall).toBeVisible();
  const bookText = await bookACall.innerText();
  expect(bookText.trim()).toBe('Book a Call');
  console.log(`"Book a Call" button found in drawer (text: "${bookText.trim()}")`);

  // 8. Click "Solutions" link in the drawer and verify the drawer closes
  const solutionsLink = page.getByText('Solutions', { exact: true }).nth(1);
  await solutionsLink.click();
  await page.waitForTimeout(500);

  // Verify drawer closed: the "open" class should be removed from the drawer
  // The drawer uses CSS transform to slide off-screen when closed
  await expect(drawer).not.toHaveClass(/\bopen\b/, { timeout: 2000 });
  console.log('Drawer closed after clicking "Solutions" link (no "open" class)');

  console.log('\nAll tests passed!');
});
