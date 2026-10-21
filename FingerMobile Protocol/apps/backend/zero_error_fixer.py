import json
import os

with open('eslint_report.json', 'r') as f:
    data = json.load(f)

# Group errors by file
files_to_fix = {}
for file in data:
    filepath = file['filePath']
    messages = file['messages']
    
    missing_imports = set()
    lines_to_delete = []
    
    for msg in messages:
        if msg.get('ruleId') == 'no-undef':
            var_name = msg['message'].split("'")[1]
            missing_imports.add(var_name)
        
        elif msg.get('ruleId') == 'no-unused-vars':
            # We can mark lines to delete if we want, but ESLint --fix can't do this by default unless configured.
            pass
            
    if missing_imports:
        files_to_fix[filepath] = missing_imports

for filepath, imports in files_to_fix.items():
    print(f"Fixing {filepath}")
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Calculate depth to get to backend root for imports
    # Simple heuristic: count '/' after 'apps/backend/'
    rel_path = filepath.split('apps/backend/')[1]
    depth = rel_path.count('/')
    prefix = '../' * depth if depth > 0 else './'
    if prefix == '': prefix = './'
    
    inject = ""
    if 'logger' in imports:
        inject += f"const logger = require('{prefix}utils/logger');\n"
    if 'identityDb' in imports:
        inject += f"const {{ identityDb }} = require('{prefix}database/connection');\n"
    if 'sequelize' in imports:
        inject += f"const {{ sequelize }} = require('{prefix}database/connection');\n"
    if 'router' in imports:
        inject += f"const express = require('express');\nconst router = express.Router();\n"
        
    if inject:
        with open(filepath, 'w') as f:
            f.write(inject + "\n" + content)
            
print("Imports injected successfully.")
