import { test, expect } from '@playwright/test';

test.describe('Vessels Management', () => {

    // Login before each test
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.getByPlaceholder('seu@email.com').fill('cliente@marina.com');
        await page.getByPlaceholder('••••••••').fill('user123');
        await page.getByRole('button', { name: 'Entrar' }).click();
        await expect(page.getByText('Olá, João!')).toBeVisible();
    });

    test('Should create and delete a vessel', async ({ page }) => {
        const vesselName = 'Test Vessel ' + Date.now();

        // Navigate to Vessels
        await page.getByRole('button', { name: 'Embarcações' }).click();

        // Open Modal
        await page.getByRole('button', { name: 'Nova Embarcação' }).click();

        // Fill Form
        await page.locator('input[name="name"]').fill(vesselName);
        await page.locator('select[name="type"]').selectOption('Lancha');
        await page.locator('input[name="model"]').fill('Test Model X');
        await page.locator('input[name="year"]').fill('2024');
        await page.locator('input[name="length"]').fill('30 pés');
        await page.locator('input[name="registration_number"]').fill('TEST-12345');

        // Submit
        await page.getByRole('button', { name: 'Salvar Embarcação' }).click();

        // Verify it appears
        await expect(page.getByText(vesselName)).toBeVisible();

        // Delete Flow
        page.on('dialog', async dialog => {
            expect(dialog.message()).toContain('excluir');
            await dialog.accept();
        });

        // Find the deletion button for this specific vessel row/card
        // We look for the card containing the vessel name, then find the delete button inside it
        // In the cards view (client view), the delete button is a Trash2 icon with title "Excluir"
        const vesselCard = page.locator('.group', { hasText: vesselName });
        await vesselCard.getByTitle('Excluir').click();

        // Verify it is gone
        await expect(page.getByText(vesselName)).not.toBeVisible();
    });

});
