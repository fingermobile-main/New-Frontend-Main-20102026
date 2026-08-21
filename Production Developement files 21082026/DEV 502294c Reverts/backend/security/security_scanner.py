import hashlib
import os
import json
from typing import Dict, Optional

class SecurityScanner:
    def __init__(self, baseline_file: str = "security_baseline.json"):
        self.baseline_file = baseline_file
        self.baseline_hashes = self._load_baseline()

    def _load_baseline(self) -> Dict[str, str]:
        """Loads the security baseline from a JSON file."""
        if os.path.exists(self.baseline_file):
            with open(self.baseline_file, 'r') as f:
                return json.load(f)
        return {}

    def _save_baseline(self) -> None:
        """Saves the current hashes as the new security baseline."""
        with open(self.baseline_file, 'w') as f:
            json.dump(self.baseline_hashes, f, indent=4)

    def _calculate_file_hash(self, filepath: str) -> Optional[str]:
        """Calculates the SHA256 hash of a given file."""
        try:
            with open(filepath, 'rb') as f:
                return hashlib.sha256(f.read()).hexdigest()
        except Exception:
            return None

    def scan_directory(self, directory: str, file_extensions: tuple = ('.py', '.js', '.html', '.css', '.java', '.swift', '.kt', '.xml')) -> Dict[str, str]:
        """Scans a directory and calculates hashes for specified file types."""
        current_hashes = {}
        for root, _, files in os.walk(directory):
            for file in files:
                if file.endswith(file_extensions):
                    filepath = os.path.join(root, file)
                    current_hashes[filepath] = self._calculate_file_hash(filepath)
        return current_hashes

    def perform_integrity_check(self, target_directory: str, baseline_key: str) -> None:
        """Performs an integrity check against the loaded baseline."""
        print(f"Performing integrity check for {target_directory}...")
        current_hashes = self.scan_directory(target_directory)

        if baseline_key not in self.baseline_hashes:
            print(f"No baseline found for {baseline_key}. Creating new baseline.")
            self.baseline_hashes[baseline_key] = current_hashes
            self._save_baseline()
            return

        for filepath, current_hash in current_hashes.items():
            relative_filepath = os.path.relpath(filepath, target_directory)
            if relative_filepath in self.baseline_hashes[baseline_key]:
                if self.baseline_hashes[baseline_key][relative_filepath] != current_hash:
                    print(f"ALERT: Unauthorized change detected in {filepath}")
            else:
                print(f"ALERT: New unauthorized file detected: {filepath}")

        for filepath in self.baseline_hashes[baseline_key]:
            absolute_filepath = os.path.join(target_directory, filepath)
            if not os.path.exists(absolute_filepath):
                print(f"ALERT: Missing file detected: {absolute_filepath}")

        print(f"Integrity check for {target_directory} completed.")

# Example Usage (to be integrated with GuardianNebulaCore)
if __name__ == "__main__":
    scanner = SecurityScanner()
    # Example for web application codebase
    # scanner.perform_integrity_check("c:\members\obinn\FingerMobile Trae\fingermobile-protocol-upgraded\backend", "web_app_baseline")
    # Example for mobile application codebase (Android)
    # scanner.perform_integrity_check("c:\members\obinn\FingerMobile Trae\fingermobile-protocol-upgraded\mobile\android", "android_app_baseline")
