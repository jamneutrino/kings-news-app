'use client';

import React, { useEffect, useState } from 'react';
import { fetchTrades } from '@/services/trades';

interface TradeItem {
  title: string;
  link: string;
  publishedDate: string;
  content: string;
}

function cleanHtml(html: string): string {
  // Remove HTML tags
  const withoutTags = html.replace(/<[^>]*>/g, '');
  // Decode HTML entities
  const decoded = withoutTags
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
  return decoded;
}

export default function TradesColumn() {
  const [trades, setTrades] = useState<TradeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTrades = async () => {
      try {
        const tradeData = await fetchTrades();
        setTrades(tradeData);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load trade news');
        setIsLoading(false);
      }
    };

    loadTrades();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-purple-700">Trades</h2>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-purple-700">Trades</h2>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-red-600">{error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-purple-700">Trades</h2>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="space-y-6">
          {trades.map((trade, index) => (
            <div key={index} className="space-y-2 pb-4 border-b last:border-b-0">
              <a 
                href={trade.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-purple-600 transition-colors"
              >
                <h3 className="font-medium">{cleanHtml(trade.title)}</h3>
              </a>
              <div className="text-sm text-gray-500">
                {new Date(trade.publishedDate).toLocaleDateString()}
              </div>
              <div className="text-gray-700 text-sm">
                {cleanHtml(trade.content)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 