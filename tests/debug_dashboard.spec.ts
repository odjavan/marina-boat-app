import { test, expect } from '@playwright/test';

test('Debug Dashboard HTML', async ({ page }) => {
    // Set viewport big
    await page.setViewportSize({ width: 1920, height: 1080 });

    await page.goto('http://localhost:3000');

    if (await page.getByTitle('Sair').isVisible()) {
        await page.getByTitle('Sair').click();
    }

    await expect(page.getByText('Área de Testes')).toBeVisible({ timeout: 10000 });
    await page.getByText('Administrador').click();

    await expect(page.getByText('Painel da Marina')).toBeVisible({ timeout: 10000 });

    // Dump HTML
    const content = await page.content();
    console.log('--- HTML DUMP START ---');
    console.log(content);
    console.log('--- HTML DUMP END ---');
});
