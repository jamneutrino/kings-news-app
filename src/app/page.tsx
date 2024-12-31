'use client';

import { useState, useEffect, useRef } from 'react';
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
  const [activeColumnIndex, setActiveColumnIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const mainRef = useRef<HTMLElement>(null);

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

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;

    const touchEndX = e.touches[0].clientX;
    const deltaX = touchEndX - touchStartX.current;
    const visibleColumns = columns.filter(col => col.visible);

    if (Math.abs(deltaX) > 50) { // Minimum swipe distance
      if (deltaX > 0 && activeColumnIndex > 0) {
        // Swipe right
        setActiveColumnIndex(prev => prev - 1);
      } else if (deltaX < 0 && activeColumnIndex < visibleColumns.length - 1) {
        // Swipe left
        setActiveColumnIndex(prev => prev + 1);
      }
      touchStartX.current = null;
    }
  };

  const handleTouchEnd = () => {
    touchStartX.current = null;
  };

  const renderMobileHeader = () => {
    const visibleColumns = columns.filter(col => col.visible);
    const currentColumn = visibleColumns[activeColumnIndex];
    const prevColumn = activeColumnIndex > 0 ? visibleColumns[activeColumnIndex - 1] : null;
    const nextColumn = activeColumnIndex < visibleColumns.length - 1 ? visibleColumns[activeColumnIndex + 1] : null;

    return (
      <div className="fixed top-0 left-0 right-0 h-14 bg-white shadow-sm z-20 flex items-center justify-between px-4 md:hidden">
        {prevColumn ? (
          <button 
            onClick={() => setActiveColumnIndex(prev => prev - 1)}
            className="text-sm text-gray-500 flex items-center hover:text-purple-600 transition-colors duration-200 active:scale-95"
          >
            <span className="mr-1 text-lg">←</span>
            {prevColumn.title}
          </button>
        ) : (
          <div className="w-20" />
        )}
        
        <div className="font-semibold text-purple-700 text-lg">
          {currentColumn.title}
        </div>
        
        {nextColumn ? (
          <button 
            onClick={() => setActiveColumnIndex(prev => prev + 1)}
            className="text-sm text-gray-500 flex items-center hover:text-purple-600 transition-colors duration-200 active:scale-95"
          >
            {nextColumn.title}
            <span className="ml-1 text-lg">→</span>
          </button>
        ) : (
          <div className="w-20" />
        )}
      </div>
    );
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

    const visibleColumns = columns.filter(col => col.visible);
    const visibleIndex = visibleColumns.findIndex(col => col.type === column.type);
    const isActive = visibleIndex === activeColumnIndex;
    const isPrevious = visibleIndex === activeColumnIndex - 1;
    const isNext = visibleIndex === activeColumnIndex + 1;

    return (
      <div 
        key={column.type}
        className={`
          flex-1 min-w-[300px] max-w-[600px] overflow-y-auto border-r
          transition-all duration-500 ease-in-out transform
          ${isActive ? 'translate-x-0 scale-100' : 
            isPrevious ? '-translate-x-full scale-95' : 
            isNext ? 'translate-x-full scale-95' : 'translate-x-full'}
          md:translate-x-0 md:scale-100 md:relative md:opacity-100
          ${!isActive && 'absolute inset-0 opacity-0 pointer-events-none'}
          ${isActive && 'relative opacity-100 pointer-events-auto'}
          will-change-transform
        `}
        draggable="true"
        style={{
          touchAction: 'pan-y pinch-zoom',
        }}
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
        <div className="h-full pt-14 md:pt-4 p-4">
          {columnContent}
        </div>
      </div>
    );
  };

  // Convert columns array to visibleColumns object for Sidebar
  const visibleColumns = columns.reduce((acc, col) => {
    acc[col.type] = col.visible;
    return acc;
  }, {} as Record<ColumnType, boolean>);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-100 touch-pan-y">
      <Sidebar 
        visibleColumns={visibleColumns}
        onToggle={toggleColumn}
      />
      <main 
        ref={mainRef}
        className="flex-1 flex overflow-hidden relative w-full"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {renderMobileHeader()}
        {columns.map((column, index) => renderColumn(column, index))}
        
        {/* Mobile Column Indicator */}
        <div className="fixed bottom-4 left-0 right-0 flex justify-center gap-2 md:hidden">
          {columns.filter(col => col.visible).map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === activeColumnIndex ? 'bg-purple-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </main>
    </div>
  );
} 