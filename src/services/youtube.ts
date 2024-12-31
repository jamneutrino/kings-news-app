import axios from 'axios';

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnailUrl: string;
  videoUrl: string;
  channelTitle: string;
}

async function fetchChannelVideos(channelId: string, channelTitle: string): Promise<YouTubeVideo[]> {
  console.log(`Fetching videos for channel ${channelTitle}:`, channelId);
  
  try {
    let response;
    try {
      // Try direct access first
      response = await axios.get(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`, {
        headers: {
          'Accept': 'application/xml, text/xml, */*',
          'User-Agent': 'KingsNewsApp/1.0'
        }
      });
    } catch (directError) {
      console.log(`Direct access failed for ${channelTitle}, trying CORS proxies...`);
      
      // Try multiple CORS proxies in order
      const corsProxies = [
        'https://corsproxy.io/?',
        'https://api.allorigins.win/raw?url=',
        'https://cors-anywhere.herokuapp.com/'
      ];

      let proxyError: unknown;
      for (const proxy of corsProxies) {
        try {
          console.log(`Trying proxy: ${proxy} for ${channelTitle}`);
          const youtubeUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
          const encodedUrl = encodeURIComponent(youtubeUrl);
          response = await axios.get(`${proxy}${encodedUrl}`, {
            headers: {
              'Accept': 'application/xml, text/xml, */*',
              'User-Agent': 'KingsNewsApp/1.0'
            }
          });
          if (response.data) {
            console.log(`Successfully fetched data using ${proxy} for ${channelTitle}`);
            break;
          }
        } catch (error: unknown) {
          proxyError = error;
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          console.log(`Proxy ${proxy} failed for ${channelTitle}:`, errorMessage);
          continue;
        }
      }

      if (!response) {
        throw proxyError || new Error('All proxies failed');
      }
    }

    if (!response.data) {
      throw new Error(`No data received from ${channelTitle} feed`);
    }

    // Parse the XML response using DOMParser (available in browser)
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(response.data, 'text/xml');
    
    // Check for parsing errors
    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
      console.error(`XML parsing error for ${channelTitle}:`, parserError.textContent);
      throw new Error(`Failed to parse YouTube feed for ${channelTitle}`);
    }

    const entries = xmlDoc.getElementsByTagName('entry');
    console.log(`Found ${entries.length} entries for ${channelTitle}`);

    if (entries.length === 0) {
      console.warn(`No entries found for ${channelTitle}`);
      return [];
    }

    const videos: YouTubeVideo[] = [];
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const videoId = entry.getElementsByTagName('yt:videoId')[0]?.textContent;
      const title = entry.getElementsByTagName('title')[0]?.textContent;
      const description = entry.getElementsByTagName('media:description')[0]?.textContent || 
                         entry.getElementsByTagName('description')[0]?.textContent;
      const publishedAt = entry.getElementsByTagName('published')[0]?.textContent;
      
      if (!videoId || !title) {
        console.warn(`Skipping video due to missing required data for ${channelTitle}`);
        continue;
      }
      
      videos.push({
        id: videoId,
        title: title,
        description: description || '',
        publishedAt: publishedAt || new Date().toISOString(),
        thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
        channelTitle: channelTitle
      });
    }

    console.log(`Successfully processed ${videos.length} videos for ${channelTitle}`);
    return videos;
  } catch (error) {
    console.error(`Error fetching videos for ${channelTitle}:`, error);
    return []; // Return empty array instead of throwing to allow other channels to continue
  }
}

export async function getDeuceAndMoVideos(): Promise<YouTubeVideo[]> {
  try {
    const channels = [
      { id: 'UCr7VqKCBgBQtBXri_rZ4Aww', title: 'Deuce & Mo' },
      { id: 'UCWkUZwMEc-_mrUxvH6XRTXQ', title: 'Kings on NBCS' },
      { id: 'UC7IssbaNfCW4zBdnpqcfFdQ', title: 'Kings Film Room' }
    ];

    console.log('Starting to fetch videos from all channels...');
    
    // Fetch videos from all channels in parallel
    const channelVideos = await Promise.all(
      channels.map(channel => fetchChannelVideos(channel.id, channel.title))
    );

    // Combine and sort videos by date
    const allVideos = channelVideos.flat().sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    console.log('Videos per channel:', channels.map((channel, index) => 
      `${channel.title}: ${channelVideos[index].length}`
    ));

    if (allVideos.length === 0) {
      throw new Error('No videos found in any feed');
    }

    console.log('Total videos found:', allVideos.length);
    return allVideos;
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to load videos: ${error.message}`);
    }
    throw new Error('Failed to load videos: Unknown error');
  }
} 