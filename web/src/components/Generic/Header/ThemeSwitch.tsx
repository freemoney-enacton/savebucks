import React from 'react';
import { useTheme } from 'next-themes';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';

export default function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  const onChange = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <button className="max-sm:hidden flex items-center justify-center p-2" onClick={onChange}>
      {isDark ? <SunIcon className="w-5 h-5 text-white stroke-2" /> : <MoonIcon className="w-5 h-5 text-white stroke-2" />}
    </button>
  );
}
