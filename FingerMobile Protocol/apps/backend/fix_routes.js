const logger = require('./utils/logger');
const fs = require('fs');
const path = require('path');

const backendDir = '/Users/user/Documents/FingerMobile Protocol Communication/FingerMobile Protocol/apps/backend';
const routesDir = path.join(backendDir, 'routes');
const indexPath = path.join(routesDir, 'index.js');
let indexContent = fs.readFileSync(indexPath, 'utf8');

const routeFiles = fs.readdirSync(routesDir)
  .filter(f => f.endsWith('.js') && f !== 'index.js');

let added = 0;
routeFiles.forEach((file) => {
  const name = file.replace('.js', '');
  if (!indexContent.includes(`require('./${name}')`) && !indexContent.includes(`require("./${name}")`) && !file.includes('backup')) {
    const importName = name.replace(/[^a-zA-Z0-9]/g, '') + 'Routes';
    const importStmt = `const ${importName} = require('./${name}');\n`;
    const useStmt = `router.use('/${name.replace(/_/g, '-')}', authenticate, ${importName});\n`;

    // Add to the end of imports (before const router = express.Router();)
    indexContent = indexContent.replace('const router = express.Router();', `${importStmt}\nconst router = express.Router();`);

    // Add to the end of router uses (before module.exports = router;)
    indexContent = indexContent.replace('module.exports = router;', `${useStmt}\nmodule.exports = router;`);
    added++;
  }
});

fs.writeFileSync(indexPath, indexContent);
logger.info(`Registered ${added} missing routes.`);
