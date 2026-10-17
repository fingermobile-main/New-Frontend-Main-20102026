# SuperVi: Orbs of Glory - Rise of the Six

SuperVi FingerMobile application
C:\members\MBAH HOME\Documents\FingerMobile Protocol Communication\FingerMobile Protocol\FingerMobile\Development Documents 17122025\SuperVi

C:\members\MBAH HOME\Documents\FingerMobile Protocol Communication\FingerMobile Protocol\SuperVi-Game
C:\members\MBAH HOME\Documents\FingerMobile Protocol Communication\FingerMobile Protocol\SuperVi-Web

The supervi is a separate entity rather than part of the main FingerMobile application.

The FingerMobile\docker-compose.yml file defines a separate service called supervi-app with its own dedicated components:

supervi-app - The main application service for SuperVi
supervi-db - PostgreSQL database specifically for SuperVi
supervi-redis - Redis cache for SuperVi

In contrast, the main docker-compose.yml file in the root directory defines the main FingerMobile services:
postgres, redis, backend, frontend, adminer, nginx 
This suggests that SuperVi was developed as a separate game/application component within the FingerMobile ecosystem but with its own isolated infrastructure. 

Looking at the file structure, there are dedicated files for SuperVi:
FingerMobile/backend/routes/supervi_achievements.js
FingerMobile/backend/routes/supervi_leaderboards.js
supervi_schema.sql
src/types/supervi.ts

This architecture allows SuperVi to operate as a distinct module within the FingerMobile platform, potentially with its own:
Database schema and data
API routes and logic
Authentication system
member management

This separation is for several reasons:
Different development teams working on the main platform vs. the game component
Different scaling requirements
Different security requirements
Independent deployment and update cycles
Specialized functionality that doesn't fit the main platform structure
So the supervi-app container was treated as a separate entity because it represents a distinct component of the FingerMobile ecosystem 
- likely a game or interactive feature with its own dedicated infrastructure, even though it's part of the overall platform.

SuperVi-Web/client and SuperVi is a separate, isolated entity beign developed separately, o treat as such

## Character Details & Game Information

### Game Overview
- **Title**: SuperVi: Orbs of Glory - Rise of the Six
- **Genre**: Afro-futuristic Urban Superhero Adventure
- **Game Type**: Combination of procedural generation, procedural level generation and an engaging reward system
- **Platform**: Unity-based with mobile focus
- **Target Audience**: All ages with emphasis on African culture and representation

### Setting
The game is set in multiple African cities: Abuja, Lagos, and Kano (Nigeria), with additional locations in Madrid, France, and Ethiopia. The environment uniquely blends urban architecture with dense jungle elements, creating a "street jungle" setting with wild animals and forest terrain integrated into the cityscape.

### Core Gameplay Mechanics
- **Procedural Level Generation**: The game engine (Unity) spawns pre-modeled "tiles" (sections of bush/forest tracks with obstacles) with varying time intervals (2-3 seconds, then 5-8 seconds, then 6-8 seconds, then 3-5 seconds, then 11-19 seconds) to keep gameplay unpredictable
- **Power-ups System**: Jetpack, coin magnet, 2x multiplier that temporarily alter gameplay dynamics
- **In-game Economy**: Collect coins and keys during runs or via daily rewards to purchase upgrades, new characters, and hoverboards
- **Orb Mechanics**: Each character wields an Orb of Glory with Egyptian symbols that provides unique abilities

### Character Details

#### 1. Zara the Zephr (Red Lion Superhero)
- **Identity**: Black Hausa Female
- **Appearance**: 
  - Skin-tight red spandex suit with bright white and gold light trimmings
  - Multiple studded gem stones of green and red opals on the front
  - Knee-length flowing hijab covering her hair
  - Glowing red hand and leg beads
- **Abilities**: 
  - Levitates above flames
  - Descends in a fiery streak
  - Controls fire-based attacks
- **Orb**: Fiery glowing red Orb with Egyptian symbols floating around it
  - **Special Ability**: Fire Dash - Creates a fiery path that burns obstacles
- **Halo**: Red glowing color halo with Egyptian symbols
- **Personality**: Protective, brave, community-focused
- **Backstory**: A guardian spirit of the community who awakens when danger threatens

#### 2. Tenko-Gen (Blue Giraffe Superhero)
- **Identity**: Brown-skinned Fulani Female
- **Appearance**: 
  - Blue urban African spandex suit with white and gold trimmings
  - Multiple studded gem stones of green and red opals on the front
  - Long braided hair with hijab
  - Glowing blue hand beads
- **Abilities**: 
  - Stretches neck and limbs to reach high places
  - Navigates above flames and obstacles
  - Enhanced vision for pathfinding
- **Orb**: Blue glowing Orb with Egyptian symbols floating around it
  - **Special Ability**: Neck Extension - Can reach distant platforms and items
- **Halo**: Blue glowing color halo with Egyptian symbols
- **Personality**: Strategic, observant, peaceful but fierce when needed
- **Backstory**: A scout and messenger who can see dangers from afar

#### 3. King the Guardian (Green Eagle Superhero)
- **Identity**: Black Yoruba Male
- **Appearance**: 
  - Green urban African spandex suit with white and gold trimmings
  - Multiple studded gem stones of green and red opals on the front
  - Long dreadlocks
  - Glowing green hand and leg beads
- **Abilities**: 
  - Smashes through walls and barriers
  - Rescues trapped kids and civilians
  - Enhanced strength and durability
- **Orb**: Green glowing Orb with Egyptian symbols floating around it
  - **Special Ability**: Wall Break - Can destroy barriers to create new paths
- **Halo**: Green glowing color halo with Egyptian symbols
- **Personality**: Protective, strong, leadership qualities
- **Backstory**: A protector of the innocent and defender of the weak

#### 4. Phantom Shadow (Orange Deer Superhero)
- **Identity**: Ibo Female
- **Appearance**: 
  - Orange urban African spandex suit with white and gold trimmings
  - Multiple studded gem stones of green and red opals on the front
  - Orange and green beads on arms, feet, and hips/waist
- **Abilities**: 
  - Phases through concrete floors and obstacles
  - Clears smoke and fog to reveal paths
  - Invisibility for short periods
- **Orb**: Orange glowing Orb with Egyptian symbols spinning around it
  - **Special Ability**: Phase Shift - Can pass through solid objects temporarily
- **Halo**: Orange glowing color halo with Egyptian symbols
- **Personality**: Mysterious, agile, quick-thinking
- **Backstory**: A spirit guide who moves between dimensions to protect the realm

#### 5. Bola the Brave (White Bear Superhero)
- **Identity**: Ibo Female
- **Appearance**: 
  - White urban African spandex suit with white and gold trimmings
  - Multiple studded gem stones of green and red opals on the front
  - White and red beads on feet and arms
- **Abilities**: 
  - Carries two toddlers effortlessly through danger
  - Lightning speed movement
  - Enhanced strength and endurance
- **Orb**: White glowing Orb with Egyptian symbols glowing and spinning violently around it
  - **Special Ability**: Lightning Dash - Ultra-fast movement with protective aura
- **Halo**: White glowing color halo with Egyptian symbols
- **Personality**: Fearless, caring, protective of the young
- **Backstory**: A fierce protector who never abandons those in need

#### 6. Neoma the Healer (Yellow Seal Hero)
- **Identity**: Light skin Ibo Female
- **Appearance**: 
  - Leafy green fruity colored urban African spandex suit with white and gold trimmings
  - Multiple studded gem stones of green and red opals on the front
  - Very long braided flowing hair
  - Floating, moving, and rotating multi-color leafy beads on feet, arms, and hips/waist
- **Abilities**: 
  - Shields children in bright multi-color leafy green fruity bubbles
  - Healing powers for self and other characters
  - Protective barrier creation
- **Orb**: Multi-color glowing Orb with Egyptian symbols gently pulsing around it
  - **Special Ability**: Protective Bubbles - Creates healing and protective barriers
- **Halo**: Leafy green fruity glowing color halo with Egyptian symbols
- **Personality**: Nurturing, wise, compassionate
- **Backstory**: A healer and protector of the innocent with ancient wisdom.

#### Villains:
Villan 1: White female demon warrior-sorceress.
White fantasy female demon warrior-sorceress, standing in an epic pose, long black flowing hair, elegant crimson horns, glowing red eyes, wearing detailed molten red and red armor with fiery runes, flames flowing through armor veins, one hand holding a blazing hammer made of molten energy, the other channeling infernal egyptian symbolic magic, long tattered skirt with metal ornaments, armored boots on cracked volcanic ground glowing with lava, surrounded by embers and heat distortion, cinematic lighting, extremely detailed, high resolution texture, epic stance

Villan 2: Black female demon warrior-sorceress.
Dark fantasy female demon warrior-sorceress, standing in an epic pose, long black flowing hair, elegant crimson horns, glowing red eyes, wearing detailed molten black and red armor with fiery runes, yellow flames flowing through armor veins, one hand holding a blazing whip made of molten energy, the other channeling infernal magic, long tattered draps with metal ornaments, armored boots on cracked floating soil ground glowing with lava, surrounded by embers and heat distortion, cinematic lighting, extremely detailed, high resolution texture, epic stance

Villan 3: Red totem demon warrior: 
Dark fantasy totem demon warrior, standing in an epic pose, multiple long black and silver flowing cobras as hair, elegant crimson snakes, glowing red eyes, wearing detailed molten black and red armor with fiery runes, flames flowing through armor veins, one hand holding a blazing fire whip made of molten energy, the other channeling infernal magic, long tattered skirt with metal ornaments, armored boots on cracked volcanic ground glowing with lava, surrounded by embers and heat distortion, cinematic lighting, extremely detailed, high resolution texture, epic stance

### Visual Style
- High-contrast, saturated colors
- Glowing effects and particle systems
- Dynamic action poses
- Afro-futuristic aesthetic blending traditional African elements with sci-fi technology
- Jungle-urban hybrid environment with wild animals like lions, giraffes, eagles, deer, bears, and seals integrated into the cityscape

### Additional Game Elements
- Floating coins and keys scattered throughout the scene
- Procedurally generated track tiles visible in the background
- Power-ups like jetpacks, coin magnets, and 2x multipliers glowing in the environment
- Egyptian hieroglyphs and symbols integrated into the architecture
- Jungle vines and trees growing through modern buildings
- Urban streets transformed into forest tracks with wild animals roaming
- Ancient Egyptian symbols floating in the air as mystical energy
- Bright, saturated colors with glowing neon accents against earthy jungle tones

### In-game Currency
- **Coins**: Collected during runs for immediate purchases
- **Keys**: Special currency for premium items and character unlocks
- **Orb Fragments**: Rare currency earned through achievements and challenges

### Character Unlock System
- **Starting Characters**: Zara the Zephr and King the Guardian are available from the start
- **Unlock Methods**: 
  - Complete story missions
  - Achieve high scores
  - Collect specific currency amounts
  - Complete special challenges
  - Special event participation

### Special Events & Seasons
- **Seasonal Events**: Limited-time events with unique rewards
- **Community Challenges**: Events where global player performance unlocks rewards
- **Character Spotlights**: Events focused on specific characters with unique challenges
- **Orb Evolution**: Events where players can upgrade their Orbs of Glory for special abilities.

### SuperVi - Game Design Document (GDD)
Document Version
Version: 1.0
Last Updated: December 2025
Document Owner: SuperVi Development Team

### Table of Contents
Executive Summary
Game Concept
Core Gameplay Mechanics
Game Modes
Characters
World Design
Procedural Generation System
Dynamic Difficulty Adjustment
Mission System
Economy System
Quest System
Power-ups and Collectibles
Obstacles and Hazards
NPC System
UI/UX Design
Monetization Strategy
Technical Implementation
Audio and Voice Lines
Player Controls
Development Roadmap

1. Executive Summary
SuperVi is an ambitious 3D -based building, crafting, and exploration game that seamlessly blends sandbox creativity with endless runner mechanics. Set in an Afro-futuristic universe, the game features procedurally generated infinite terrain, dynamic day/night cycles, survival mechanics, and a unique endless runner mode called “Orbs of Glory - Rise of the Six.”
The game supports up to 6 simultaneous players in multiplayer mode, features 15+ explorable cities across the globe, and incorporates a rich economy system with in-app purchases, missions, quests, and social interactions.
Target Platforms: Web (primary), Mobile (iOS/Android), Desktop (Windows/Mac/Linux)
Target Audience: Ages 10+, fans of Minecraft, Subway Surfers, and building/exploration games
Estimated Development Time: 18-24 months (full production with team of 8-12 developers)

2. Game Concept
2.1 High-Level Concept
SuperVi combines two distinct gameplay experiences:
 Sandbox Mode: Players explore an infinite procedurally generated world, mine resources, craft items, build structures, and survive against environmental challenges and wildlife.
Endless Runner Mode (“Orbs of Glory”): Players navigate through jungle/forest terrain in a lane-based endless runner inspired by Subway Surfers, collecting coins, avoiding obstacles, and completing missions to earn rewards.

2.2 Unique Selling Points (USPs)
Dual Gameplay Modes: Seamless transition between sandbox building and endless runner
Afro-Futuristic Theme: Celebrates African culture with modern sci-fi aesthetics
Global Exploration: 15+ real-world cities reimagined with cultural authenticity
Rich NPC Interactions: NPCs with jobs, tasks, and dialogue systems
Deep Economy: Multiple currency types, crafting, trading, and marketplace
Social Features: 6-player multiplayer, leaderboards, clan systems
Cultural Voice Lines: Authentic Nigerian Igbo and Yoruba accent voice feedback

2.3 Core Pillars
Creativity: Unlimited building possibilities with  blocks
Exploration: Vast procedurally generated worlds to discover
Challenge: Progressive difficulty in runner mode and survival mechanics
Community: Multiplayer collaboration and competition
Cultural Authenticity: Celebrating African heritage and global diversity

3. Core Gameplay Mechanics
3.1  Building System
Block Types: 50+ different block types including natural (grass, dirt, stone, wood) and crafted (furnaces, workbenches, decorative blocks)
Mining: Players can break blocks to collect resources
Placement: Blocks can be placed anywhere in the world (with collision checks)
Crafting: Combine resources to create new blocks and items
Building Tools: Grid snapping, copy/paste, undo/redo functionality

