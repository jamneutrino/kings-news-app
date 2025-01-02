import { useState } from 'react';
import { Menu, X, Settings } from 'lucide-react';

type ColumnType = 'reddit' | 'youtube' | 'news' | 'podcast' | 'twitter' | 'trades';

interface SidebarProps {
  visibleColumns: Record<ColumnType, boolean>;
  onToggle: (columnType: ColumnType) => void;
  onManageColumns: () => void;
}

export default function Sidebar({ visibleColumns, onToggle, onManageColumns }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar/Dropdown */}
      <aside className={`
        fixed top-0 left-0 h-screen bg-white shadow-lg z-40 transition-transform duration-300
        md:relative md:translate-x-0 md:w-64 md:block
        ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full'}
      `}>
        <div className="p-4">
          <h1 className="text-2xl font-bold text-purple-700 mb-6 mt-14 md:mt-0">Kings News</h1>
          
          <div className="mt-8 border-t pt-4">
            <button
              onClick={() => {
                onManageColumns();
                setIsOpen(false);
              }}
              className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors duration-200"
            >
              <Settings size={20} />
              <span>Manage Columns</span>
            </button>
          </div>

          <div className="mt-8 text-sm text-gray-500 md:hidden">
            Swipe left/right to view columns
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
} 