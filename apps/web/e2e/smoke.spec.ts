import { test, expect } from '@playwright/test';

test.describe('Amharic Phonetic Keyboard Web App Smoke Test', () => {
  test('types "selam" and live transliterates to "ሰላም"', async ({ page }) => {
    await page.goto('/');

    // Locate the main editor textarea
    const textarea = page.locator('.editor-textarea');
    await expect(textarea).toBeVisible();

    // Click and type "selam" sequentially
    await textarea.click();
    await textarea.pressSequentially('selam');

    // Expect the transliterated Amharic text "ሰላም"
    await expect(textarea).toHaveValue('ሰላም');
  });

  test('clicking a reference chart cell inserts character into editor', async ({ page }) => {
    await page.goto('/');
    const textarea = page.locator('.editor-textarea');
    await expect(textarea).toBeVisible();

    // Clear any text first
    await textarea.fill('');

    // Click a chart cell with "ሀ"
    const cellBtn = page.locator('.cell-button:has-text("ሀ")').first();
    await expect(cellBtn).toBeVisible();
    await cellBtn.click();

    await expect(textarea).toHaveValue('ሀ');
  });
});