3.2 Survival Mechanics
Health System: 100 HP, regenerates when hunger is above 80%, depletes when hunger is below 20%
Hunger System: 100 hunger points, depletes over time (0.01 per frame), restored by eating food
Food Types:
Raw Bacon: +20 hunger
Cooked Bacon: +40 hunger
Fruits: +10-15 hunger
Cooked Meals: +50-80 hunger

3.3 Inventory System
Hotbar: 8 quick-access slots displayed on screen
Full Inventory: 40 total slots accessible via menu
Item Stacking: Items stack up to 64 per slot
Item Categories: Blocks, Tools, Food, Materials, Special Items

3.4 Crafting System
Crafting Station: Furnaces, workbenches, anvils
Recipe Discovery: Recipes unlock through exploration and experimentation
Resource Requirements: Each item requires specific materials
Crafting Time: Instant for basic items, timed for advanced items

3.5 Endless Runner Mechanics
Lane System: 3 vertical lanes (left, center, right)
Movement Controls:
Swipe Left: Move to left lane
Swipe Right: Move to right lane
Swipe Up: Jump
Swipe Down: Slide/Duck
Double Swipe Up: Double jump (2x height)
Double Swipe Down: Fast slide
Tap Down 1x: Slow down
Tap Down 2x: Pause for 2 seconds
Tap Up 2x: Speed boost
Forward Movement: Constant forward speed that increases over time
Camera: Third-person follow camera with 360° rotation capability

4. Game Modes
4.1 Sandbox  Mode
Objective: Explore, build, craft, and survive in an infinite procedurally generated world.
Features:
Infinite terrain generation
Day/night cycle (20-minute real-time cycle)
Weather systems (rain, fog, clear)
Wildlife (pigs, cows, chickens, hostile mobs)
Resource gathering and crafting
Base building and defense
Multiplayer collaboration (up to 6 players)
Win Condition: No specific win condition - open-ended creative gameplay

4.2 Endless Runner Mode: “Orbs of Glory - Rise of the Six”
Objective: Run as far as possible, collect coins, complete missions, and avoid obstacles.
Features:
Procedurally generated jungle/forest track
Progressive difficulty (speed increases over time)
Random obstacle patterns
Collectible coins, power-ups, and boosters
Mission-based score multipliers
Leaderboards and achievements
90-minute session duration per player
Win Condition: Achieve highest score, complete missions, reach distance milestones

4.3 Multiplayer Mode
Player Count: 2-6 players
Modes:
Cooperative Building: Players work together to build structures
Competitive Runner: Race against other players in endless runner
PvP Combat: Players can fight each other for coins and points
Team Missions: Complete group objectives for bonus rewards
Matchmaking: Quick match, private lobbies, clan-based matchmaking

5. Characters
5.1 Character System
Total Characters: 6 playable Afro-futuristic heroes
Character Attributes:
Name: Unique character identity
Origin City: One of the 15+ global cities
Special Ability: Unique power-up or skill
Appearance: Customizable skins, outfits, accessories
Voice Lines: Character-specific audio feedback

5.2 Character Roster (Proposed)
Emenike (Lagos, Nigeria)
Ability: Speed Surge - Temporary 2x speed boost
Theme: Urban tech innovator
Voice: Nigerian Igbo accent
Prime (Abuja, Nigeria)
Ability: Shield of Ancestors - Temporary invincibility
Theme: Royal guardian
Voice: Nigerian Yoruba accent
Sungo (Kano, Nigeria)
Ability: Desert Wind - Dash through obstacles
Theme: Desert warrior
Voice: Hausa accent
Igwe (Kingston, Jamaica)
Ability: Rhythm Jump - Enhanced jump height
Theme: Musical warrior
Voice: Jamaican patois
Snow (Ethiopia)
Ability: Time Freeze - Slow down obstacles
Theme: Mountain sage
Voice: Ethiopian accent
Iwangee (South Africa)
Ability: Coin Magnet - Auto-collect nearby coins
Theme: Tech entrepreneur
Voice: South African accent

5.3 Character Progression
Level System: Characters level up through gameplay (max level 100)
Skill Trees: Unlock new abilities and upgrades
Cosmetic Unlocks: Skins, outfits, emotes, victory animations
Character-Specific Missions: Unique storylines for each character

6. World Design
6.1 Biomes ( Mode)
Jungle/Forest: Dense trees, vines, wildlife, rivers
Plains: Open grasslands, scattered trees, villages
Desert: Sand dunes, cacti, oases, ruins
Mountains: Snow-capped peaks, caves, mineral deposits
Ocean: Islands, coral reefs, underwater caves
Swamp: Murky water, twisted trees, unique resources

6.2 Cities (15+ Locations)
Each city features:
Unique architectural style reflecting local culture
NPCs with region-specific dialogue and jobs
City-specific resources and crafting recipes
Cultural landmarks and monuments
Marketplaces for trading
Transportation hubs (portals, trains, boats)

City List:
Abuja, Nigeria - Capital city, government district
Lagos, Nigeria - Coastal metropolis, tech hub
Kano, Nigeria - Ancient trading city, desert gateway
Madrid, Spain - European cultural center
Paris, France - Art and fashion capital
Addis Ababa, Ethiopia - Highland city, historical sites
Kingston, Jamaica - Caribbean port, music culture
Honolulu, Hawaii - Island paradise, volcanic landscapes
Washington D.C., USA - Political center, monuments
London, UK - Historic metropolis, modern innovation
Cape Town, South Africa - Coastal beauty, diverse culture
Sydney, Australia - Harbor city, beach culture
Stockholm, Sweden - Nordic design, waterfront city
Seoul, South Korea - Tech megacity, K-culture
New Delhi, India - Ancient meets modern, spice markets
Shanghai, China - Futuristic skyline, traditional gardens

6.3 City Features
Hospitals: Heal players, purchase health items
Schools: Learn new crafting recipes, NPC training
Roads: Fast travel networks between districts
Houses: Player-owned properties, storage, customization
Markets: Buy/sell items, trade with NPCs
Job Centers: Accept missions and employment opportunities

6.4 Portals (CERNs)
Portal Types:
Ilumina Portal: Standard fast-travel between cities
Iluminata Portal: Premium portal with visual effects (colliding atoms: Carbon & Hydrogen, Rocks, Wind, Water, Fire)
Gateway Portal: Access to special islands and dungeons
Lion’s Gate: Legendary portal requiring special keys
Portal Mechanics:
Requires specific keys or currency to activate
Cooldown period between uses
Visual spectacle with particle effects
Can be upgraded for faster travel

7. Procedural Generation System
7.1 Terrain Generation ( Mode)
Algorithm: Perlin noise-based height map generation
Parameters:
Chunk Size: 16x16 blocks horizontal, 64 blocks vertical
Render Distance: 3-5 chunks in all directions
Biome Blending: Smooth transitions between biomes
Feature Placement: Trees, rocks, ores, structures placed based on biome rules
Optimization:
Geometry merging to reduce draw calls
Chunk loading/unloading based on player position
Level of Detail (LOD) system for distant chunks
Object pooling for frequently spawned items

7.2 Track Generation (Runner Mode)
Tile-Based System:
Tile Length: 10-20 meters per tile
Tile Pool: 50+ unique tile configurations
Spawning Logic: Tiles spawn 2-3 seconds ahead of player
Randomization: Weighted random selection based on difficulty
Tile Spawn Intervals (Dynamic):
Early Game: 2-3 seconds between complex obstacles
Mid Game: 5-8 seconds, then 6-8 seconds, then 3-5 seconds
Late Game: 11-19 seconds (unpredictable intervals)
Obstacle Types per Tile:
Stationary obstacles (stumps, rocks, logs)
Moving obstacles (buses, cars, trains, animals)
Environmental hazards (falling trees, quicksand, rivers)
Interactive elements (ramps, tunnels, bridges)

7.3 Randomized Obstacles
Obstacle Categories:
Natural Hazards:
Falling trees (warning animation before fall)
Tree stumps (require jump or lane change)
Logs (slide under or jump over)
Quicksand patches (instant fail if touched)
Rivers/water (requires jump or bridge)
Urban Obstacles:
Stationary buses (block entire lane)
Moving cars (cross lanes unpredictably)
Bicycles (slow-moving, easy to avoid)
Pedestrians (walk across lanes)
Trains (fast-moving, require precise timing)
Wildlife:
Wild animals (boars, leopards, elephants)
Pets (dogs, cats - less dangerous)
Birds (flying obstacles, duck to avoid)
Barriers:
Wooden fences (jump over)
Stone walls (require lane change)
Construction barriers (temporary obstacles)
Obstacle Behavior:
Static: Remain in fixed position
Patrol: Move back and forth across lanes
Chase: Follow player (rare, high difficulty)
Triggered: Activate when player approaches

8. Dynamic Difficulty Adjustment (DDA)
8.1 Speed Scaling
Base Speed: 10 meters/second
Speed Increase:
Every 30 seconds: +0.5 m/s
Every mission completed: +1 m/s
Maximum speed: 30 m/s (reached after ~20 minutes)
Speed Reduction:
Using slow-down power-up: -50% for 3 seconds
After collision: -20% for 2 seconds (recovery period)

8.2 Obstacle Density
Early Game (0-5 minutes):
1 obstacle per tile
Simple patterns (single lane blocks)
Long gaps between obstacles
Mid Game (5-15 minutes):
2-3 obstacles per tile
Complex patterns (multi-lane coordination)
Shorter gaps, faster moving obstacles
Late Game (15+ minutes):
3-5 obstacles per tile
Extreme patterns (requires power-ups to survive)
Minimal gaps, unpredictable spawns

8.3 Adaptive Difficulty
Player Performance Tracking:
If player dies frequently: Reduce obstacle density by 10%
If player survives long runs: Increase density by 10%
If player uses many power-ups: Spawn more power-ups
If player ignores coins: Increase coin spawn rate

9. Mission System
9.1 Mission Structure
Mission Set: 7 tasks per set
Task Types:
Collect X coins in one run
Travel X distance without dying
Use X power-ups in one run
Avoid X obstacles in a row
Collect X specific items (feathers, fruits)
Complete run without using power-ups
Achieve X score in one run

9.2 Mission Rewards
Completion Bonuses:
Per Task: 100 FIC, 500 coins
Full Set (7/7): 1000 FIC, 5000 coins, 1 key
Score Multiplier: +0.5x per set completed (permanent)
Multiplier System:
Base score: 1x
After 1 set: 1.5x
After 2 sets: 2.0x
After 5 sets: 3.5x
Maximum multiplier: 10x (after 19 sets)

9.3 Multiplayer Missions
Cooperative Missions:
Team must collectively achieve goal
Rewards distributed equally
Bonus rewards for all players completing together
Competitive Missions:
Players compete for highest score
Winner receives 2x rewards
Losers receive participation rewards
Mission Examples:
“Team Coin Rush”: Collect 50,000 coins as a team
“Relay Race”: Each player runs 1km, total 6km
“Survival Challenge”: Last player standing wins
“Build Together”: Construct a specific structure in  mode

10. Economy System
10.1 Currency Types
10.1.1 FIC (Primary Currency)
Earning Methods:
Mission completion: 100-1000 FIC
Daily login: 50 FIC
Quest completion: 200-500 FIC
Achievements: 500-5000 FIC
In-app purchase: $0.99 = 100 FIC, $4.99 = 600 FIC, $9.99 = 1500 FIC

Usage:
Purchase premium items
Unlock characters
Buy time extensions
Access special cities/islands
Upgrade abilities

10.1.2 Coins (5 Types)
Bronze Coins (1 coin value): Most common
Found everywhere in runner mode
1000 bronze = 1 FIC

Silver Coins (3 coin value): Uncommon
Found in challenging sections
500 silver = 1 FIC
Gold Coins (5 coin value): Rare
Found in dangerous areas
200 gold = 1 FIC

Platinum Coins (10 coin value):
Very rare
Mission rewards
100 platinum = 1 FIC
Diamond Coins (50 coin value): Extremely rare
Special events only
20 diamond = 1 FIC

Coin Packages (In-App Purchase):
10,000 coins: $0.99
35,000 coins: $2.99
100,000 coins: $7.99
600,000 coins: $39.99
10.1.3 Keys (5 Types)
Walkway Key: Opens basic paths and shortcuts
Doorway Key: Opens buildings and houses
Pathway Key: Opens advanced routes
Gateway Key: Opens portals to special islands
Lion’s Gate Key: Opens legendary portals (rarest)
Key Acquisition:
Mission rewards
Quest completion
Daily challenges
In-app purchase: $1.99 per key (types 1-3), $4.99 (type 4), $9.99 (type 5)

10.1.4 Energy Levels (10 Types)
Energy determines how long a player can run in endless mode.
Emenike Energy: 30 minutes runtime
Prime Energy: 45 minutes runtime
Sungo Energy: 60 minutes runtime
Igwe Energy: 75 minutes runtime
Snow Energy: 90 minutes runtime

Iwangee Energy: 105 minutes runtime
Eke Energy: 120 minutes runtime
Afo Energy: 135 minutes runtime

Okorie Energy: 150 minutes runtime
Nkwo Energy: 180 minutes runtime (max)

Energy Recharge:
Natural recharge: 1 energy level per 6 hours
Instant recharge: 50 FIC or $0.99
Energy drinks (in-game item): +1 level
10.2 Store System
10.2.1 Boosters (5 Types)

Speed Booster:
Effect: +50% speed for 10 seconds
Price: 100 coins or 5 FIC

Cooldown: 30 seconds
Strength Booster:
Effect: Destroy obstacles on contact for 10 seconds
Price: 150 coins or 8 FIC

Cooldown: 45 seconds

Water Booster:
Effect: Swim through water hazards for 15 seconds
Price: 120 coins or 6 FIC

Cooldown: 60 seconds
Food Booster:
Effect: Restore 50 hunger instantly
Price: 80 coins or 4 FIC
Cooldown: None (consumable)
Elixir Booster:
Effect: Invincibility for 5 seconds
Price: 300 coins or 15 FIC
Cooldown: 120 seconds
10.2.2 Time Extension Boosters
30 Minutes: 200 FIC or $1.99
1 Hour: 350 FIC or $2.99
6 Hours: 1500 FIC or $9.99
12 Hours: 2500 FIC or $14.99
48 Hours: 8000 FIC or $39.99
10.2.3 Gifts
Gift Types:
Character skins
Emotes and animations
Building blueprints
Rare crafting materials
Exclusive power-ups
Pricing: 500-5000 FIC depending on rarity
10.3 Marketplace
Player Trading:
Players can trade items, blocks, and resources
10% transaction fee (in coins)
Trade history and reputation system
NPC Vendors:
City-specific merchants
Dynamic pricing based on supply/demand
Bulk discounts for large purchases

