import { describe, it, expect } from 'vitest'
import { evaluateEligibility, getUniversalAlerts } from '../../eligibility-service'
import type { MonetizationMetrics, PlatformConfig, EligibilityResult } from '../../types'
import { DEFAULT_PLATFORM_CONFIG } from '../../constants'

describe('Eligibility Service', () => {
  const mockMetrics: MonetizationMetrics = {
    followers: 15000,
    watchMinutes60d: 120000,
    watchMinutes30d: 80000,
    postEngagement30d: 50000,
    returningViewers30d: 600,
    uniqueViews30d: 400000,
    activeVideos: 40,
    consecutiveFollowerDays: 70,
    accountAgeDays: 90,
    age: 25,
    isEligibleCountry: true,
    originalContentScore: 85,
    policyViolations: 0,
    giftPurchaseEligible: true,
    verifiedBusiness: true,
    verifiedPayout: true,
  }

  const mockConfig: PlatformConfig = DEFAULT_PLATFORM_CONFIG

  describe('evaluateEligibility', () => {
    it('should return eligible status for qualifying metrics', () => {
      const result = evaluateEligibility(mockMetrics, mockConfig)
      
      expect(result).toBeDefined()
      expect(result.universalStatus).toBe('eligible')
      expect(result.products).toHaveLength(5)
      expect(result.universalAlerts).toHaveLength(0)
    })

    it('should block eligibility for underage user', () => {
      const underageMetrics = { ...mockMetrics, age: 18 }
      const result = evaluateEligibility(underageMetrics, mockConfig)
      
      expect(result.universalStatus).toBe('blocked')
      expect(result.universalAlerts).toContain('Member must be at least 22 years old.')
    })

    it('should warn for unsupported country', () => {
      const unsupportedMetrics = { ...mockMetrics, isEligibleCountry: false }
      const result = evaluateEligibility(unsupportedMetrics, mockConfig)
      
      expect(result.universalStatus).toBe('warning')
      expect(result.universalAlerts).toContain('Monetization is unavailable in the current country setting.')
    })

    it('should evaluate in_stream_ads product correctly', () => {
      const result = evaluateEligibility(mockMetrics, mockConfig)
      const adsProduct = result.products.find((p: EligibilityResult) => p.product === 'in_stream_ads')
      
      expect(adsProduct).toBeDefined()
      expect(adsProduct?.status).toBe('eligible')
    })

    it('should block gifts if follower consistency not met', () => {
      const lowConsistencyMetrics = { ...mockMetrics, consecutiveFollowerDays: 30 }
      const result = evaluateEligibility(lowConsistencyMetrics, mockConfig)
      const giftsProduct = result.products.find((p: EligibilityResult) => p.product === 'gifts')
      
      expect(giftsProduct?.status).toBe('blocked')
      expect(giftsProduct?.failedRules).toContain('Requires 60 consecutive days of qualifying followers.')
    })
  })

  describe('getUniversalAlerts', () => {
    it('should return empty array for compliant metrics', () => {
      const alerts = getUniversalAlerts(mockMetrics, mockConfig)
      expect(alerts).toHaveLength(0)
    })

    it('should return alert for policy violations', () => {
      const violationMetrics = { ...mockMetrics, policyViolations: 2 }
      const alerts = getUniversalAlerts(violationMetrics, mockConfig)
      
      expect(alerts).toContain('Policy violations are blocking one or more monetization products.')
    })

    it('should return alert for missing payout account', () => {
      const noPayoutMetrics = { ...mockMetrics, verifiedPayout: false }
      const alerts = getUniversalAlerts(noPayoutMetrics, mockConfig)
      
      expect(alerts).toContain('A verified payout account is required to collect earnings.')
    })

    it('should return multiple alerts for multiple issues', () => {
      const problematicMetrics = {
        ...mockMetrics,
        age: 20,
        accountAgeDays: 15,
        policyViolations: 1,
      }
      const alerts = getUniversalAlerts(problematicMetrics, mockConfig)
      
      expect(alerts.length).toBeGreaterThan(1)
    })
  })
})