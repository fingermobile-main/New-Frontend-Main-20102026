const fs = require('fs');
const path = require('path');

class ExportService {
  async exportToCSV(data, filename = 'export') {
    try {
      // Simple CSV generation
      if (!data || data.length === 0) {
        return { success: false, error: 'No data to export' };
      }

      const headers = Object.keys(data[0]).join(',');
      const rows = data.map(row => 
        Object.values(row).map(val => 
          typeof val === 'string' && val.includes(',') ? `"${val}"` : val
        ).join(',')
      );
      
      const csv = [headers, ...rows].join('\n');
      const filePath = path.join(__dirname, '../exports', `${filename}_${Date.now()}.csv`);
      
      // Ensure exports directory exists
      if (!fs.existsSync(path.join(__dirname, '../exports'))) {
        fs.mkdirSync(path.join(__dirname, '../exports'), { recursive: true });
      }
      
      fs.writeFileSync(filePath, csv);
      
      logger.info(`✅ CSV exported: ${filePath}`);
      return { success: true, filePath, filename: path.basename(filePath) };
    } catch (error) {
      logger.error('❌ CSV export failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  async exportToJSON(data, filename = 'export') {
    try {
      const json = JSON.stringify(data, null, 2);
      const filePath = path.join(__dirname, '../exports', `${filename}_${Date.now()}.json`);
      
      if (!fs.existsSync(path.join(__dirname, '../exports'))) {
        fs.mkdirSync(path.join(__dirname, '../exports'), { recursive: true });
      }
      
      fs.writeFileSync(filePath, json);
      
      logger.info(`✅ JSON exported: ${filePath}`);
      return { success: true, filePath, filename: path.basename(filePath) };
    } catch (error) {
      logger.error('❌ JSON export failed:', error.message);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new ExportService();
