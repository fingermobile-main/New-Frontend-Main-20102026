
/Users/user/Documents/FingerMobile Protocol Communication/AGENTS.md

http://localhost:3000/admindashboard is so underdeveloped also., almost all the elements are not clickable and all missing endpoints, just stubs everywhere., all the buttons are subs and hashed, no call to action. i have seen these all over the platform and its time to audit the platform totally for all these types of elements/buttons/tabs that do not have any endpoints, dont link or persist to any database or tables, 

#### Important: ensure that upon starting the Production Development Servers and Services that you Start the Backend API Server., Launch the backend Node/Express server in apps/backend so it listens on the right available port XXXX and connects to PostgreSQL on right available port XXXX. Ensure Frontend Endpoints Route to the Backend (wired frontend to backend)., make sure the Decommissioned LocalStorage Shim is not what is persisting and ensure to Remove the client-only localStorage fallback so that when you upload media., Browser sends multipart/form-data to Express backend. start the backend API and connect the upload and feed services directly to PostgreSQL now so all data saves to the database and always verify and confirm that the Backend Express API Started & Connected to PostgreSQL before proceeding and starting the Frontend.

OBJECTIVE: All dasboards and consoles
all consoles must be able to micromanage their Screens/pages fully and persist data to the Live Databases and push Live information to all their frontends screens/pages and UI. Correct and Optimize as you proceed. Build and create and missing features, consoles, fill all seen gaps, controllers, context updates, Reason updates, API endpoints, no stubs must be on this platform for any reason howsoever and where so ever and when so ever.

Investigate and find all stubbed and placeholder implementation in the Frontend.