11. Quest System
11.1 Daily Quests
11.1.1 Coin Collection Quests
Quest Tiers:
Pick up 5,500 coins → Reward: 50 FIC, 1 Bronze Key
Pick up 15,000 coins → Reward: 100 FIC, 1 Silver Key
Pick up 25,000 coins → Reward: 200 FIC, 1 Gold Key
Pick up 50,000 coins → Reward: 500 FIC, 1 Platinum Key
Pick up 75,000 coins → Reward: 1000 FIC, 1 Diamond Key
Pick up 105,000 coins → Reward: 2000 FIC, 1 Lion’s Gate Key
Reset: Daily at midnight (player’s local time)

11.1.2 Feather Collection Quests
Feathers are special collectibles that grant flight power-ups.
Quest Tiers:
Pick up 2,000 feathers → Reward: 100 FIC, 1 Speed Booster
Pick up 5,000 feathers → Reward: 250 FIC, 1 Strength Booster
Pick up 7,000 feathers → Reward: 400 FIC, 1 Elixir Booster
Pick up 15,000 feathers → Reward: 1000 FIC, 1 Legendary Skin
Feather Spawn Rate: 1 feather per 100 meters traveled

11.2 Monthly Quests

11.2.1 Weekly Coin Targets
Quest Tiers:
Pick up 500,000 coins in a week → Reward: 2000 FIC, 5 Keys
Pick up 700,000 coins in a week → Reward: 3500 FIC, 10 Keys
Pick up 1,000,000 coins in a week → Reward: 5000 FIC, 20 Keys, 1 Exclusive Character Skin
Reset: Every Monday at midnight

11.2.2 Monthly Challenges
Challenge Types:
Complete 100 missions
Travel 1000km total distance
Collect 10,000 feathers
Defeat 500 obstacles
Build 50 structures in  mode
Rewards: 10,000 FIC, exclusive monthly character skin, leaderboard placement

11.3 Achievement System
Categories:
Distance milestones (10km, 50km, 100km, 500km, 1000km)
Coin collection (100k, 500k, 1M, 5M, 10M)
Mission completion (10, 50, 100, 500, 1000)
Building achievements (structures built, blocks placed)
Combat achievements (mobs defeated, players defeated in PvP)
Rewards: FIC, exclusive titles, profile badges, cosmetic items

12. Power-ups and Collectibles
12.1 Power-ups (Runner Mode)
12.1.1 Speed Power-ups
2x Speed Boost:
Duration: 3 seconds
Effect: Double movement speed
Spawn Rate: Common
5x Speed Boost:
Duration: 7 seconds
Effect: 5x movement speed (extreme)
Spawn Rate: Rare

12.1.2 Strength Effigies
Collectible items that grant temporary strength boosts.
Types:
Kolanut: +10% strength for 30 seconds
Roast Chicken: +20% strength for 45 seconds
Sugar Cane: +15% strength for 60 seconds
Agbalumo (African Star Apple): +25% strength for 30 seconds
Guava: +10% strength for 90 seconds
Cashew: +30% strength for 20 seconds
Coconut: +20% strength for 60 seconds
Chia Seeds: +15% strength for 120 seconds
Strength Effect: Allows player to destroy obstacles on contact
12.1.3 Food Items (Hunger Restoration)
Along-the-Way Boosters:
Watermelon: +15 hunger
Apples: +10 hunger
Bananas: +12 hunger
Oranges: +10 hunger
Pineapples: +20 hunger
Spawn Rate: 1 food item per 50 meters

12.2 Collectibles
12.2.1 Coins
Spawn Patterns:
Lines: Straight lines of coins (easy to collect)
Curves: Curved paths requiring lane changes
Clusters: Groups of coins in specific lanes
Spirals: Rotating patterns around obstacles
Coin Values:
1 coin pickups (bronze)
3 coin pickups (silver)
5 coin pickups (gold)
Pickup Pace:
Early game: 15 coins per 100 meters
Mid game: 25 coins per 100 meters
Late game: 35 coins per 100 meters

12.2.2 Feathers
Purpose: Currency for unlocking flight abilities and special skins
Spawn Rate: 1 feather per 100 meters (rare)
Feather Types:
White feathers: Common (1 point)
Golden feathers: Rare (5 points)
Rainbow feathers: Legendary (25 points)

12.2.3 Gifts
Random Drops:
Character skins
Emotes
Building blueprints
Rare materials
Exclusive power-ups
Spawn Rate: 1 gift per 500 meters (very rare)

13. Obstacles and Hazards
13.1 Obstacle Classification
13.1.1 Natural Obstacles
Falling Trees:
Warning: 1-second animation before fall
Avoidance: Change lanes or time jump
Damage: Instant fail
Tree Stumps:
Height: Low (jump required)
Placement: Random lanes
Damage: Instant fail if hit
Logs:
Position: Ground level or elevated
Avoidance: Jump over or slide under
Damage: Instant fail
Quicksand Patches:
Visual: Dark brown texture
Effect: Instant fail if touched
Avoidance: Jump over or change lanes
Rivers/Water:
Width: 1-3 lanes
Crossing: Jump or use water booster
Damage: Instant fail (unless water booster active)

13.1.2 Urban Obstacles
Stationary Buses:
Size: Blocks entire lane
Placement: Random lanes
Avoidance: Change lanes
Moving Cars:
Behavior: Cross lanes unpredictably
Speed: Varies (slow to fast)
Avoidance: Timing and lane changes
Bicycles:
Speed: Slow-moving
Behavior: Patrol lanes
Avoidance: Easy to dodge
Pedestrians:
Behavior: Walk across lanes
Speed: Slow
Avoidance: Jump over or change lanes
Trains:
Speed: Very fast
Warning: Horn sound 2 seconds before
Avoidance: Precise timing required

13.1.3 Wildlife Obstacles
Wild Boars:
Behavior: Charge at player
Speed: Medium
Avoidance: Jump or change lanes
Leopards:
Behavior: Pounce from sides
Speed: Fast
Avoidance: Quick reflexes required
Elephants:
Size: Large (blocks 2 lanes)
Speed: Slow
Avoidance: Change to free lane
Birds:
Position: Flying at head height
Avoidance: Duck/slide
Pets (Dogs/Cats):
Behavior: Run across lanes
Speed: Medium
Damage: Minor (slows player instead of instant fail)

13.1.4 Barriers
Wooden Fences:
Height: Medium
Avoidance: Jump
Stone Walls:
Height: Tall (cannot jump)
Avoidance: Change lanes
Construction Barriers:
Duration: Temporary (disappear after 5 seconds)
Avoidance: Wait or change lanes

13.2 Obstacle Behavior Patterns

13.2.1 Static Obstacles
Remain in fixed position
Predictable placement
Easy to plan around

13.2.2 Patrol Obstacles
Move back and forth across lanes
Predictable pattern
Requires timing

13.2.3 Chase Obstacles
Follow player’s lane
Rare occurrence (high difficulty)
Requires power-ups or extreme skill

13.2.4 Triggered Obstacles
Activate when player approaches
Visual/audio warning
Requires quick reaction

13.3 Collision System

13.3.1 Collision Types
Instant Fail:
Hit by train, bus, falling tree
Fall into quicksand or water
Result: Run ends immediately
Damage:
Scrape against obstacle
Hit by bicycle or pet
Result: -20 health, -10% speed for 2 seconds
Stun:
Hit by pedestrian
Result: Pause for 1 second, lose combo

13.3.2 Collision Forgiveness
Grace Period: 0.1-second window after collision to recover
Near Miss Bonus: +50 points for avoiding obstacle by <1 meter
Combo System: Consecutive near misses increase multiplier

14. NPC System
14.1 NPC Types
14.1.1 City NPCs
Roles:
Vendors: Sell items, resources, and equipment
Quest Givers: Provide missions and challenges
Workers: Perform jobs (construction, farming, crafting)
Guards: Protect city areas, enforce rules
Citizens: Populate cities, provide atmosphere
Behavior:
Wander around designated areas
Follow daily schedules (work, rest, socialize)
React to player actions (greet, trade, flee)
Engage in conversations with other NPCs

14.1.2 Wilderness NPCs
Types:
Travelers: Provide tips and hints
Hermits: Offer rare items for trade
Bandits: Hostile NPCs that attack players (PvE)

14.2 NPC Dialogue System
14.2.1 Dialogue Types
Greetings:
“Hi ya doing” (casual greeting)
“Welcome to [City Name]”
“Good to see you again!”
Trading:
“What are you buying?”
“I have rare items for sale”
“Make me an offer”
Quest Dialogue:
“I need your help with something”
“Can you collect [item] for me?”
“Thank you for your help!”
Reactions:
“Wahala Dey” (trouble ahead)
“See Gobe” (seeing trouble)
“Kilode” (questioning)

14.2.2 Dialogue Triggers
Player proximity (within 5 meters)
Player interaction (click/tap on NPC)
Quest completion
Time-based events

14.3 NPC Jobs and Tasks
14.3.1 Job Types
Construction Workers:
Build and repair structures
Provide building materials
Teach construction techniques
Farmers:
Grow crops
Sell food items
Offer farming quests
Merchants:
Buy and sell goods
Provide market information
Offer trading quests
Guards:
Patrol city streets
Protect against hostile mobs
Provide security quests
Teachers:
Teach crafting recipes
Provide skill training
Offer educational quests

14.3.2 Player Job System
Players can accept jobs from NPCs:
Job Categories:
Delivery: Transport items between locations
Collection: Gather specific resources
Construction: Build structures for NPCs
Protection: Guard NPCs or locations
Exploration: Discover new areas
Job Rewards:
FIC currency
Coins
Reputation points
Exclusive items
Skill experience

14.4 NPC Interactions
14.4.1 Trading
Buy: Purchase items from NPC vendors
Sell: Sell items to NPCs for coins
Barter: Trade items directly (no currency)

14.4.2 Gifting
Players can gift items to NPCs
Increases reputation
Unlocks special dialogue and quests
Voice line: “Dash me naa, Abeg come Bless me na” (NPC requesting gift)
Voice line: “Gift me” (NPC requesting gift)
Voice line: “Thank you” (NPC receiving gift)

14.4.3 Reputation System
Reputation Levels:
Stranger (0-100 points)
Acquaintance (101-500 points)
Friend (501-1000 points)
Trusted (1001-2500 points)
Hero (2501+ points)
Benefits:
Higher reputation = better prices
Unlock exclusive quests
Access to restricted areas
Special dialogue options

15. UI/UX Design
15.1 Screen Layout: 3-Column Postcard Design
15.1.1 Layout Structure
Top Column (60% height):
Large video/gameplay window
Main action display
Fullscreen gameplay in runner mode
Bottom Left Column (20% width, 40% height):
3 thumbnail images
Quick stats preview
Mini-map ( mode)
Bottom Right Column (20% width, 40% height):
Information panel
Statistics and analysis
Real-time data display

15.1.2 HUD Elements (In-Game)
Top-Left Corner:
Health bar (red, 100 HP)
Hunger bar (orange, 100 hunger)
Player avatar icon
Character name
Top-Right Corner:
Inventory hotbar (8 slots)
Item counts
Selected item highlight
Bottom-Left Corner:
Virtual joystick (mobile)
Movement controls
Bottom-Right Corner:
Action buttons (Jump, Mine/Place, Eat)
Button labels adapt based on context
Center-Top:
Score display (large, prominent)
Distance traveled (meters)
Time remaining (countdown)
Current mission progress
Center-Bottom:
Combo counter
Multiplier display
Power-up status icons

15.2 Menu Screens
15.2.1 Main Menu
Elements:
Game logo (SuperVi)
Play button (large, centered)
Mode selection ( / Runner)
Settings button
Store button
Profile button
Leaderboards button
Daily login bonus popup

15.2.2 Store Screen (3-Column Layout)
Top Column:
Featured items video showcase
Limited-time offers
Bottom-Left:
3 promotional images
New arrivals
Best sellers
Bottom-Right:
Store categories:
Boosters
Coins
Keys
Energy Levels
Gifts
Time Extensions
Purchase buttons
Current balance display (FIC, coins)

15.2.3 Mission Screen (3-Column Layout)
Top Column:
Current mission video preview
Mission objectives animation
Bottom-Left:
3 mission preview images
Difficulty indicators
Bottom-Right:
Mission details:
Present Mission (current progress)
New Mission (available to start)
Proposed Mission (upcoming)
System Curated Missions (AI-generated)
Multiplayer Missions (team-based)
Reward preview
Accept/Decline buttons

15.2.4 Quest Screen (3-Column Layout)
Top Column:
Quest category video (Daily/Monthly)
Bottom-Left:
Quest progress images (3)
Bottom-Right:
Quest lists:
Daily Quests (coin collection, feather collection)
Monthly Quests (weekly targets)
Progress bars
Reward previews
Claim buttons

15.3 Visual Design Principles
15.3.1 Color Palette
Primary Colors:
Afro-Futuristic Gold: #FFD700 (accents, highlights)
Deep Purple: #6A0DAD (backgrounds, UI panels)
Electric Blue: #00BFFF (interactive elements)
Vibrant Green: #00FF00 (health, positive feedback)
Warning Red: #FF0000 (danger, health low)
Secondary Colors:
Earth Brown: #8B4513 ( blocks, natural elements)
Sky Blue: #87CEEB (backgrounds, atmosphere)
Sunset Orange: #FF8C00 (hunger bar, warm accents)

15.3.2 Typography
Fonts:
Headings: Bold, futuristic sans-serif (e.g., Orbitron, Exo)
Body Text: Clean, readable sans-serif (e.g., Roboto, Open Sans)
Numbers: Monospace for scores and stats (e.g., Courier New)
Font Sizes:
H1 (Titles): 48px
H2 (Section Headers): 36px
H3 (Subsections): 24px
Body Text: 16px
Small Text (Stats): 12px

