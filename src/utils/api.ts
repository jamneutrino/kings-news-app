import axios from 'axios';
import Parser from 'rss-parser';

// RSS Parser with custom fields for Google Alerts
const parser = new Parser({
  customFields: {
    item: [
      ['title', 'title'],
      ['link', 'link'],
      ['pubDate', 'pubDate'],
      ['content', 'content'],
      ['contentSnippet', 'contentSnippet'],
    ],
  },
});

export interface RSSItem {
  title: string;
  link: string;
  pubDate?: string;
  isoDate?: string;
  content?: string;
  contentSnippet?: string;
}

export interface RSSFeed {
  items: RSSItem[];
}

export async function fetchRSSFeed(url: string): Promise<RSSFeed> {
  try {
    const corsProxy = 'https://api.allorigins.win/raw?url=';
    const response = await axios.get(`${corsProxy}${encodeURIComponent(url)}`);
    const feed = await parser.parseString(response.data);
    
    return {
      items: feed.items.map(item => ({
        title: item.title || '',
        link: item.link || '',
        pubDate: item.pubDate,
        isoDate: item.isoDate,
        content: item.content,
        contentSnippet: item.contentSnippet
      }))
    };
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    throw error;
  }
}

// Reddit API
export const redditApi = axios.create({
  baseURL: 'https://www.reddit.com',
});

// Remove Twitter API configuration 