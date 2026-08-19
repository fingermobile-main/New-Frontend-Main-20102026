import os

target_dir = r'C:\members\MBAH HOME\Documents\FingerMobile Protocol Communication\FingerMobile Protocol\mobile\fingermobile_app\lib'
output_file = r'C:\members\MBAH HOME\Documents\FingerMobile Protocol Communication\FingerMobile Protocol\mobile\fingermobile_app\mobile_screens_targeted_list.txt'

dart_files = []
for root, dirs, files in os.walk(target_dir):
    for file in files:
        if file.endswith('.dart'):
            dart_files.append(os.path.join(root, file))

with open(output_file, 'w') as f:
    for file_path in dart_files:
        f.write(f"{file_path}\n")

print(f"Successfully wrote {len(dart_files)} targeted .dart files to {output_file}")