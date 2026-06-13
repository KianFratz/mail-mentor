import React from 'react';

interface SocialButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: string;
  iconSrc?: string;
  label: string;
}

export const SocialButton: React.FC<SocialButtonProps> = ({ 
  icon, 
  iconSrc, 
  label, 
  className = '', 
  ...props 
}) => {
  return (
    <button 
      className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-border hover:bg-muted transition-colors active:scale-95 duration-100 ${className}`}
      {...props}
    >
      {iconSrc ? (
        <img src={iconSrc} alt={`${label} Logo`} className="w-5 h-5" />
      ) : icon ? (
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      ) : null}
      <span className="font-label-sm text-label-sm text-foreground">{label}</span>
    </button>
  );
};
