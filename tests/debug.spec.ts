import { test, expect } from '@playwright/test';

test.describe('Simple Debug Test', () => {
    test('Check if app loads and login works', async ({ page }) => {
        test.setTimeout(60000);

        console.log('1. Going to localhost:3000...');
        await page.goto('http://localhost:3000');

        console.log('2. Waiting for page to load...');
        await page.waitForLoadState('networkidle');

        console.log('3. Taking screenshot of initial page...');
        await page.screenshot({ path: 'debug-01-initial.png' });

        console.log('4. Checking for login form...');
        const emailInput = page.locator('input[type="email"]');
        await expect(emailInput).toBeVisible({ timeout: 10000 });

        console.log('5. Filling login form...');
        await emailInput.fill('alexandre.djavan@gmail.com');
        await page.fill('input[type="password"]', 'admin123');

        console.log('6. Taking screenshot before submit...');
        await page.screenshot({ path: 'debug-02-before-submit.png' });

        console.log('7. Clicking submit...');
        await page.click('button[type="submit"]');

        console.log('8. Waiting for navigation...');
        await page.waitForLoadState('networkidle');

        console.log('9. Taking screenshot after login...');
        await page.screenshot({ path: 'debug-03-after-login.png' });

        console.log('10. Checking page content...');
        const bodyText = await page.locator('body').textContent();
        console.log('Body contains:', bodyText?.substring(0, 500));

        console.log('11. Looking for h2 elements...');
        const h2Elements = await page.locator('h2').all();
        console.log('Found', h2Elements.length, 'h2 elements');
        for (let i = 0; i < h2Elements.length; i++) {
            const text = await h2Elements[i].textContent();
            console.log(`  h2[${i}]:`, text);
        }

        console.log('12. Test completed!');
    });
});
