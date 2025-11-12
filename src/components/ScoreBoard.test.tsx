// ABOUTME: Tests for ScoreBoard component
// ABOUTME: Verifies score display and updates
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ScoreBoard } from './ScoreBoard'

describe('ScoreBoard', () => {
  it('should display player wins', () => {
    render(<ScoreBoard playerWins={3} aiWins={1} draws={0} />)
    expect(screen.getByText('PLAYER')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('should display AI wins', () => {
    render(<ScoreBoard playerWins={1} aiWins={2} draws={0} />)
    expect(screen.getByText('AI')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('should display draws', () => {
    render(<ScoreBoard playerWins={1} aiWins={1} draws={1} />)
    expect(screen.getByText('DRAWS')).toBeInTheDocument()
    expect(screen.getAllByText('1')).toHaveLength(3)
  })

  it('should display zero scores initially', () => {
    render(<ScoreBoard playerWins={0} aiWins={0} draws={0} />)
    expect(screen.getByText('PLAYER')).toBeInTheDocument()
    expect(screen.getByText('AI')).toBeInTheDocument()
    expect(screen.getAllByText('0')).toHaveLength(3)
  })
})
