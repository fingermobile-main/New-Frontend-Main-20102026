import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should register a new member', async ({ page }: {
page: any }) => {
    await page.goto('/auth/register');

    await page.getByLabel('Username').fill('testuser');
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', {
      name: 'Register' }).click();

    await expect(page).toHaveURL(/\/$/);
  });

  test('should login existing member', async ({ page }: {
page: any }) => {
    await page.goto('/auth/login');

    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', {
      name: 'Login' }).click();

    await expect(page).toHaveURL(/\/$/);
  });

  test('should logout member', async ({ page }: {
page: any }) => {
    await page.goto('/');

    await page.getByRole('button', {
      name: 'Logout' }).click();

    await expect(page).toHaveURL(/\/$/);
  });
});
