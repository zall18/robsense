import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WargaOnboardingPage from '@/app/warga/onboarding/page';
import { getRiskData } from '../../app/actions/warga';

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
    };
  },
}));

jest.mock('../../app/actions/warga', () => ({
  getRiskData: jest.fn(),
  saveOnboardingResult: jest.fn().mockResolvedValue({ success: true }),
}));

describe('WargaOnboardingPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Step 1 initially and moves to Step 2 after selecting air type', () => {
    render(<WargaOnboardingPage />);
    
    // Check Step 1 text
    expect(screen.getByText('Kamu pakai fasilitas air jenis apa?')).toBeInTheDocument();
    
    // Find PDAM button and click it
    const pdamBtn = screen.getByText('PDAM');
    fireEvent.click(pdamBtn);
    
    // Click Next
    const nextBtn = screen.getByText('Next');
    fireEvent.click(nextBtn);
    
    // Check Step 2 text
    expect(screen.getByText('Kamu ada di kecamatan mana?')).toBeInTheDocument();
  });

  it('fetches risk data and shows result in Step 3', async () => {
    // Mock the getRiskData response
    (getRiskData as jest.Mock).mockResolvedValue({
      percentage: 75,
      tingkatRisiko: 'Tinggi',
      found: true
    });

    render(<WargaOnboardingPage />);
    
    // Step 1
    fireEvent.click(screen.getByText('Air Tanah'));
    fireEvent.click(screen.getByText('Next'));
    
    // Step 2
    expect(screen.getByText('Kamu ada di kecamatan mana?')).toBeInTheDocument();
    
    // Select Kecamatan
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'Genuk' } });
    
    // Click Next on Step 2
    fireEvent.click(screen.getByText('Next'));
    
    // Wait for Step 3 to appear
    await waitFor(() => {
      expect(screen.getByText('Wilayah kamu sangat berisiko')).toBeInTheDocument();
    });
    
    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(getRiskData).toHaveBeenCalledWith('Genuk');
  });
});
