const { aiBridgeExecute } = require('./controllers/MasterDashboardController');

const mockReq = {
  body: {
    prompt: 'Create a new table for caching analytics data and generate a react component for displaying it.'
  }
};

const mockRes = {
  status: function(code) {
    this.statusCode = code;
    return this;
  },
  json: function(data) {
    console.log(`Status: ${this.statusCode}`);
    console.log('Response:', JSON.stringify(data, null, 2));
  }
};

async function runTest() {
  console.log('Testing AI Bridge Execution...');
  await aiBridgeExecute(mockReq, mockRes);
}

runTest();
