import axios from 'axios';

// Reddit API
export const redditApi = axios.create({
  baseURL: 'https://www.reddit.com',
});

// Twitter API v2
export const twitterApi = axios.create({
  baseURL: 'https://api.twitter.com/2',
  headers: {
    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_TWITTER_BEARER_TOKEN || ''}`,
  },
}); 