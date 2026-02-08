
import { test, expect } from '@playwright/test';

test('Admin can Create, Edit and Delete Clients', async ({ page }) => {
    try {
        // 1. Login as Admin
        await page.goto('http://localhost:3000/');

        // Ensure clean state (logout if needed)
        await page.evaluate(() => localStorage.clear());
        await page.reload();

        await page.getByRole('button', { name: /Administrador/i }).click();
        await page.getByRole('button', { name: 'Entrar' }).click();

        // Wait for dashboard
        await expect(page.getByText('Painel da Marina')).toBeVisible();

        // 2. Navigate to Clients
        await page.getByRole('button', { name: 'Clientes' }).click();
        await expect(page.getByRole('heading', { name: 'Clientes Cadastrados' })).toBeVisible();

        // 3. Create Client
        const clientName = `Test User ${Date.now()} `;
        await page.getByRole('button', { name: 'Novo Cliente' }).click();

        await page.locator('input[name="name"]').fill(clientName);
        await page.locator('input[name="email"]').fill(`test${Date.now()} @example.com`);
        await page.locator('input[name="phone"]').fill('11999999999');
        await page.locator('input[name="cpf"]').fill('12345678900');
        await page.locator('input[name="password"]').fill('123456');

        await page.getByRole('button', { name: 'Cadastrar Cliente' }).click();

        // Verify creation
        await expect(page.getByText(clientName)).toBeVisible();

        // 4. Edit Client
        // Find the row with the client name and click the Edit button within it
        const row = page.getByRole('row', { name: clientName });
        await row.getByRole('button', { name: 'Editar' }).click();

        // Check if modal title changed
        await expect(page.getByText('Editar Cliente')).toBeVisible();

        // Update name
        const newName = clientName + ' EDITED';
        await page.locator('input[name="name"]').fill(newName);
        await page.getByRole('button', { name: 'Salvar Alterações' }).click();

        // Verify update
        await expect(page.getByText(newName)).toBeVisible();
        await expect(page.getByText(clientName)).not.toBeVisible();

        // 5. Delete Client
        try {
            console.log('Attempting to delete client...');
            const rowEdited = page.getByRole('row', { name: newName });
            await rowEdited.getByRole('button', { name: 'Excluir' }).click();
            console.log('Clicked delete icon');

            // Confirm in Modal
            await expect(page.getByText('Confirmar Exclusão')).toBeVisible({ timeout: 5000 });
            console.log('Modal visible');
            await expect(page.getByText('Você está prestes a excluir permanentemente')).toBeVisible();
            await page.getByRole('button', { name: 'Excluir Cliente' }).click();
            console.log('Confirmed deletion');
        } catch (error) {
            console.error('Delete flow failed:', error);
            await page.screenshot({ path: 'delete_failure.png' });
            throw error;
        }

        // Verify deletion
        await expect(page.getByText(newName)).not.toBeVisible();

    } catch (error) {
        console.error('Test failed globally:', error);
        await page.screenshot({ path: 'global_failure.png' });
        throw error;
    }
});