15.3.3 Iconography
Icon Style: Flat design with subtle gradients
Icon Categories:
Currency icons (FIC, coins, keys)
Item icons (blocks, food, power-ups)
Action icons (mine, place, eat, jump)
Status icons (health, hunger, energy)
Social icons (friends, chat, leaderboards)

15.4 Animations and Transitions
15.4.1 UI Animations
Button Press: Scale down 95%, bounce back
Panel Slide: Smooth slide-in from edges
Fade Transitions: 0.3-second fade between screens
Number Count-Up: Animated score increases
Progress Bars: Smooth fill animations

15.4.2 Feedback Animations
Coin Collection: Sparkle effect, fly to HUD
Power-up Activation: Screen flash, particle burst
Mission Complete: Confetti explosion, fanfare
Level Up: Radial burst, glow effect
Collision: Screen shake, red flash

15.5 Accessibility Features
15.5.1 Visual Accessibility
Colorblind Modes: Deuteranopia, Protanopia, Tritanopia filters
High Contrast Mode: Increased contrast for better visibility
Text Scaling: Adjustable font sizes (100%, 125%, 150%)
Subtitles: For all voice lines and audio cues

15.5.2 Control Accessibility
Customizable Controls: Remap buttons and gestures
Sensitivity Settings: Adjust joystick and camera sensitivity
Auto-Run Option: Continuous forward movement without input
Simplified Controls: Reduced input complexity for casual players

15.5.3 Audio Accessibility
Volume Controls: Separate sliders for music, SFX, voice
Visual Cues: On-screen indicators for audio events
Haptic Feedback: Vibration for important events (mobile)

16. Monetization Strategy
16.1 Revenue Streams
16.1.1 In-App Purchases (Primary)
Currency Packs:
FIC: $0.99 to $99.99
Coins: $0.99 to $39.99
Keys: $1.99 to $9.99
Premium Items:
Character skins: $2.99 to $9.99
Building blueprints: $1.99 to $4.99
Exclusive power-ups: $0.99 to $2.99
Time Extensions:
30 minutes to 48 hours: $1.99 to $39.99
Bundles:
Starter Pack: $4.99 (1000 FIC, 50k coins, 5 keys)
Premium Pack: $19.99 (5000 FIC, 200k coins, 20 keys, 1 character)
Ultimate Pack: $49.99 (15000 FIC, 1M coins, 50 keys, 3 characters, exclusive skin)

16.1.2 Subscription Model (Optional)
SuperVi VIP:
Monthly: $9.99
Annual: $99.99 (save 17%)
Benefits:
10% discount on all purchases
Daily FIC bonus (100 FIC/day)
Exclusive VIP skins and emotes
Priority matchmaking
Ad-free experience
Early access to new content

16.1.3 Advertisements (Secondary)
Ad Types:
Rewarded Videos: Watch ad for bonus FIC, coins, or energy
Interstitial Ads: Between runs (optional, can be disabled with VIP)
Banner Ads: Small banners in menus (non-intrusive)
Ad Frequency:
Maximum 1 ad per 5 minutes
Players can opt-out with VIP subscription
Rewarded ads always optional

16.1.4 Cosmetic Sales
Cosmetic Categories:
Character skins (50+ options)
Emotes and victory animations (30+ options)
Building block textures (20+ packs)
UI themes (10+ themes)
Pet companions (15+ pets)
Pricing: $0.99 to $9.99 per item

16.1.5 Expansion Content
DLC Packs:
New City Pack: $4.99 (3 new cities, unique NPCs, quests)
Character Pack: $7.99 (2 new characters with abilities)
Biome Pack: $3.99 (new biomes for  mode)
Story Mode: $9.99 (narrative campaign with 20 missions)
16.2 Monetization Balance
16.2.1 Free-to-Play Viability
Core Gameplay: 100% accessible without payment
All game modes available
All core features unlocked
Earn all currencies through gameplay
No pay-to-win mechanics
Grind vs. Pay:
Average player can earn 500 FIC per week through gameplay
Premium items can be earned in 2-4 weeks of active play
Paying players save time but don’t gain unfair advantages

16.2.2 Ethical Monetization
No Loot Boxes: All purchases show exact contents No Pay-to-Win: Purchases are cosmetic or time-saving only Transparent Pricing: Clear display of all costs Parental Controls: Require password for purchases Spending Limits: Optional daily/weekly spending caps

16.3 Live Events and Seasonal Content

16.3.1 Seasonal Events
Event Types:
Holiday Events: Christmas, Halloween, Easter (themed items and quests)
Cultural Celebrations: African festivals, global holidays
Community Events: Player-driven challenges and competitions
Event Duration: 1-2 weeks
Event Rewards:
Exclusive skins and items
Limited-time currency bonuses
Special event quests with high rewards

16.3.2 Battle Pass System (Optional)
Free Track:
30 tiers of rewards
Earn through gameplay
Basic cosmetics and currency
Premium Track: $9.99
50 tiers of rewards
Exclusive skins and emotes
2x currency rewards
Instant tier unlocks available
Season Duration: 3 months

17. Technical Implementation
17.1 Technology Stack
17.1.1 Game Engine Options
Option 1: Unity (Recommended)
Pros:
Excellent 3D  support
Large asset store
Strong mobile optimization
C# scripting (developer-friendly)
Unity Addressable Asset System for content delivery
Cross-platform deployment (Web, iOS, Android, Desktop)
Cons:
Licensing costs for large teams
Requires optimization for web builds
Option 2: Unreal Engine
Pros:
Stunning graphics (Lumen, Nanite)
Blueprint visual scripting
Powerful built-in tools
Free until $1M revenue
Cons:
Steeper learning curve
Larger build sizes
Less optimized for web/mobile
Option 3: Custom Web Stack (Current Prototype)
Pros:
Full control over codebase
Instant web deployment
No engine licensing fees
TypeScript for type safety
Cons:
Requires building all systems from scratch
Limited to web platform initially
Performance challenges for complex features
Recommended Stack for Production:
Engine: Unity 2023 LTS
Language: C#
Backend: Node.js + PostgreSQL
Containerization: Docker
Frontend (Web): React Native for Web + Tailwind CSS
Mobile: React Native (iOS/Android)

17.1.2 Backend Architecture
Database: PostgreSQL
Player Data: Accounts, profiles, progress
World Data:  chunks, player builds
Economy: Transactions, inventory, currency balances
Social: Friends, clans, leaderboards
Analytics: Player behavior, monetization metrics
API: Node.js + Express
RESTful API for client-server communication
WebSocket for real-time multiplayer
Authentication: JWT tokens
Rate limiting and security measures
Cloud Infrastructure:
Hosting: AWS, Google Cloud, or Azure
CDN: Cloudflare for asset delivery and DDoS protection
Database: Managed PostgreSQL (AWS RDS, Google Cloud SQL)
File Storage: S3 or Google Cloud Storage for assets

17.1.3 Performance Optimization
Geometry Merging:
Merge  blocks into single meshes per chunk
Reduces draw calls from thousands to dozens
Implemented using Unity’s CombineMeshes or Three.js BufferGeometryUtils
Chunk System:
World divided into 16x16x64 chunks
Load/unload chunks based on player position
Render distance: 3-5 chunks (configurable)
Object Pooling:
Reuse game objects instead of creating/destroying
Essential for obstacles, coins, power-ups in runner mode
Reduces garbage collection overhead
Level of Detail (LOD):
Distant chunks use simplified geometry
Reduce polygon count for far objects
Swap to high-detail models when player approaches
Occlusion Culling:
Don’t render blocks hidden by other blocks
Only render exposed faces of s
Significant performance boost in dense areas
Asset Streaming:
Unity Addressable Asset System
Load assets on-demand
Reduces initial download size
Supports 3-week update cycles
Network Optimization:
Argo Smart Routing (Cloudflare) for low latency
Delta compression for world updates
Client-side prediction for smooth multiplayer

17.2 Multiplayer Architecture
17.2.1 Networking Model
Client-Server Architecture:
Authoritative server for game state
Clients send inputs, server validates and broadcasts results
Prevents cheating and ensures consistency
Synchronization:
Player positions: 20 updates/second
World changes: Event-based (immediate broadcast)
Inventory/economy: Server-authoritative (no client-side modification)

17.2.2 Matchmaking
Quick Match:
Automatic matchmaking based on skill level
Region-based server selection
Average wait time: <30 seconds
Private Lobbies:
Create custom rooms with invite codes
Password protection
Host can set game rules
Clan-Based:
Matchmaking within clan members
Clan vs. Clan competitions
Shared clan resources and builds

17.3 Data Management
17.3.1 Save System
Cloud Saves:
Automatic cloud backup every 5 minutes
Cross-platform progress sync
Rollback to previous saves (up to 7 days)
Local Caching:
Cache frequently accessed data locally
Reduces server load
Faster load times

17.3.2 Version Control
Content Versioning:
Semantic versioning (e.g., 1.2.3)
Backward compatibility for old clients
Graceful degradation for missing assets
Update System:
Hot-reload for minor updates (no app restart)
Full update for major versions
Delta patching to minimize download size

17.4 Security Measures
17.4.1 Anti-Cheat
Server-Side Validation:
All critical actions validated on server
Impossible actions rejected (e.g., teleporting, infinite resources)
Client Integrity Checks:
Detect modified game files
Ban players using cheats or hacks
Rate Limiting:
Prevent spam and exploits
Throttle excessive API requests

17.4.2 Data Protection
Encryption:
HTTPS for all API communication
Database encryption at rest
Secure password hashing (bcrypt)
Privacy Compliance:
GDPR compliant (EU)
COPPA compliant (children under 13)
Clear privacy policy and terms of service

17.5 Analytics and Telemetry
17.5.1 Player Metrics
Tracked Data:
Session duration
Retention rates (D1, D7, D30)
Conversion rates (free to paid)
Average revenue per member (ARPU)
Churn rate
Gameplay Metrics:
Most used characters
Popular game modes
Average run distance
Mission completion rates
Item usage statistics

17.5.2 A/B Testing
Test Variables:
UI layouts
Pricing strategies
Difficulty curves
Reward structures
Tools:
Firebase A/B Testing
Custom analytics dashboard

18. Audio and Voice Lines
18.1 Voice Line System (VoiceLineService.ts)
18.1.1 Voice Line Categories
Event-Triggered Voice Lines:
“Great!” - Level/achievement completion (2s 3D animated emoji)
“Sugar crush” - Achievement success (2s 3D animated emoji)
“Wooow!” - Disappointment or excitement
“Oh yeeeaah!” - Special effects or goal achievement
“Bootilicious!” - FingerWars/SuperVi level turn (12, 20, 27 points)
“Oooh yeah go on!” - Close to completing objective
“Nice One, you’re there already” - Mii™©® variations
“You’re mine” - Acquisition of objects/gifts/earnings
Social Interaction Voice Lines: 9. “Hi ya doing” - Greetings (first time or every time) 10. “Wahala Dey” - Lamentation on obstacle encounter 11. “See Gobe” - Lamentation on seeing obstacle 12. “Kilode” - Questioning activity, requesting reason 13. “Owo ni Koko” - Earning points/gifts/money/FIC 14. “Wonderful” - Surprise 15. “Get a Hug” - Appraisal on milestone or failure 16. “Dance for me” - Enticement to retry or redo action 17. “Play my music!!” - Boastful after earning/achieving 18. “Dash me naa, Abeg come Bless me na” - Plea for gift 19. “Gift me” - Request for gift 20. “Thank you” - Appreciation for receiving gift
Financial Voice Lines: 21. “I need Urgent 2k” - Funding request 22. “Urgent 2k” - Raw funding expression 23. “Urgent 5k” - Raw funding expression 24. “I need Urgent 5k” - Funding request
Affection Voice Lines: 25. “Miss me” - Question of affection (P2P matching) 26. “I miss you” - Expression of affection 27. “Let’s do this” - Agreement action
Appraisal Voice Lines: 28. “Awesome” - Appraisal upon achievement/receipt 29. “Thumbs up!” - Appraisal upon achievement/receipt 30. “Say whaaaaaaa” - Excitement or shock 31. “Whatever” - Freedom, surprise, confusion 32. “Stunning!” - Appraisal of acquisition 33. “You look great” - Flirtatious affirmation
Achievement Voice Lines: 34. “Wereey” - Impossible stunt pulled off 35. “Madt o!” - Unusual achievement 36. “Sharp!” - Few more points achieved 37. “Oomo you gbaski” - Appraisal for doing great 38. “O B O!” - Earned something big 39. “Billion Dollar Gang” - Joined successfully 40. “Correct” - Made an achievement 41. “oOoOO ma Gaddddd!” - Pulled a stunt/did something colossal 42. “My Goodness” - Appraisals and surprises 43. “You’re Endowed” - Physical attribute appraisal 44. “You’re gorgeous” - Admiration appraisal 45. “Divine” - Impressive move 46. “Blessings Blessings Blessings” - Appraisals
Combo Announcements:
“Small combo!” - 3-5 consecutive actions
“Great combo!” - 6-10 consecutive actions
“Colossal combo!” - 11+ consecutive actions

18.1.2 Voice Line Implementation
File Format: .MP3 or .AAC
Voice Characteristics:
Nigerian Igbo Accent: Authentic pronunciation
Nigerian Yoruba Accent: Cultural authenticity
Tone: Energetic, enthusiastic, culturally appropriate
Trigger Conditions:
Specific game events (coin collection, obstacle avoidance)
Player actions (jumping, mining, crafting)
Social interactions (trading, gifting, chatting)
Achievements (mission completion, level up)
Voice Line Service Structure (TypeScript):
interface VoiceLine {
  id: string;
  text: string;
  audioFile: string;
  accent: 'igbo' | 'yoruba' | 'general';
  category: 'event' | 'social' | 'financial' | 'affection' | 'appraisal' | 'achievement' | 'combo';
  duration: number; // in seconds
  emoji?: string; // optional 3D animated emoji
}


class VoiceLineService {
  private voiceLines: Map<string, VoiceLine>;
  private audioContext: AudioContext;
  
  constructor() {
    this.voiceLines = new Map();
    this.audioContext = new AudioContext();
    this.loadVoiceLines();
  }
  
  loadVoiceLines() {
    // Load all voice line audio files
    // Map IDs to audio files and metadata
  }
  
