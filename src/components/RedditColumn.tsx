'use client';

import { useEffect, useState } from 'react';
import { RedditPost, getKingsSubredditPosts } from '@/services/reddit';

export default function RedditColumn() {
  const [posts, setPosts] = useState<RedditPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const data = await getKingsSubredditPosts();
        setPosts(data);
        setError(null);
      } catch (err) {
        setError('Failed to load Reddit posts');
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  const renderMedia = (post: RedditPost) => {
    if (post.isVideo && post.videoUrl) {
      return (
        <div className="mt-2 rounded-lg overflow-hidden">
          <video 
            controls
            preload="none"
            poster={post.thumbnail}
            className="w-full max-h-[400px] object-contain bg-black"
          >
            <source src={post.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }
    
    if (post.imageUrl) {
      return (
        <div className="mt-2 rounded-lg overflow-hidden">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full max-h-[400px] object-contain bg-gray-100"
            loading="lazy"
          />
        </div>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-purple-700">Reddit</h2>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-medium">Loading Reddit posts...</h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-purple-700">Reddit</h2>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-medium text-red-600">{error}</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-purple-700">Reddit</h2>
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow p-4">
            <a
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:text-purple-700"
            >
              <h3 className="font-medium">{post.title}</h3>
            </a>
            {renderMedia(post)}
            {post.selftext && (
              <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                {post.selftext}
              </p>
            )}
            <div className="mt-2 text-sm text-gray-600">
              <span>Posted by u/{post.author}</span>
              <span className="mx-2">•</span>
              <span>{new Date(post.created * 1000).toLocaleDateString()}</span>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              <span>{post.score} points</span>
              <span className="mx-2">•</span>
              <span>{post.numComments} comments</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 