import React, { useState } from 'react';
import { Input } from './ui/input';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: string;
  isPassword?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({ 
  label, 
  icon, 
  isPassword, 
  id,
  className = '', 
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = isPassword && !showPassword ? 'password' : props.type || 'text';

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label htmlFor={id} className="font-label-md text-label-md text-foreground block">
          {label}
        </label>
        {isPassword && (
          <a href="#" className="font-label-sm text-label-sm text-primary hover:underline transition-all">
            Forgot Password?
          </a>
        )}
      </div>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
          <span className="material-symbols-outlined text-[20px]">{icon}</span>
        </div>
        <Input 
          id={id}
          type={inputType}
          className={`pl-10 ${isPassword ? 'pr-12' : 'pr-4'} h-12 text-base ${className}`}
          {...props}
        />
        {isPassword && (
          <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">
              {showPassword ? 'visibility_off' : 'visibility'}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
