import re

with open('kyc-verification-service.ts', 'r') as f:
    content = f.read()

# First occurrence of interface KYCSubmissionData {
content = content.replace('export interface KYCSubmissionData {', 'export interface KYCSubmissionDataV1 {', 1)
content = content.replace('export interface KYBSubmissionData {', 'export interface KYBSubmissionDataV1 {', 1)

# Second occurrence
content = content.replace('export interface KYCSubmissionData {', 'export interface KYCSubmissionDataV2 {', 1)
content = content.replace('export interface KYBSubmissionData {', 'export interface KYBSubmissionDataV2 {', 1)

# Change usage in the first class (KYCVerificationService)
first_class = content.find('class KYCVerificationService')
second_class = content.find('class KYCService')

part1 = content[:second_class]
part2 = content[second_class:]

part1 = part1.replace('data: KYCSubmissionData)', 'data: KYCSubmissionDataV1)')
part1 = part1.replace('data: KYBSubmissionData)', 'data: KYBSubmissionDataV1)')

part2 = part2.replace('data: KYCSubmissionData)', 'data: KYCSubmissionDataV2)')
part2 = part2.replace('data: KYBSubmissionData)', 'data: KYBSubmissionDataV2)')
part2 = part2.replace('futureDOB: KYCSubmissionData', 'futureDOB: KYCSubmissionDataV2')
part2 = part2.replace('oldDOB: KYCSubmissionData', 'oldDOB: KYCSubmissionDataV2')
part2 = part2.replace('emptyBio: KYCSubmissionData', 'emptyBio: KYCSubmissionDataV2')
part2 = part2.replace('specialName: KYCSubmissionData', 'specialName: KYCSubmissionDataV2')

content = part1 + part2

with open('kyc-verification-service.ts', 'w') as f:
    f.write(content)
