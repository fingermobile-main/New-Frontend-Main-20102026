
import sys
import os
import re

def refactor_icons(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Determine relative path to src/components/icons
    # filepath is e.g. src/pages/dashboard/content/ContentCalendarPage.tsx
    parts = filepath.split(os.sep)
    # Find index of 'src'
    try:
        src_index = parts.index('src')
    except ValueError:
        return

    # Depth from src
    depth = len(parts) - src_index - 1
    # We want to go to src/components/icons
    # If depth is 1 (e.g. src/App.tsx), path is ./components/icons
    # If depth is 2 (e.g. src/pages/AboutPage.tsx), path is ../components/icons
    # If depth is 3 (e.g. src/pages/dashboard/Admin.tsx), path is ../../components/icons
    # If depth is 4 (e.g. src/pages/dashboard/content/Calendar.tsx), path is ../../../components/icons
    
    prefix = '../' * (depth - 1) if depth > 1 else './'
    icons_path = prefix + 'components/icons'

    # Replace heroicons imports
    new_content = re.sub(r"from ['\"]@heroicons/react(/[^'\"]+)?['\"]", f"from '{icons_path}'", content)
    new_content = re.sub(r"from [\"']\.\./components/icons[\"']", f"from '{icons_path}'", new_content) # fix my previous mess

    if new_content != content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Refactored {filepath} to {icons_path}")

if __name__ == '__main__':
    for arg in sys.argv[1:]:
        if os.path.isfile(arg):
            refactor_icons(arg)
