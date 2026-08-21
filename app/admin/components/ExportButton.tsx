'use client';

import { Download } from 'lucide-react';
import React from 'react';

interface ExportButtonProps {
  data: any[];
  filename: string;
  label?: string;
  className?: string;
}

export default function ExportButton({ data, filename, label = 'Ekspor', className = '' }: ExportButtonProps) {
  const handleExport = () => {
    if (!data || data.length === 0) {
      alert("Tidak ada data untuk diekspor");
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const val = row[header];
          if (val === null || val === undefined) return '""';
          if (val instanceof Date) return `"${val.toISOString()}"`;
          if (typeof val === 'string') return `"${val.replace(/"/g, '""')}"`;
          return `"${val}"`;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const defaultClassName = "flex items-center gap-2 text-sm text-white font-medium bg-[#2563EB] px-4 py-2 rounded-[8px] shadow-sm hover:bg-blue-700 transition-colors h-[38px]";

  return (
    <button 
      onClick={handleExport}
      className={className || defaultClassName}
    >
      <Download className="w-4 h-4" /> {label}
    </button>
  );
}
