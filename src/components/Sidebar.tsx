type ColumnType = 'reddit' | 'youtube' | 'news' | 'podcast';

interface SidebarProps {
  visibleColumns: Record<ColumnType, boolean>;
  onToggle: (columnType: ColumnType) => void;
}

export default function Sidebar({ visibleColumns, onToggle }: SidebarProps) {
  return (
    <aside className="w-64 bg-white shadow-lg p-4">
      <h1 className="text-2xl font-bold text-purple-700 mb-6">Kings News</h1>
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
      <div className="mt-8 text-sm text-gray-500">
        Drag columns to reorder them
      </div>
    </aside>
  );
} 