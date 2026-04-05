"use client";

import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";

type InputProps = {
  name?: string;
  type?: string;
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  secured?: boolean;
  className?: string;
};

const Input = ({
  name,
  type,
  label,
  placeholder,
  value,
  onChange,
  secured,
  className,
}: InputProps) => {
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <div className="flex flex-col gap-2 w-full">
      <label htmlFor={name} className="text-sm text-[#6B7280]">
        {label}
      </label>

      <div className="w-full relative">
        <input
          name={name}
          type={visible ? "text" : type}
          id={name}
          placeholder={placeholder}
          aria-label={label}
          autoComplete="off"
          value={value}
          onChange={onChange}
          className={`w-full text-base border border-gray-300 rounded-xl px-4 py-3
        focus:outline-none focus:ring-2 focus:ring-[#2D36E0] focus:border-transparent
        placeholder:text-gray-400 transition-all duration-500 ease-in-out ${className}`}
        />
        {secured && (
          <span
            className="absolute right-0 top-1/2 -translate-1/2 cursor-pointer"
            onClick={() => setVisible(!visible)}
          >
            {visible ? <EyeClosed className="p-1" /> : <Eye className="p-1" />}
          </span>
        )}
      </div>
    </div>
  );
};

export default Input;
