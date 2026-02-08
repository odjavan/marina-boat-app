
import { test, expect } from '@playwright/test';

test('Service Management: Create and Sync', async ({ page }) => {
    // 1. Login
    await page.goto('http://localhost:5173/');
    await page.fill('input[type="email"]', 'alexandre.djavan@gmail.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Entrar")');

    // Wait for dashboard
    await expect(page.locator('text=Visão Geral da Marina')).toBeVisible();

    // 2. Go to Service Management (Gestão de Serviços)
    // Assuming "Gestão de Serviços" is accessible via the sidebar "Configurações" -> "Catálogo" or similar, 
    // OR assuming it's the "Services" view if that's what the user meant.
    // Looking at App.tsx, case 'services' returns <Services /> which is the Catalog view.
    // Sidebar might say "Catálogo" or similar. Let's try to find a button that links to 'services' view.
    // Based on previous knowledge, it's likely "Catálogo" or "Serviços" in sidebar.
    // Let's look for text "Gestão de Serviços" if it exists on dashboard or sidebar.

    // Actually, checking previous screenshots/context, sidebar item might be "Catálogo" or similar.
    // Let's assume there is a sidebar button to switch view.
    // If we can't find it easily by text, we might need to rely on the fact that App.tsx renders MainContent based on currentView.

    // Let's try clicking on "Serviços" or "Catálogo" in sidebar.
    // If the user said "Gestão de Serviços", maybe that's the title of the page?
    // Let's try to click a sidebar link.
    // Common sidebar items: "Visão Geral", "Embarcações", "Serviços" (Solicitações?), "Histórico", "Clientes", "Equipe".
    // Wait, the user specifically mentioned "Gestão de Serviços".
    // In `App.tsx`, `case 'services': return <Services />;`.
    // `Services` component likely contains `ServiceCatalog`.
    // Let's try to find a navigation button.

    // Navigate to Services view using data-testid
    await page.click('[data-testid="services"]');

    // Check if we are in the right place. Look for "Novo Serviço".
    await expect(page.locator('button:has-text("Novo Serviço")')).toBeVisible({ timeout: 5000 });

    // 3. Create New Service
    const uniqueServiceName = `Test Service ${Date.now()}`;
    await page.click('button:has-text("Novo Serviço")');

    await page.fill('input[placeholder="Ex: Polimento Completo"]', uniqueServiceName);
    // Select Category
    await page.selectOption('select', { index: 1 }); // Select first available category
    await page.fill('input[placeholder="O que será feito..."]', 'Test Description');
    await page.fill('input[placeholder="R$ 0,00"]', '15000'); // 150.00

    await page.click('button:has-text("Criar Serviço")');

    // 4. Verify in List
    await expect(page.locator(`text=${uniqueServiceName}`)).toBeVisible();

    // 5. Verify Sync in "Nova Solicitação"
    // Go to Dashboard or Requests
    await page.click('button:has-text("Todas Solicitações")'); // Or "Solicitações"

    await page.click('button:has-text("Nova Solicitação")');

    // Open dropdown
    // The dropdown might be a select or a custom component.
    // In App.tsx, it's a <Select> inside the modal.
    const select = page.locator('select[name="category_select"]');
    // Wait, the wizard might be different. 
    // Let's look for "Tipo de Serviço".

    // If it's the Wizard:
    await expect(page.locator('text=Detalhes do Serviço')).toBeVisible();

    // Check if our service is in the options (it might be in a select or a list of radio buttons/cards)
    // Looking at `ServiceRequestWizard.tsx` (or similar logic in App.tsx), it usually iterates over `catalog`.

    // If it's a select:
    const options = await page.locator('select option').allInnerTexts();
    const found = options.some(opt => opt.includes(uniqueServiceName));

    // Or maybe it's a list of cards in the wizard step 2?
    // Let's assumet it's a select or list. 
    // We will check for the text visibility in the modal.
    await expect(page.locator(`text=${uniqueServiceName}`)).toBeVisible();

});
