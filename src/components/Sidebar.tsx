import { useState } from 'react';
import { Menu, X } from 'lucide-react';

type ColumnType = 'reddit' | 'youtube' | 'news' | 'podcast';

interface SidebarProps {
  visibleColumns: Record<ColumnType, boolean>;
  onToggle: (columnType: ColumnType) => void;
}

export default function Sidebar({ visibleColumns, onToggle }: SidebarProps) {
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
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="reddit"
                checked={visibleColumns.reddit}
                onChange={() => onToggle('reddit')}
                className="w-4 h-4 text-purple-600"
              />
              <label htmlFor="reddit" className="text-gray-700">Reddit</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="youtube"
                checked={visibleColumns.youtube}
                onChange={() => onToggle('youtube')}
                className="w-4 h-4 text-purple-600"
              />
              <label htmlFor="youtube" className="text-gray-700">YouTube</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="news"
                checked={visibleColumns.news}
                onChange={() => onToggle('news')}
                className="w-4 h-4 text-purple-600"
              />
              <label htmlFor="news" className="text-gray-700">News</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="podcast"
                checked={visibleColumns.podcast}
                onChange={() => onToggle('podcast')}
                className="w-4 h-4 text-purple-600"
              />
              <label htmlFor="podcast" className="text-gray-700">Podcasts</label>
            </div>
          </div>
          <div className="mt-8 text-sm text-gray-500 hidden md:block">
            Drag columns to reorder them
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