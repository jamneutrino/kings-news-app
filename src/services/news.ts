import axios from 'axios';
import { parseString } from 'xml2js';
import { promisify } from 'util';

const parseXml = promisify(parseString);

interface RSSItem {
  title: [string | { _: string }];
  description: [string | { _: string }];
  guid: [string];
  link: [string];
  pubDate: [string];
  source?: [string];
}

interface RSSResponse {
  rss: {
    channel: [{
      item: RSSItem[];
    }];
  };
}

export interface NewsArticle {
  id: string;
  headline: string;
  excerpt: string;
  publisher: string;
  publishedDate: string;
  url: string;
  imageUrl?: string;
}

export async function getKingsNews(): Promise<NewsArticle[]> {
  try {
    // Use a CORS proxy to avoid CORS issues
    const corsProxy = 'https://api.allorigins.win/raw?url=';
    const rssUrl = 'https://sportspyder.com/rss/teams/sacramento-kings/articles';
    const response = await axios.get(`${corsProxy}${encodeURIComponent(rssUrl)}`);
    
    console.log('RSS Response:', response.data); // Debug log
    
    const result = await parseXml(response.data) as RSSResponse;
    console.log('Parsed XML:', result); // Debug log
    
    const items = result.rss.channel[0].item;
    return items.map((item: RSSItem) => {
      // Extract the text content from CDATA if present
      const title = typeof item.title[0] === 'string' ? item.title[0] : item.title[0]._;
      const description = typeof item.description[0] === 'string' ? item.description[0] : item.description[0]._;
      
      return {
        id: item.guid[0],
        headline: title,
        excerpt: description,
        publisher: item.source?.[0] || 'SportSpyder',
        publishedDate: item.pubDate[0],
        url: item.link[0],
        imageUrl: undefined
      };
    });
  } catch (error) {
    console.error('Error fetching news articles:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    }
    return [];
  }
} 