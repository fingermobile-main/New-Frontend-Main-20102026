import { useEffect } from 'react';

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  canonicalPath?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile';
  jsonLdSchema?: Record<string, any>;
}

export function usePlatformSEO(config: SEOConfig) {
  useEffect(() => {
    // 1. Title
    const fullTitle = `${config.title} | FingerMobile™ Protocol`;
    document.title = fullTitle;

    // 2. Helper to set or create meta tag
    const setMetaTag = (attribute: string, attrValue: string, content: string) => {
      let element = document.querySelector(`meta[${attribute}="${attrValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 3. Description & Keywords
    setMetaTag('name', 'description', config.description);
    if (config.keywords && config.keywords.length > 0) {
      setMetaTag('name', 'keywords', config.keywords.join(', '));
    }

    // 4. Open Graph
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', config.description);
    if (config.ogImage) {
      setMetaTag('property', 'og:image', config.ogImage);
    }
    if (config.ogType) {
      setMetaTag('property', 'og:type', config.ogType);
    }

    // 5. Canonical Link
    const canonicalUrl = `https://fingermobileprotocol.com${config.canonicalPath || window.location.pathname}`;
    let linkElement = document.querySelector('link[rel="canonical"]');
    if (!linkElement) {
      linkElement = document.createElement('link');
      linkElement.setAttribute('rel', 'canonical');
      document.head.appendChild(linkElement);
    }
    linkElement.setAttribute('href', canonicalUrl);

    // 6. JSON-LD Schema (optional)
    if (config.jsonLdSchema) {
      let scriptElement = document.getElementById('dynamic-jsonld-schema') as HTMLScriptElement | null;
      if (!scriptElement) {
        scriptElement = document.createElement('script');
        scriptElement.id = 'dynamic-jsonld-schema';
        scriptElement.type = 'application/ld+json';
        document.head.appendChild(scriptElement);
      }
      scriptElement.text = JSON.stringify(config.jsonLdSchema);
    }
  }, [config]);
}
