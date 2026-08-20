import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WargaLaporPage from '../../app/warga/lapor/page';
import { submitLaporan } from '../../app/actions/warga';

jest.mock('../../app/actions/warga', () => ({
  submitLaporan: jest.fn()
}));

describe('WargaLaporPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Lapor form initially', () => {
    render(<WargaLaporPage />);
    
    expect(screen.getByText('Lapor Gejala Kamu')).toBeInTheDocument();
    expect(screen.getByText('Kecamatan/Kelurahan')).toBeInTheDocument();
    expect(screen.getByText('Gejala')).toBeInTheDocument();
  });

  it('submits the form successfully and shows success message', async () => {
    (submitLaporan as jest.Mock).mockResolvedValue({
      success: true,
      id: 'mock-id'
    });

    render(<WargaLaporPage />);
    
    // Select Kecamatan
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'Semarang Utara' } });
    
    // Enter Gejala
    const textarea = screen.getByPlaceholderText('Sampaikan gejala mu !');
    fireEvent.change(textarea, { target: { value: 'Gatal-gatal parah' } });
    
    // Click Send
    const sendBtn = screen.getByText('Send');
    fireEvent.click(sendBtn);
    
    // Wait for success screen
    await waitFor(() => {
      expect(screen.getByText('Laporan Terkirim!')).toBeInTheDocument();
    });
    
    expect(submitLaporan).toHaveBeenCalledWith('Semarang Utara', 'Gatal-gatal parah');
  });
});
