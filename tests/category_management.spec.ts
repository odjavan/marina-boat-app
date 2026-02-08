import { test, expect } from '@playwright/test';

test.describe('Category Management', () => {
    test.setTimeout(60000);

    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000');
        // Login as Admin
        await page.locator('button').filter({ hasText: 'Administrador' }).click();
        await expect(page.locator('h2')).toContainText('Visão Geral da Marina', { timeout: 15000 });

        // Go to Services
        await page.locator('aside').getByText('Todas Solicitações').click();
        await expect(page.getByText('Gestão de Serviços')).toBeVisible();
    });

    test('Should allow Creating Editing and Deleting Categories', async ({ page }) => {
        const timestamp = Date.now();
        const categoryName = `CatTeste ${timestamp}`;
        const categoryNameEdited = `CatEditada ${timestamp}`;

        // 1. Open Category Manager
        await page.click('button:has-text("Gerenciar Categorias")');
        await expect(page.getByText('Categorias Existentes')).toBeVisible();

        // 2. Create Category
        await page.fill('input[placeholder="Nome da categoria..."]', categoryName);
        await page.click('button:has-text("Adicionar")');

        // Confirm it was added to the list in the modal
        await expect(page.locator('div.border').getByText(categoryName)).toBeVisible();

        // 3. Edit Category
        // Find Edit button near the category name
        // We need scoping.
        const catRow = page.locator('div.flex.justify-between').filter({ hasText: categoryName });
        await catRow.getByTitle('Renomear').click();

        // Check if value is populated in input
        await expect(page.locator('input[placeholder="Nome da categoria..."]')).toHaveValue(categoryName);

        // Change name
        await page.fill('input[placeholder="Nome da categoria..."]', categoryNameEdited);
        await page.click('button:has-text("Salvar")');

        // Verify update in list
        await expect(page.locator('div.border').getByText(categoryNameEdited)).toBeVisible();

        // 4. Close Modal and Verify Tabs
        await page.click('button:has-text("Gerenciar Categorias")'); // Click "X" or close somehow? 
        // The modal uses `Dialog` which likely has an overlay or close button if standard, 
        // but our implementation uses `isCategoryManagerOpen` state. 
        // The Dialog component usually has a close 'X' or we can click outside.
        // Let's assume hitting Escape or clicking outside works, or checking if the Dialog has a Close button.
        // Actually our code: <Dialog ... onClose={() => setIsCategoryManagerOpen(false)} ...>
        // Dialog UI usually has an 'X' button or we can click the overlay.
        // Let's try pressing Escape.
        await page.keyboard.press('Escape');

        // Check if new category tab exists
        await expect(page.getByRole('button', { name: categoryNameEdited })).toBeVisible();

        // 5. Delete Category
        // Re-open Manager
        await page.click('button:has-text("Gerenciar Categorias")');

        // Delete
        // Need to handle confirm dialog
        page.on('dialog', dialog => dialog.accept());

        const catRowEdited = page.locator('div.flex.justify-between').filter({ hasText: categoryNameEdited });
        await catRowEdited.getByTitle('Excluir').click();

        // Verify it's gone
        await expect(page.locator('div.border').getByText(categoryNameEdited)).not.toBeVisible();
    });
});
