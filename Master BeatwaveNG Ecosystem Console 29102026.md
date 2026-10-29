Method 1: Upload via the Master BeatwaveNG Ecosystem Console (Executive / Admin)

The Master BeatwaveNG Console is built directly into the Master Dashboard and is powered by the MediaCatalogManagementConsole.

Step-by-Step Walkthrough:

Navigate to the Console:

Open the top-left Platform Burger Menu ([≡]) and select Master Dashboard (/master-dashboard).
On the dashboard navigation bar, click the BeatwaveNG Console tab.
Switch to the Catalog Management sub-tab ("BeatwaveNG Ecosystem Management").

Select the Target Entity:

Choose the media type you want to upload from the top entity switcher:
Tracks: Individual audio tracks, singles, and stems.
AudioNovels: Narrated audiobooks, spoken word, and serials.
Podcasts: Audio episodes, interviews, and talk shows.
Albums & Artists: Full album tracklists and artist profiles.

Click + Create [Entity] (e.g., + Create Track):

An interactive modal form will open with dedicated multipart file-upload pickers.

Upload Audio Media & Artwork Directly:

Upload Audio Track (media field):
Supports MP3, FLAC, WAV, OGG, AAC, and M4A (up to 150 MB per file).
Click Choose File to pick your track.
The browser automatically dispatches a multipart/form-data request to POST /master-dashboard/ecosystems/upload.
The server stores the file under /uploads/audio/ and auto-populates the resulting persistent URL into the database record.
Upload Cover Art (thumbnail field):
Supports JPEG, PNG, and WebP.
Automatically uploads to /uploads/images/ and auto-populates the artwork URL.

Fill in Metadata:

Enter Track Title, Artist Name, Genre, Release Year, and Track Number.
For AudioNovels/Podcasts: select Narrator Voice, Episode Number, or Duration (1–30 min).

Save & Publish Live:

Click Save. The record is written directly to the PostgreSQL database in draft status.
In the track management table, click the green Publish button to make the track live across the entire Beatwave streaming network.
Method 2: Fast-Track Creator Upload via BeatwaveNG Page (/beatwaveng)

For independent artists and creators wanting to publish music directly from the listener interface:

Navigate to BeatwaveNG (/beatwaveng) from the Drawer Menu under Media & Entertainment.
Click the Upload Track or Publish Audio button in the header.
Choose Distribution Tier:
🌊 SoundRiver: Free open creator tier for emergent indie artists, podcasters, and youth creators (320kbps High Quality).
💎 SoundOcean: Audiophile-grade 24-bit/192kHz FLAC master recordings backed by Web3 smart contracts (80% direct FIC royalty split, fan micro-tipping, and verified artist seal).
Enter Track Title, Artist Name, Genre (choose from 70+ curated sovereign genres), and optional Synchronized Lyrics (LRC format).
Click Submit to Library to register the master audio with creator rights.