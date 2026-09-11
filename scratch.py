import csv
import json

csv_path = "/Users/user/Documents/FingerMobile Protocol Communication/FingerMobile Protocol/Assets/CSV Files/FingerMobile Forum Categories (1).csv"

categories = []
with open(csv_path, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for i, row in enumerate(reader):
        name = row.get("Name", "").strip()
        if not name: continue
        
        # Determine restriction type based on write protected or arbitrary rules for mock
        write_protected = row.get("Write Protected", "false").lower() == "true"
        
        restriction = "NONE"
        if write_protected:
            restriction = "MODERATOR"
        elif "verified" in name.lower() or "lux" in name.lower():
            restriction = "SUBSCRIPTION"
        elif "assured" in name.lower() or "private" in name.lower():
            restriction = "BADGE"
            
        category = {
            "id": row.get("ID", ""),
            "name": name,
            "description": row.get("Description", "").strip().replace('\n', ' '),
            "slug": row.get("Slug", ""),
            "imageUrl": row.get("Header Image", ""),
            "restrictionType": restriction,
        }
        categories.append(category)

ts_content = """export type RestrictionType = 'NONE' | 'SUBSCRIPTION' | 'BADGE' | 'MODERATOR';

export interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  imageUrl: string;
  restrictionType: RestrictionType;
}

export const FORUM_CATEGORIES: Category[] = """ + json.dumps(categories, indent=2) + """;
"""

with open("/Users/user/Documents/FingerMobile Protocol Communication/FingerMobile Protocol/apps/frontend-main/src/data/categories.ts", "w") as out_f:
    out_f.write(ts_content)

print("Done")
