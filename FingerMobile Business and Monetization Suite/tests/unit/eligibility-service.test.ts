import { describe, it, expect } from 'vitest'
import { eligibilityService } from '../../eligibility-service'
import type { MonetizationMetrics, PlatformConfig } from '../../shared/types'
import { DEFAULT_PLATFORM_CONFIG } from '../../constants'

describe('Eligibility Service', () => {
  const mockMetrics: MonetizationMetrics = {
    followers: 15000,
    watchMinutes30d: 80000,
    postEngagement30d: 50000,
    accountAgeDays: 90,
    originalContentScore: 85,
    policyViolations: 0,
    userBase: 100000,
    revenuePotential: 500,
    contentVolume: 50,
    engagementRate: 5,
    geographicDistribution: {},
    deviceBreakdown: {},
    riskFactors: []
  }

  const mockConfig: PlatformConfig = DEFAULT_PLATFORM_CONFIG

  describe('checkEligibility', () => {
    it('should return eligible status for qualifying metrics', async () => {
      const result = await eligibilityService.checkEligibility(mockMetrics, mockConfig)
      
      expect(result).toBeDefined()
      expect(result.universalStatus).toBe('eligible')
      expect(result.alerts).toHaveLength(0)
    })

    it('should block eligibility for underage user', async () => {
      const underageMetrics = { ...mockMetrics, accountAgeDays: 10 }
      const result = await eligibilityService.checkEligibility(underageMetrics, mockConfig)
      
      expect(result.universalStatus).toBe('ineligible')
      expect(result.alerts).toContain('Account must be at least 30 days old. Current age: 10 days')
    })
  })

  describe('generateAlerts', () => {
    it('should return empty array for compliant metrics', async () => {
      const alerts = await eligibilityService.generateAlerts(mockMetrics, mockConfig)
      expect(alerts).toHaveLength(0)
    })
  })
})