'use client';

import { useEffect, useState } from 'react';
import { NewsArticle, getKingsNews } from '@/services/news';

export default function NewsColumn() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArticles() {
      try {
        console.log('Fetching news articles...');
        const data = await getKingsNews();
        console.log('Fetched articles:', data);
        setArticles(data);
        setError(null);
      } catch (err) {
        console.error('Error in NewsColumn:', err);
        setError(err instanceof Error ? err.message : 'Failed to load news articles');
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-purple-700">News</h2>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-medium">Loading news articles...</h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-purple-700">News</h2>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-medium text-red-600">Error: {error}</h3>
          <p className="mt-2 text-sm text-gray-600">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-purple-700">News</h2>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-medium">No news articles available</h3>
          <p className="mt-2 text-sm text-gray-600">Check back later for updates.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-purple-700">News</h2>
      <div className="space-y-4">
        {articles.map((article) => (
          <div key={article.id} className="bg-white rounded-lg shadow p-4">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:text-purple-700"
            >
              <h3 className="font-medium">{article.headline}</h3>
              {article.imageUrl && (
                <div className="mt-2 rounded-lg overflow-hidden">
                  <img
                    src={article.imageUrl}
                    alt={article.headline}
                    className="w-full max-h-[300px] object-cover bg-gray-100"
                    loading="lazy"
                  />
                </div>
              )}
            </a>
            <p className="mt-2 text-sm text-gray-600 line-clamp-3">{article.excerpt}</p>
            <div className="mt-2 text-sm text-gray-500">
              <span>{article.publisher}</span>
              <span className="mx-2">•</span>
              <span>{new Date(article.publishedDate).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 