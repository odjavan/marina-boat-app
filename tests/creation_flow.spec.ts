import { test, expect } from '@playwright/test';

test('Fluxo Completo de Cadastro: Cliente -> Embarcação -> Serviço', async ({ page }) => {
    // Dados do Teste
    const testData = {
        client: {
            name: 'Cliente Teste Auto',
            email: `teste.auto.${Date.now()}@email.com`,
            phone: '(11) 99999-8888',
            cpf: '111.222.333-44',
            password: 'senha123'
        },
        vessel: {
            name: 'Lancha Teste 2024',
            type: 'Lancha',
            brand: 'Focker',
            model: '240',
            year: '2024',
            length: '24',
            registration: 'BR-TEST-AUTO'
        },
        service: {
            name: 'Polimento Expresso',
            category: 'Limpeza',
            description: 'Polimento rápido com cera líquida.',
            time: '2 horas',
            icon: 'Droplets'
        }
    };

    console.log('--- DADOS UTILIZADOS NO TESTE ---');
    console.log('Cliente:', testData.client);
    console.log('Embarcação:', testData.vessel);
    console.log('Serviço:', testData.service);
    console.log('---------------------------------');

    // 0. Monitoramento de Erros
    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));

    // Configurar Viewport Grande
    await page.setViewportSize({ width: 1920, height: 1080 });

    // 1. Login e Preparação
    await page.goto('http://localhost:3000');

    // Efetuar logout se já estiver logado (limpar estado)
    if (await page.getByTitle('Sair').isVisible()) {
        await page.getByTitle('Sair').click();
    }

    // Aguardar tela de login
    await expect(page.getByText('Área de Testes')).toBeVisible({ timeout: 10000 });

    // Login como Admin
    await page.getByText('Administrador').click();

    // Validar que entrou como Admin (menu exclusivo)
    await expect(page.getByText('Painel da Marina')).toBeVisible({ timeout: 10000 });
    console.log('✅ Login efetuado com sucesso');

    // 2. Cadastro de Cliente
    // Usar Role Button para evitar confusão com textos soltos
    await page.getByRole('button', { name: 'Clientes' }).click();
    await page.getByRole('button', { name: 'Novo Cliente' }).click();
    await page.fill('input[name="name"]', testData.client.name);
    await page.fill('input[name="email"]', testData.client.email);
    await page.fill('input[name="phone"]', testData.client.phone);
    await page.fill('input[name="cpf"]', testData.client.cpf);
    await page.fill('input[name="password"]', testData.client.password);
    await page.getByRole('button', { name: 'Cadastrar Cliente' }).click();

    // Verificação Cliente
    await expect(page.getByText(testData.client.name)).toBeVisible();
    console.log('✅ Cliente cadastrado com sucesso');

    // 3. Cadastro de Embarcação
    await page.getByText('Todas Embarcações').click();
    await page.getByRole('button', { name: 'Nova Embarcação' }).click();

    // Selecionar dono (regras de negócio exigem dono no admin)
    await page.selectOption('select[name="owner_email"]', { label: `${testData.client.name} (${testData.client.email})` });

    await page.fill('input[name="name"]', testData.vessel.name);
    await page.selectOption('select[name="type"]', testData.vessel.type);
    await page.fill('input[name="model"]', `${testData.vessel.brand} ${testData.vessel.model}`);
    await page.fill('input[name="year"]', testData.vessel.year);
    await page.fill('input[name="length"]', testData.vessel.length);
    await page.fill('input[name="registration_number"]', testData.vessel.registration);

    await page.getByRole('button', { name: 'Salvar Embarcação' }).click();

    // Verificação Embarcação
    await expect(page.getByText(testData.vessel.name)).toBeVisible();
    console.log('✅ Embarcação cadastrada com sucesso');

    // 4. Cadastro de Serviço (Catálogo)
    await page.getByText('Todas Solicitações').click();

    await page.getByText('Novo Serviço').click();

    await page.fill('input[placeholder="Ex: Polimento Completo"]', testData.service.name);
    await page.selectOption('select', { label: testData.service.category }); // Simple select in Catalog
    await page.fill('input[placeholder="O que será feito..."]', testData.service.description);
    await page.fill('input[placeholder="Ex: 2 horas"]', testData.service.time);
    await page.fill('input[placeholder="Wrench, Anchor..."]', testData.service.icon);

    await page.getByRole('button', { name: 'Criar Serviço' }).click();

    // Verificação Serviço
    await expect(page.getByText(testData.service.name)).toBeVisible();
    console.log('✅ Serviço cadastrado no catálogo com sucesso');

});