import { fetchRSSFeed, RSSItem } from '@/utils/api';

const TRADES_RSS_URL = 'https://www.google.com/alerts/feeds/16503350685543320273/7203054617307959470';

export interface TradeItem {
  title: string;
  link: string;
  publishedDate: string;
  content: string;
}

export async function fetchTrades(): Promise<TradeItem[]> {
  try {
    const feed = await fetchRSSFeed(TRADES_RSS_URL);
    return feed.items.map((item: RSSItem) => ({
      title: item.title,
      link: item.link,
      publishedDate: item.pubDate || item.isoDate || new Date().toISOString(),
      content: item.contentSnippet || item.content || ''
    }));
  } catch (error) {
    console.error('Error fetching trades:', error);
    throw error;
  }
} 