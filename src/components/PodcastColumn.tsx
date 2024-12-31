'use client';

import { useEffect, useState, useCallback } from 'react';
import { PodcastEpisode, getAllPodcasts } from '@/services/podcast';

export default function PodcastColumn() {
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchEpisodes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching podcast episodes... (Attempt', retryCount + 1, ')');
      const data = await getAllPodcasts();
      console.log('Successfully fetched', data.length, 'episodes');
      if (data.length === 0) {
        throw new Error('No episodes found in any feeds');
      }
      setEpisodes(data);
    } catch (err) {
      console.error('Error in PodcastColumn:', err);
      let errorMessage = 'Failed to load podcast episodes';
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
    fetchEpisodes();
  }, [fetchEpisodes]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-purple-700">Podcasts</h2>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-medium">Loading episodes...</h3>
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
        <h2 className="text-xl font-semibold text-purple-700">Podcasts</h2>
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

  if (episodes.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-purple-700">Podcasts</h2>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-medium">No episodes available</h3>
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
      <h2 className="text-xl font-semibold text-purple-700">Podcasts</h2>
      <div className="space-y-4">
        {episodes.map((episode) => (
          <div key={episode.id} className="bg-white rounded-lg shadow p-4">
            {episode.imageUrl && (
              <img
                src={episode.imageUrl}
                alt={episode.title}
                className="w-full h-48 object-cover rounded-t-lg mb-4"
              />
            )}
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-purple-600">{episode.podcastName}</span>
              {episode.duration && (
                <span className="text-sm text-gray-500">
                  Duration: {episode.duration}
                </span>
              )}
            </div>
            <a
              href={episode.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:text-purple-700"
            >
              <h3 className="font-medium">{episode.title}</h3>
            </a>
            <p className="mt-2 text-sm text-gray-600 line-clamp-3">{episode.description}</p>
            <div className="mt-2 text-sm text-gray-500">
              <span>{new Date(episode.publishedDate).toLocaleDateString()}</span>
            </div>
            {episode.audioUrl && (
              <audio
                controls
                className="mt-4 w-full"
                preload="none"
              >
                <source src={episode.audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 