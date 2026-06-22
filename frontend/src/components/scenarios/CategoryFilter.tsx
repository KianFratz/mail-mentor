export const CategoryFilter: React.FC<{
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}> = ({ label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-2 rounded-full text-sm font-medium active:scale-95 transition-all ${
        isActive
          ? "bg-primary text-primary-foreground"
          : "bg-card text-muted-foreground border border-border hover:border-primary"
      }`}
    >
      {label}
    </button>
  );
};

