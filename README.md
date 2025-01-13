# task-race

Task Race is an interactive real-time photo challenge game where players compete against each other to complete photo-based tasks as quickly as possible. Players are given prompts to take specific selfies or photos, and the first to complete the challenge wins the race.

## Features

### Core Functionality
- Real-time multiplayer photo challenges
- Player matchmaking and race initiation
- Live race status updates
- Score tracking and leaderboard system
- QR code integration for player identification

### Game Flow
1. Players can initiate races with other players
2. Both players receive the same random prompt
3. First player to submit a matching photo wins
4. Scores are tracked and updated in real-time
5. Players can view their match history and statistics

## Technical Stack

### Frontend (Web)
- **Framework**: Next.js
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Data Fetching**: SWR for efficient data caching and revalidation
- **Image Storage**: Vercel Blob Storage

## Backend (Web)
- **API Routes**: Next.js API Routes
- **ORM**: Prisma

### Backend (WebSockets)
- **Language**: Go
- **WebSocket Library**: gobwas/ws
- **Database ORM**: Prisma Client Go

### Database
- **Database**: PostgreSQL
- **Schema Management**: Prisma

## Implementation Details

#### API Routes Overview
- **Players**
  - Get player details and QR code information
  - Create new players with profile photos
  - Fetch leaderboard with battle statistics

- **Races**
  - Retrieve winning race photos
  - Get player-specific race history

- **Upload**
  - Handle secure image uploads via Vercel Blob

#### Real-time Data Management
- **SWR Integration**: Implements efficient data fetching and caching
- **Auto Revalidation**: Keeps UI in sync with server state

#### Image Handling
- **Vercel Blob Storage**: Secure and scalable image storage

### WebSocket Server
The WebSocket server handles real-time communication between players and manages game states. Key components include:

- **Hub**: Central manager for all active races and player connections
- **Client Management**: Handles individual WebSocket connections
- **Race Management**: Coordinates race creation, joining, and completion
- **Prompt System**: Randomly selects challenges from a predefined list

### Database Schema
The system uses three main models:
- **Player**: Stores user information and scores
- **Race**: Tracks ongoing and completed races
- **QRCode**: Manages QR code authentication

### Race Flow
1. Player initiates a race request
2. Target player accepts the challenge
3. Both players receive the same random prompt
4. First valid submission wins
5. Scores are updated and results are broadcast

## Getting Started

### Frontend Setup

```
cd web
npm install
npm run dev
```

### Backend Setup

```
cd websockets
go build .
go run .
```
