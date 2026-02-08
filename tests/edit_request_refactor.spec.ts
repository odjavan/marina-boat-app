
import { test, expect } from '@playwright/test';

test.describe('Edit Request Refactor', () => {
    test.setTimeout(60000);

    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000');
        // Login as Admin
        await page.locator('button').filter({ hasText: 'Administrador' }).click();
        await expect(page.locator('h2')).toContainText('Visão Geral da Marina', { timeout: 15000 });

        // Go to Services
        await page.locator('aside').getByText('Serviços').click();
        await expect(page.getByText('Gestão de Serviços')).toBeVisible();
    });

    test('Should allow editing a request using Service Selector', async ({ page }) => {
        const timestamp = Date.now();
        const customServiceName = `Serviço Custom ${timestamp}`;
        const catalogServiceName = `Catalog Service ${timestamp}`;

        // 1. Create a Catalog Item first to test selection
        // Check if "+" button exists (Category Management check)
        // Then Create Service
        if (await page.locator('button[title="Nova Categoria"]').isVisible()) {
            console.log('Category Management is active');
        }

        // Create a new Service in Catalog to select later
        await page.click('button:has-text("Novo Serviço")');
        await page.fill('input[placeholder="Ex: Polimento Completo"]', catalogServiceName);
        await page.selectOption('select >> nth=0', { index: 1 }); // Select first category
        await page.fill('input[placeholder="O que será feito..."]', 'Descrição do Catálogo');
        await page.click('button:has-text("Criar Serviço")');
        // Wait for success dialog or notification
        await page.waitForTimeout(1000);
        if (await page.getByText('Sucesso!').isVisible()) {
            await page.click('button:has-text("Continuar")');
        }

        // 2. Create a "Solicitação Customizada" to have something to edit
        await page.click('button:has-text("Solicitação Personalizada")');
        // Wizard Step 1: Vessel
        await page.click('div.border-slate-200 >> nth=0'); // Click first vessel
        await page.click('button:has-text("Próximo")');
        // Wizard Step 2: Service
        await page.selectOption('select', { value: 'Outro' });
        await page.fill('textarea', 'Descrição Inicial');
        await page.click('button:has-text("Próximo")');
        // Wizard Step 3: Date
        await page.fill('input[type="date"]', new Date().toISOString().split('T')[0]);
        await page.click('button:has-text("Próximo")');
        // Wizard Step 4: Review
        await page.click('button:has-text("Confirmar Solicitação")');

        // 3. Find the request and Edit
        // Switch to "Pendente" tab if needed, but it should be visible
        await page.waitForTimeout(1000);

        // Find Edit button for the request.
        // The request card/row should have "Outro" or "Personalizado"?
        // In Step 2 we selected 'Outro', but didn't type a name because Wizard logic for 'Outro' might default to 'Outro' or 'Personalizado'.
        // Let's assume it created a request.

        // We need to find the specific request.
        // It's the most recent one.
        const editButton = page.locator('button[aria-label="Editar"]').first();
        await editButton.click();

        await expect(page.getByText('Editar Solicitação')).toBeVisible();

        // 4. Test Selector Behavior

        // Case A: Select "Outro" and type custom name
        await page.selectOption('select[name="category_select"]', 'Outro');
        await expect(page.locator('input[name="category"]')).toBeVisible();
        await page.fill('input[name="category"]', customServiceName);
        await page.fill('input[name="description"]', 'Descrição Customizada');
        await page.click('button:has-text("Salvar Alterações")');

        // Verify update
        await expect(page.getByText(customServiceName)).toBeVisible();

        // 5. Test Selector Catalog Link
        // Edit again
        await page.locator('button[aria-label="Editar"]').filter({ hasText: '' }).first().click(); // Re-open

        // Case B: Select Catalog Service
        await page.selectOption('select[name="category_select"]', catalogServiceName);

        // Verify Input is hidden
        await expect(page.locator('input[name="category"]')).not.toBeVisible();

        // Verify Description updated automatically
        // Description value check
        await expect(page.locator('input[name="description"]')).toHaveValue('Descrição do Catálogo');

        await page.click('button:has-text("Salvar Alterações")');

        // Verify final state
        await expect(page.getByText(catalogServiceName)).toBeVisible();
    });
});