  play(id: string, volume: number = 1.0) {
    const voiceLine = this.voiceLines.get(id);
    if (voiceLine) {
      // Play audio file
      // Trigger emoji animation if applicable
      // Log analytics event
    }
  }
  
  playRandom(category: string) {
    // Play random voice line from category
  }
  
  stop() {
    // Stop all currently playing voice lines
  }

}



18.2 Music and Sound Effects
18.2.1 Music Tracks
Main Menu: Upbeat Afro-futuristic theme  Mode: Calm, ambient exploration music Runner Mode: High-energy, fast-paced beats Cities: Region-specific cultural music Boss Battles: Intense, dramatic orchestral
Music System:
Dynamic music that adapts to gameplay
Smooth transitions between tracks
Volume control and mute options

18.2.2 Sound Effects
Gameplay SFX:
Coin collection: Ding sound
Power-up activation: Whoosh + sparkle
Obstacle collision: Crash/thud
Jump: Whoosh
Mining: Pickaxe hitting stone
Placing block: Block placement sound
UI SFX:
Button click: Soft click
Menu open/close: Whoosh
Achievement unlock: Fanfare
Level up: Triumphant chord
Error: Buzzer sound
Ambient SFX:
Wind blowing (outdoor areas)
Birds chirping (jungle/forest)
Water flowing (rivers)
City noise (urban areas)
Animal sounds (wildlife)

19. Player Controls
19.1 Mobile Controls (Primary)
19.1.1 Virtual Joystick
Position: Bottom-left corner Function: Movement (forward, backward, left, right) Visual: Circular base with draggable handle Sensitivity: Adjustable in settings

19.1.2 Swipe Gestures (Runner Mode)
Swipe Left: Move to left lane
Swipe Right: Move to right lane
Swipe Up: Jump
Swipe Down: Slide/Duck
Double Swipe Up: Double jump (2x height)
Double Swipe Down: Fast slide
Tap Down 1x: Slow down speed
Tap Down 2x: Pause running for 2 seconds
Tap Up 2x: Speed boost

19.1.3 Touch Controls ( Mode)
Touch and Drag: Look around (camera rotation)
Tap on Block: Mine/interact
Tap on Empty Space: Place block
Pinch Zoom: Adjust camera distance

19.1.4 Virtual Buttons
Jump Button:
Position: Bottom-right corner
Color: Blue
Function: Jump in  mode
Action Button:
Position: Bottom-right, above jump button
Color: Red (mine), Blue (place), Orange (eat)
Function: Context-sensitive action
Label: “MINE”, “PLACE [Block Name]”, “EAT [Food Name]”

19.2 Desktop Controls (Secondary)
19.2.1 Keyboard Controls ( Mode)
W/A/S/D: Movement (forward, left, backward, right)
Space: Jump
Left Click: Mine block
Right Click: Place block
E: Open inventory
Q: Drop item
1-8: Select hotbar slot
Shift: Sprint
Ctrl: Crouch

19.2.2 Keyboard Controls (Runner Mode)
Left Arrow / A: Move to left lane
Right Arrow / D: Move to right lane
Up Arrow / W: Jump
Down Arrow / S: Slide
Space: Jump (alternative)

19.2.3 Mouse Controls
Mouse Movement: Look around (camera rotation)
Left Click: Mine / Attack
Right Click: Place block / Interact
Scroll Wheel: Change selected hotbar slot
Middle Click: Pick block (copy block type)

19.3 Controller Support (Optional)

19.3.1 Gamepad Mapping
Left Stick: Movement
Right Stick: Camera rotation
A Button (Xbox) / X Button (PlayStation): Jump
B Button (Xbox) / Circle Button (PlayStation): Mine/Place
X Button (Xbox) / Square Button (PlayStation): Interact
Y Button (Xbox) / Triangle Button (PlayStation): Open inventory
D-Pad: Quick item selection
Triggers: Sprint (RT/R2), Crouch (LT/L2)
Bumpers: Cycle hotbar (RB/R1, LB/L1)

19.4 Accessibility Controls

19.4.1 Customizable Controls
Remap any button or gesture
Adjust sensitivity for joystick and camera
Enable/disable specific gestures

19.4.2 Assisted Controls
Auto-Run: Continuous forward movement
Auto-Jump: Automatically jump over obstacles
Aim Assist: Easier targeting for mining/placing
Simplified Gestures: Reduce swipe complexity

20. Development Roadmap

20.1 Phase 1: Pre-Production (Months 1-3)
Month 1: Planning and Design
Finalize Game Design Document
Create technical design documents
Assemble development team (8-12 people)
Set up development environment
Create project timeline and milestones
Month 2: Prototyping
Build core  engine prototype
Implement basic runner mechanics
Test procedural generation algorithms
Create initial art style guide
Develop UI mockups
Month 3: Vertical Slice
Create playable vertical slice (5-minute gameplay demo)
Implement one complete game mode
Test core mechanics with focus group
Refine gameplay based on feedback
Secure funding or publisher (if needed)

20.2 Phase 2: Production (Months 4-15)
Months 4-6: Core Systems
Implement full  building system
Develop endless runner mode
Create inventory and crafting systems
Build multiplayer infrastructure
Implement save/load system
Months 7-9: Content Creation
Design and build 15+ cities
Create 50+ block types
Develop 6 playable characters
Design 100+ missions and quests
Compose music and sound effects
Months 10-12: Features and Polish
Implement NPC system with AI
Develop economy and monetization
Create UI/UX for all screens
Integrate voice line system
Add social features (friends, clans)
Months 13-15: Optimization and Testing
Performance optimization (target 60 FPS)
Cross-platform testing (Web, iOS, Android)
Bug fixing and stability improvements
Balance gameplay and economy
Conduct closed beta testing

20.3 Phase 3: Launch (Months 16-18)
Month 16: Soft Launch
Release in select regions (e.g., Nigeria, Kenya)
Monitor server performance
Gather player feedback
Adjust monetization based on data
Fix critical bugs
Month 17: Marketing and PR
Create launch trailer and promotional materials
Social media campaign (Twitter, Instagram, TikTok)
Influencer partnerships
Press releases and media outreach
Community building (Discord, forums)
Month 18: Global Launch
Worldwide release on all platforms
Launch day events and promotions
Monitor server load and scale as needed
Respond to player feedback
Celebrate with community

20.4 Phase 4: Post-Launch (Ongoing)
Months 19-24: Live Operations
Weekly content updates (new missions, quests)
Monthly events and seasonal content
Balance patches and bug fixes
Community engagement (contests, challenges)
Expand to new platforms (console, VR)
Year 2+: Expansion
Major content updates (new cities, biomes)
Story mode DLC
Competitive esports mode
Cross-platform play enhancements
Localization to more languages

20.5 Team Structure
Core Team (8-12 people)
Game Director: Overall vision and design
Lead Programmer: Core systems and architecture
Network Programmer: Multiplayer and backend
Gameplay Programmer: Mechanics and features
3D Artist / Modeler: Characters, environments, assets
UI/UX Designer: Interface design and member experience
Sound Designer / Composer: Music and sound effects
QA Lead: Testing and quality assurance
Community Manager: Player engagement and support
Producer: Project management and coordination
Extended Team (Contractors / Part-Time)
Voice actors (Nigerian Igbo, Yoruba accents)
Additional 3D artists for asset creation
Backend engineers for server infrastructure
Marketing and PR specialists
Legal and compliance advisors

20.6 Budget Estimate (Rough)
Development Costs (18 months)
Team Salaries: $800,000 - $1,200,000
Software Licenses: $20,000 - $50,000
Server Infrastructure: $30,000 - $60,000
Audio Production: $15,000 - $30,000
Marketing and PR: $50,000 - $150,000
Legal and Compliance: $10,000 - $20,000
Contingency (20%): $185,000 - $302,000
Total Estimated Budget: $1,110,000 - $1,812,000
Note: Costs vary based on team location, experience, and scope adjustments.

21. Conclusion
SuperVi is an ambitious and innovative game that combines the creative freedom of  building with the addictive challenge of endless runner mechanics. Set in an Afro-futuristic universe, the game celebrates African culture while offering global appeal.
Key Strengths:
Unique Dual Gameplay: Seamlessly blends two popular genres
Cultural Authenticity: Celebrates African heritage with authentic voice lines and settings
Deep Progression Systems: Missions, quests, economy, and character progression
Social Features: Multiplayer, clans, and community engagement
Ethical Monetization: Fair free-to-play model with no pay-to-win
Development Priorities:
Core Gameplay First: Ensure  and runner modes are fun and polished
Performance Optimization: Target 60 FPS on all platforms
Community Building: Engage players early and often
Iterative Development: Test, gather feedback, improve continuously
Cultural Sensitivity: Work with cultural consultants for authenticity
Success Metrics:
Player Retention: 40% D1, 20% D7, 10% D30
Conversion Rate: 5-10% of players make a purchase
Average Revenue Per member (ARPU): $2-5
Community Engagement: Active Discord, social media presence
Critical Reception: 4+ star ratings on app stores

Final Thoughts:
SuperVi has the potential to become a cultural phenomenon, blending entertainment with cultural celebration. With careful planning, talented execution, and community-focused development, this game can achieve both commercial success and cultural impact.
Development Team: Ready to build something amazing. Community: Ready to play and celebrate. SuperVi: Ready to rise.

Document End
This Game Design Document is a living document and will be updated throughout development as features are refined, tested, and implemented.

**********************************************************************************************************************************************

### Section 2: Creations.

Now Create using Three.js with the following features: - 3D SuperVi world with infinite procedural terrain generation - Building and crafting mechanics with block placement/mining - Day/night cycle system - Mobile-friendly controls (virtual joystick, touch controls) - Jungle/forest terrain with trees and foliage - Basic survival mechanics (health, hunger, inventory) – Six (6) Lane-based runner mode inspired by Subway Surfers with obstacles - Collectible system (coins, power-ups, boosters) - Score tracking and mission system - HUD with player stats, score, distance, time - Store interface for purchasing items - Quest system (daily and monthly challenges) - Use Tailwind-ui, TypeScript, and Tailwind CSS - Implement the game in  directory - Create proper project structure with organized components Technology stack: Vite, Three.js, TypeScript, Tailwind CSS, Tailwind-ui The plan has been confirmed with the member. No need to ask human or draft plan again. Proceed directly.


Create comprehensive SuperVi Game Design Document (GDD) covering: - Complete game concept overview and vision - Core gameplay mechanics (SuperVi building, crafting, runner mode, survival) - Detailed system descriptions (procedural generation, difficulty adjustment, mission system, monetization) - member experience flow from start to end - Game modes (sandbox SuperVi mode, endless runner mode, multiplayer concepts) - Character system (6 playable characters with Afro-futuristic theme) - World design (cities, islands, VILLANs, environments across 15+ global locations) - Economy system (FIC currency, coins, keys, energy levels, store items) - Quest and mission structure (daily/monthly challenges, rewards) - Power-ups and collectibles system - Obstacle types and difficulty progression - UI/UX specifications (3-column postcard layout, HUD elements, menus) - Technical requirements and constraints - Performance optimization strategies Save the document to: /workspace/docs/SuperVi-gdd.md The plan has been confirmed with the member. No need to ask human or draft plan again. Proceed directly.

Create VoiceLineService.ts with African Nigerian Igbo/Yoruba accent voice line integration: - Implement voice line system with 46+ event-triggered phrases - Include all specified voice lines from "Great!" to "Blessings Blessings Blessings" - Add combo announcements: "Small combo!", "Great combo!", "Colossal combo!" - Create event trigger system for achievements, milestones, obstacles, earnings, greetings - Integrate with game events (score milestones, collectibles, obstacles, social interactions) - Support for .mp3 or .aac audio formats - Include 3D animated emoticons/emoji/stickers system (2-second animations) - Create TypeScript interfaces and enums for voice line categories Save to: /src/services/VoiceLineService.ts The plan has been confirmed with the member. No need to ask human or draft plan again. Proceed directly.

Create Full Technical Architecture Guide for SuperVi covering: - Unity/Unreal Engine implementation blueprint - Backend infrastructure (PostgreSQL database schema, Docker containerization, Node.js API design) - Multiplayer networking architecture (real-time sync, player matchmaking, 6-player sessions) - VILLAN AI systems (pathfinding, task assignment, dialogue system) - Procedural generation algorithms (infinite terrain, tile-based spawning, obstacle placement) - Dynamic Difficulty Adjustment (DDA) implementation - Monetization features (in-app purchases, FIC currency system, store integration) - Content management (Unity Addressable Asset System, asset loading/unloading) - Performance optimization (object pooling, LOD systems, chunk management) - Cloud infrastructure (Cloudflare Argo Smart Routing, CDN setup) - Mobile deployment (React Native integration, cross-platform considerations) - Security and anti-cheat measures Save to: /workspace/docs/SuperVi-technical-architecture.md The plan has been confirmed with the member. No need to ask human or draft plan again. Proceed directly.

Create Asset Generation Guidelines document covering: - 3D modeling workflow (Blender, Maya, 3ds Max, ZBrush) - SuperVi model creation for blocks and structures - Character rigging and animation (6 Afro-futuristic characters) - Environment asset creation ‘’(cities, forests, islands across 15+ locations) - VILLAN models and animations (walking, working, talking) - Texture creation and opt5imization - LOD (Level of Detail) model generation - Integration with Meshy.ai API (API Key: msy_g7H9VvfYAPq5fPu6P2U60fyBKzcuilEAbg45) - File format standards (FBX, glTF/GLB, OBJ) - Audio asset creation (voice lines, sound effects, music) - Animation guidelines (idle, run, jump, attack, interact) - Performance optimization for mobile devices - Asset naming conventions and organization Save to: /workspace/docs/SuperVi-asset-guidelines.md The plan has been confirmed with the member. No need to ask human or draft plan again. Proceed directly.
Create Deployment Strategy Guide covering: - Mobile deployment (hosting options, CDN setup, SSL configuration) - Mobile app packaging with React Native (iOS and Android builds) - Server infrastructure setup (PostgreSQL, Docker, Node.js backend) - Database migration and seeding strategies - CI/CD pipeline configuration - Environment configuration (development, staging, production) - Monitoring and analytics integration - Backup and disaster recovery procedures - Scaling strategies for multiplayer infrastructure - Performance monitoring and optimization - Security best practices and compliance Save to: /workspace/docs/SuperVi-deployment-strategy.md The plan has been confirmed with the member. No need to ask human or draft plan again. Proceed directly.

