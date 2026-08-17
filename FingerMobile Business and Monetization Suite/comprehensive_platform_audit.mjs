import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Comprehensive Platform Audit Script
 * Identifies missing components, controllers, database entities, and service implementations
 */
async function runComprehensiveAudit() {
  console.log('Starting Comprehensive Platform Audit...\n');

  // Define expected entities and their components
  const expectedEntities = [
    'User',
    'SeshatPage',
    'ContentMetrics',
    'BusinessVerification',
    'MonetizationApplication',
    'RevenueLedgerEntry',
    'Payout',
    'PayoutAccount',
    'PlatformConfig',
    'AffiliateEvent',
    'WebhookEvent',
    'AuditLog'
    // Add more entities as needed
  ];

  // Define expected component types for each entity
  const componentTypes = [
    'types.ts interface',
    'repository method',
    'service method',
    'controller method',
    'API endpoint',
    'database table schema',
    'database migration'
  ];

  console.log('Checking for expected entities in types.ts...');
  const typesFilePath = path.join(__dirname, 'types.ts');
  let typesContent = '';
  if (fs.existsSync(typesFilePath)) {
    typesContent = fs.readFileSync(typesFilePath, 'utf8');
  } else {
    console.error('ERROR: types.ts file not found!');
  }

  const missingInterfaces = [];
  expectedEntities.forEach(entity => {
    const interfacePattern = new RegExp(`interface\\s+${entity}\\s*\\{`, 'g');
    if (!interfacePattern.test(typesContent)) {
      missingInterfaces.push(entity);
    }
  });

  if (missingInterfaces.length > 0) {
    console.log(`Missing interfaces in types.ts: ${missingInterfaces.join(', ')}`);
  } else {
    console.log('All expected interfaces found in types.ts');
  }

  console.log('\nChecking for repository methods...');
  const repositoryFilePath = path.join(__dirname, 'repository.ts');
  let repositoryContent = '';
  if (fs.existsSync(repositoryFilePath)) {
    repositoryContent = fs.readFileSync(repositoryFilePath, 'utf8');
  } else {
    console.error('ERROR: repository.ts file not found!');
  }

  const missingRepositoryMethods = [];
  expectedEntities.forEach(entity => {
    // Check for get, create, update methods for each entity
    const getMethodPattern = new RegExp(`get${entity}|get${entity}s|get[A-Za-z]*${entity}`, 'g');
    const createMethodPattern = new RegExp(`create${entity}|add${entity}`, 'g');
    const updateMethodPattern = new RegExp(`update${entity}`, 'g');
    
    if (!getMethodPattern.test(repositoryContent)) {
      missingRepositoryMethods.push(`get${entity}`);
    }
    if (!createMethodPattern.test(repositoryContent)) {
      missingRepositoryMethods.push(`create${entity}`);
    }
    if (!updateMethodPattern.test(repositoryContent)) {
      missingRepositoryMethods.push(`update${entity}`);
    }
  });

  if (missingRepositoryMethods.length > 0) {
    console.log(`Missing repository methods: ${missingRepositoryMethods.join(', ')}`);
  } else {
    console.log('All expected repository methods found');
  }

  console.log('\nChecking for service methods...');
  const serviceFilePath = path.join(__dirname, 'business-suite-service.ts');
  let serviceContent = '';
  if (fs.existsSync(serviceFilePath)) {
    serviceContent = fs.readFileSync(serviceFilePath, 'utf8');
  } else {
    console.error('ERROR: business-suite-service.ts file not found!');
  }

  const missingServiceMethods = [];
  expectedEntities.forEach(entity => {
    // Check for get, create, update methods for each entity
    const getMethodPattern = new RegExp(`get${entity}|get${entity}s|get[A-Za-z]*${entity}`, 'g');
    const createMethodPattern = new RegExp(`create${entity}|add${entity}`, 'g');
    const updateMethodPattern = new RegExp(`update${entity}`, 'g');
    
    if (!getMethodPattern.test(serviceContent)) {
      missingServiceMethods.push(`get${entity}`);
    }
    if (!createMethodPattern.test(serviceContent)) {
      missingServiceMethods.push(`create${entity}`);
    }
    if (!updateMethodPattern.test(serviceContent)) {
      missingServiceMethods.push(`update${entity}`);
    }
  });

  if (missingServiceMethods.length > 0) {
    console.log(`Missing service methods: ${missingServiceMethods.join(', ')}`);
  } else {
    console.log('All expected service methods found');
  }

  console.log('\nChecking for controller methods...');
  const controllerFilePath = path.join(__dirname, 'business-suite-controller.ts');
  let controllerContent = '';
  if (fs.existsSync(controllerFilePath)) {
    controllerContent = fs.readFileSync(controllerFilePath, 'utf8');
  } else {
    console.error('ERROR: business-suite-controller.ts file not found!');
  }

  const missingControllerMethods = [];
  expectedEntities.forEach(entity => {
    // Check for GET, POST, PUT methods for each entity
    const getMethodPattern = new RegExp(`GET\\s+"/api/[a-zA-Z]+/${entity.toLowerCase()}|GET\\s+"/api/${entity.toLowerCase()}s?"`, 'g');
    const postMethodPattern = new RegExp(`POST\\s+"/api/[a-zA-Z]+/${entity.toLowerCase()}|POST\\s+"/api/${entity.toLowerCase()}s?"`, 'g');
    const putMethodPattern = new RegExp(`PUT\\s+"/api/[a-zA-Z]+/${entity.toLowerCase()}|PUT\\s+"/api/${entity.toLowerCase()}s?"`, 'g');
    
    if (!getMethodPattern.test(controllerContent)) {
      missingControllerMethods.push(`GET /api/${entity.toLowerCase()}s`);
    }
    if (!postMethodPattern.test(controllerContent)) {
      missingControllerMethods.push(`POST /api/${entity.toLowerCase()}s`);
    }
    if (!putMethodPattern.test(controllerContent)) {
      missingControllerMethods.push(`PUT /api/${entity.toLowerCase()}s`);
    }
  });

  if (missingControllerMethods.length > 0) {
    console.log(`Missing controller methods: ${missingControllerMethods.join(', ')}`);
  } else {
    console.log('All expected controller methods found');
  }

  console.log('\nChecking for database schema...');
  const schemaFilePath = path.join(__dirname, 'schema.sql');
  const dbFilePath = path.join(__dirname, 'database.ts');
  
  let schemaContent = '';
  if (fs.existsSync(schemaFilePath)) {
    schemaContent = fs.readFileSync(schemaFilePath, 'utf8');
  } else {
    console.log('INFO: schema.sql file not found, checking database.ts instead');
  }
  
  if (fs.existsSync(dbFilePath)) {
    const dbContent = fs.readFileSync(dbFilePath, 'utf8');
    schemaContent += dbContent;
  } else {
    console.error('ERROR: database.ts file not found!');
  }

  const missingTables = [];
  expectedEntities.forEach(entity => {
    const tablePattern = new RegExp(`${entity.toLowerCase()}|${entity}s|_${entity}_|_${entity}s_`, 'gi');
    if (!tablePattern.test(schemaContent)) {
      missingTables.push(entity);
    }
  });

  if (missingTables.length > 0) {
    console.log(`Missing database tables for entities: ${missingTables.join(', ')}`);
  } else {
    console.log('All expected database tables found');
  }

  console.log('\nChecking for API endpoints in app.ts...');
  const appFilePath = path.join(__dirname, 'app.ts');
  let appContent = '';
  if (fs.existsSync(appFilePath)) {
    appContent = fs.readFileSync(appFilePath, 'utf8');
  } else {
    console.error('ERROR: app.ts file not found!');
  }

  const missingEndpoints = [];
  expectedEntities.forEach(entity => {
    const endpointPattern = new RegExp(`/api/${entity.toLowerCase()}|/api/${entity.toLowerCase()}s`, 'g');
    if (!endpointPattern.test(appContent)) {
      missingEndpoints.push(`/api/${entity.toLowerCase()}s`);
    }
  });

  if (missingEndpoints.length > 0) {
    console.log(`Missing API endpoints: ${missingEndpoints.join(', ')}`);
  } else {
    console.log('All expected API endpoints found');
  }

  console.log('\nChecking for Docker configuration...');
  const dockerfilePath = path.join(__dirname, 'Dockerfile');
  const dockerComposePath = path.join(__dirname, 'docker-compose.yml');
  
  if (!fs.existsSync(dockerfilePath)) {
    console.log('WARNING: Dockerfile not found');
  } else {
    console.log('Dockerfile found');
  }
  
  if (!fs.existsSync(dockerComposePath)) {
    console.log('WARNING: docker-compose.yml not found');
  } else {
    console.log('docker-compose.yml found');
  }

  console.log('\nAudit completed.');
}

// Run the audit
runComprehensiveAudit().catch(console.error);
