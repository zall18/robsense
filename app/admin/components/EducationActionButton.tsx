'use client';

import React, { useState } from 'react';
import { Check } from 'lucide-react';

export default function EducationActionButton() {
  const [planned, setPlanned] = useState(false);

  if (planned) {
    return (
      <button 
        onClick={() => setPlanned(false)}
        className="flex items-center justify-center gap-1.5 text-sm font-medium text-white bg-[#2563EB] px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors"
      >
        <Check className="w-4 h-4" /> Direncanakan
      </button>
    );
  }

  return (
    <button 
      onClick={() => setPlanned(true)}
      className="text-sm font-medium text-[#2563EB] bg-transparent hover:text-blue-700 px-3 py-1.5 rounded-md transition-colors"
    >
      Rencanakan
    </button>
  );
}
