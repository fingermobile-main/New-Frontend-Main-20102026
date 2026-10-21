export class ContentCurationService {
  static async uploadProduct(productData: any): Promise<any> {
    try {
      const response = await fetch('/api/curation/products/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify(productData)
      });
      return await response.json();
    } catch (error) {
      console.error('Error uploading product:', error);
      throw error;
    }
  }

  static async uploadMedia(mediaData: any): Promise<any> {
    try {
      const response = await fetch('/api/curation/media/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify(mediaData)
      });
      return await response.json();
    } catch (error) {
      console.error('Error uploading media:', error);
      throw error;
    }
  }

  static async manageAds(adData: any): Promise<any> {
    try {
      const response = await fetch('/api/curation/ads/manage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify(adData)
      });
      return await response.json();
    } catch (error) {
      console.error('Error managing ads:', error);
      throw error;
    }
  }
}
