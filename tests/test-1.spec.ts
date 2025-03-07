import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:4200/');
  await page.getByRole('link', { name: 'Forms' }).click();
  await page.getByRole('link', { name: 'Form Layouts' }).click();
});

test('should fill and submit the form', async ({ page }) => {
  await page.goto('http://localhost:4200/pages/iot-dashboard');
  await page.getByRole('link', { name: 'Forms' }).click();
  await page.getByRole('link', { name: 'Form Layouts' }).click();
  const janeDoeTextbox = page.getByRole('textbox', { name: 'Jane Doe' });
  await janeDoeTextbox.click();
  await janeDoeTextbox.fill('Jane Doe');
  const formLocator = page.locator('form').filter({ hasText: 'Remember meSubmit' });
  await formLocator.getByPlaceholder('Email').click();
  await formLocator.getByPlaceholder('Email').fill('Janedoe@email.com');
  await formLocator.getByRole('button').click();
  await page.locator('form').filter({ hasText: 'Remember meSubmit' }).getByRole('button').click();
});

test('assertions', async ({ page }) => {
  const basicFormButton = page.locator('nb-card').filter({ hasText: "Basic form" }).locator('button');
  const value = 5 
  expect(value).toEqual(5);

  const text = await basicFormButton.textContent();
  expect(text).toContain('Submit');
  expect(text).toBe('Submit');
});