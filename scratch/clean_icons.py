
import sys

def clean_icons(filepath):
    with open(filepath, 'r') as f:
        lines = f.readlines()

    new_lines = []
    seen_exports = set()
    current_export = None
    collecting = False
    buffer = []

    for line in lines:
        if line.strip().startswith('export const '):
            export_name = line.split('export const ')[1].split(':')[0].strip()
            if export_name in seen_exports:
                collecting = True
                buffer = []
            else:
                seen_exports.add(export_name)
                collecting = False
                new_lines.append(line)
        elif collecting:
            if line.strip() == ');':
                collecting = False
            # skip these lines
        else:
            new_lines.append(line)

    with open(filepath, 'w') as f:
        f.writelines(new_lines)

if __name__ == '__main__':
    clean_icons(sys.argv[1])
