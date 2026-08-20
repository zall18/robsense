import React from 'react';

type BadgeProps = {
  text: string;
  variant: 'bahaya' | 'siaga' | 'waspada' | 'aman' | string;
};

export default function Badge({ text, variant }: BadgeProps) {
  let colorClasses = '';

  switch (variant.toLowerCase()) {
    case 'bahaya':
    case 'tinggi':
      colorClasses = 'bg-red-100 text-red-600';
      break;
    case 'siaga':
    case 'sedang':
      colorClasses = 'bg-orange-100 text-orange-600';
      break;
    case 'waspada':
      colorClasses = 'bg-yellow-100 text-yellow-600';
      break;
    case 'aman':
    case 'rendah':
      colorClasses = 'bg-green-100 text-green-600';
      break;
    default:
      colorClasses = 'bg-gray-100 text-gray-600';
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide ${colorClasses}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {text.toUpperCase()}
    </span>
  );
}
