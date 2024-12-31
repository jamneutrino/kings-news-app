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
  thumbnail?: string;
  imageUrl?: string;
  isVideo: boolean;
  videoUrl?: string;
}

export async function getKingsSubredditPosts(): Promise<RedditPost[]> {
  try {
    const response = await redditApi.get('/r/kings/hot.json');
    return response.data.data.children.map((child: any) => {
      // Handle different types of media
      let imageUrl;
      let videoUrl;
      
      // Check for gallery
      if (child.data.is_gallery && child.data.media_metadata) {
        const firstImageId = Object.keys(child.data.media_metadata)[0];
        if (firstImageId) {
          const metadata = child.data.media_metadata[firstImageId];
          imageUrl = metadata?.s?.u || metadata?.s?.gif;
        }
      }
      // Check for direct image
      else if (child.data.url?.match(/\.(jpg|jpeg|png|gif)$/i)) {
        imageUrl = child.data.url;
      }
      // Check for Reddit-hosted image
      else if (child.data.preview?.images?.[0]?.source?.url) {
        imageUrl = child.data.preview.images[0].source.url.replace(/&amp;/g, '&');
      }

      // Check for video
      if (child.data.is_video && child.data.media?.reddit_video?.fallback_url) {
        videoUrl = child.data.media.reddit_video.fallback_url;
      }

      return {
        id: child.data.id,
        title: child.data.title,
        author: child.data.author,
        created: child.data.created_utc,
        numComments: child.data.num_comments,
        url: child.data.url,
        score: child.data.score,
        selftext: child.data.selftext,
        permalink: `https://reddit.com${child.data.permalink}`,
        thumbnail: child.data.thumbnail !== 'self' && child.data.thumbnail !== 'default' ? child.data.thumbnail : undefined,
        imageUrl,
        isVideo: child.data.is_video,
        videoUrl
      };
    });
  } catch (error) {
    console.error('Error fetching Reddit posts:', error);
    return [];
  }
} 