This is a massive undertaking involving a hybrid of Forest-Urban City-style SuperVi mechanics and Subway Surfers-style runner gameplay. To make this "better," I have synthesized your requirements into a cohesive, high-performance architecture.
I will focus on the Technical Architecture and the SuperVi-Runner Hybrid Logic, as these are the hardest parts to get right in a Mobile environment.

1. Game Design Document (GDD) Highlights
File: /workspace/docs/SuperVi-gdd.md
Vision: An Afro-futuristic "Build-to-Run" experience. Players build their home base in the SuperVi Sandbox and venture into "The Rift" (Runner Mode) to gather rare resources.
Core Loop: 1. Settle: Build in the SuperVi jungle. 2. Scout: Enter the lane-based runner mode to collect $FIC and materials. 3. Survive: Manage hunger/health using harvested crops.
Characters: 6 Heroes (e.g., Zola the Architect, Kojo the Sprinter) with unique stats for jump height or mining speed.

2. Voice Line & Emote Service

File: /src/services/VoiceLineService.ts
TypeScript

export enum VoiceEvent {
  ACHIEVEMENT = 'ACHIEVEMENT',
  OBSTACLE_HIT = 'OBSTACLE_HIT',
  COMBO_SMALL = 'COMBO_SMALL',
  COMBO_COLOSSAL = 'COMBO_COLOSSAL',
  GREETING = 'GREETING'
}

interface VoiceLine {
  text: string;
  audioPath: string;
  accent: 'Igbo' | 'Yoruba' | 'Pidgin';
}

export const VoiceLines: Record<VoiceEvent, VoiceLine[]> = {
  [VoiceEvent.COMBO_COLOSSAL]: [
    { text: "Oshey! Colossal combo!", audioPath: "/audio/yoruba/colossal.mp3", accent: 'Yoruba' },
    { text: "Blessings, blessings, blessings!", audioPath: "/audio/igbo/blessings.mp3", accent: 'Igbo' }
  ],
  // ... 46+ phrases mapped here
};

export class VoiceLineService {
  static play(event: VoiceEvent) {
    const lines = VoiceLines[event];
    const selected = lines[Math.floor(Math.random() * lines.length)];
    const audio = new Audio(selected.audioPath);
    audio.play();
    this.triggerEmote(selected.text);
  }

  private static triggerEmote(text: string) {
    // Logic to render 2-second 3D emoji/sticker in HUD
    console.log(`Emote triggered: ${text}`);
  }
}

3. Technical Architecture: The Hybrid Engine
File: /workspace/docs/SuperVi-technical-architecture.md
SuperVi Generation (The "World" Layer)
Algorithm: Simplex Noise for 2D heightmaps + 3D Perlin Noise for caves/overhangs.
Optimization: * Chunking: 16×16×16 blocks.
oFrustum Culling: Only render chunks in the player's view.
oWorker Threads: Offload mesh generation to Mobile Workers to prevent UI lag.
Runner Mode (The "Lane" Layer)
Logic: A "Treadmill" approach. Instead of the player moving infinitely, the world chunks move toward the player at z-axis speed v.
Lane Switching: Three fixed x positions: −2,0,2. Use Lerp for smooth transitions.

4. Implementation Plan (Tailwind + Three.js)
Directory: /
components/game/Scene.tsx: The Three.js Canvas container.
components/ui/HUD.tsx: Tailwind-based overlays for Health, Hunger, and $FIC currency.
hooks/useControls.ts: Hybrid listener for WASD and Mobile Touch (Swipe for runner, Joystick for SuperVi).

5. Asset Pipeline (Meshy.ai Integration)
File: /workspace/docs/SuperVi-asset-guidelines.md
To generate the Afro-futuristic assets:
1.Prompting: Use Meshy.ai for "Low-poly SuperVi character, Yoruba-inspired futuristic armor, bright neon accents."
2.Processing: Export as .glb.
3.Optimization: Use gltf-transform to compress textures for mobile Mobile performance.

Generate the full boilerplate code for the SuperVi World  class or the RunnerManager logic first?
To implement the hybrid engine, we need a robust structure that handles both the infinite SuperVi world and the high-speed runner mechanics. 
Below is the boilerplate for the SuperVi Engine and the Runner Manager, integrated with Three.js and TypeScript.

1. SuperVi World Engine
This service handles the generation of chunks and the management of city blocks. It uses a Map to store chunks for $O(1)$ access.
TypeScript
// /src/game/SuperVi World .ts
import * as THREE from 'three';
import { createNoise2D } from 'simplex-noise';

export class SuperVi World  {
  private chunks: Map<string, THREE.Mesh> = new Map();
  private chunkSize = 16;
  private noise = createNoise2D();
  private scene: THREE.Scene;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  generateChunk(x: number, z: number) {
    const key = `${x},${z}`;
    if (this.chunks.has(key)) return;

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x228b22 }); // Jungle Green
    const instancedMesh = new THREE.InstancedMesh(geometry, material, this.chunkSize * this.chunkSize * 10);

    let count = 0;
    const matrix = new THREE.Matrix4();

    for (let cx = 0; cx < this.chunkSize; cx++) {
      for (let cz = 0; cz < this.chunkSize; cz++) {
        const worldX = x * this.chunkSize + cx;
        const worldZ = z * this.chunkSize + cz;
        const height = Math.floor(this.noise(worldX * 0.05, worldZ * 0.05) * 5) + 10;

        for (let cy = 0; cy < height; cy++) {
          matrix.setPosition(worldX, cy, worldZ);
          instancedMesh.setMatrixAt(count++, matrix);
        }
      }
    }

    this.scene.add(instancedMesh);
    this.chunks.set(key, instancedMesh as any);
  }

  update(playerPos: THREE.Vector3) {
    const px = Math.floor(playerPos.x / this.chunkSize);
    const pz = Math.floor(playerPos.z / this.chunkSize);
    
    // Generate chunks in a 3x3 grid around player
    for (let x = px - 1; x <= px + 1; x++) {
      for (let z = pz - 1; z <= pz + 1; z++) {
        this.generateChunk(x, z);
      }
    }
  }
}

2. Lane-Based Runner Manager
This logic handles the "Subway Surfers" style movement, specifically lane switching and obstacle spawning.
TypeScript
// /src/game/RunnerManager.ts
import * as THREE from 'three';

export enum Lane {
  LEFT = -2,
  CENTER = 0,
  RIGHT = 2
}

export class RunnerManager {
  public currentLane: Lane = Lane.CENTER;
  private targetX: number = 0;
  private speed: number = 0.5;
  private obstacles: THREE.Mesh[] = [];

  update(player: THREE.Group) {
    // Smooth Lane Transition (Lerp)
    player.position.x = THREE.MathUtils.lerp(player.position.x, this.targetX, 0.1);
    
    // Move obstacles toward player
    this.obstacles.forEach((obs, index) => {
      obs.position.z -= this.speed;
      
      // Collision Detection
      if (obs.position.distanceTo(player.position) < 1) {
        console.log("Collision! Triggering Health reduction...");
      }

      // Cleanup
      if (obs.position.z < -10) {
        obs.removeFromParent();
        this.obstacles.splice(index, 1);
      }
    });
  }

  moveLeft() {
    if (this.currentLane === Lane.CENTER) this.targetX = Lane.LEFT;
    else if (this.currentLane === Lane.RIGHT) this.targetX = Lane.CENTER;
  }

  moveRight() {
    if (this.currentLane === Lane.CENTER) this.targetX = Lane.RIGHT;
    else if (this.currentLane === Lane.LEFT) this.targetX = Lane.CENTER;
  }
}

3. Main Game Loop (React Component)
Using react-three-fiber concepts for the Tailwind integration.
TypeScript
// /src/components/game/SuperVi.tsx
import React, { memberef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { SuperVi World  } from '@/game/SuperVi World ';
import { RunnerManager } from '@/game/RunnerManager';
import { VoiceLineService, VoiceEvent } from '@/services/VoiceLineService';

const GameScene = () => {
  const playerRef = memberef<THREE.Group>(null!);
  const worldRef = memberef<SuperVi World >();
  const runnerRef = memberef(new RunnerManager());

  useFrame((state) => {
    if (playerRef.current) {
      // 1. Update World Chunks
      worldRef.current?.update(playerRef.current.position);
      
      // 2. Update Runner Logic
      runnerRef.current.update(playerRef.current);
      
      // 3. Move Camera
      state.camera.position.z = playerRef.current.position.z + 5;
      state.camera.lookAt(playerRef.current.position);
    }
  });

  return (
    <>
      <group ref={playerRef}>
        <mesh>
          <boxGeometry args={[1, 2, 1]} />
          <meshStandardMaterial color="orange" />
        </mesh>
      </group>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} />
    </>
  );
};

export const SuperVi = () => (
  <div className="w-full h-screen bg-slate-900 relative">
    <Canvas>
      <GameScene />
    </Canvas>
    {/* Tailwind UI Overlay */}
    <div className="absolute top-4 left-4 text-white p-4 bg-black/50 rounded-lg">
      <h2 className="text-xl font-bold">SuperVi</h2>
      <p>FIC Coins: 1,240</p>
    </div>
  </div>
);

Next Steps: implement the Survival UI using Tailwind-ui components (Health bars, Hunger meters) or the Inventory System logic next?
the Survival UI using Tailwind-ui components
(Health bars, Hunger meters) then the Inventory System logic next
To implement the Survival UI and Inventory System, we will utilize Tailwind-UI's progress components and layout utilities. This layer sits directly over the Three.js canvas to provide a crisp, modern gaming interface.

1. Survival UI (HUD)
Using Tailwind's Progress component and Lucide icons to create a high-visibility status bar.
TypeScript
// /src/components/game/HUD.tsx
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Heart, Utensils, Coins, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";

interface HUDProps {
  health: number;
  hunger: number;
  coins: number;
  distance: number;
}

export const HUD: React.FC<HUDProps> = ({ health, hunger, coins, distance }) => {
  return (
    <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between select-none">
      {/* Top Bar: Stats & Currency */}
      <div className="flex justify-between items-start">
        <div className="space-y-3 w-64 pointer-events-auto">
          {/* Health Bar */}
          <div className="flex items-center gap-3 bg-black/40 p-2 rounded-full backdrop-blur-md border border-red-500/30">
            <Heart className="text-red-500 fill-red-500 animate-pulse" size={20} />
            <Progress value={health} className="h-3 bg-red-950/50" indicatorClassName="bg-red-500" />
          </div>
          
          {/* Hunger Bar */}
          <div className="flex items-center gap-3 bg-black/40 p-2 rounded-full backdrop-blur-md border border-orange-500/30">
            <Utensils className="text-orange-500" size={20} />
            <Progress value={hunger} className="h-3 bg-orange-950/50" indicatorClassName="bg-orange-500" />
          </div>
        </div>

        {/* Currency & Distance */}
        <Card className="bg-black/60 border-yellow-500/50 p-4 flex gap-6 text-white backdrop-blur-xl pointer-events-auto">
          <div className="flex items-center gap-2">
            <Coins className="text-yellow-400" />
            <span className="font-bold text-xl">{coins.toLocaleString()} <small className="text-[10px] text-yellow-500">FIC</small></span>
          </div>
          <div className="flex items-center gap-2 border-l border-white/20 pl-4">
            <MapPin className="text-blue-400" />
            <span className="font-mono text-xl">{distance}m</span>
          </div>
        </Card>
      </div>
    </div>
  );
};

2. Inventory System Logic
This service manages the player's collection of SuperVi blocks and runner power-ups.
TypeScript
// /src/game/InventoryService.ts
export type ItemType = 'BLOCK' | 'POWERUP' | 'RESOURCE';

export interface InventoryItem {
  id: string;
  name: string;
  type: ItemType;
  quantity: number;
  icon: string;
  maxStack: number;
}

export class InventoryService {
  private items: Map<string, InventoryItem> = new Map();
  private slots: number = 9;

  addItem(item: Omit<InventoryItem, 'quantity'>, amount: number): boolean {
    const existing = this.items.get(item.id);
    
    if (existing) {
      const newTotal = existing.quantity + amount;
      existing.quantity = Math.min(newTotal, item.maxStack);
      return true;
    }

    if (this.items.size < this.slots) {
      this.items.set(item.id, { ...item, quantity: amount });
      return true;
    }

    return false; // Inventory full
  }

  getItems(): InventoryItem[] {
    return Array.from(this.items.values());
  }

  useItem(id: string): boolean {
    const item = this.items.get(id);
    if (!item || item.quantity <= 0) return false;

    item.quantity -= 1;
    if (item.quantity === 0) this.items.delete(id);
    return true;
  }
}

3. Hotbar UI Component
A bottom-centered hotbar for quick access to building blocks and consumables.
TypeScript
// /src/components/game/Hotbar.tsx
import { InventoryItem } from '@/game/InventoryService';
import { cn } from "@/lib/utils";

export const Hotbar = ({ items, activeIndex }: { items: InventoryItem[], activeIndex: number }) => {
  return (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 pointer-events-auto bg-black/20 p-2 rounded-xl backdrop-blur-sm">
      {Array.from({ length: 9 }).map((_, i) => {
        const item = items[i];
        return (
          <div
            key={i}
            className={cn(
              "w-14 h-14 rounded-lg border-2 flex items-center justify-center relative transition-all",
              activeIndex === i 
                ? "border-yellow-400 bg-white/20 scale-110 shadow-[0_0_15px_rgba(250,204,21,0.5)]" 
                : "border-white/10 bg-black/40"
            )}
          >
            {item && (
              <>
                <span className="text-2xl">{item.icon}</span>
                <span className="absolute bottom-1 right-1 text-[10px] font-bold text-white bg-black/50 px-1 rounded">
                  {item.quantity}
                </span>
              </>
            )}
            <span className="absolute top-0.5 left-1 text-[8px] text-white/30">{i + 1}</span>
          </div>
        );
      })}
    </div>
  );
};

