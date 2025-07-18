import React from 'react';

export default function Checkbox({ label, id, customClass, ...rest }: any) {
  return (
    <div className="flex items-center gap-2.5">
      {/* Hidden default checkbox */}
      <input type="checkbox" id={id} className="sr-only" {...rest} />

      {/* Custom checkbox container */}
      <label htmlFor={id} className={`relative flex items-center cursor-pointer ${customClass ? customClass : ''}`}>
        <div
          className={`shrink-0 size-4 sm:size-5 bg-black border rounded flex items-center justify-center transition-ease ${
            rest.checked ? 'bg-primary border-primary' : 'bg-transparent border-white'
          }`}
        >
          <svg
            className={`size-3 sm:size-3.5 text-black transition-ease ${rest.checked ? 'opacity-100' : 'opacity-0'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Label text */}
        <span className="ml-2 text-xs sm:text-sm font-medium">{label}</span>
      </label>
    </div>
  );
}
