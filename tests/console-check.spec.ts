import { test, expect } from '@playwright/test';

test.describe('Console Error Check', () => {
    test('Check for console errors', async ({ page }) => {
        const consoleMessages: string[] = [];
        const errors: string[] = [];

        page.on('console', msg => {
            consoleMessages.push(`[${msg.type()}] ${msg.text()}`);
        });

        page.on('pageerror', error => {
            errors.push(`PAGE ERROR: ${error.message}`);
        });

        await page.goto('http://localhost:3000');
        await page.waitForLoadState('networkidle');

        await page.fill('input[type="email"]', 'alexandre.djavan@gmail.com');
        await page.fill('input[type="password"]', 'admin123');
        await page.click('button[type="submit"]');

        await page.waitForTimeout(3000);

        console.log('\n=== CONSOLE MESSAGES ===');
        consoleMessages.forEach(msg => console.log(msg));

        console.log('\n=== PAGE ERRORS ===');
        errors.forEach(err => console.log(err));

        if (errors.length > 0) {
            throw new Error(`Found ${errors.length} page errors: ${errors.join(', ')}`);
        }
    });
});