Integration Note:
To tie this together, add the HUD and Hotbar inside your SuperVi.tsx main component. Use a useEffect to trigger a VoiceLineService call (e.g., "Great!") whenever an item is added to the inventory or a distance milestone is reached.
Create the Store Interface (purchasing items with FIC) or the Quest System (daily/monthly challenges) next?
create the Store Interface (purchasing items with FIC) then the Quest System (daily/monthly challenges) next
To implement the Store Interface and Quest System, we’ll use Tailwind-UI's Tabs, Dialog, and ScrollArea components. These will provide a high-fidelity "Meta-UI" that feels like a premium mobile game.

1. Store Interface (FIC Economy)
This component allows players to spend their earned currency on characters and power-ups.

TypeScript
// /src/components/game/Store.tsx
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingBag, Zap, member, Star } from "lucide-react";

const STORE_ITEMS = [
  { id: 'p1', name: 'Magnet Booster', cost: 500, icon: <Zap className="text-blue-400"/>, desc: 'Pulls FIC coins automatically' },
  { id: 'c1', name: 'Zola (Architect)', cost: 5000, icon: <member className="text-purple-400"/>, desc: 'Faster building speed' },
  { id: 'b1', name: 'Jungle Totem', cost: 1200, icon: <Star className="text-yellow-400"/>, desc: 'Decoration for SuperVi base' },
];

