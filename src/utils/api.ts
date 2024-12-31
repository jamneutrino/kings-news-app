import axios from 'axios';

// Reddit API
export const redditApi = axios.create({
  baseURL: 'https://www.reddit.com',
});

// Remove Twitter API configuration 