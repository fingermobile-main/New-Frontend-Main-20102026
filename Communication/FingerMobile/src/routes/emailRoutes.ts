import express, { Request, Response } from 'express';
import { plunkEmailService } from '../services/plunkEmailService';
import { deliverabilityService } from '../services/deliverabilityService';

const router = express.Router();

// 1. Send Transactional / Broadcast Email via Plunk
router.post('/send', async (req: Request, res: Response) => {
  try {
    const { to, subject, body, name, data, headers } = req.body;

    if (!to || !subject || !body) {
      return res.status(400).json({
        success: false,
        message: 'to, subject, and body are required'
      });
    }

    const recipient = Array.isArray(to) ? to[0] : to;

    // Check suppression list
    if (deliverabilityService.isSuppressed(recipient)) {
      return res.status(403).json({
        success: false,
        message: `Recipient ${recipient} is in the suppression list (bounced or complained). Dispatch cancelled to protect sender reputation.`
      });
    }

    // Check warm-up quota
    const quotaCheck = deliverabilityService.recordEmailSent();
    if (!quotaCheck.allowed) {
      return res.status(429).json({
        success: false,
        message: 'Daily IP warm-up quota reached. Sending throttled until midnight UTC to protect IP reputation.'
      });
    }

    // Dispatch via Plunk
    const result = await plunkEmailService.sendEmail({
      to,
      subject,
      body,
      name,
      data,
      headers
    });

    if (!result.success) {
      return res.status(502).json({
        success: false,
        message: 'Plunk dispatch failed',
        error: result.error
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Email dispatched successfully via Plunk',
      data: {
        id: result.id,
        timestamp: result.timestamp,
        remainingWarmupQuota: quotaCheck.remaining
      }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Server error sending email',
      error: error.message
    });
  }
});

// 2. Track Automated Workflow Event in Plunk
router.post('/track', async (req: Request, res: Response) => {
  try {
    const { event, email, data } = req.body;
    if (!event || !email) {
      return res.status(400).json({
        success: false,
        message: 'event and email are required'
      });
    }

    const result = await plunkEmailService.trackEvent({ event, email, data });
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 3. DNS Deliverability Diagnostic (PTR, SPF, DKIM, DMARC)
router.get('/deliverability', async (req: Request, res: Response) => {
  try {
    const domain = (req.query.domain as string) || 'fingermobile.com';
    const serverIp = (req.query.ip as string) || '198.51.100.25';

    const diagnostics = await deliverabilityService.checkDNSDeliverability(domain, serverIp);
    return res.status(200).json({
      success: true,
      data: diagnostics
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 4. IP Warm-up Status & Controls
router.get('/warmup', (req: Request, res: Response) => {
  const status = deliverabilityService.getWarmupStatus();
  return res.status(200).json({ success: true, data: status });
});

router.post('/warmup/advance', (req: Request, res: Response) => {
  const { week } = req.body;
  if (!week || week < 1 || week > 6) {
    return res.status(400).json({ success: false, message: 'Valid week between 1 and 6 is required' });
  }
  const status = deliverabilityService.setWarmupWeek(Number(week));
  return res.status(200).json({ success: true, data: status });
});

// 5. Suppression List Management
router.get('/suppressions', (req: Request, res: Response) => {
  const list = deliverabilityService.getSuppressionList();
  return res.status(200).json({ success: true, data: list });
});

router.post('/suppressions', (req: Request, res: Response) => {
  const { email, reason } = req.body;
  if (!email) return res.status(400).json({ success: false, message: 'Email is required' });
  deliverabilityService.suppressEmail(email, reason || 'manual');
  return res.status(200).json({ success: true, message: `Email ${email} added to suppression list` });
});

router.delete('/suppressions/:email', (req: Request, res: Response) => {
  const { email } = req.params;
  const removed = deliverabilityService.removeSuppression(email);
  return res.status(200).json({ success: true, removed });
});

// 6. Pre-flight Spam & Deliverability Content Analysis
router.post('/preflight', (req: Request, res: Response) => {
  const { subject = '', body = '' } = req.body;
  const analysis = deliverabilityService.analyzeEmailContent(subject, body);
  return res.status(200).json({ success: true, data: analysis });
});

export default router;
