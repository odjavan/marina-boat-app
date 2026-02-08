import { test, expect } from '@playwright/test';

test.describe('Service Catalog Edit', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000');
        // Login as Admin
        await page.getByText('Administrador').click();
        await expect(page.getByText('Ola, Alexandre!')).toBeVisible();
    });

    test('should edit a service name without crashing', async ({ page }) => {
        // Navigate to Services
        await page.getByRole('button', { name: 'Todas Solicitações' }).click();

        // Wait for Catalog to load
        await expect(page.getByText('Catálogo Disponível')).toBeVisible();

        // Find the first Edit button in the catalog section
        // The catalog cards are seemingly identified by their edit buttons if visible.
        // We target the first edit button we see.
        const editButtons = page.locator('button .lucide-edit-2');
        // Lucide Edit2 icon is used in catalog.

        // If no services, create one first?
        const count = await editButtons.count();
        if (count === 0) {
            // Create new service
            await page.getByRole('button', { name: 'Novo Serviço' }).click();
            await page.locator('input[placeholder="Ex: Polimento Completo"]').fill('Test Service');
            await page.locator('select').selectOption({ index: 1 }); // Pick first category
            await page.locator('input[placeholder="O que será feito..."]').fill('Description');
            await page.locator('input[placeholder="Ex: 2 horas"]').fill('1 hora');
            await page.getByRole('button', { name: 'Criar Serviço' }).click();

            // Wait for success dialog or notification
            await page.waitForTimeout(1000);
        }

        // Now edit
        await editButtons.first().click();

        // Verify modal opens
        await expect(page.getByText('Editar Serviço')).toBeVisible();

        // Change Name
        const nameInput = page.locator('input[value]').first(); // Should be the name input
        await nameInput.fill('Edited Service Name');

        // Save
        await page.getByRole('button', { name: 'Salvar Alterações' }).click();

        // Verify No Crash
        await expect(page.getByText('Algo deu errado')).not.toBeVisible();

        // Verify notification success
        await expect(page.getByText('Serviço atualizado com sucesso!')).toBeVisible();
    });
});
