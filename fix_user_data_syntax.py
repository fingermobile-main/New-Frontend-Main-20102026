import os
import re

def fix_syntax_in_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Fix: user: {, -> user: {
    # Fix: data: {, -> data: {
    # Fix: metadata: {, -> metadata: {
    # It might have spaces or newlines, but the grep showed exactly "  user: {,"
    new_content = re.sub(r'user:\s*\{,', 'user: {', content)
    new_content = re.sub(r'data:\s*\{,', 'data: {', new_content)
    new_content = re.sub(r'metadata:\s*\{,', 'metadata: {', new_content)
    
    # Also I noticed in auth.js: 
    # console.error('Registration,
    # error:', error);
    # This is a multi-line string that is broken.
    new_content = re.sub(r"console\.error\('([^']+),\nerror:',", r"console.error('\1 error:',", new_content)
    
    if new_content != content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Fixed {filepath}")

def process_directory(directory):
    for root, _, files in os.walk(directory):
        if "node_modules" in root or ".git" in root or "ARCHIVES" in root:
            continue
        for file in files:
            if file.endswith('.js') or file.endswith('.ts'):
                fix_syntax_in_file(os.path.join(root, file))

if __name__ == "__main__":
    process_directory('.')
