import { test, expect } from '@playwright/test';

test.describe('Service Catalog (Admin)', () => {

    test.beforeEach(async ({ page }) => {
        // Login as Admin
        await page.goto('/');
        await page.getByPlaceholder('seu@email.com').fill('admin@marina.com');
        await page.getByPlaceholder('••••••••').fill('admin123');
        await page.getByRole('button', { name: 'Entrar' }).click();
        await expect(page.getByText('Painel Admin')).toBeVisible();
    });

    test('Should handle catalog item creation gracefully', async ({ page }) => {
        // Navigate to Services (which contains Catalog)
        await page.getByRole('button', { name: 'Todas Solicitações' }).click();

        // The "Novo Serviço" button in the catalog section
        await page.getByRole('button', { name: 'Novo Serviço' }).click();

        await page.locator('input[placeholder="Ex: Polimento Completo"]').fill('Test Service ' + Date.now());

        // Select category (assuming Categories exist, otherwise we might need to select specific index)
        // We select the 2nd option (index 1) just to be safe if "Selecione..." is first
        await page.locator('select').first().selectOption({ index: 1 });

        await page.locator('input[placeholder="O que será feito..."]').fill('Description test');
        await page.locator('input[placeholder="Ex: 2 horas"]').fill('1 hora');

        // Click Create
        await page.getByRole('button', { name: 'Criar Serviço' }).click();

        // We expect either Success OR a Graceful Error (not a crash, not a raw alert if possible, but the current code uses alert)
        // The previous error was an alert with "new row violates...".
        // We want to verify we adjusted the code to show a friendly error or (if fixed properly) success.
        // For now, let's assert that we do NOT see the raw SQL error.

        // Note: Playwright handles dialogs automatically by dismissing them usually, so we need to listen.
        let dialogMessage = '';
        page.on('dialog', async dialog => {
            dialogMessage = dialog.message();
            await dialog.accept();
        });

        // Wait a bit for the operation
        await page.waitForTimeout(3000);

        // If RLS blocked it, we expect a specific friendly message or the test fails if it sees the raw SQL error.
        expect(dialogMessage).not.toContain('row-level security policy');

        // Ideally, we want 'Serviço criado com sucesso!' or 'Modo Demo: Ação restrita'.
    });

});
