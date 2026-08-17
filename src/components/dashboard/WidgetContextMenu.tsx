import React, { useState } from 'react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';

interface WidgetContextMenuProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onMove?: () => void;
}

const WidgetContextMenu: React.FC<WidgetContextMenuProps> = ({ onEdit, onDelete, onMove }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 hover:bg-gray-100 rounded"
      >
        <EllipsisVerticalIcon className="w-5 h-5 text-gray-600" />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
          <button onClick={() => { onEdit?.(); setIsOpen(false); }} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">
            Edit
          </button>
          <button onClick={() => { onMove?.(); setIsOpen(false); }} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">
            Move
          </button>
          <button onClick={() => { onDelete?.(); setIsOpen(false); }} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50">
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default WidgetContextMenu;
