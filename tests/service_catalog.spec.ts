
import { test, expect } from '@playwright/test';

test.describe('Service Catalog Management', () => {
    test.beforeEach(async ({ page }) => {
        // Increase timeout for slow environments
        test.setTimeout(60000);
        await page.goto('http://localhost:3000');

        // Login as Admin (Demo Mode)
        await page.locator('button').filter({ hasText: 'Administrador' }).click();

        // Wait for dashboard
        await expect(page.locator('h2')).toContainText('Visão Geral da Marina', { timeout: 15000 });

        // Navigate to Services
        await page.click('text=Todas Solicitações'); // Assuming Services are here or distinct menu
        // Wait! The menu item might be "Serviços" or within "Todas Solicitações" -> "Gestão"
        // Let's check App.tsx sidebar:
        // <SidebarItem icon={<Package size={20} />} label="Serviços" active={activeTab === 'services'} onClick={() => setActiveTab('services')} />
        // It says "Serviços".
        await page.click('text=Serviços');
        await expect(page.getByText('Gestão de Serviços')).toBeVisible();
    });

    test('Create, Edit and Delete Service', async ({ page }) => {
        const timestamp = Date.now();
        const serviceName = `Serviço Teste ${timestamp}`;
        const updatedServiceName = `Serviço Teste ${timestamp} (Atualizado)`;

        // --- CREATE ---
        await page.click('button:has-text("Novo Serviço")');
        await expect(page.locator('h2', { hasText: 'Novo Serviço' })).toBeVisible();

        await page.fill('input[placeholder="Ex: Polimento Completo"]', serviceName);
        await page.selectOption('select', { label: 'Limpeza' }); // Assuming 'Limpeza' exists
        await page.fill('input[placeholder="O que será feito..."]', 'Descrição do serviço de teste');

        // Price Input - Masked
        // Type "15000" should result in "R$ 150,00"
        await page.fill('input[placeholder="R$ 0,00"]', '15000');
        // Verify value? It might be tricky with mask.

        await page.click('button:has-text("Criar Serviço")');

        // Verify Success (Dialog or Toast or List)
        // If optimistic update works, it should be in the list
        await expect(page.getByText(serviceName)).toBeVisible();
        await expect(page.getByText('R$ 150,00')).toBeVisible(); // Check price formatting

        // --- EDIT ---
        // Find the edit button for this service card
        // We need to target the specific card.
        const serviceCard = page.locator('div.bg-white\\/80').filter({ hasText: serviceName });
        // Click edit button (pencil icon)
        await serviceCard.locator('button').first().click(); // First button is usually Edit, second Trash

        await expect(page.getByText('Editar Serviço')).toBeVisible();

        // Change Name
        await page.fill('input[value="' + serviceName + '"]', updatedServiceName);

        // Change Price
        // Input should have value. Let's change to 200.00
        await page.fill('input[placeholder="R$ 0,00"]', '20000');

        await page.click('button:has-text("Salvar Alterações")');

        // Verify Update
        await expect(page.getByText(updatedServiceName)).toBeVisible();
        await expect(page.getByText('R$ 200,00')).toBeVisible();

        // --- DELETE ---
        // Click delete button (trash icon)
        const updatedCard = page.locator('div.bg-white\\/80').filter({ hasText: updatedServiceName });

        // Handling window.confirm
        page.on('dialog', dialog => dialog.accept());

        await updatedCard.locator('button').nth(1).click(); // Second button is Trash

        // Verify Deletion
        await expect(page.getByText(updatedServiceName)).not.toBeVisible();
    });
});
