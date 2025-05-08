import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Spinner from './Spinner'

describe('Spinner component', () => {
  test('does not render when on prop is false', () => {
    const { container } = render(<Spinner on={false} />)
    expect(container.firstChild).toBeNull()
  })

  test('renders spinner with correct text when on prop is true', () => {
    render(<Spinner on={true} />)
    const spinner = screen.getByTestId('spinner')
    expect(spinner).toBeInTheDocument()
    expect(spinner).toHaveTextContent('Please wait...')
  })
})
