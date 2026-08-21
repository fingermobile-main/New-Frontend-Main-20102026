const { monetizationDb } = require("../db");
const { logSecurityEvent } = require("../utils/securityLogger");

// Mock API service for fetching real-time exchange rates
// In production, this would connect to a real exchange rate API
const ExchangeRateApiService = {
  async fetchRates(countryCode) {
    // This is a mock implementation
    // In a real implementation, this would connect to an exchange rate API
    // such as Fixer.io, Open Exchange Rates, etc.

    // For demonstration purposes, returning mock data
    const mockRates = {
      US: { USD: 1.0, CNY: 7.2 } // US uses USD, NG: { USD: 1.0, CNY: 7.2 } // Nigeria (using USD as primary), CN: { USD: 0.14, CNY: 1.0 } // China uses CNY, UK: { USD: 1.25, CNY: 9.0 } // UK, IN: { USD: 0.012, CNY: 0.086 } // India, KE: { USD: 0.0075, CNY: 0.054 } // Kenya, ZA: { USD: 0.053, CNY: 0.38 } // South Africa, BR: { USD: 0.19, CNY: 1.38 } // Brazil, RU: { USD: 0.011, CNY: 0.078 } // Russia, EU: { USD: 1.1, CNY: 7.9 } // European Union
    };

    const rates = mockRates[countryCode] || mockRates["US"]; // Default to US rates

    return {
      success: true,
      rates: {
        USD: rates.USD,
        CNY: rates.CNY,
        lastUpdated: new Date().toISOString()
      }
    };
  }
};

class ExchangeRateService {
  // Get real-time exchange rate for a specific country
  static async getExchangeRate(countryCode, baseCurrency = "USD") {
    try {
      // Try to get country-specific rate from our database
      let result = await monetizationDb.query(
        `SELECT * FROM exchange_rates 
         WHERE country_code = $1 AND base_currency = $2
         ORDER BY updated_at DESC LIMIT 1`,
        [countryCode, baseCurrency],
      );

      if (result.rows.length === 0 && baseCurrency === "USD") {
        // Fallback to CNY if USD unavailable for country
        result = await monetizationDb.query(
          `SELECT * FROM exchange_rates 
           WHERE country_code = $1 AND base_currency = 'CNY'
           ORDER BY updated_at DESC LIMIT 1`,
          [countryCode],
        );
      }

      if (result.rows.length === 0) {
        // Fetch from external API and cache in our database
        const apiResponse =
          await ExchangeRateApiService.fetchRates(countryCode);

        if (apiResponse.success) {
          // Cache the rates in our database
          const ratesToCache = [];

          for (const [currency, rate] of Object.entries(apiResponse.rates)) {
            if (currency !== "lastUpdated") {
              const expiry = new Date();
              expiry.setHours(expiry.getHours() + 1); // Expire in 1 hour

              const insertResult = await monetizationDb.query(
                `INSERT INTO exchange_rates 
                 (base_currency, target_currency, rate, country_code, provider, updated_at, expires_at)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)
                 RETURNING *`,
                [
                  currency,
                  "FIC",
                  rate,
                  countryCode,
                  "MockAPI",
                  new Date(),
                  expiry
                ],
              );

              ratesToCache.push(insertResult.rows[0]);
            }
          }

          // Return the requested currency rate
          const requestedRate = ratesToCache.find(
            (r) => r.base_currency === baseCurrency,
          ) ||
            ratesToCache.find((r) => r.base_currency === "CNY") || {
              rate: 16,
              base_currency: "USD",
              target_currency: "FIC"
            }; // Default fallback

          return requestedRate;
        } else {
          // If API fails, return default rate
          return { rate: 16, base_currency: "USD", target_currency: "FIC" }; // Default 1 USD = 16 FIC
        }
      }

      // Check if rate has expired
      const rate = result.rows[0];
      const now = new Date();
      if (new Date(rate.expires_at) < now) {
        // Refresh the rate
        return await this.refreshExchangeRate(countryCode, rate.base_currency);
      }

      return rate;
    } catch (error) {
      logger.error("Error getting exchange, rate:", error);
      // Return default rate in case of error
      return { rate: 16, base_currency: "USD", target_currency: "FIC" }; // Default 1 USD = 16 FIC
    }
  }

  // Refresh a specific exchange rate
  static async refreshExchangeRate(countryCode, baseCurrency) {
    try {
      const apiResponse = await ExchangeRateApiService.fetchRates(countryCode);

      if (apiResponse.success) {
        const newRate = apiResponse.rates[baseCurrency];
        if (newRate) {
          const expiry = new Date();
          expiry.setHours(expiry.getHours() + 1); // Expire in 1 hour

          const result = await monetizationDb.query(
            `INSERT INTO exchange_rates 
             (base_currency, target_currency, rate, country_code, provider, updated_at, expires_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [
              baseCurrency,
              "FIC",
              newRate,
              countryCode,
              "MockAPI",
              new Date(),
              expiry
            ],
          );

          return result.rows[0];
        }
      }

      // If refresh fails, return default
      return { rate: 16, base_currency: "USD", target_currency: "FIC" };
    } catch (error) {
      logger.error("Error refreshing exchange, rate:", error);
      return { rate: 16, base_currency: "USD", target_currency: "FIC" }; // Default fallback
    }
  }

  // Update all rates from external API (for scheduled updates)
  static async updateAllRates() {
    try {
      // In a real implementation, this would update rates for all countries
      // For demo purposes, we'll just log the action
      logger.info("Updating all exchange rates from external API...");

      // This could be implemented to update all cached rates periodically
      // to keep them fresh without waiting for individual requests
    } catch (error) {
      logger.error("Error updating all, rates:", error);
    }
  }

  // Convert an amount from one currency to FIC
  static async convertToFIc(amount, fromCurrency, countryCode) {
    try {
      // First, convert to USD if needed
      let usdAmount = amount;
      if (fromCurrency !== "USD") {
        // Get conversion rate from fromCurrency to USD
        // This is simplified - in reality you'd need cross-currency rates
        const exchangeRate = await this.getExchangeRate(countryCode, "USD");
        usdAmount = amount / exchangeRate.rate; // Adjust based on actual cross-rate
      }

      // Then convert USD to FIC using the standard rate
      const ficExchangeRate = await this.getExchangeRate(countryCode, "USD");
      const ficAmount = usdAmount * ficExchangeRate.rate;

      return {
        originalAmount: amount,
        originalCurrency: fromCurrency,
        ficAmount: ficAmount,
        exchangeRate: ficExchangeRate.rate,
        conversionDate: new Date()
      };
    } catch (error) {
      logger.error("Error converting to, FIC:", error);
      throw error;
    }
  }

  // Get all available rates for a country
  static async getAllRatesForCountry(countryCode) {
    try {
      const result = await monetizationDb.query(
        `SELECT * FROM exchange_rates 
         WHERE country_code = $1
         AND expires_at > NOW()
         ORDER BY base_currency`,
        [countryCode],
      );

      return result.rows;
    } catch (error) {
      logger.error("Error getting all rates for, country:", error);
      throw error;
    }
  }
}

module.exports = ExchangeRateService;
