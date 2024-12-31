'use client';

import { useEffect, useState, useCallback } from 'react';
import { YouTubeVideo, getDeuceAndMoVideos } from '@/services/youtube';

export default function YouTubeColumn() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchVideos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching YouTube videos... (Attempt', retryCount + 1, ')');
      const data = await getDeuceAndMoVideos();
      console.log('Successfully fetched', data.length, 'videos');
      if (data.length === 0) {
        throw new Error('No videos found');
      }
      setVideos(data);
    } catch (err) {
      console.error('Error in YouTubeColumn:', err);
      let errorMessage = 'Failed to load videos';
      if (err instanceof Error) {
        errorMessage = `${errorMessage}: ${err.message}`;
      }
      if (retryCount >= 2) {
        errorMessage += '. Multiple attempts failed, please try again later';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [retryCount]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-purple-700">YouTube</h2>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-medium">Loading videos...</h3>
          <p className="mt-2 text-sm text-gray-600">
            Attempt {retryCount + 1}
            {retryCount > 0 && ' - Retrying...'}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-purple-700">YouTube</h2>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-medium text-red-600">Error</h3>
          <p className="mt-2 text-sm text-gray-600">{error}</p>
          {retryCount < 3 && (
            <button
              onClick={handleRetry}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
            >
              Retry ({retryCount + 1}/3)
            </button>
          )}
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-purple-700">YouTube</h2>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-medium">No videos available</h3>
          <p className="mt-2 text-sm text-gray-600">Check back later for updates.</p>
          <button
            onClick={handleRetry}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-purple-700">YouTube</h2>
      <div className="space-y-4">
        {videos.map((video) => (
          <div key={video.id} className="bg-white rounded-lg shadow p-4">
            <a
              href={video.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:opacity-90 transition-opacity"
            >
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="font-medium hover:text-purple-700">{video.title}</h3>
            </a>
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">{video.description}</p>
            <div className="mt-2 text-sm text-gray-500 flex items-center justify-between">
              <span>{new Date(video.publishedAt).toLocaleDateString()}</span>
              <span className="text-purple-600">{video.channelTitle}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 