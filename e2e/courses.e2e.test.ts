import { test, expect } from '@playwright/test';

test.describe('Course Management', () => {
  test.beforeEach(async ({ page }: {
page: any }) => {
    await page.goto('/courses');
  });

  test('should create a new course', async ({ page }: {
page: any }) => {
    await page.getByRole('button', {
      name: 'Create Course' }).click();

    await page.getByLabel('Course Title').fill('Test Course');
    await page.getByLabel('Description').fill('This is a test course');
    await page.getByRole('button', {
      name: 'Save Course' }).click();

    await expect(page.getByText('Test Course')).toBeVisible();
  });

  test('should edit an existing course', async ({ page }: {
page: any }) => {
    await page.getByRole('link', {
      name: 'Edit Course' }).click();

    await page.getByLabel('Course Title').fill('Updated Test Course');
    await page.getByRole('button', {
      name: 'Save Changes' }).click();

    await expect(page.getByText('Updated Test Course')).toBeVisible();
  });

  test('should delete a course', async ({ page }: {
page: any }) => {
    await page.getByRole('button', {
      name: 'Delete Course' }).click();

    await expect(page.getByText('Are you sure?')).toBeVisible();
    await page.getByRole('button', {
      name: 'Confirm' }).click();

    await expect(page.getByText('Course deleted successfully')).toBeVisible();
  });
});
