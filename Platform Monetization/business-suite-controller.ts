import type { Request, Response } from 'express'
import { businessSuiteService } from './business-suite-service.js'
import {
  parseApplicationPayload,
  parseBusinessVerificationPayload,
  parseConfigPayload,
  parseEstimatePayload,
  parseHallmarkPayload,
  parsePayoutPayload,
} from './requests.js'
import { sendCreated, sendOk } from './http.js'

export const businessSuiteController = {
  getOverview(req: Request, res: Response) {
    return sendOk(res, businessSuiteService.getOverview())
  },
  getHallmarks(req: Request, res: Response) {
    return sendOk(res, businessSuiteService.getOverview().hallmarkPage)
  },
  createHallmark(req: Request, res: Response) {
    const payload = parseHallmarkPayload(req.body)
    const page = businessSuiteService.createHallmarkPage(payload)

    return sendCreated(res, page, 'HallMarks Page created')
  },
  updateHallmark(req: Request, res: Response) {
    const payload = parseHallmarkPayload(req.body)
    const page = businessSuiteService.updateHallmarkPage({
      id: req.params.id,
      ...payload,
      billingPlan: payload.billingPlan,
    })

    return sendOk(res, page, 'HallMarks Page updated')
  },
  getPrograms(req: Request, res: Response) {
    return sendOk(res, businessSuiteService.getPrograms())
  },
  getEligibility(req: Request, res: Response) {
    return sendOk(res, businessSuiteService.getEligibility())
  },
  submitApplication(req: Request, res: Response) {
    const productKey = parseApplicationPayload(req.body)
    const application = businessSuiteService.submitMonetizationApplication(
      productKey,
    )

    return sendCreated(res, application, 'Application submitted')
  },
  estimate(req: Request, res: Response) {
    const payload = parseEstimatePayload(req.body)
    return sendOk(res, businessSuiteService.estimateRevenue(payload))
  },
  getVerificationStatus(req: Request, res: Response) {
    return sendOk(res, businessSuiteService.getVerificationStatus())
  },
  updateBusinessVerification(req: Request, res: Response) {
    const payload = parseBusinessVerificationPayload(req.body)
    return sendOk(
      res,
      businessSuiteService.updateBusinessVerification(payload),
      'Business verification submitted',
    )
  },
  updatePayoutAccount(req: Request, res: Response) {
    const payload = parsePayoutPayload(req.body)
    return sendOk(
      res,
      businessSuiteService.updatePayoutAccount(payload),
      'Payout account updated',
    )
  },
  getRevenue(req: Request, res: Response) {
    return sendOk(res, businessSuiteService.getRevenueSummary())
  },
  getAffiliate(req: Request, res: Response) {
    return sendOk(res, businessSuiteService.getAffiliateSummary())
  },
  getPolicy(req: Request, res: Response) {
    return sendOk(res, businessSuiteService.getPolicy())
  },
  getAdmin(req: Request, res: Response) {
    return sendOk(res, businessSuiteService.getAdminMonitoring())
  },
  updateConfig(req: Request, res: Response) {
    const payload = parseConfigPayload(req.body)
    return sendOk(res, businessSuiteService.updateConfig(payload), 'Config updated')
  },
  trackWebhook(req: Request, res: Response) {
    const eventType =
      typeof req.body?.eventType === 'string' ? req.body.eventType : 'unknown'
    return sendCreated(
      res,
      businessSuiteService.trackWebhook(eventType, req.body),
      'Webhook accepted',
    )
  },
  health(req: Request, res: Response) {
    return sendOk(res, {
      status: 'healthy',
      requestId: req.requestId,
      time: new Date().toISOString(),
    })
  },
}
