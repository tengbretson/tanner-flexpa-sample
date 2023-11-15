import { test, expect } from '@playwright/test';

test('it should show the main heading', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Connect' }).click();
  await expect(
    page.getByRole('heading', { name: "Tanner's Health Data Emporium" }),
  ).toBeVisible();
});

test('it should launch the Flexpa Link iframe', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Connect' }).click();
  await expect(
    page
      .frameLocator('iframe[title="Flexpa Link"]')
      .getByRole('heading', { name: 'Select a health plan' }),
  ).toBeVisible();
});

test('it should be able to select an insurance provider', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Connect' }).click();
  await page
    .frameLocator('iframe[title="Flexpa Link"]')
    .getByRole('heading', { name: 'Select a health plan' })
    .click();
  await page
    .frameLocator('iframe[title="Flexpa Link"]')
    .getByRole('button', { name: 'Aetna' })
    .click();
  await expect(
    page
      .frameLocator('iframe[title="Flexpa Link"]')
      .getByLabel(/I agree to the Terms/),
  ).toBeVisible();
});
