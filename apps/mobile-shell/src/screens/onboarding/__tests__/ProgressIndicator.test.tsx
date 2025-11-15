import React from 'react';
import { render, screen } from '@testing-library/react-native';
import ProgressIndicator from '../components/ProgressIndicator';
import { tokens } from '@/design-system';

// Mock design system tokens based on the expected Light/DMG theme
jest.mock('@/design-system', () => ({
  tokens: {
    spacing: { 1: 4, 2: 8, 3: 16 },
    colors: {
      background: { primary: '#9BBC0F', elevated: '#8BAC0F' },
      text: { primary: '#0F380F', secondary: '#306230' },
      border: { default: '#306230' },
    },
    border: { width: { pixel: 1 } },
  },
}));

// Mock PixelText (require inside factory)
jest.mock('@/components/atoms', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    PixelText: jest.fn(({ children }) => React.createElement(Text, {}, children)),
  };
});

describe('ProgressIndicator', () => {
  const totalSteps = 3;

  it('renders the correct step text', () => {
    render(<ProgressIndicator currentStep={1} totalSteps={totalSteps} />);
    expect(screen.getByText('Step 1 of 3')).toBeTruthy();
  });

  it('renders the correct number of dots', () => {
    render(<ProgressIndicator currentStep={1} totalSteps={totalSteps} />);
    // Check using the accessibility labels assigned to the dots
    const dots = screen.getAllByLabelText(/Step \d (completed|pending)/);
    expect(dots.length).toBe(totalSteps);
  });

  it('styles active and inactive dots correctly (Step 1)', () => {
    render(<ProgressIndicator currentStep={1} totalSteps={totalSteps} />);

    const step1 = screen.getByLabelText('Step 1 completed');
    const step2 = screen.getByLabelText('Step 2 pending');

    // Active dot style (dark background)
    expect(step1.props.style).toEqual(expect.arrayContaining([
        expect.objectContaining({ backgroundColor: tokens.colors.text.primary })
    ]));

    // Inactive dot style (light background, border)
    expect(step2.props.style).toEqual(expect.arrayContaining([
        expect.objectContaining({
            backgroundColor: tokens.colors.background.elevated,
            borderWidth: 1,
            borderColor: tokens.colors.border.default
        })
    ]));
  });

  it('styles all dots as active for the final step (Step 3)', () => {
    render(<ProgressIndicator currentStep={3} totalSteps={totalSteps} />);

    const step3 = screen.getByLabelText('Step 3 completed');

    expect(step3.props.style).toEqual(expect.arrayContaining([
        expect.objectContaining({ backgroundColor: tokens.colors.text.primary })
    ]));
  });

  it('has the correct accessibility roles and values', () => {
    render(<ProgressIndicator currentStep={2} totalSteps={3} />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeTruthy();
    // Check ARIA attributes used in the component
    expect(progressBar.props['aria-valuemax']).toBe(3);
    expect(progressBar.props['aria-valuenow']).toBe(2);
  });
});
