import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ReviewCard from '../components/ReviewCard'

describe('ReviewCard', () => {
  it('renders the review body text', () => {
    render(
      <ReviewCard
        rating={4}
        body="Great building overall."
        date="2026-04-02"
        author="James"
      />
    )
    expect(screen.getByText('Great building overall.')).toBeInTheDocument()
  })

  it('renders the correct number of filled stars', () => {
    render(
      <ReviewCard rating={3} body="OK place." date="2026-01-01" author="Alex" />
    )
    const filledStars = screen.getAllByText('★')
    expect(filledStars.length).toBe(3)
  })

  it('renders the correct number of empty stars', () => {
    render(
      <ReviewCard rating={3} body="OK place." date="2026-01-01" author="Alex" />
    )
    const emptyStars = screen.getAllByText('☆')
    expect(emptyStars.length).toBe(2)
  })

  it('renders the author name', () => {
    render(
      <ReviewCard rating={5} body="Amazing!" date="2026-03-01" author="Taylor" />
    )
    expect(screen.getByText('Taylor')).toBeInTheDocument()
  })

  it('renders the date', () => {
    render(
      <ReviewCard rating={5} body="Amazing!" date="2026-03-01" author="Taylor" />
    )
    expect(screen.getByText('2026-03-01')).toBeInTheDocument()
  })

  it('does not render action buttons when no handlers are passed', () => {
    render(
      <ReviewCard rating={4} body="Good." date="2026-01-01" author="Sam" />
    )
    expect(screen.queryByText('Delete')).not.toBeInTheDocument()
    expect(screen.queryByText('Edit')).not.toBeInTheDocument()
  })

  it('renders Delete button when onDelete is passed', () => {
    render(
      <ReviewCard
        rating={4}
        body="Good."
        date="2026-01-01"
        author="Sam"
        onDelete={() => {}}
      />
    )
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })
})
