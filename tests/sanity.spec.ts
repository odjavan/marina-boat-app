import { test, expect } from '@playwright/test';

test('Sanity Check: Page loads and has correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Marina Boat/);
    await expect(page.locator('body')).toBeVisible();
});
