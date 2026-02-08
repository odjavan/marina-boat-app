import { test, expect } from '@playwright/test';
import path from 'path';

test('Full System Flow: Login -> Create Client -> Create Boat -> Create Service', async ({ page }) => {
    // 1. Initial Setup
    const uniqueId = Date.now().toString();
    const clientName = `Autotest Client ${uniqueId}`;
    const clientEmail = `autotest_${uniqueId}@marina.com`;
    const boatName = `Boat ${uniqueId}`;

    // 2. Login as Admin
    const url = 'http://localhost:3000';
    console.log(`Connecting to ${url}...`);
    await page.goto(url, { timeout: 15000, waitUntil: 'domcontentloaded' });
    const title = await page.title();
    console.log(`Connected. Title: ${title}`);



    // Login Flow
    // The button contains "Administrador" and credentials, not "Entrar como Administrador"
    console.log('Tentando clicar no botão de Login...');
    await page.locator('button').filter({ hasText: 'Administrador' }).first().click();

    // Assert Dashboard
    await expect(page.getByText('Painel da Marina')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Bem-vindo, Administrador')).toBeVisible();

    // 3. Create Client
    console.log('Creating Client:', clientName);
    await page.getByRole('button', { name: 'Clientes' }).click();
    await page.getByRole('button', { name: 'Novo Cliente' }).click();

    await page.fill('input[name="name"]', clientName);
    await page.fill('input[name="email"]', clientEmail);
    await page.fill('input[name="phone"]', '11999999999');
    await page.fill('input[name="cpf"]', '12345678900');
    await page.fill('input[name="password"]', 'user123'); // Password was missing

    await page.getByRole('button', { name: /Cadastrar Cliente/i }).click(); // Correct Button Text

    // Verify Success
    await expect(page.getByText('Cliente cadastrado com sucesso')).toBeVisible();

    // 4. Create Boat (Testing Schema: photos, type)
    console.log('Creating Boat:', boatName);
    await page.getByRole('button', { name: 'Minha Frota' }).or(page.getByRole('button', { name: 'Embarcações' })).click();
    await page.getByRole('button', { name: /Nova Embarcação/i }).click();

    // Select Owner (Admin specific field)
    // Wait for modal (Use Heading to avoid ambiguity with the button itself)
    await expect(page.getByRole('heading', { name: 'Nova Embarcação' })).toBeVisible();

    // Select user if dropdown exists (Admin flow)
    const ownerSelect = page.locator('select[name="owner_email"]');
    if (await ownerSelect.isVisible()) {
        try {
            // Select the first available client (Index 1, as 0 is disabled label)
            await ownerSelect.selectOption({ index: 1 });
        } catch (e) {
            console.log('Could not select owner:', e.message);
        }
    }

    await page.fill('input[name="name"]', boatName);
    await page.selectOption('select[name="type"]', 'Lancha'); // Critical Schema Check ('type')
    await page.fill('input[name="year"]', '2024');
    await page.fill('input[name="model"]', 'Test Model');
    await page.fill('input[name="model"]', 'Test Model');
    await page.fill('input[name="length"]', '30');
    // Schema Fix: Capacity/Price are now hidden/defaulted
    // await page.fill('input[name="capacity"]', '12');
    // await page.fill('input[name="price"]', '1500');
    await page.fill('input[name="registration_number"]', `REG-${uniqueId}`);

    // Upload Photo (Critical Schema Check 'photos')
    const fileInput = page.locator('input[type="file"][accept="image/*"]');
    const imagePath = path.resolve(process.cwd(), 'tests', 'test_image.jpg');
    console.log('Uploading from:', imagePath);
    await fileInput.setInputFiles(imagePath);

    // Scoped to modal or use stricter text
    await page.getByRole('button', { name: /Salvar/i }).click();

    // Verify Success
    // Verify Success or Capture Error
    try {
        await expect(page.getByText('Embarcação salva com sucesso')).toBeVisible({ timeout: 5000 });
    } catch (e) {
        // If success not found, check for error message
        const errorToast = page.locator('text=/Erro ao salvar/i');
        if (await errorToast.isVisible()) {
            const errorText = await errorToast.textContent();
            console.log('❌ Backend Error:', errorText);
            throw new Error(`Migration Failed: ${errorText}`);
        }
        throw e; // Re-throw original timeout if no error toast either
    }

    // 5. Create Service Request
    console.log('Creating Service for:', boatName);
    await page.getByRole('button', { name: 'Todas Solicitações' }).or(page.getByRole('button', { name: 'Serviços' })).click();
    await page.getByRole('button', { name: 'Novo Serviço' }).click();

    // Select Boat
    // WIZARD STEP 1: Select Vessel
    // Click on the card that contains the boat name
    await page.getByText(boatName).first().click();
    await page.getByRole('button', { name: /Próximo/i }).click();

    // WIZARD STEP 2: Service Details
    await page.locator('select').selectOption({ index: 1 });
    await page.fill('textarea', 'Serviço solicitado via teste automatizado.');
    await page.getByRole('button', { name: /Próximo/i }).click();

    // WIZARD STEP 3: Date & Urgency
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    await page.fill('input[type="date"]', dateStr);
    await page.getByText('Normal').click();
    await page.getByRole('button', { name: /Próximo/i }).click();

    // WIZARD STEP 4: Review & Confirm
    await page.getByRole('button', { name: /Confirmar Solicitação/i }).click();

    // Verify Success
    await expect(page.getByText('Solicitação criada com sucesso')).toBeVisible();

    // 6. Validar Edição (Admin Action)
    console.log('Validating Edit Action...');

    // Localizar a ação de editar na tabela/lista para o serviço recém-criado
    // Como acabou de ser criado, deve ser o último ou estar visível.
    // Vamos usar o aria-label="Editar"
    await page.getByRole('button', { name: 'Editar' }).last().click();

    // Verificar se modal abriu
    await expect(page.getByRole('heading', { name: 'Editar Serviço' })).toBeVisible();

    // Editar Descrição
    await page.fill('textarea[name="description"]', 'Serviço EDITADO via teste automatizado.');
    await page.getByRole('button', { name: 'Salvar Alterações' }).click();

    // Verificar Sucesso da Edição
    await expect(page.getByText('Serviço atualizado com sucesso')).toBeVisible();
    await expect(page.getByText('Serviço EDITADO via teste automatizado.')).toBeVisible();

    // 7. Validar Exclusão (Admin Action)
    console.log('Validating Delete Action...');

    // Clicar em Excluir (Lixeira) - Pode ser necessário esperar a notificação anterior sumir ou não
    await page.getByRole('button', { name: 'Excluir' }).last().click();

    // Agora temos um MODAL de confirmação, não mais window.confirm
    await expect(page.getByText('Confirmar Exclusão')).toBeVisible();
    await page.getByRole('button', { name: 'Excluir Serviço' }).click();

    // Verificar Sucesso da Exclusão
    await expect(page.getByText('Serviço excluído com sucesso')).toBeVisible();

    // Garantir que a descrição editada sumiu da tela
    await expect(page.getByText('Serviço EDITADO via teste automatizado.')).not.toBeVisible();

    console.log('FULL SUCCESS');
});
