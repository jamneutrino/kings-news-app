import { twitterApi } from '@/utils/api';

export interface Tweet {
  id: string;
  text: string;
  author: string;
  handle: string;
  created: string;
  retweetCount: number;
  favoriteCount: number;
}

export async function getKingsTweets(): Promise<Tweet[]> {
  try {
    const response = await twitterApi.get('/tweets/search/recent', {
      params: {
        query: 'from:SacramentoKings OR #SacramentoKings OR #SacKings -is:retweet',
        'tweet.fields': 'created_at,public_metrics,author_id',
        'user.fields': 'name,username',
        expansions: 'author_id',
        max_results: 20,
      },
    });

    const users = new Map(
      response.data.includes.users.map((user: any) => [user.id, user])
    );

    return response.data.data.map((tweet: any) => {
      const user = users.get(tweet.author_id);
      return {
        id: tweet.id,
        text: tweet.text,
        author: user?.name || 'Unknown',
        handle: user?.username || 'unknown',
        created: tweet.created_at,
        retweetCount: tweet.public_metrics.retweet_count,
        favoriteCount: tweet.public_metrics.like_count,
      };
    });
  } catch (error) {
    console.error('Error fetching tweets:', error);
    return [];
  }
} 