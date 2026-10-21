/**
 * FingerMobile™Protocol - Exchange Rate Service
 * Handles real-time multi-currency conversion, country-specific USD exchange rates,
 * emergency Chinese Renminbi Yuan (CNY) fallback hierarchy, and the protocol tokenomic standard:
 *  - 1 FIC = $0.05 USD (1 USD = 20 FIC)
 *  - 1 FIC = ₦65.00 NGN (based on Nigerian Apex Bank / CBN rate $1.00 USD = ₦1,340.00 NGN)
 */

import {
  ExchangeRate,
  DEFAULT_USD_TO_FIC_RATE,
  DEFAULT_FIC_USD_VALUE,
  DEFAULT_FIC_NAIRA_VALUE,
  DEFAULT_USD_NAIRA_RATE,
  MultiBalanceUsdValuation,
} from '../types/enhanced-monetization';

const STORAGE_KEY_PLATFORM_FIC_RATE = 'fingermobile_platform_fic_rate_v1';

// Seeded country currency rates against USD
// Rate is: 1 USD = X local currency units
// Updated with Nigerian Apex Bank rate: $1.00 USD = ₦1,340.00 NGN
const COUNTRY_USD_RATES: Record<string, { currency: string; name: string; usdRate: number; ficRateDirect?: number }> = {
  NG: { currency: 'NGN', name: 'Nigerian Naira (Apex Bank / CBN)', usdRate: DEFAULT_USD_NAIRA_RATE, ficRateDirect: DEFAULT_FIC_NAIRA_VALUE },
  KE: { currency: 'KES', name: 'Kenyan Shilling', usdRate: 129.5 },
  GH: { currency: 'GHS', name: 'Ghanaian Cedi', usdRate: 15.8 },
  ZA: { currency: 'ZAR', name: 'South African Rand', usdRate: 18.2 },
  EG: { currency: 'EGP', name: 'Egyptian Pound', usdRate: 48.5 },
  GB: { currency: 'GBP', name: 'British Pound', usdRate: 0.77 },
  EU: { currency: 'EUR', name: 'Euro', usdRate: 0.92 },
  CN: { currency: 'CNY', name: 'Chinese Renminbi Yuan', usdRate: 7.24 },
  IN: { currency: 'INR', name: 'Indian Rupee', usdRate: 83.9 },
  JP: { currency: 'JPY', name: 'Japanese Yen', usdRate: 149.2 },
  CA: { currency: 'CAD', name: 'Canadian Dollar', usdRate: 1.38 },
  AU: { currency: 'AUD', name: 'Australian Dollar', usdRate: 1.51 },
  BR: { currency: 'BRL', name: 'Brazilian Real', usdRate: 5.62 },
  AE: { currency: 'AED', name: 'UAE Dirham', usdRate: 3.67 },
  US: { currency: 'USD', name: 'United States Dollar', usdRate: 1.0 },
};

// Chinese Renminbi rates against local currencies for fallback scenarios
const COUNTRY_CNY_RATES: Record<string, { currency: string; cnyRate: number }> = {
  NG: { currency: 'NGN', cnyRate: 185.08 }, // 1340 / 7.24
  KE: { currency: 'KES', cnyRate: 17.88 },
  GH: { currency: 'GHS', cnyRate: 2.18 },
  ZA: { currency: 'ZAR', cnyRate: 2.51 },
  EG: { currency: 'EGP', cnyRate: 6.70 },
  GB: { currency: 'GBP', cnyRate: 0.106 },
  EU: { currency: 'EUR', cnyRate: 0.127 },
  CN: { currency: 'CNY', cnyRate: 1.0 },
  IN: { currency: 'INR', cnyRate: 11.58 },
  JP: { currency: 'JPY', cnyRate: 20.6 },
  US: { currency: 'USD', cnyRate: 0.138 },
};

class ExchangeRateService {
  private activeFicUsdRate: number = DEFAULT_USD_TO_FIC_RATE; // 1 USD = 20 FIC (1 FIC = $0.05 USD)

  constructor() {
    this.initRateFromStorage();
  }

