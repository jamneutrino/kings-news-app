'use client';

import { useEffect, useState } from 'react';
import { Tweet, getKingsTweets } from '@/services/twitter';

export default function TwitterColumn() {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTweets() {
      try {
        const data = await getKingsTweets();
        setTweets(data);
        setError(null);
      } catch (err) {
        setError('Failed to load tweets');
      } finally {
        setLoading(false);
      }
    }

    fetchTweets();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-purple-700">Twitter</h2>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-medium">Loading tweets...</h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-purple-700">Twitter</h2>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-medium text-red-600">{error}</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-purple-700">Twitter</h2>
      <div className="space-y-4">
        {tweets.map((tweet) => (
          <div key={tweet.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center space-x-2">
              <span className="font-medium">{tweet.author}</span>
              <span className="text-gray-500">@{tweet.handle}</span>
            </div>
            <p className="mt-2">{tweet.text}</p>
            <div className="mt-2 text-sm text-gray-500">
              <span>{new Date(tweet.created).toLocaleDateString()}</span>
              <span className="mx-2">•</span>
              <span>{tweet.retweetCount} Retweets</span>
              <span className="mx-2">•</span>
              <span>{tweet.favoriteCount} Likes</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 