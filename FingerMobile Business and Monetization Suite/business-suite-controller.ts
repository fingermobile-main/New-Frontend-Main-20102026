  getOverview(_req: Request, res: Response) {
    const overview = businessSuiteService.getOverview()

    return sendOk(res, overview)
  },

  getSeshat(_req: Request, res: Response) {
    const page = businessSuiteService.getSeshatPage()

    return sendOk(res, page)
  },

  // ... other methods with unused req parameters ...

  getPrograms(_req: Request, res: Response) {
    return sendOk(res, businessSuiteService.getPrograms())
  },

  getEligibility(_req: Request, res: Response) {
    return sendOk(res, businessSuiteService.getEligibility())
  },

  // ... continue for other methods that have unused req parameters ...

  estimate(_req: Request, res: Response) {
    // Parse from the body instead of params since payload comes from request body
    const payload = parseEstimatePayload(_req.body)
    // Map EstimatePayload to EstimateRequest structure
    const estimateRequest: EstimateRequest = {
      projectedVolume: payload.projectedVolume,
      conversionRate: payload.conversionRate,
      averageOrderValue: payload.averageOrderValue
    };
    return sendOk(res, businessSuiteService.estimateRevenue(estimateRequest))
  },

  getApplications: (_req: Request, res: Response) => {
    return sendOk(res, businessSuiteService.getApplications())
  },

  createApplication: (_req: Request, res: Response) => {
    const payload = parseApplicationPayload(_req.body)
    const productKey = payload.productKey as ProductKey;
    return sendCreated(
      res,
      businessSuiteService.submitMonetizationApplication(productKey),
    )
  },

  getApplicationById: (_req: Request, res: Response) => {
    return sendOk(res, businessSuiteService.getApplicationById(_req.params.id))
  },

  updateApplication: (_req: Request, res: Response) => {
    return sendOk(res, businessSuiteService.updateApplication(_req.params.id, _req.body))
  },

  deleteApplication: (_req: Request, res: Response) => {
    businessSuiteService.deleteApplication(_req.params.id)

    return res.status(204).send()
  },

  getBusinessVerifications: (_req: Request, res: Response) => {
    // TODO: Implement getBusinessVerifications
    return sendOk(res, [])
  },

  createBusinessVerification: (_req: Request, res: Response) => {
    // TODO: Implement createBusinessVerification
    return sendCreated(res, { id: 'temp-id' })
  },

  getBusinessVerificationById: (_req: Request, res: Response) => {
    // TODO: Implement getBusinessVerificationById
    return sendOk(res, { id: _req.params.id })
  },

  updateBusinessVerification: (_req: Request, res: Response) => {
    // TODO: Implement updateBusinessVerification
    return sendOk(res, { id: _req.params.id, ..._req.body })
  },

  deleteBusinessVerification: (_req: Request, res: Response) => {
    // TODO: Implement deleteBusinessVerification
    return res.status(204).send()
  },

  // ... continue for other methods ...