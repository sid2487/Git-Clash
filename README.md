# 🚀 Git Clash — ELO-Based Developer Ranking Arena

Git Clash is a competitive ranking platform where developers upload GitHub profiles, vote in head-to-head battles, and climb the leaderboard using an **ELO rating system**.  
The platform updates ranks **in real time**, usign SSE(Server Sent Events) ensuring that every vote immediately affects the leaderboard.  
The project is fully serverless and optimized with caching, scheduled jobs, and a fast UI powered by modern web technologies.


![Git Clash Banner] <img width="843" height="961" alt="Screenshot from 2025-11-29 19-09-26" src="https://github.com/user-attachments/assets/dfce7753-0da4-4c83-a3d8-47bedcdf3f92" />


---

## ⭐ Features

### 🔥 ELO-Based Ranking
- Every profile gets an ELO score.
- Users vote between two profiles → scores update instantly.
- Similar to competitive chess ranking.

### 👤 Upload Any GitHub Profile
- No login required.
- Anyone can upload their or their friend’s profile.

### ⚡ Ultra-Fast Leaderboards
- Redis caching for instant leaderboard load.
- Paginated all-time leaderboard.
- Live top-10 leaderboard.
- Automatic weekly snapshots & historical ranking.

### 🕵️ Anonymous User Tracking (No Auth Needed)
- Tracks users via browser fingerprint + secure anonymous cookies.
- Prevents duplicate voting per matchup.

### 🗳️ Head-to-Head Voting UI
- Two random profiles appear.
- Vote for the better one.
- ELO adjusts and new match appears.

### 📊 Weekly & All-Time History
- Stored via scheduled Upstash QStash cron job.
- Full ranking history preserved.

- ### ⚡ Real-Time Live Leaderboard (SSE + Redis)
- Uses **Server-Sent Events (SSE)** to stream live leaderboard updates.
- No page refresh needed — scores and ranks update automatically.
- Redis is used to optimize the SSE stream and reduce database load.

---

## 🧠 How Git Clash Works (High-Level Flow)

1. User enters the site → fingerprint + anon cookie identifies them.
2. Two profiles are shown.
3. User votes (winner vs loser).
4. ELO is recalculated:
   - Winner gains points
   - Loser loses points
5. Redis caches updated leaderboards.
6. Weekly cron job takes snapshot of rankings.
7. Leaderboards & history displayed using snap on leaderboard page.
8. Live top 10 ranking will be shown on landing page and rest on seperate page. 

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14 (App Router), TailwindCSS |
| **Backend** | Next.js Server Actions & Routes |
| **Database** | NeonDB (PostgreSQL) |
| **ORM** | Prisma |
| **Cache** | Upstash Redis |
| **Scheduling** | Upstash QStash Cron |
| **Fingerprinting** | Browser fingerprint + secure cookies + Local Storage |
| **Deployment** | Vercel |

---

## 🧱 Architecture Diagram

Client → Next.js API → Prisma → NeonDB
↓
Redis (Cache)
↓
QStash (Cron Jobs)



---

## 📸 Screenshots

> Replace these with your actual screenshots

### 🏠 Home Page
![Home](<img width="843" height="961" alt="Screenshot from 2025-11-29 19-09-26" src="https://github.com/user-attachments/assets/479d0244-a676-4438-93a2-175d2877ac13" />

### 🏆 Leaderboard
![Leaderboard] (<img width="700" height="630" alt="image" src="https://github.com/user-attachments/assets/292d5b83-59d1-49fc-ba5e-8a7411daa966" />
)


---

# ELO Ranking Formula:

expectedScore = 1 / (1 + 10 ^ ((loserElo - winnerElo) / 400))
winnerElo = winnerElo + K * (1 - expectedScore)
loserElo  = loserElo  + K * (0 - expectedScore)

## Installation & Setup:

1. Clone the repo
git clone https://github.com/your-name/git-clash.git
cd git-clash

2. Install dependencies
npm install

3. Setup environment variables
Create .env:

DATABASE_URL="your-neondb-url"
REDIS_URL="your-upstash-redis-url"
QSTASH_URL="your-qstash-url"
QSTASH_TOKEN="your-qstash-token"

4. Migrate database
npx prisma migrate deploy

5. Run locally
Run locally


## 🤝 Contributing

Contributions are welcome!

Fork the repo

# Thank you so much for using this!!

Create a feature branch

Make changes

Submit a PR
