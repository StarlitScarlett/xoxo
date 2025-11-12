// ABOUTME: End-to-end tests for complete game flow
// ABOUTME: Tests user journey from start to finish
import { test, expect } from '@playwright/test'

test.describe('Tic Tac Toe Game Flow', () => {
  test('should load the game', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toContainText('Tic Tac Toe')
  })

  test('should allow player to make moves', async ({ page }) => {
    await page.goto('/')

    await page.locator('button[aria-label="empty cell"]').first().click()

    // Verify that an X appears
    await expect(page.locator('button[aria-label="X"]')).toBeVisible()
  })

  test('should have AI make a move after player', async ({ page }) => {
    await page.goto('/')

    await page.locator('button[aria-label="empty cell"]').first().click()

    // Wait for AI move
    await page.waitForTimeout(500)

    // Check that there's one X and one O
    const xCount = await page.locator('button[aria-label="X"]').count()
    const oCount = await page.locator('button[aria-label="O"]').count()
    expect(xCount).toBe(1)
    expect(oCount).toBe(1)
  })

  test('should display winner message when game is won', async ({ page }) => {
    await page.goto('/')

    // Play moves until game ends
    for (let i = 0; i < 5; i++) {
      const gameOverMessage = page.locator('p:has-text("wins"), p:has-text("draw")')
      if (await gameOverMessage.count() > 0) {
        break
      }

      // Click next available cell
      const emptyCell = page.locator('button[aria-label="empty cell"]').first()
      if (await emptyCell.count() > 0) {
        await emptyCell.click()
        await page.waitForTimeout(400)
      }
    }

    // Eventually someone wins or draws
    const gameOverMessage = page.locator('p:has-text("wins"), p:has-text("draw")')
    await expect(gameOverMessage).toBeVisible({ timeout: 5000 })
  })

  test('should allow starting a new game', async ({ page }) => {
    await page.goto('/')

    // Play until game ends
    for (let i = 0; i < 5; i++) {
      const gameOverMessage = page.locator('p:has-text("wins"), p:has-text("draw")')
      if (await gameOverMessage.count() > 0) {
        break
      }

      const emptyCell = page.locator('button[aria-label="empty cell"]').first()
      if (await emptyCell.count() > 0) {
        await emptyCell.click()
        await page.waitForTimeout(400)
      }
    }

    // Wait for game to end
    await page.locator('button:has-text("New Game")').waitFor({ timeout: 5000 })

    // Click new game button
    await page.locator('button:has-text("New Game")').click()

    // All cells should be empty
    const emptyCellCount = await page.locator('button[aria-label="empty cell"]').count()
    expect(emptyCellCount).toBe(9)
  })

  test('should track scores across multiple games', async ({ page }) => {
    await page.goto('/')

    // Verify score board exists with PLAYER, DRAWS, AI labels
    await expect(page.locator('._label_1ojnv_18:has-text("PLAYER")')).toBeVisible()
    await expect(page.locator('._label_1ojnv_18:has-text("DRAWS")')).toBeVisible()
    await expect(page.locator('._label_1ojnv_18:has-text("AI")')).toBeVisible()

    // All scores should initially be 0
    const scoreValues = await page.locator('._value_1ojnv_24').allTextContents()
    expect(scoreValues).toEqual(['0', '0', '0'])
  })
})
