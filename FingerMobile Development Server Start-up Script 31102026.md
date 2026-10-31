FingerMobile Development Server Start-up Script 31102026.md
This single command will:
	1	Verify PostgreSQL and Redis.
	2	Clear any lingering ports.
	3	Start the auto-commit watcher.
	4	Launch the Express backend on port 5001.
	5	Launch the frontend bound to 0.0.0.0:3000 for LAN access.
	6	Print your LAN URLs (http://192.168.1.11:3000) so you can begin multi-device testing immediately.


Or Open the system terminal and paste the below:-

cd "/Users/user/Documents/FingerMobile Protocol Communication"
./start-dev-lan.sh

Or open the below and execute it in the terminal: /Users/user/Documents/FingerMobile Protocol Communication/start-dev-lan.sh 


What the Script Automates
	1	Auto-Detects Your LAN IP: Dynamically grabs your Mac's current Wi-Fi/Ethernet IP (e.g. 192.168.1.11).
	2	Verifies Prerequisites: Checks that PostgreSQL is reachable on port 5433 and checks Redis on port 6379.
	3	Cleans Stale Ports: Terminates any hung or orphaned Node processes on ports 5001 and 3000.
	4	Starts Auto-Commit Watcher: Launches auto commit watcher-git-commit-watcher.js in the background with logging to watcher.log.
	5	Starts Backend Server First: Boots Node/Express on port 5001, validates connection, and streams logs to backend-dev.log.
	6	Displays Multi-Device URLs: Outputs all clickable LAN links for phone and PC testing.
	7	Starts Frontend on 0.0.0.0: Runs React on port 3000 bound to all network interfaces.
	8	Graceful Single Exit: Pressing Ctrl + C automatically shuts down all services (frontend, backend, watcher) cleanly with zero lingering background processes.

How to Run It in Your System Terminal
Open your native Mac terminal (Terminal.app or iTerm2) and execute:
bash

cd "/Users/user/Documents/FingerMobile Protocol Communication"
./start-dev-lan.sh
Immediate Testing on Your Devices
Once the script displays Compiled successfully, you can immediately test from your devices on the local Wi-Fi:
	•	Host Mac: http://localhost:3000
	•	Mobile Phone / Tablet / External PC:
	◦	Full Platform: http://192.168.1.11:3000
	◦	Forum Page: http://192.168.1.11:3000/forum
	◦	Mii Peer Encrypted Chat: http://192.168.1.11:3000/mii
	◦	Onboarding & Live Camera: http://192.168.1.11:3000/onboarding


The previous background process exited cleanly (its logs recorded the prior code states before our fix to CanaryAdMakerPage.tsx was applied; the file is verified clean now).
To Start Everything Right Now
In your native Mac terminal (Terminal.app or iTerm2):
bash

cd "/Users/user/Documents/FingerMobile Protocol Communication"
./start-dev-lan.sh




