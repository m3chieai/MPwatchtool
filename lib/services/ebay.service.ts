import axios from 'axios';

interface EbaySearchParams {
  keywords: string;
  brand: string;
  model: string;
  referenceNumber?: string;
}

interface EbaySoldListing {
  itemId: string;
  title: string;
  soldPrice: number;
  currency: string;
  saleDate: string;
  condition?: string;
  shippingCost?: number;
  listingUrl: string;
}

export class EbayService {
  private appId: string = process.env.EBAY_APP_ID!;
  private certId: string = process.env.EBAY_CERT_ID!;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  /**
   * Get OAuth access token - Arrow function fixes 'this' context
   */
  private getAccessToken = async (): Promise<string> => {
    if (this.accessToken && Date.now() < this.tokenExpiry) return this.accessToken;

    try {
      const auth = Buffer.from(`${this.appId}:${this.certId}`).toString('base64');
      const response = await axios.post(
        'https://api.ebay.com/identity/v1/oauth2/token',
        'grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope',
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${auth}`,
          },
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in * 1000) - 60000;
      return this.accessToken!;
    } catch (error) {
      console.error('eBay Auth Error:', error);
      throw new Error('Failed to authenticate with eBay');
    }
  };

  /**
   * Main search function
   */
  searchSoldListings = async (params: EbaySearchParams): Promise<EbaySoldListing[]> => {
    try {
      const token = await this.getAccessToken();
      const keywords = `${params.brand} ${params.referenceNumber}`;

      const response = await axios.get(
        'https://api.ebay.com/buy/browse/v1/item_summary/search',
        {
          params: {
            q: keywords,
            filter: 'buyingOptions:{FIXED_PRICE},itemLocationCountry:US', 
            limit: 50,
          },
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
          },
        }
      );

      return this.parseBrowseResponse(response.data);
    } catch (error) {
      console.error('eBay Browse API Error:', error);
      throw new Error('Failed to fetch eBay listings');
    }
  };

  /**
   * Parses JSON response
   */
  private parseBrowseResponse = (data: any): EbaySoldListing[] => {
    const listings: EbaySoldListing[] = [];
    const items = data.itemSummaries || [];

    for (const item of items) {
      const price = parseFloat(item.price?.value || '0');
      if (price === 0) continue;

      listings.push({
        itemId: item.itemId || '',
        title: item.title || '',
        soldPrice: price,
        currency: item.price?.currency || 'USD',
        saleDate: new Date().toISOString(),
        condition: item.condition,
        shippingCost: parseFloat(item.shippingOptions?.[0]?.shippingCost?.value || '0'),
        listingUrl: item.itemWebUrl || '',
      });
    }
    return listings;
  };

 /**
   * Filter valid listings with Metal-Specific Logic
   */
 filterValidListings = (listings: EbaySoldListing[], targetRef: string): EbaySoldListing[] => {
    // Ensure targetRef is at least an empty string to prevent .endsWith() crashes
    const safeRef = targetRef || ''; 

    return listings.filter(listing => {
      // 1. DEFENSIVE CHECK: Ensure listing and title exist
      if (!listing || !listing.title) {
        return false;
      }

      const title = listing.title.toLowerCase();
      const cleanTarget = safeRef.toLowerCase();
      
      // 2. Structural Exclusions
      if (/\b(parts|repair|broken|box only|papers only|link|bezel|dial only)\b/.test(title)) {
        return false;
      }

      // 3. Strict Reference Check
      if (cleanTarget && !title.includes(cleanTarget)) {
        return false;
      }

      // 4. Smart Price Floors
      let minPrice = 1000; 
      if (title.includes('rolex')) {
        const isLadies = /\b(6917|7917|lady|26mm|28mm|31mm)\b/.test(title);
        
        // Use safeRef here for the material check
        if (safeRef.endsWith('8')) {
          minPrice = 9000;      // Solid Gold
        } else if (safeRef.endsWith('3')) {
          minPrice = 3800;      // Two-Tone
        } else {
          minPrice = isLadies ? 2200 : 7000; // Steel
        }
      }

      return listing.soldPrice >= minPrice;
    });
  };

  removeOutliers = (prices: number[]): number[] => {
    if (prices.length < 4) return prices;
    const sorted = [...prices].sort((a, b) => a - b);
    const q1 = sorted[Math.floor(sorted.length * 0.25)];
    const q3 = sorted[Math.floor(sorted.length * 0.75)];
    const iqr = q3 - q1;
    return prices.filter(p => p >= (q1 - 1.5 * iqr) && p <= (q3 + 1.5 * iqr));
  };

  calculateMedian = (prices: number[]): number => {
    if (prices.length === 0) return 0;
    const sorted = [...prices].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  };

  convertToCAD = async (usdAmount: number): Promise<number> => {
    return usdAmount * 1.35;
  };
}

export const ebayService = new EbayService();