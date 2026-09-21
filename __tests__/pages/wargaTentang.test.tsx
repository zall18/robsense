import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import WargaTentangPage from '../../app/warga/tentang/page';

describe('WargaTentangPage', () => {
  it('renders Header and Cards correctly', () => {
    render(<WargaTentangPage />);
    expect(screen.getByText('Tentang RobSense')).toBeInTheDocument();
    expect(screen.getByText('ROBSENSE: Dari Akar Masalah Air Tanah ke Kota Rendah Risiko')).toBeInTheDocument();
    expect(screen.getByText('Panduan Cepat')).toBeInTheDocument();
    expect(screen.getByText('Penting untuk Diketahui')).toBeInTheDocument();
  });

  it('toggles FAQ accordion correctly', () => {
    render(<WargaTentangPage />);
    
    const faq1Button = screen.getByText('Bagaimana RobSense menentukan zona risiko?');
    const faq2Button = screen.getByText('Apakah aplikasi ini gratis digunakan?');
    
    // Initially closed
    expect(screen.queryByText(/Sistem menggunakan algoritma/i)).not.toBeInTheDocument();
    
    // Click FAQ 1
    fireEvent.click(faq1Button);
    expect(screen.getByText(/Sistem menggunakan algoritma/i)).toBeInTheDocument();
    
    // Click FAQ 2
    fireEvent.click(faq2Button);
    expect(screen.queryByText(/Sistem menggunakan algoritma/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Ya, RobSense sepenuhnya gratis/i)).toBeInTheDocument();
  });

  it('renders user registered profile when available in localStorage', () => {
    localStorage.setItem('userKecamatan', 'Genuk');
    localStorage.setItem('userAirType', 'Air Tanah');

    render(<WargaTentangPage />);
    expect(screen.getByText('Profil Wilayah Anda')).toBeInTheDocument();
    expect(screen.getByText(/Anda berada di Kecamatan/i)).toBeInTheDocument();
    expect(screen.getByText('Genuk')).toBeInTheDocument();
    expect(screen.getByText('Air Tanah')).toBeInTheDocument();

    localStorage.clear();
  });
});
