// ABOUTME: End-to-end tests for AI player behavior
// ABOUTME: Verifies AI makes reasonable moves
import { test, expect } from '@playwright/test'

test.describe('AI Behavior', () => {
  test('AI should make valid moves', async ({ page }) => {
    await page.goto('/')

    // Player makes a move
    await page.locator('button[aria-label="empty cell"]').first().click()

    // Wait for AI
    await page.waitForTimeout(500)

    // Check that there's one O
    const oCount = await page.locator('button[aria-label="O"]').count()
    expect(oCount).toBe(1)

    // Verify X is still there
    const xCount = await page.locator('button[aria-label="X"]').count()
    expect(xCount).toBe(1)
  })

  test('AI should not move on occupied cells', async ({ page }) => {
    await page.goto('/')

    // Make 3 moves
    for (let i = 0; i < 3; i++) {
      const emptyCell = page.locator('button[aria-label="empty cell"]').first()
      if (await emptyCell.count() > 0) {
        await emptyCell.click()
        await page.waitForTimeout(400)
      }
    }

    // Verify each cell has either X, O, or is empty (no overlaps)
    const allCells = await page.locator('button[aria-label]').all()
    for (const cell of allCells) {
      const label = await cell.getAttribute('aria-label')
      expect(['X', 'O', 'empty cell']).toContain(label)
    }
  })

  test('AI should respond within reasonable time', async ({ page }) => {
    await page.goto('/')

    const startTime = Date.now()
    await page.locator('button[aria-label="empty cell"]').first().click()

    // Wait for AI move (O should appear)
    await page.locator('button[aria-label="O"]').first().waitFor({ timeout: 1000 })

    const endTime = Date.now()
    const duration = endTime - startTime

    // AI should move within 1 second
    expect(duration).toBeLessThan(1000)
  })
})
