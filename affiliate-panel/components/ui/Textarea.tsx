import { cn } from "@/lib/utils";
import React from "react";

const Textarea = ({
  id,
  placeholder = "Type your message here...",
  value,
  onChange,
  className,
  cols = 5,
  ...rest
}: {
  id: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  cols?: number;
  className?: string;
}) => {
  return (
    <div className="space-y-2">
      <textarea
        name={id}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={cn(
          "dark:bg-dark-900 min-h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800",
          className
        )}
        cols={cols}
        {...rest}
      ></textarea>
    </div>
  );
};

export default Textarea;
