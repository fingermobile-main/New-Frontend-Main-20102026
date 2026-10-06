import React from 'react';
import { DrawerMenuContainer } from './layout/DrawerMenu/DrawerMenuContainer';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile view slide-over drawer */}
      <DrawerMenuContainer isOpen={isOpen} onClose={onClose} isDesktopSidebar={false} />

      {/* Desktop sidebar view */}
      <div className="hidden lg:block">
        <DrawerMenuContainer isOpen={true} onClose={() => {}} isDesktopSidebar={true} />
      </div>
    </>
  );
};

export default Sidebar;
