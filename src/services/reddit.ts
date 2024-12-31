import { redditApi } from '@/utils/api';

export interface RedditPost {
  id: string;
  title: string;
  author: string;
  created: number;
  numComments: number;
  url: string;
  score: number;
  selftext?: string;
  permalink: string;
}

export async function getKingsSubredditPosts(): Promise<RedditPost[]> {
  try {
    const response = await redditApi.get('/r/kings/hot.json');
    return response.data.data.children.map((child: any) => ({
      id: child.data.id,
      title: child.data.title,
      author: child.data.author,
      created: child.data.created_utc,
      numComments: child.data.num_comments,
      url: child.data.url,
      score: child.data.score,
      selftext: child.data.selftext,
      permalink: `https://reddit.com${child.data.permalink}`,
    }));
  } catch (error) {
    console.error('Error fetching Reddit posts:', error);
    return [];
  }
} 