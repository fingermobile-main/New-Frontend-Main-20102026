/*
 * FingerMobile Protocol™ - Open Graph (OG) Web Metadata Crawler & Link Preview Service
 * Adheres to Facebook Open Graph Protocol (og:title, og:description, og:image, og:url)
 * Copyright © 2026 FingerMobile Protocol™. All rights reserved.
 */

export interface OpenGraphMetadata {
  url: string;
  title: string;
  description: string;
  image: string;
  domain: string;
  siteName?: string;
  type?: string;
  fetchedAt: number;
  failureReason?: 'PRIVACY_RESTRICTED' | 'POOR_CONNECTION' | 'MISSING_TAGS' | null;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}

const OG_CACHE_KEY_PREFIX = 'fmp_og_cache_';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

class OpenGraphService {
  /**
   * Detects any valid http:// or https:// URLs inside text
   */
  public extractUrls(text: string): string[] {
    if (!text) return [];
    const urlRegex = /(https?:\/\/[^\s]+)/gi;
    const matches = text.match(urlRegex) || [];
    return Array.from(new Set(matches)).map((u) => u.replace(/[),.;!?]+$/, ''));
  }

  /**
   * Alias for extractUrls for flexible caller compatibility
   */
  public detectUrls(text: string): string[] {
    return this.extractUrls(text);
  }

  /**
   * Fetches and parses Open Graph meta tags for a given URL
   */
  public async fetchMetadata(targetUrl: string): Promise<OpenGraphMetadata> {
    const cleanUrl = targetUrl.trim();
    let domain = 'external';
    try {
      domain = new URL(cleanUrl).hostname.replace(/^www\./, '');
    } catch {
      // Invalid URL
    }

    // 1. Check local cache
    const cached = this.getCached(cleanUrl);
    if (cached) {
      return cached;
    }

    // Check known domains with instant reliable mock metadata for rapid demo/offline resilience
    const knownDomainMetadata = this.getKnownDomainFallback(cleanUrl, domain);

    try {
      // 2. Background Scraping Request
      // We first attempt to query the backend proxy or public Open Graph micro-resolvers
      // If offline or blocked by CORS / Privacy, we gracefully diagnose and fallback
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500);

      let data: any = null;

      try {
        // Try public microlink resolver API
        const proxyUrl = `https://api.microlink.io?url=${encodeURIComponent(cleanUrl)}`;
        const response = await fetch(proxyUrl, {
          signal: controller.signal,
          headers: { 'Accept': 'application/json' },
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const json = await response.json();
          if (json.status === 'success' && json.data) {
            data = json.data;
          }
        }
      } catch (networkErr: any) {
        clearTimeout(timeoutId);
        if (networkErr.name === 'AbortError') {
          // Poor connection / timeout
          const timeoutFallback: OpenGraphMetadata = {
            url: cleanUrl,
            title: knownDomainMetadata?.title || `Preview for ${domain}`,
            description: knownDomainMetadata?.description || 'Connection timed out while fetching Open Graph tags from the destination server.',
            image: knownDomainMetadata?.image || `https://images.unsplash.com/photo-1557683316-973673baf926?w=800&auto=format&fit=crop&q=80`,
            domain,
            siteName: domain,
            fetchedAt: Date.now(),
            failureReason: 'POOR_CONNECTION',
          };
          this.setCache(cleanUrl, timeoutFallback);
          return timeoutFallback;
        }
      }

      if (data && (data.title || data.image?.url)) {
        const metadata: OpenGraphMetadata = this.enrichMetadata({
          url: cleanUrl,
          title: data.title || `${domain} Resource`,
          description: data.description || 'Open Graph preview fetched directly from destination page header tags.',
          image: data.image?.url || data.logo?.url || `https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80`,
          domain,
          siteName: data.publisher || domain,
          fetchedAt: Date.now(),
          failureReason: null,
        });
        this.setCache(cleanUrl, metadata);
        return metadata;
      }

      // Check for Privacy Settings (e.g. facebook.com, instagram.com private profiles)
      const isPrivatePlatform = /(facebook\.com|instagram\.com|x\.com|twitter\.com|threads\.net)/i.test(domain);
      if (isPrivatePlatform) {
        const privacyFallback: OpenGraphMetadata = this.enrichMetadata({
          url: cleanUrl,
          title: knownDomainMetadata?.title || `${domain.charAt(0).toUpperCase() + domain.slice(1)} Post / Media`,
          description: knownDomainMetadata?.description || 'Snippet restricted by destination Privacy Settings (private profile or login required).',
          image: knownDomainMetadata?.image || `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80`,
          domain,
          siteName: domain,
          fetchedAt: Date.now(),
          failureReason: 'PRIVACY_RESTRICTED',
        });
        this.setCache(cleanUrl, privacyFallback);
        return privacyFallback;
      }

      // If no tags returned, diagnosis is MISSING_TAGS
      const missingTagsFallback: OpenGraphMetadata = this.enrichMetadata({
        url: cleanUrl,
        title: knownDomainMetadata?.title || `${domain.toUpperCase()} Resource`,
        description: knownDomainMetadata?.description || 'The destination webpage has not implemented standard Open Graph (<meta property="og:...">) tags.',
        image: knownDomainMetadata?.image || `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80`,
        domain,
        siteName: domain,
        fetchedAt: Date.now(),
        failureReason: 'MISSING_TAGS',
      });
      this.setCache(cleanUrl, missingTagsFallback);
      return missingTagsFallback;
    } catch {
      // General fallback
      return this.enrichMetadata({
        url: cleanUrl,
        title: knownDomainMetadata?.title || `${domain} Page`,
        description: knownDomainMetadata?.description || 'External resource link.',
        image: knownDomainMetadata?.image || `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80`,
        domain,
        siteName: domain,
        fetchedAt: Date.now(),
        failureReason: 'POOR_CONNECTION',
      });
    }
  }

  private enrichMetadata(m: OpenGraphMetadata): OpenGraphMetadata {
    return {
      ...m,
      ogTitle: m.ogTitle || m.title,
      ogDescription: m.ogDescription || m.description,
      ogImage: m.ogImage || m.image,
    };
  }

  private getKnownDomainFallback(url: string, domain: string): Partial<OpenGraphMetadata> | null {
    if (domain.includes('facebook.com')) {
      return {
        title: 'Facebook Post & Community Update',
        description: 'Connect with friends, family and other people you know. Share photos and videos, send messages and get updates.',
        image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop&q=80',
      };
    }
    if (domain.includes('youtube.com') || domain.includes('youtu.be')) {
      return {
        title: 'YouTube • High Definition Streaming Video',
        description: 'Enjoy the videos and music you love, upload original content, and share it all with friends, family, and the world on YouTube.',
        image: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&auto=format&fit=crop&q=80',
      };
    }
    if (domain.includes('fingermobile')) {
      return {
        title: 'FingerMobile Protocol™ — Sovereign Mobile Infrastructure',
        description: 'Decentralized mobile protocol with native sovereign identities, BeatwaveNG spatial audio, and Dancia-4Tv broadcasting.',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
      };
    }
    if (domain.includes('github.com')) {
      return {
        title: 'GitHub: Let’s build from here',
        description: 'GitHub is where over 100 million developers shape the future of software, together.',
        image: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&auto=format&fit=crop&q=80',
      };
    }
    return null;
  }

  private getCached(url: string): OpenGraphMetadata | null {
    try {
      const stored = localStorage.getItem(`${OG_CACHE_KEY_PREFIX}${encodeURIComponent(url)}`);
      if (stored) {
        const item: OpenGraphMetadata = JSON.parse(stored);
        if (Date.now() - item.fetchedAt < CACHE_TTL_MS) {
          return item;
        }
      }
    } catch {
      // ignore
    }
    return null;
  }

  private setCache(url: string, data: OpenGraphMetadata) {
    try {
      localStorage.setItem(`${OG_CACHE_KEY_PREFIX}${encodeURIComponent(url)}`, JSON.stringify(data));
    } catch {
      // ignore
    }
  }
}

export const openGraphService = new OpenGraphService();
export default openGraphService;
