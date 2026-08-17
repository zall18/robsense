import { render, screen } from '@testing-library/react';
import { PrimaryButton } from '@/app/components/PrimaryButton';
import React from 'react';

describe('PrimaryButton Component', () => {
  it('renders the button with children', () => {
    render(<PrimaryButton>Klik Saya</PrimaryButton>);
    const buttonElement = screen.getByText(/Klik Saya/i);
    expect(buttonElement).toBeInTheDocument();
  });
});
