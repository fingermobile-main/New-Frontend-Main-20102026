import React, {} from 'react';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface TabButtonProps {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  badge?: number;
  disabled?: boolean;
}

const TabButton: React.FC<TabButtonProps> = ({
  label,
  isActive = false,
  onClick,
  icon,
  badge,
  disabled = false
}) => {
  return (
    <Button
      variant={isActive ? "default" : "ghost"}
      onClick={onClick}
      disabled={disabled}
      className={`relative px-4 py-2 transition-all ${
        isActive
          ? "bg-primary text-primary-foreground"
          : "hover:bg-muted"
      }`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      <span>{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-foreground" />
      )}
    </Button>
  );
};

export default TabButton;
