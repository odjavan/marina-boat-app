import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {

    test('Should allow login with valid admin credentials', async ({ page }) => {
        await page.goto('/');

        // Fill valid credentials
        await page.getByPlaceholder('seu@email.com').fill('admin@marina.com');
        await page.getByPlaceholder('••••••••').fill('admin123');
        await page.getByRole('button', { name: 'Entrar' }).click();

        // Expect to see dashboard welcome message
        await expect(page.getByText('Olá, Maria!')).toBeVisible();
    });

    test('Should handle invalid credentials alert', async ({ page }) => {
        await page.goto('/');

        // Setup dialog handler
        page.on('dialog', async dialog => {
            expect(dialog.message()).toContain('Credenciais inválidas');
            await dialog.accept();
        });

        // Fill invalid credentials
        await page.getByPlaceholder('seu@email.com').fill('wrong@test.com');
        await page.getByPlaceholder('••••••••').fill('wrongpass');
        await page.getByRole('button', { name: 'Entrar' }).click();
    });

});
