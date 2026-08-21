'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react';

interface SelectFilterProps {
  paramName: string;
  options: { label: string; value: string }[];
  defaultValue?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
}

function SelectFilterInner({ 
  paramName, 
  options, 
  defaultValue, 
  placeholder, 
  icon,
  className = ''
}: SelectFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const currentValue = searchParams.get(paramName) || defaultValue || '';

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set(paramName, value);
    } else {
      params.delete(paramName);
    }
    
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      {icon && (
        <div className="absolute left-3 pointer-events-none text-gray-500 z-10 flex items-center">
          {icon}
        </div>
      )}
      <select
        value={currentValue}
        onChange={handleChange}
        className={`appearance-none bg-white border border-[var(--color-border-base)] rounded-[8px] text-sm text-[var(--color-text-primary)] hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563EB] shadow-sm w-full font-medium cursor-pointer relative z-0
          ${icon ? 'pl-9 pr-8 py-2' : 'pl-4 pr-8 py-2'}
        `}
      >
        {placeholder && (
          <option value="">{placeholder}</option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute right-3 flex items-center text-gray-500 z-10">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
        </svg>
      </div>
    </div>
  );
}

export default function SelectFilter(props: SelectFilterProps) {
  return (
    <Suspense fallback={
      <div className={`relative flex items-center ${props.className || ''}`}>
        {props.icon && (
          <div className="absolute left-3 pointer-events-none text-gray-500 z-10 flex items-center">
            {props.icon}
          </div>
        )}
        <select disabled className={`appearance-none bg-gray-100 border border-[var(--color-border-base)] rounded-[8px] text-sm text-[var(--color-text-primary)] w-full font-medium ${props.icon ? 'pl-9 pr-8 py-2' : 'pl-4 pr-8 py-2'}`}>
          <option>Memuat...</option>
        </select>
      </div>
    }>
      <SelectFilterInner {...props} />
    </Suspense>
  );
}
