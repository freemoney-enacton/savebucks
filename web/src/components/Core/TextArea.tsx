import React from 'react';

const TextArea = ({
  type,
  placeholder,
  id,
  customClass,
  label,
  onChange,
  hint,
  icon,
  rows = 5,
  required: required = false,
  ...rest
}: any) => {
  return (
    <div>
      <textarea
        id={id}
        name={id}
        rows={rows}
        placeholder={placeholder}
        value={rest.value}
        onChange={onChange}
        onBlur={rest.onBlur}
        className="w-full h-full py-3 px-5 bbg-transparent !bg-input-gr rounded-lg border-0 placeholder:text-gray-700 placeholder:text-sm text-white focus:ring-0 focus:border-0 outline-none transition-ease"
      />
      {hint !== undefined && <span className="text-red text-xs">{hint}</span>}
    </div>
  );
};

export default TextArea;