export const Store = ({ balance }: { balance: number }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold gap-2 border-none">
          <ShoppingBag size={18} /> OPEN STORE
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-yellow-500 uppercase italic">Prime Market</DialogTitle>
          <p className="text-slate-400 text-sm">Balance: {balance.toLocaleString()} FIC</p>
        </DialogHeader>
        
        <Tabs defaultValue="powerups" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800">
            <TabsTrigger value="powerups">Power-ups</TabsTrigger>
            <TabsTrigger value="characters">Characters</TabsTrigger>
          </TabsList>
          
          <TabsContent value="powerups">
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-4 pt-4">
                {STORE_ITEMS.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-slate-800 rounded-xl border border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-slate-700 rounded-lg">{item.icon}</div>
                      <div>
                        <h4 className="font-bold">{item.name}</h4>
                        <p className="text-xs text-slate-400">{item.desc}</p>
                      </div>
                    </div>
                    <Button 
                      disabled={balance < item.cost}
                      className="bg-yellow-500 hover:bg-yellow-400 text-black font-black"
                    >
                      {item.cost} FIC
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

2. Quest System (Daily & Monthly)
A logic-driven quest tracker that rewards players for hitting milestones.

TypeScript
// /src/game/QuestService.ts
export interface Quest {
  id: string;
  title: string;
  type: 'DAILY' | 'MONTHLY';
  target: number;
  current: number;
  reward: number;
  isClaimed: boolean;
}

export const INITIAL_QUESTS: Quest[] = [
  { id: 'q1', title: 'Run 5000m', type: 'DAILY', target: 5000, current: 1200, reward: 250, isClaimed: false },
  { id: 'q2', title: 'Mine 100 SuperVi Blocks', type: 'DAILY', target: 100, current: 45, reward: 150, isClaimed: false },
  { id: 'q3', title: 'Collect 50,000 FIC', type: 'MONTHLY', target: 50000, current: 15400, reward: 2000, isClaimed: false },
];

export class QuestService {
  static getProgress(quest: Quest): number {
    return Math.min((quest.current / quest.target) * 100, 100);
  }

  static isComplete(quest: Quest): boolean {
    return quest.current >= quest.target;
  }
}

3. Quest UI Component
A postcard-style layout for tracking challenges.
TypeScript
// /src/components/game/QuestBoard.tsx
import { Quest, QuestService } from '@/game/QuestService';
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Trophy } from "lucide-react";

export const QuestBoard = ({ quests }: { quests: Quest[] }) => {
  return (
    <div className="grid grid-cols-1 gap-4 w-full">
      {quests.map((quest) => {
        const progress = QuestService.getProgress(quest);
        const complete = QuestService.isComplete(quest);

        return (
          <div key={quest.id} className={`p-4 rounded-xl border-2 transition-all ${
            complete ? 'border-green-500 bg-green-500/10' : 'border-slate-700 bg-slate-800/50'
          }`}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  quest.type === 'DAILY' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                }`}>
                  {quest.type}
                </span>
                <h3 className="font-bold text-white mt-1">{quest.title}</h3>
              </div>
              {complete ? <CheckCircle2 className="text-green-500" /> : <Trophy className="text-slate-600" size={18} />}
            </div>

            <Progress value={progress} className="h-2 mb-2" indicatorClassName={complete ? "bg-green-500" : "bg-blue-500"} />
            
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>{quest.current} / {quest.target}</span>
              <span className="text-yellow-500 font-bold">REWARD: {quest.reward} FIC</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

Integration Logic
In your main SuperVi.tsx file, you would now state-manage these:
1.FIC Balance: Tracked via useState.
2.Purchase Logic: Deduct balance and update InventoryService when a store item is bought.
3.Voice Triggers: Call VoiceLineService.play(VoiceEvent.ACHIEVEMENT) when QuestService.isComplete(quest) transitions from false to true.
Implement the character system (6 Afro-futuristic characters with unique stats) or the VILLAN AI Dialogue system next
To implement the Character System and VILLAN AI Dialogue System, we'll create a dedicated service for managing character data and an interactive component for VILLAN conversations. The characters will have distinct stats that influence gameplay, while the dialogue system will offer branching narrative paths.

1. Character System (6 Afro-futuristic Characters)
This service will define and manage the playable characters, each with unique attributes that affect gameplay in both SuperVi and Runner modes.
TypeScript
// /src/game/CharacterService.ts

export interface CharacterStats {
  id: string;
  name: string;
  description: string;
  avatar: string; // URL to character image
  baseHealth: number;
  baseHunger: number;
  miningSpeedMultiplier: number; // For SuperVi mode
  runSpeedMultiplier: number;    // For Runner mode
  jumpHeightMultiplier: number;
  specialAbility: string;
}

export const CHARACTERS: CharacterStats[] = [
  {
    id: 'zola',
    name: 'Zola (The Architect)',
    description: 'A brilliant builder with a knack for terrain manipulation. Excels in SuperVi construction.',
    avatar: '/assets/characters/zola.png',
    baseHealth: 100,
    baseHunger: 100,
    miningSpeedMultiplier: 1.5,
    runSpeedMultiplier: 1.0,
    jumpHeightMultiplier: 1.0,
    specialAbility: 'Insta-Build (places blocks faster)'
  },
  {
    id: 'kofi',
    name: 'Kofi (The Sprinter)',
    description: 'Lightning-fast and agile, perfect for navigating the perilous Rift.',
    avatar: '/assets/characters/kofi.png',
    baseHealth: 90,
    baseHunger: 120,
    miningSpeedMultiplier: 0.8,
    runSpeedMultiplier: 1.3,
    jumpHeightMultiplier: 1.2,
    specialAbility: 'Dash (brief burst of invincibility)'
  },
  {
    id: 'ayo',
    name: 'Ayo (The Botanist)',
    description: 'Understands the natural world, yielding more resources from flora.',
    avatar: '/assets/characters/ayo.png',
    baseHealth: 110,
    baseHunger: 110,
    miningSpeedMultiplier: 1.2, // Better resource gathering
    runSpeedMultiplier: 1.0,
    jumpHeightMultiplier: 1.0,
    specialAbility: 'Harvest Boost (double plant yield)'
  },
  {
    id: 'esther',
    name: 'Esther (The Engineer)',
    description: 'Master of gadgets and traps, capable of modifying obstacles.',
    avatar: '/assets/characters/esther.png',
    baseHealth: 95,
    baseHunger: 105,
    miningSpeedMultiplier: 1.0,
    runSpeedMultiplier: 1.1,
    jumpHeightMultiplier: 1.0,
    specialAbility: 'Rift Reroute (changes upcoming obstacle type)'
  },
  {
    id: 'nnamdi',
    name: 'Nnamdi (The Guardian)',
    description: 'Tough and resilient, enduring more hits in the Rift.',
    avatar: '/assets/characters/nnamdi.png',
    baseHealth: 130,
    baseHunger: 90,
    miningSpeedMultiplier: 0.9,
    runSpeedMultiplier: 0.9,
    jumpHeightMultiplier: 0.9,
    specialAbility: 'Shield (brief invulnerability)'
  },
  {
    id: 'amina',
    name: 'Amina (The Mystic)',
    description: 'Connects with ancient energies, finding rare collectibles.',
    avatar: '/assets/characters/amina.png',
    baseHealth: 100,
    baseHunger: 100,
    miningSpeedMultiplier: 1.0,
    runSpeedMultiplier: 1.0,
    jumpHeightMultiplier: 1.1,
    specialAbility: 'Treasure Sense (highlights nearby rare items)'
  }
];

export class CharacterService {
  private activeCharacter: CharacterStats = CHARACTERS[0]; // Default character

  setSelectedCharacter(charId: string) {
    const character = CHARACTERS.find(c => c.id === charId);
    if (character) {
      this.activeCharacter = character;
      console.log(`Active character set to: ${character.name}`);
      // Potentially trigger a voice line: "Character selected!"
    } else {
      console.warn(`Character with ID ${charId} not found.`);
    }
  }

  getActiveCharacter(): CharacterStats {
    return this.activeCharacter;
  }
}

2. Character Selection UI (Tailwind-UI)
This component will allow players to browse and select their character.
TypeScript
// /src/components/game/CharacterSelect.tsx
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CHARACTERS, CharacterStats, CharacterService } from '@/game/CharacterService';
import { member } from 'lucide-react';

interface CharacterSelectProps {
  onCharacterSelect: (charId: string) => void;
  activeCharacterId: string;
}

export const CharacterSelect: React.FC<CharacterSelectProps> = ({ onCharacterSelect, activeCharacterId }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-blue-500 hover:bg-blue-600 text-white font-bold gap-2 border-none">
          <member size={18} /> SELECT CHARACTER
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-blue-400 uppercase italic">Choose Your Hero</DialogTitle>
          <p className="text-slate-400 text-sm">Select a character to explore SuperVi's vibrant world.</p>
        </DialogHeader>

        <ScrollArea className="h-[400px] pr-4">
          <div className="grid grid-cols-2 gap-6 pt-4">
            {CHARACTERS.map((char) => (
              <div 
                key={char.id} 
                className={`flex flex-col items-center p-4 rounded-xl transition-all duration-200 
                  ${activeCharacterId === char.id ? 'bg-blue-700/30 border-2 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'bg-slate-800/50 border border-slate-700 hover:bg-slate-700/50'}`}
              >
                <Avatar className="w-24 h-24 mb-3 border-4 border-white/20">
                  <AvatarImage src={char.avatar} alt={char.name} />
                  <AvatarFallback>{char.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h4 className="font-bold text-xl text-center">{char.name}</h4>
                <p className="text-xs text-slate-400 text-center mt-1 h-10 overflow-hidden">{char.description}</p>
                
                <div className="grid grid-cols-2 gap-2 text-xs mt-3 w-full text-slate-300">
                    <span className="flex items-center gap-1"><Zap size={12} className="text-yellow-400" /> Run: {char.runSpeedMultiplier}x</span>
                    <span className="flex items-center gap-1"><Trophy size={12} className="text-green-400" /> Mine: {char.miningSpeedMultiplier}x</span>
                </div>

                <Button 
                  onClick={() => onCharacterSelect(char.id)}
                  className="mt-4 w-full bg-blue-600 hover:bg-blue-500 text-white font-black"
                  disabled={activeCharacterId === char.id}
                >
                  {activeCharacterId === char.id ? "SELECTED" : "SELECT"}
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

3. VILLAN AI Dialogue System
This system defines conversational flows and allows players to interact with VILLANs.
TypeScript
// /src/game/VILLANDialogueService.ts
import { VoiceLineService, VoiceEvent } from '@/services/VoiceLineService';

export interface DialogueNode {
  id: string;
  speaker: string; // VILLAN name
  text: string;
  options?: { text: string; nextNodeId: string; }[];
  action?: 'GIVE_QUEST' | 'TRADE' | 'INFO' | 'COMPLETE_QUEST'; // Optional action
}

export const DIALOGUES: Record<string, DialogueNode> = {
  'welcome_start': {
    id: 'welcome_start',
    speaker: 'Elder Nzinga',
    text: 'Greetings, traveler. Welcome to our sacred lands. How may I assist you today?',
    options: [
      { text: 'Tell me about this place.', nextNodeId: 'welcome_info' },
      { text: 'I need to trade.', nextNodeId: 'trade_start' },
      { text: 'I have a quest to complete.', nextNodeId: 'quest_complete' },
      { text: 'Farewell.', nextNodeId: 'goodbye' },
    ]
  },
  'welcome_info': {
    id: 'welcome_info',
    speaker: 'Elder Nzinga',
    text: 'This is the Heartwood, where ancient trees whisper secrets of the past. Beyond lies the Rift, a dangerous but rewarding path.',
    options: [
      { text: 'Sounds perilous!', nextNodeId: 'perilous_response' },
      { text: 'I understand.', nextNodeId: 'goodbye' },
    ]
  },
  'perilous_response': {
    id: 'perilous_response',
    speaker: 'Elder Nzinga',
    text: 'Indeed. But with great risk comes great reward. Perhaps you are ready for a challenge?',
    options: [
      { text: 'What challenge?', nextNodeId: 'give_quest_rift' },
      { text: 'Not today.', nextNodeId: 'goodbye' },
    ]
  },
  'give_quest_rift': {
    id: 'give_quest_rift',
    speaker: 'Elder Nzinga',
    text: 'The Rift beckons! Gather 5 Ancient Relics from its depths. Return when you succeed.',
    action: 'GIVE_QUEST',
    options: [{ text: 'I accept!', nextNodeId: 'quest_accepted' }]
  },
  'quest_accepted': {
    id: 'quest_accepted',
    speaker: 'Elder Nzinga',
    text: 'May the ancestors guide your path!',
    options: [{ text: 'Thank you.', nextNodeId: 'goodbye' }]
  },
  'goodbye': {
    id: 'goodbye',
    speaker: 'Elder Nzinga',
    text: 'Until next time, adventurer.',
  },
  // ... more dialogue nodes for trade, quest completion, etc.
};

export class VILLANDialogueService {
  private currentDialogueNodeId: string | null = null;

  startDialogue(initialNodeId: string = 'welcome_start') {
    this.currentDialogueNodeId = initialNodeId;
    VoiceLineService.play(VoiceEvent.GREETING); // Play a greeting voice line
    return DIALOGUES[initialNodeId];
  }

  advanceDialogue(optionIndex: number) {
    if (!this.currentDialogueNodeId) return null;

    const currentNode = DIALOGUES[this.currentDialogueNodeId];
    if (currentNode.options && optionIndex < currentNode.options.length) {
      const nextNodeId = currentNode.options[optionIndex].nextNodeId;
      this.currentDialogueNodeId = nextNodeId;
      
      // Perform action if defined
      if (DIALOGUES[nextNodeId].action) {
        console.log(`Performing action: ${DIALOGUES[nextNodeId].action}`);
        // Here you would integrate with QuestService or InventoryService
      }

      return DIALOGUES[nextNodeId];
    }
    return null; // Dialogue ended or invalid option
  }
}

4. VILLAN Dialogue UI Component
This will be a dynamic chat box appearing when the player interacts with an VILLAN.
TypeScript
// /src/components/game/VillanDialogueBox.tsx
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { VILLANDialogueService, DialogueNode, DIALOGUES } from '@/game/VILLANDialogueService';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Speech } from 'lucide-react';

interface VILLANDialogueBoxProps {
  isOpen: boolean;
  onClose: () => void;
  VillanId: string; // e.g., 'elder_nzinga'
  initialDialogueNodeId: string;
}

export const VILLANDialogueBox: React.FC<VILLANDialogueBoxProps> = ({ isOpen, onClose, VillanId, initialDialogueNodeId }) => {
  const [currentDialogue, setCurrentDialogue] = useState<DialogueNode | null>(null);
  const dialogueServiceRef = React.memberef(new VILLANDialogueService());

  React.useEffect(() => {
    if (isOpen) {
      setCurrentDialogue(dialogueServiceRef.current.startDialogue(initialDialogueNodeId));
    }
  }, [isOpen, initialDialogueNodeId]);

  const handleOptionClick = (index: number) => {
    const nextNode = dialogueServiceRef.current.advanceDialogue(index);
    if (nextNode) {
      setCurrentDialogue(nextNode);
    } else {
      onClose(); // Dialogue path ended
    }
  };

  if (!currentDialogue) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-slate-900 border-slate-700 text-white p-6">
        <DialogHeader className="flex flex-row items-center gap-4">
          <Avatar className="w-16 h-16 border-2 border-white/20">
            <AvatarImage src={`/assets/Villans/${VillanId}.png`} alt={currentDialogue.speaker} />
            <AvatarFallback>{currentDialogue.speaker.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <DialogTitle className="text-xl font-bold text-teal-400">{currentDialogue.speaker}</DialogTitle>
            <p className="text-sm text-slate-400">VILLAN</p>
          </div>
        </DialogHeader>
        
        <div className="py-4 border-t border-b border-slate-700 my-4">
          <p className="text-slate-200 text-lg leading-relaxed flex items-center gap-2">
            <Speech className="text-teal-500" size={20} />
            {currentDialogue.text}
          </p>
        </div>

        {currentDialogue.options && currentDialogue.options.length > 0 && (
          <DialogFooter className="flex flex-col gap-3">
            {currentDialogue.options.map((option, index) => (
              <Button 
                key={index} 
                onClick={() => handleOptionClick(index)} 
                variant="secondary"
                className="w-full justify-start text-left bg-slate-800 hover:bg-slate-700 text-white"
              >
                {option.text}
              </Button>
            ))}
          </DialogFooter>
        )}
        
        {!currentDialogue.options && (
          <DialogFooter>
            <Button onClick={onClose} className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white">
              End Conversation
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

Integration Notes:
Character Selection: In SuperVi.tsx, you'd manage the activeCharacterId state and pass it to CharacterSelect. When a character is selected, update the global game state to reflect their stats (e.g., player speed, mining efficiency).
VILLAN Interaction: When a player character approaches an VILLAN (e.g., using a Raycaster in Three.js for proximity detection), toggle the VILLANDialogueBox's isOpen prop.
Implement the Day/Night Cycle system with dynamic lighting or the Mobile-Friendly Controls (virtual joystick, touch controls)
To implement the Day/Night Cycle and Mobile Controls, we will manipulate Three.js lighting over time and use a specialized library (or custom touch logic) for the virtual joystick to ensure high-performance input on mobile devices.

1. Day/Night Cycle System
This system rotates a "Sun" (DirectionalLight) and "Moon" while transitioning colors for the Sky and Ambient light.
TypeScript
// /src/game/EnvironmentService.ts
import * as THREE from 'three';

export class EnvironmentService {
  private sun: THREE.DirectionalLight;
  private ambient: THREE.AmbientLight;
  private scene: THREE.Scene;
  
  public time: number = 0; // 0 to 2400 (military time scale)
  public dayDuration: number = 120; // seconds for a full cycle

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.ambient = new THREE.AmbientLight(0x404040, 1);
    this.sun = new THREE.DirectionalLight(0xffffff, 1.5);
    this.sun.castShadow = true;
    
    scene.add(this.ambient);
    scene.add(this.sun);
    scene.background = new THREE.Color(0x87ceeb); // Sky Blue
  }

  update(delta: number) {
    this.time += (delta / this.dayDuration) * 2400;
    if (this.time > 2400) this.time = 0;

    const angle = (this.time / 2400) * Math.PI * 2;
    
    // Position Sun/Moon
    this.sun.position.x = Math.cos(angle) * 50;
    this.sun.position.y = Math.sin(angle) * 50;

    // Intensity and Color mapping
    if (this.sun.position.y > 0) {
      // Day
      const intensity = Math.min(this.sun.position.y / 10, 1.5);
      this.sun.intensity = intensity;
      this.ambient.intensity = 0.8;
      this.scene.background = new THREE.Color(0x87ceeb).lerp(new THREE.Color(0xffa500), 1 - (this.sun.position.y / 50));
    } else {
      // Night
      this.sun.intensity = 0.1; // Dim moonlight
      this.ambient.intensity = 0.2;
      this.scene.background = new THREE.Color(0x000011); // Deep Midnight
    }
  }
}

2. Virtual Joystick & Mobile Controls
We'll create a React component that overlays the screen, using pointer-events to capture movement for the SuperVi mode (joystick) and swiping for the Runner mode.
TypeScript
// /src/components/game/MobileControls.tsx
import React, { useState, memberef } from 'react';

interface ControlsProps {
  onMove: (vector: { x: number, y: number }) => void;
  onAction: () => void; // Jump or Mine
}

export const MobileControls: React.FC<ControlsProps> = ({ onMove, onAction }) => {
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
  const containerRef = memberef<HTMLDivElement>(null);

  const handleTouch = (e: React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const touch = e.touches[0];
    const dx = touch.clientX - rect.left - centerX;
    const dy = touch.clientY - rect.top - centerY;
    
    // Clamp to circle radius 40
    const distance = Math.sqrt(dx*dx + dy*dy);
    const limit = 40;
    const moveX = distance > limit ? (dx / distance) * limit : dx;
    const moveY = distance > limit ? (dy / distance) * limit : dy;

    setJoystickPos({ x: moveX, y: moveY });
    onMove({ x: moveX / limit, y: -(moveY / limit) });
  };

  const resetJoystick = () => {
    setJoystickPos({ x: 0, y: 0 });
    onMove({ x: 0, y: 0 });
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-50 select-none">
      {/* Virtual Joystick (Left Side) */}
      <div 
        ref={containerRef}
        className="absolute bottom-12 left-12 w-32 h-32 rounded-full bg-white/10 border-2 border-white/20 backdrop-blur-md pointer-events-auto"
        onTouchMove={handleTouch}
        onTouchEnd={resetJoystick}
      >
        <div 
          className="absolute w-12 h-12 bg-white/40 rounded-full border-2 border-white"
          style={{ 
            left: `calc(50% + ${joystickPos.x}px)`, 
            top: `calc(50% + ${joystickPos.y}px)`,
            transform: 'translate(-50%, -50%)'
          }}
        />
      </div>

      {/* Action Button (Right Side) */}
      <button 
        className="absolute bottom-16 right-16 w-20 h-20 rounded-full bg-yellow-500/80 border-4 border-yellow-200 shadow-xl pointer-events-auto active:scale-90 flex items-center justify-center font-black text-white italic"
        onTouchStart={onAction}
      >
        ACT
      </button>
    </div>
  );
};

3. Integrated Loop
In your SuperVi.tsx, you update the environment and listen for the mobile input.
TypeScript
// Inside SuperVi.tsx (Main Component)
const worldEnv = memberef<EnvironmentService>();

useFrame((state, delta) => {
  // Update Day/Night
  if (!worldEnv.current) worldEnv.current = new EnvironmentService(state.scene);
  worldEnv.current.update(delta);
  
  // Handle movement from state
  if (mobileInput.x !== 0 || mobileInput.y !== 0) {
    playerRef.current.position.x += mobileInput.x * playerStats.runSpeedMultiplier * 0.1;
    playerRef.current.position.z -= mobileInput.y * playerStats.runSpeedMultiplier * 0.1;
  }
});

return (
  <div className="relative w-full h-full overflow-hidden touch-none">
     <Canvas shadows>
        <GameScene />
     </Canvas>
     <MobileControls 
        onMove={(vec) => setMobileInput(vec)} 
        onAction={() => handleAction()} 
     />
     <HUD ... />
  </div>
);

Next Step
The core engine and UI are now functional. 
The Procedural Jungle Generator (adding trees, foliage, and varying terrain heights) or the Monetization System (linking $FIC to the store for character unlocking) next
To complete the Procedural Jungle and the Monetization System, we will expand the SuperVi engine to handle complex object scattering (trees/foliage) and create a secure transaction handler for unlocking characters.

1. Procedural Jungle Generator
We will update the SuperVi World  to include "Biomes" and a "Feature Spawner" that places trees and foliage using a secondary noise map.
TypeScript
// /workspace/tailwind-ui/src/game/JungleGenerator.ts
import * as THREE from 'three';

export class JungleGenerator {
  // Simple L-System or Static Tree structure
  static createTree(x: number, y: number, z: number, scene: THREE.Scene) {
    const trunkGeo = new THREE.BoxGeometry(1, 4, 1);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5d4037 });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.set(x, y + 2, z);

    const leavesGeo = new THREE.BoxGeometry(3, 3, 3);
    const leavesMat = new THREE.MeshStandardMaterial({ color: 0x2e7d32 });
    const leaves = new THREE.Mesh(leavesGeo, leavesMat);
    leaves.position.set(x, y + 5, z);

    const treeGroup = new THREE.Group();
    treeGroup.add(trunk, leaves);
    scene.add(treeGroup);
  }

  static getBiomeData(x: number, z: number, noise2D: Function) {
    // Secondary noise for "Density"
    const density = noise2D(x * 0.1, z * 0.1); 
    return {
      isTreeSpot: density > 0.8, // Only high-density spots get trees
      isFoliageSpot: density > 0.5 && density <= 0.8
    };
  }
}

Integration into SuperVi World .update():

TypeScript
// Inside SuperVi World .ts generateChunk method:
const { isTreeSpot, isFoliageSpot } = JungleGenerator.getBiomeData(worldX, worldZ, this.noise);

if (isTreeSpot && cy === height - 1) {
    JungleGenerator.createTree(worldX, height, worldZ, this.scene);
} else if (isFoliageSpot && cy === height - 1) {
    // Add small grass/shrub instance here
}

2. Monetization & Character Unlocking
This logic connects the Store to the CharacterService, ensuring that characters persist as "unlocked" once the $FIC cost is paid.
TypeScript
// /workspace/tailwind-ui/src/game/EconomyService.ts

export class EconomyService {
  private balance: number = 0;
  private unlockedIds: Set<string> = new Set(['zola']); // Zola is free/default

  constructor(initialBalance: number) {
    this.balance = initialBalance;
  }

  getBalance() { return this.balance; }

  canAfford(amount: number) { return this.balance >= amount; }

  purchaseCharacter(charId: string, cost: number): { success: boolean; message: string } {
    if (this.unlockedIds.has(charId)) {
      return { success: false, message: "Already unlocked!" };
    }
    
    if (this.canAfford(cost)) {
      this.balance -= cost;
      this.unlockedIds.add(charId);
      // Save to LocalStorage for persistence
      localStorage.setItem('unlocked_chars', JSON.stringify([...this.unlockedIds]));
      return { success: true, message: "Hero Unlocked! Blessings!" };
    }
    
    return { success: false, message: "Not enough FIC coins!" };
  }

  isUnlocked(charId: string) {
    return this.unlockedIds.has(charId);
  }
}

3. The "Purchase Success" UI
Update the Store item to handle the purchase state visually using Tailwind.
TypeScript
// /workspace/tailwind-ui/src/components/game/StoreItem.tsx
import { Button } from "@/components/ui/button";
import { Lock, CheckCircle } from "lucide-react";

export const StoreItem = ({ item, isUnlocked, onPurchase, canAfford }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-800 rounded-xl">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-slate-700 rounded-lg">{item.icon}</div>
        <div>
          <h4 className="font-bold text-white">{item.name}</h4>
          <p className="text-xs text-slate-400">{item.cost} FIC</p>
        </div>
      </div>

      {isUnlocked ? (
        <Button variant="ghost" className="text-green-500 gap-2 cursor-default">
          <CheckCircle size={16} /> UNLOCKED
        </Button>
      ) : (
        <Button 
          onClick={() => onPurchase(item.id, item.cost)}
          disabled={!canAfford}
          className="bg-yellow-500 hover:bg-yellow-400 text-black font-black"
        >
          <Lock size={14} className="mr-2" /> UNLOCK
        </Button>
      )}
    </div>
  );
};

Summary of System Flow
1.SuperVi Mode: Players explore the Jungle, mining blocks and finding FIC caches.
2.Runner Mode: Players trigger a "Rift" event, switching to lane-based movement to multiply their earnings.
3.Economy: Earned FIC is checked against the EconomyService.
4.Meta-Game: Players visit the Store, unlock Amina (The Mystic), and immediately see their character model and stats (like Treasure Sense) update in the next run.
Final Step for Project Completion
We have implemented the core engine, UI, characters, environment, and economy.
Would you like me to generate the Deployment Strategy Guide (how to host this on docker) or create a "Game Over" summary screen that calculates total rewards?






