/**
 * Financial Economic Ecosystem Controller
 * FingerMobile Protocol™ Production Architecture
 */

const financialEcosystemService = require('../services/financialEcosystemService');

exports.getRails = async (req, res) => {
  try {
    const revenueRails = financialEcosystemService.getRevenueRails();
    const profitRails = financialEcosystemService.getProfitRails();
    return res.status(200).json({
      success: true,
      data: {
        revenueRails,
        profitRails
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDefinitions = async (req, res) => {
  try {
    const definitions = financialEcosystemService.getEconomicDefinitions();
    return res.status(200).json({ success: true, data: definitions });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllSheets = async (req, res) => {
  try {
    const sheets = financialEcosystemService.getAllExcelSheets();
    return res.status(200).json({ success: true, count: Object.keys(sheets).length, data: sheets });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSheetByKey = async (req, res) => {
  try {
    const sheet = await financialEcosystemService.getExcelSheet(req.params.key);
    if (!sheet) {
      return res.status(404).json({ success: false, message: `Sheet ${req.params.key} not found` });
    }
    return res.status(200).json({ success: true, data: sheet });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSheet = async (req, res) => {
  try {
    const { key } = req.params;
    const { sheetData, metadata } = req.body;
    const payloadData = sheetData || req.body;
    const result = await financialEcosystemService.saveSheet(key, payloadData, metadata || {});
    return res.status(200).json({
      success: true,
      message: `Financial sheet ${key} updated and persisted to PostgreSQL`,
      data: result
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.approveSheet = async (req, res) => {
  try {
    const { key } = req.params;
    const { approver, notes } = req.body;
    const result = await financialEcosystemService.approveSheet(key, approver, notes);
    if (!result) {
      return res.status(404).json({ success: false, message: `Sheet ${key} not found or could not be approved` });
    }
    return res.status(200).json({
      success: true,
      message: `Financial sheet ${key} approved by SuperAdmin and locked`,
      data: result
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAuditLogs = async (req, res) => {
  try {
    const { sheetKey } = req.query;
    const logs = await financialEcosystemService.getAuditLogs(sheetKey);
    return res.status(200).json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.createAuditLog = async (req, res) => {
  try {
    await financialEcosystemService.recordAuditLog(req.body);
    return res.status(201).json({ success: true, message: 'Audit record committed' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getRatios = async (req, res) => {
  try {
    const ratios = financialEcosystemService.evaluateAccountingRatios();
    return res.status(200).json({ success: true, data: ratios });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.evaluateCustomRatios = async (req, res) => {
  try {
    const ratios = financialEcosystemService.evaluateAccountingRatios(req.body);
    return res.status(200).json({ success: true, data: ratios });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.calculateSimpleInterest = async (req, res) => {
  try {
    const { principal, rate, timeYears } = req.body;
    if (principal === undefined || rate === undefined || timeYears === undefined) {
      return res.status(400).json({ success: false, message: 'Missing principal, rate, or timeYears' });
    }
    const result = financialEcosystemService.calculateSimpleInterest(principal, rate, timeYears);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.calculateCompoundInterest = async (req, res) => {
  try {
    const { presentValue, rate, compoundingPeriodsPerYear, timeYears } = req.body;
    if (presentValue === undefined || rate === undefined || timeYears === undefined) {
      return res.status(400).json({ success: false, message: 'Missing presentValue, rate, or timeYears' });
    }
    const result = financialEcosystemService.calculateCompoundInterest(
      presentValue,
      rate,
      compoundingPeriodsPerYear || 1,
      timeYears
    );
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.calculatePresentValue = async (req, res) => {
  try {
    const { futureValue, discountRate, timeYears } = req.body;
    if (futureValue === undefined || discountRate === undefined || timeYears === undefined) {
      return res.status(400).json({ success: false, message: 'Missing futureValue, discountRate, or timeYears' });
    }
    const result = financialEcosystemService.calculatePresentValue(futureValue, discountRate, timeYears);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.calculateEffectiveAnnualRate = async (req, res) => {
  try {
    const { nominalRate, compoundingPeriodsPerYear } = req.body;
    if (nominalRate === undefined) {
      return res.status(400).json({ success: false, message: 'Missing nominalRate' });
    }
    const result = financialEcosystemService.calculateEffectiveAnnualRate(
      nominalRate,
      compoundingPeriodsPerYear || 1
    );
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getLedger = async (req, res) => {
  try {
    const ledger = financialEcosystemService.getLedger();
    return res.status(200).json({ success: true, count: ledger.length, data: ledger });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.recordLedgerEntry = async (req, res) => {
  try {
    const { entryTitle, amount } = req.body;
    if (!entryTitle || !amount) {
      return res.status(400).json({ success: false, message: 'Missing entryTitle or amount' });
    }
    const entry = financialEcosystemService.recordLedgerEntry(req.body);
    return res.status(201).json({ success: true, data: entry });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
