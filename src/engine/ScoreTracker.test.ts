// ABOUTME: Unit tests for ScoreTracker class
// ABOUTME: Tests score recording and statistics tracking
import { describe, it, expect, beforeEach } from 'vitest'
import { ScoreTracker } from './ScoreTracker'

describe('ScoreTracker', () => {
  let tracker: ScoreTracker

  beforeEach(() => {
    tracker = new ScoreTracker()
  })

  it('should initialize with zero scores', () => {
    const stats = tracker.getStats()
    expect(stats.playerWins).toBe(0)
    expect(stats.aiWins).toBe(0)
    expect(stats.draws).toBe(0)
  })

  it('should record player win', () => {
    tracker.recordResult('X')
    const stats = tracker.getStats()
    expect(stats.playerWins).toBe(1)
  })

  it('should record AI win', () => {
    tracker.recordResult('O')
    const stats = tracker.getStats()
    expect(stats.aiWins).toBe(1)
  })

  it('should record draw', () => {
    tracker.recordResult('Draw')
    const stats = tracker.getStats()
    expect(stats.draws).toBe(1)
  })

  it('should track multiple games', () => {
    tracker.recordResult('X')
    tracker.recordResult('O')
    tracker.recordResult('Draw')
    tracker.recordResult('X')

    const stats = tracker.getStats()
    expect(stats.playerWins).toBe(2)
    expect(stats.aiWins).toBe(1)
    expect(stats.draws).toBe(1)
  })

  it('should reset scores', () => {
    tracker.recordResult('X')
    tracker.recordResult('O')
    tracker.reset()

    const stats = tracker.getStats()
    expect(stats.playerWins).toBe(0)
    expect(stats.aiWins).toBe(0)
    expect(stats.draws).toBe(0)
  })
})
