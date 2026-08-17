
import sys
import os
import re

def refactor_icons(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Determine relative path to icons library
    depth = len(filepath.split(os.sep)) - 1
    # Assuming icons are in src/components/icons/index.tsx
    # If file is src/pages/AboutPage.tsx, path is ../components/icons
    # If file is src/components/dashboard/CreatorDashboard.tsx, path is ../icons
    
    parts = filepath.split(os.sep)
    if 'pages' in parts:
        icons_path = '../components/icons'
    elif 'components' in parts:
        # Check if it's in a subdirectory of components
        comp_index = parts.index('components')
        if len(parts) > comp_index + 2: # e.g. components/dashboard/CreatorDashboard.tsx
             icons_path = '../icons'
        else:
             icons_path = './icons'
    elif 'layouts' in parts:
        icons_path = '../components/icons'
    else:
        icons_path = './components/icons'

    # Replace heroicons imports
    new_content = re.sub(r"from ['\"]@heroicons/react/[^'\"]+['\"]", f"from '{icons_path}'", content)
    new_content = re.sub(r"from ['\"]@heroicons/react['\"]", f"from '{icons_path}'", content)

    if new_content != content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Refactored {filepath}")

if __name__ == '__main__':
    for arg in sys.argv[1:]:
        if os.path.isfile(arg):
            refactor_icons(arg)
