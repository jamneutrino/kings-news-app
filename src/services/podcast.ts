import axios from 'axios';

export interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  publishedDate: string;
  url: string;
  duration?: string;
  imageUrl?: string;
  audioUrl?: string;
  podcastName: string;
}

const PODCAST_FEEDS = [
  {
    url: 'https://feed.podbean.com/kingsbeat/feed.xml',
    name: 'Kings Beat'
  },
  {
    url: 'https://anchor.fm/s/d739a80/podcast/rss',
    name: 'Sac Lunch'
  }
];

async function fetchPodcastFeed(feedUrl: string, feedName: string): Promise<PodcastEpisode[]> {
  try {
    let response;
    try {
      // Try direct access first
      response = await axios.get(feedUrl, {
        headers: {
          'Accept': 'application/xml, text/xml, */*',
          'User-Agent': 'KingsNewsApp/1.0'
        }
      });
    } catch (directError) {
      console.log(`Direct access failed for ${feedName}, trying CORS proxy...`);
      
      // Try multiple CORS proxies in order
      const corsProxies = [
        'https://corsproxy.io/?',
        'https://api.allorigins.win/raw?url=',
        'https://cors-anywhere.herokuapp.com/'
      ];

      let proxyError;
      for (const proxy of corsProxies) {
        try {
          console.log(`Trying proxy: ${proxy} for ${feedName}`);
          response = await axios.get(`${proxy}${encodeURIComponent(feedUrl)}`, {
            headers: {
              'Accept': 'application/xml, text/xml, */*',
              'User-Agent': 'KingsNewsApp/1.0'
            }
          });
          if (response.data) {
            break;
          }
        } catch (error) {
          proxyError = error;
          console.log(`Proxy ${proxy} failed for ${feedName}, trying next...`);
          continue;
        }
      }

      if (!response) {
        throw proxyError || new Error('All proxies failed');
      }
    }

    if (!response.data) {
      throw new Error(`No data received from ${feedName} feed`);
    }

    // Parse the XML response using DOMParser (available in browser)
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(response.data, 'text/xml');
    
    // Check for parsing errors
    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
      console.error(`XML parsing error for ${feedName}:`, parserError.textContent);
      throw new Error(`Failed to parse podcast feed for ${feedName}`);
    }

    const items = xmlDoc.getElementsByTagName('item');
    console.log(`Found ${items.length} episodes in ${feedName}`);

    const channelImage = xmlDoc.querySelector('channel > itunes\\:image');
    const imageUrl = xmlDoc.querySelector('channel > image > url');
    const defaultImage = channelImage?.getAttribute('href') || imageUrl?.textContent || '';

    const episodes: PodcastEpisode[] = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      try {
        const title = item.querySelector('title')?.textContent || '';
        const description = item.querySelector('description')?.textContent || 'No description available';
        const guid = item.querySelector('guid')?.textContent || '';
        const link = item.querySelector('link')?.textContent || '';
        const pubDate = item.querySelector('pubDate')?.textContent;
        const duration = item.querySelector('itunes\\:duration')?.textContent || undefined;
        const itemImage = item.querySelector('itunes\\:image');
        const imageUrl = itemImage?.getAttribute('href') || defaultImage;
        const enclosure = item.querySelector('enclosure');
        const audioUrl = enclosure?.getAttribute('url') || undefined;

        if (!title || (!guid && !link)) {
          console.warn(`Skipping episode due to missing required data for ${feedName}`);
          continue;
        }

        episodes.push({
          id: `${feedName}-${guid || link || Math.random().toString()}`,
          title: title,
          description: description.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim(),
          publishedDate: pubDate || new Date().toISOString(),
          url: link,
          duration: duration,
          imageUrl: imageUrl,
          audioUrl: audioUrl,
          podcastName: feedName
        });
      } catch (itemError) {
        console.error(`Error processing ${feedName} episode:`, itemError);
      }
    }

    return episodes;
  } catch (error) {
    console.error(`Error fetching ${feedName} episodes:`, error);
    return [];
  }
}

export async function getAllPodcasts(): Promise<PodcastEpisode[]> {
  try {
    console.log('Starting to fetch podcasts from all feeds...');
    const allEpisodes = await Promise.all(
      PODCAST_FEEDS.map(feed => fetchPodcastFeed(feed.url, feed.name))
    );
    
    // Combine all episodes and sort by date
    const sortedEpisodes = allEpisodes
      .flat()
      .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());

    console.log('Episodes per feed:', PODCAST_FEEDS.map((feed, index) => 
      `${feed.name}: ${allEpisodes[index].length}`
    ));
    console.log('Total episodes found:', sortedEpisodes.length);

    return sortedEpisodes;
  } catch (error) {
    console.error('Error fetching podcasts:', error);
    throw error;
  }
} 