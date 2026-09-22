import os
import re

def replace_in_file(filepath, replacements):
    if not os.path.exists(filepath): return
    with open(filepath, 'r') as f:
        content = f.read()
    
    original_content = content
    for pattern, repl in replacements:
        content = re.sub(pattern, repl, content)
        
    if content != original_content:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Updated {filepath}")

replace_in_file("OverviewPage.tsx", [(r'\bany\b', 'unknown')])
replace_in_file("api.ts", [
    (r'\(err.*?_next: NextFunction\).*?{', r'\g<0>\n    void _next;')
])
replace_in_file("business-suite-controller.ts", [
    (r"const\s+PDFDocument\s*=\s*require\('pdfkit'\);", "import PDFDocument from 'pdfkit';")
])
replace_in_file("server.ts", [(r':\s*any\b', ': unknown')])
replace_in_file("services/eligibility-service.ts", [
    (r'checkEligibility\(.*?\).*?{', r'\g<0>\n    void _config;')
])
replace_in_file("useBusinessSuite.ts", [
    (r'const\s*\[_programs,\s*_setPrograms\].*?;', 'const [_programs, _setPrograms] = useState<unknown[] | null>(null);\n  void _setPrograms;'),
    (r'const\s*\[_overview,\s*_setOverview\].*?;', 'const [_overview, _setOverview] = useState<unknown | null>(null);\n  void _setOverview;'),
])

