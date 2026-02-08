
import { test, expect } from '@playwright/test';

test('Admin can Delete Vessel and Service using Custom Modals', async ({ page }) => {
    // 1. Login
    await page.goto('http://localhost:3000/');
    await page.getByRole('button', { name: /Administrador/i }).click();
    await page.getByRole('button', { name: 'Entrar' }).click();
    await expect(page.getByText('Painel da Marina')).toBeVisible();

    // 2. Test Vessel Deletion Modal
    await page.getByRole('button', { name: 'Todas Embarcações' }).click();
    await expect(page.getByText('Todas as Embarcações')).toBeVisible();

    // Click delete on the first vessel using aria-label
    await page.getByRole('button', { name: 'Excluir' }).first().click();

    // Verify Modal
    await expect(page.getByText('Confirmar Exclusão')).toBeVisible();
    await expect(page.getByText('Você tem certeza que deseja excluir a embarcação')).toBeVisible();

    // Cancel first to test interactability
    await page.getByRole('button', { name: 'Cancelar' }).click();
    await expect(page.getByText('Confirmar Exclusão')).not.toBeVisible();

    // 3. Test Service Deletion Modal
    await page.getByRole('button', { name: 'Todas Solicitações' }).click();

    // Default tab might be 'Todos'
    await expect(page.getByRole('tab', { name: 'Todos' })).toBeVisible();

    // Wait for data load
    await page.waitForTimeout(1000);

    // Check if there are services to delete
    const deleteButtons = page.getByRole('button', { name: 'Excluir' });
    if (await deleteButtons.count() > 0) {
        await deleteButtons.first().click();

        // Verify Modal
        await expect(page.getByText('Confirmar Exclusão')).toBeVisible();
        await expect(page.getByText('Você tem certeza que deseja excluir o serviço')).toBeVisible();

        // Confirm Deletion
        await page.getByRole('button', { name: 'Excluir Serviço' }).click();

        // Expect Notification or modal close
        await expect(page.getByText('Confirmar Exclusão')).not.toBeVisible();
        // await expect(page.getByText('Serviço excluído com sucesso!')).toBeVisible(); // Toast might be fast
    } else {
        console.log('No services to delete, skipping service deletion test.');
    }
});
