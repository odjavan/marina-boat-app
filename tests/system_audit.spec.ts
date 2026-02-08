import { test, expect } from '@playwright/test';
import fs from 'fs';

test.describe('System Audit: Full Lifecycle Verification', () => {

    test('Full Cycle: Client -> Boat -> Service -> Catalog -> Profile', async ({ page }) => {
        try {
            // Increase timeout for the whole test
            test.setTimeout(120000);

            // --- 1. SETUP ---
            const uniqueId = Date.now();
            const clientName = `Audit Client ${uniqueId}`;
            const boatName = `Audit Boat ${uniqueId}`;
            const serviceName = `Audit Service ${uniqueId}`;
            const catalogItemName = `Catalog Item ${uniqueId}`;

            console.log('--- STARTING SYSTEM AUDIT ---');

            // Login as Admin (Manual Login)
            console.log('1. Login...');
            await page.goto('/');
            await page.getByPlaceholder('seu@email.com').fill('admin@marina.com');
            await page.getByPlaceholder('••••••••').fill('admin123');
            await page.getByRole('button', { name: 'Entrar' }).click();
            await expect(page.getByText('Painel da Marina')).toBeVisible({ timeout: 10000 });

            // --- 2. CLIENT MANAGEMENT (CRUD) ---
            console.log('2. Testing Client CRUD...');
            await page.getByRole('button', { name: 'Clientes' }).click();

            // Create
            console.log('   Creating Client...');
            await page.getByRole('button', { name: 'Novo Cliente' }).click();
            await page.locator('input[name="name"]').fill(clientName);
            await page.locator('input[name="email"]').fill(`client${uniqueId}@audit.com`);
            await page.locator('input[name="phone"]').fill('11999999999');
            await page.locator('input[name="cpf"]').fill('12345678900');
            await page.locator('input[name="password"]').fill('123456');
            await page.getByRole('button', { name: 'Cadastrar Cliente' }).click();

            // Verify in List (Wait up to 10s)
            console.log('   Verifying Client in List...');
            await expect(page.getByText(clientName)).toBeVisible({ timeout: 10000 });

            // Edit
            console.log('   Editing Client...');
            await page.locator('tr', { hasText: clientName }).getByTitle('Editar').click();
            await page.locator('input[name="name"]').fill(`${clientName} EDITED`);
            await page.getByRole('button', { name: 'Salvar Alterações' }).click();
            await expect(page.getByText(`${clientName} EDITED`)).toBeVisible({ timeout: 10000 });

            // --- 3. VESSEL MANAGEMENT (CRUD) ---
            console.log('3. Testing Vessel CRUD...');
            await page.getByRole('button', { name: 'Minha Frota' }).or(page.getByRole('button', { name: 'Embarcações' })).click();

            // Create
            console.log('   Creating Vessel...');
            await page.getByRole('button', { name: 'Nova Embarcação' }).click();
            await page.locator('input[name="name"]').fill(boatName);
            await page.locator('select[name="type"]').selectOption('Lancha');
            await page.locator('input[name="year"]').fill('2024');
            await page.locator('input[name="model"]').fill('Audit Model');
            await page.locator('input[name="length"]').fill('40');
            await page.locator('input[name="registration_number"]').fill(`REG-${uniqueId}`);

            // Owner selection
            const ownerSelect = page.locator('select[name="owner_email"]');
            if (await ownerSelect.isVisible()) {
                await ownerSelect.selectOption({ index: 1 });
            }

            await page.getByRole('button', { name: /Salvar/i }).click();

            // Verify in List
            console.log('   Verifying Vessel in List...');
            await expect(page.getByText(boatName)).toBeVisible({ timeout: 10000 });

            // Edit
            console.log('   Editing Vessel...');
            await page.locator('tr', { hasText: boatName }).getByTitle('Editar').click();
            await page.locator('input[name="name"]').fill(`${boatName} EDITED`);
            await page.getByRole('button', { name: /Salvar/i }).click();
            await expect(page.getByText(`${boatName} EDITED`)).toBeVisible({ timeout: 10000 });

            // --- 4. CATALOG MANAGEMENT (CRUD) ---
            console.log('4. Testing Catalog CRUD...');
            await page.getByRole('button', { name: 'Todas Solicitações' }).click();

            // Create
            console.log('   Creating Service in Catalog...');
            await page.getByRole('button', { name: 'Novo Serviço' }).click();
            await page.locator('input[placeholder="Ex: Polimento Completo"]').fill(catalogItemName);
            await page.locator('select').selectOption({ index: 1 });
            await page.locator('input[placeholder="O que será feito..."]').fill('Audit Description');
            await page.locator('input[placeholder="Ex: 2 horas"]').fill('1h');
            await page.getByRole('button', { name: 'Criar Serviço' }).click();

            // Edit 
            console.log('   Editing Service in Catalog...');
            await expect(page.getByText(catalogItemName)).toBeVisible();

            const catalogGrid = page.locator('.grid');
            const catalogCard = catalogGrid.locator('.rounded-lg', { hasText: catalogItemName });

            // Wait for edit button (ensure it's interactive)
            const editBtn = catalogCard.locator('button').first();
            await editBtn.waitFor({ state: 'visible' });
            await editBtn.click();

            await expect(page.getByRole('heading', { name: 'Editar Serviço' })).toBeVisible();
            await page.locator('input[value="' + catalogItemName + '"]').first().fill(`${catalogItemName} EDITED`);
            await page.getByRole('button', { name: 'Salvar Alterações' }).click();

            await expect(page.getByText(`${catalogItemName} EDITED`)).toBeVisible({ timeout: 10000 });

            // --- 5. SERVICE REQUEST FLOW ---
            console.log('5. Testing Service Request Flow...');

            // Create Request (Admin for Client)
            await page.getByRole('button', { name: 'Solicitação Personalizada' }).click();

            // Step 1: Vessel
            console.log('   Wizard Step 1...');
            await page.getByText(`${boatName} EDITED`).first().click();
            await page.getByRole('button', { name: /Próximo/i }).click();

            // Step 2: Service
            console.log('   Wizard Step 2...');
            await page.locator('select').selectOption({ index: 1 });
            await page.fill('textarea', serviceName);
            await page.getByRole('button', { name: /Próximo/i }).click();

            // Step 3: Date
            console.log('   Wizard Step 3...');
            await page.getByRole('button', { name: /Próximo/i }).click();

            // Step 4: Confirm
            console.log('   Wizard Step 4...');
            await page.getByRole('button', { name: /Confirmar/i }).click();

            // Status Update
            console.log('   Updating Request Status...');
            const requestCard = page.locator('.space-y-4').getByText(serviceName);
            await requestCard.click();
            await page.getByRole('button', { name: 'Aceitar / Analisar' }).click();
            await expect(page.getByText('Em Análise')).toBeVisible({ timeout: 10000 });

            // --- 6. CLEANUP (Delete) ---
            console.log('6. Cleanup...');

            // Close detail modal if open
            const backButton = page.locator('button').filter({ has: page.locator('.lucide-chevron-left') });
            if (await backButton.isVisible()) {
                await backButton.click();
            }

            // Delete Service Request
            console.log('   Deleting Service Request...');
            const serviceRow = page.locator('div').filter({ hasText: serviceName }).last();
            // Use more general delete button finder to avoid flaky locator
            const deleteReqBtn = serviceRow.locator('button').filter({ has: page.locator('.lucide-trash-2') });
            if (await deleteReqBtn.count() > 0) {
                await deleteReqBtn.click();
                await expect(page.getByText('Confirmar Exclusão')).toBeVisible();
                await page.getByRole('button', { name: 'Excluir Serviço' }).click();
                await expect(serviceRow).not.toBeVisible();
            }

            // Clean up Catalog
            console.log('   Deleting Catalog Item...');
            await page.getByRole('button', { name: 'Todas Solicitações' }).click();
            const catalogItem = page.locator('.grid').filter({ hasText: `${catalogItemName} EDITED` }).first();
            await catalogItem.locator('button').filter({ has: page.locator('.lucide-trash-2') }).click();

            // Catalog deletion might not have confirmation or might be fast. 
            // Check if confirmation modal appears.
            if (await page.getByText('Confirmar Exclusão').isVisible({ timeout: 2000 })) {
                await page.getByRole('button', { name: 'Excluir Serviço' }).click();
            }
            await expect(page.getByText(`${catalogItemName} EDITED`)).not.toBeVisible();

            // Clean up Vessel
            console.log('   Deleting Vessel...');
            await page.getByRole('button', { name: 'Minha Frota' }).or(page.getByRole('button', { name: 'Embarcações' })).click();
            const vesselRow = page.locator('tr', { hasText: `${boatName} EDITED` });
            await vesselRow.getByTitle('Excluir').click();
            await expect(page.getByText('Confirmar Exclusão')).toBeVisible();
            await page.getByRole('button', { name: /Excluir/ }).click();
            await expect(page.getByText(`${boatName} EDITED`)).not.toBeVisible();

            // Clean up Client
            console.log('   Deleting Client...');
            await page.getByRole('button', { name: 'Clientes' }).click();
            const clientRow = page.locator('tr', { hasText: `${clientName} EDITED` });
            await clientRow.getByTitle('Excluir').click();
            await expect(page.getByText('Confirmar Exclusão')).toBeVisible();
            await page.getByRole('button', { name: /Excluir/ }).click();
            await expect(page.getByText(`${clientName} EDITED`)).not.toBeVisible();

            console.log('--- SYSTEM AUDIT COMPLETE: ALL CHECKS PASSED ---');
        } catch (error) {
            console.error('TEST FAILED AT STEP:', error.message);
            fs.writeFileSync('error_report.txt', error.stack || error.message);
            throw error;
        }
    });
});