  private initRateFromStorage(): void {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PLATFORM_FIC_RATE);
      if (stored) {
        const parsed = parseFloat(stored);
        if (!isNaN(parsed) && parsed > 0) {
          this.activeFicUsdRate = parsed;
        }
      }
    } catch {
      this.activeFicUsdRate = DEFAULT_USD_TO_FIC_RATE;
    }
  }

  /**
   * Get the current platform FIC-to-USD exchange rate (default 1 USD = 20 FIC, where 1 FIC = $0.05 USD)
   */
  public getFicUsdRate(): number {
    return this.activeFicUsdRate;
  }

  /**
   * Returns the exact USD value per 1 FIC (default $0.05c)
   */
  public getUsdPerFic(): number {
    return this.activeFicUsdRate > 0 ? 1 / this.activeFicUsdRate : DEFAULT_FIC_USD_VALUE;
  }

  /**
   * SuperAdmin update to the global platform FIC/USD exchange rate
   */
  public setPlatformFicRate(newRate: number): void {
    if (newRate <= 0) return;
    this.activeFicUsdRate = newRate;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_PLATFORM_FIC_RATE, newRate.toString());
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('Failed to cache platform FIC rate', err);
      }
    }
  }

  /**
   * Dynamically update the Nigerian Apex Bank (CBN) NFEM exchange rate and FIC Naira anchor
   */
  public setApexBankNairaRate(newNairaRate: number, ficNairaAnchor?: number): void {
    if (newNairaRate > 0) {
      COUNTRY_USD_RATES.NG.usdRate = newNairaRate;
      if (ficNairaAnchor && ficNairaAnchor > 0) {
        COUNTRY_USD_RATES.NG.ficRateDirect = ficNairaAnchor;
      }
      // Re-scale CNY fallback for NGN: newNairaRate / 7.24
      if (COUNTRY_CNY_RATES.NG) {
        COUNTRY_CNY_RATES.NG.cnyRate = parseFloat((newNairaRate / 7.24).toFixed(2));
      }
    }
  }

  /**
   * Returns current active Apex Bank Naira rate
   */
  public getApexBankNairaRate(): { usdRate: number; ficRateDirect: number } {
    return {
      usdRate: COUNTRY_USD_RATES.NG.usdRate,
      ficRateDirect: COUNTRY_USD_RATES.NG.ficRateDirect || DEFAULT_FIC_NAIRA_VALUE,
    };
  }

  /**
   * Primary exchange rate query with automatic CNY fallback hierarchy:
   * 1. Query country USD rate
   * 2. If USD unavailable, fallback to CNY rate
   * 3. Fallback to standard protocol rate (1 USD = 20 FIC / 1 FIC = $0.05c)
   */
  public async getExchangeRate(
    countryCode = 'US',
    baseCurrency: 'USD' | 'CNY' = 'USD'
  ): Promise<ExchangeRate> {
    const code = countryCode.toUpperCase();

    // Check USD rates
    if (baseCurrency === 'USD') {
      const countryData = COUNTRY_USD_RATES[code];
      if (countryData) {
        return {
          id: `rate-usd-${code}`,
          baseCurrency: 'USD',
          targetCurrency: countryData.currency,
          rate: countryData.usdRate,
          countryCode: code,
          provider: 'FingerMobile Global Forex Engine',
          updatedAt: new Date().toISOString(),
        };
      }

      // Fallback hierarchy: If USD rate not found for country, fallback to CNY
      const cnyFallbackData = COUNTRY_CNY_RATES[code];
      if (cnyFallbackData) {
        return {
          id: `rate-cny-fallback-${code}`,
          baseCurrency: 'CNY',
          targetCurrency: cnyFallbackData.currency,
          rate: cnyFallbackData.cnyRate,
          countryCode: code,
          provider: 'FingerMobile CNY Fallback Engine',
          updatedAt: new Date().toISOString(),
        };
      }
    }

    // Direct CNY request
    if (baseCurrency === 'CNY') {
      const cnyData = COUNTRY_CNY_RATES[code];
      if (cnyData) {
        return {
          id: `rate-cny-${code}`,
          baseCurrency: 'CNY',
          targetCurrency: cnyData.currency,
          rate: cnyData.cnyRate,
          countryCode: code,
          provider: 'FingerMobile Renminbi Gateway',
          updatedAt: new Date().toISOString(),
        };
      }
    }

    // Default Protocol Rate (1 USD = 20 FIC)
    return {
      id: 'rate-default-fic',
      baseCurrency: 'USD',
      targetCurrency: 'FIC',
      rate: this.activeFicUsdRate,
      countryCode: code,
      provider: 'FingerMobile Sovereign Protocol',
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Convert FIC amount to USD value:
   * At 1 FIC = $0.05c (1 USD = 20 FIC) -> ficAmount * 0.05
   */
  public ficToUsd(ficAmount: number): number {
    if (ficAmount <= 0) return 0;
    return parseFloat((ficAmount / this.activeFicUsdRate).toFixed(2));
  }

  /**
   * Convert USD amount to FIC tokens:
   * At 1 FIC = $0.05c (1 USD = 20 FIC) -> usdAmount * 20
   */
  public usdToFic(usdAmount: number): number {
    if (usdAmount <= 0) return 0;
    return parseFloat((usdAmount * this.activeFicUsdRate).toFixed(2));
  }

  /**
   * Convert FIC amount to Chinese Renminbi (CNY)
   * 1 USD = 7.24 CNY, 1 FIC = $0.05 USD -> 1 FIC = 0.05 * 7.24 = 0.362 CNY
   */
  public ficToCny(ficAmount: number): number {
    if (ficAmount <= 0) return 0;
    const usdVal = this.ficToUsd(ficAmount);
    return parseFloat((usdVal * (COUNTRY_USD_RATES.CN?.usdRate || 7.24)).toFixed(2));
  }

  /**
   * Convert FIC amount to member's local national currency:
   * For Nigeria: 1 FIC = ₦65.00 NGN (Apex Bank / CBN market benchmark)
   * For other countries: (ficAmount * 0.05) * countryUsdRate
   */
  public ficToLocalCurrency(
    ficAmount: number,
    countryCode = 'NG'
  ): { amount: number; currency: string; ratePerFic: number; formatted: string } {
    const code = countryCode.toUpperCase();
    const country = COUNTRY_USD_RATES[code] || COUNTRY_USD_RATES.NG;

    let localAmount: number;
    let ratePerFic: number;

    if (code === 'NG' && country.ficRateDirect) {
      ratePerFic = country.ficRateDirect; // ₦65.00k per 1 FIC
      localAmount = ficAmount * ratePerFic;
    } else {
      const usdEquivalent = this.ficToUsd(ficAmount);
      localAmount = usdEquivalent * country.usdRate;
      ratePerFic = (1 / this.activeFicUsdRate) * country.usdRate;
    }

    return {
      amount: parseFloat(localAmount.toFixed(2)),
      currency: country.currency,
      ratePerFic: parseFloat(ratePerFic.toFixed(2)),
      formatted: `${country.currency} ${localAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    };
  }

  /**
   * Converts all 4 wallet balances into their exact USD & CNY valuations
   */
  public convertMultiBalanceValuation(
    ficBalance: number,
    storeCreditBalance: number,
    stakeBalance: number
  ): MultiBalanceUsdValuation {
    const ficUsd = this.ficToUsd(ficBalance);
    const storeCreditUsd = this.ficToUsd(storeCreditBalance);
    const stakeUsd = this.ficToUsd(stakeBalance);
    const totalUsd = parseFloat((ficUsd + storeCreditUsd + stakeUsd).toFixed(2));
    const ficCny = this.ficToCny(ficBalance);

    return {
      ficUsd,
      storeCreditUsd,
      stakeUsd,
      totalUsd,
      ficCny,
      rateUsed: this.activeFicUsdRate,
    };
  }

  /**
   * Returns all available country exchange pairs for selection dropdowns
   */
  public getAllCountryRates(): Array<{
    countryCode: string;
    currency: string;
    name: string;
    usdRate: number;
    ficRate: number;
  }> {
    return Object.entries(COUNTRY_USD_RATES).map(([code, data]) => {
      const ficRate = data.ficRateDirect || parseFloat(((1 / this.activeFicUsdRate) * data.usdRate).toFixed(2));
      return {
        countryCode: code,
        currency: data.currency,
        name: data.name,
        usdRate: data.usdRate,
        ficRate,
      };
    });
  }
}

export const exchangeRateService = new ExchangeRateService();
export default exchangeRateService;
