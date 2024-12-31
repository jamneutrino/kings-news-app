'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import RedditColumn from '@/components/RedditColumn';
import YouTubeColumn from '@/components/YouTubeColumn';
import NewsColumn from '@/components/NewsColumn';
import PodcastColumn from '@/components/PodcastColumn';

type ColumnType = 'reddit' | 'youtube' | 'news' | 'podcast';

interface ColumnConfig {
  type: ColumnType;
  visible: boolean;
  title: string;
}

const defaultColumns: ColumnConfig[] = [
  { type: 'reddit', visible: true, title: 'Reddit' },
  { type: 'youtube', visible: true, title: 'YouTube' },
  { type: 'news', visible: true, title: 'News' },
  { type: 'podcast', visible: true, title: 'Podcasts' }
];

export default function Home() {
  const [columns, setColumns] = useState<ColumnConfig[]>(defaultColumns);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load column configuration from localStorage after mount
  useEffect(() => {
    const saved = localStorage.getItem('columnConfig');
    if (saved) {
      try {
        const savedConfig = JSON.parse(saved);
        setColumns(savedConfig);
      } catch (e) {
        console.error('Failed to parse saved column config:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save column configuration to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('columnConfig', JSON.stringify(columns));
    }
  }, [columns, isLoaded]);

  const toggleColumn = (columnType: ColumnType) => {
    setColumns(prev => prev.map(col => 
      col.type === columnType ? { ...col, visible: !col.visible } : col
    ));
  };

  const moveColumn = (fromIndex: number, toIndex: number) => {
    setColumns(prev => {
      const newColumns = [...prev];
      const [movedColumn] = newColumns.splice(fromIndex, 1);
      newColumns.splice(toIndex, 0, movedColumn);
      return newColumns;
    });
  };

  const renderColumn = (column: ColumnConfig, index: number) => {
    if (!column.visible) return null;

    const columnContent = (() => {
      switch (column.type) {
        case 'reddit': return <RedditColumn />;
        case 'youtube': return <YouTubeColumn />;
        case 'news': return <NewsColumn />;
        case 'podcast': return <PodcastColumn />;
      }
    })();

    return (
      <div 
        key={column.type}
        className="flex-1 min-w-[300px] max-w-[600px] p-4 overflow-y-auto border-r cursor-move"
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData('text/plain', index.toString());
          e.currentTarget.classList.add('opacity-50');
        }}
        onDragEnd={(e) => {
          e.currentTarget.classList.remove('opacity-50');
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.currentTarget.classList.add('bg-purple-50');
        }}
        onDragLeave={(e) => {
          e.currentTarget.classList.remove('bg-purple-50');
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.currentTarget.classList.remove('bg-purple-50');
          const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
          const toIndex = index;
          if (fromIndex !== toIndex) {
            moveColumn(fromIndex, toIndex);
          }
        }}
      >
        {columnContent}
      </div>
    );
  };

  // Convert columns array to visibleColumns object for Sidebar
  const visibleColumns = columns.reduce((acc, col) => {
    acc[col.type] = col.visible;
    return acc;
  }, {} as Record<ColumnType, boolean>);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        visibleColumns={visibleColumns}
        onToggle={toggleColumn}
      />
      <main className="flex-1 flex overflow-hidden">
        {columns.map((column, index) => renderColumn(column, index))}
      </main>
    </div>
  );
} 