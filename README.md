# 🌌 AniVault

> **Track, Discover, and Connect.**  
> A sleek, high-performance anime tracking dashboard, social community hub, and personal vault built with modern web technologies, Firebase real-time persistence, and live API integrations.

---

## 🌟 Highlights & Key Features

### 🔍 1. Smart Discover & Search
- **Dual API Engine with Curated Fallback**: Automatically queries the AniList GraphQL API and Jikan (MAL) REST API with lightning-fast caching and an integrated offline dataset to guarantee 0-delay content rendering.
- **Instant Search**: Debounced search bar with live spinner and search results filtering across titles, genres, and release years.
- **Category & Genre Browsing**: Browse titles filtered by genres (Action, Adventure, Fantasy, Sci-Fi, Romance, etc.).
- **Global Bulk Actions**: Select multiple anime titles simultaneously and update their status (`Watching`, `Watched`, `Plan to Watch`, or `Remove`) with one click.

---

### 🗃️ 2. Personal Vault & Watchlist Tracker
- **Segmented Lists**: Manage your collection across four status views:
  - 📺 **Watching**: Keep track of current anime in progress.
  - ✅ **Watched**: Archive your completed masterpieces.
  - 🔖 **Plan to Watch**: Bookmark upcoming series to watch later.
  - 📋 **All Vault**: View and search your entire tracked collection.
- **Episode & Score Badging**: View user scores, episode counts, and status tags overlaid on high-resolution cover posters.

---

### 🌐 3. Connected Accounts & Universal Data Importer
- **AniList Live Sync**:
  - Connect your public AniList account via username.
  - Fetch and import watchlists directly using AniList's public GraphQL API.
- **MyAnimeList (MAL) Integration**:
  - Connect your MyAnimeList profile by username.
  - 1-Click **MAL Export Importer**: Directly uploads official MyAnimeList XML (`.xml`) or JSON (`.json`) exports from [MyAnimeList Export](https://myanimelist.net/panel.php?go=export) and accurately parses all watched/watching/planned anime, ratings, and episodes.
- **Universal Backup & Restore**:
  - Export your entire AniVault library as an offline `.json` backup.
  - Universal File Drop: Import backup files in `.json`, `.xml`, or `.txt` format with automatic schema detection and zero duplicate entries.

---

### 💬 4. Real-Time Community Wall
- **Global Chat**: Chat in real-time with other AniVault members powered by Firebase Firestore snapshots.
- **User Identity & Badges**: Displays avatar, custom nickname, role flair, and achievement tier pills right beside every message.
- **Role Flair Highlights**: Distinct color badges for platform roles (`Owner`, `Moderator`, `Officer`, `Celebrity`).

---

### 🏆 5. Gamification, Badges & Leaderboard
- **Community Leaderboard**: Real-time rank list showing who has tracked and watched the most anime.
- **Multi-Tier Badge Progression**:
  - 🥉 **Bronze**: List Starter, First Watch, Beginner (1-10 anime)
  - 🥈 **Silver**: Dedicated Viewer, Curator, Binge Watcher (25-50 anime)
  - 🥇 **Gold**: Archivist, Completionist, Intermediate (100-200 anime)
  - 💎 **Diamond**: Advanced Watcher (500+ anime)
  - 👑 **Legendary**: Expert Archivist (1000+ anime)
- **Progress Tracking**: Dynamic progress bars showing your exact progress towards each locked badge.

---

### 🎨 6. Interactive Live Wallpapers & Custom Avatars
- **6 Procedural Canvas Live Wallpapers**:
  - ✨ *Void Particles*: Floating constellation of nebula particles
  - 🌸 *Sakura Storm*: Falling Japanese cherry blossom petals
  - 💻 *Digital Rain*: Retro Matrix-inspired green code streams
  - 🌌 *Aurora Wave*: Flowing northern lights gradients
  - 🔥 *Soul Flame*: Rising fiery embers and sparks
  - 🌊 *Dark Ocean*: Gentle rippling oceanic wave ripples
- **Curated Avatar Gallery**: Choose avatars from popular anime categories (*Shonen Legends*, *Dark & Serious*, *Demon Slayer*, *Jujutsu Kaisen*, *Iconic Girls*, *Classic & Retro*).

---

### 👑 7. Role-Based Access Control & Admin Panel
- **Role Hierarchy**:
  - 👑 **Owner (`SIDDIK` / `abubakorsiddikpapel@gmail.com`)**: Full system access, permanent Admin Panel rights, and golden owner badge.
  - 🛡️ **Moderator**: Community chat moderation capabilities.
  - 🎖️ **Officer**: Platform operations and management.
  - ⭐ **Celebrity**: Verified community member status.
  - 👤 **Member**: Standard user profile.
- **Admin Dashboard**: View total registered members, inspect joined dates, and manage community roles.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | HTML5, Modern CSS3 (CSS Variables, Flexbox, CSS Grid, Glassmorphism), Vanilla JavaScript (ES6+ Modules & Async/Await) |
| **Backend & Cloud** | Firebase Authentication, Google Cloud Firestore Real-time Database (Compat v10.8.1) |
| **APIs** | AniList GraphQL API, Jikan v4 REST API, wsrv.nl image cache |
| **Graphics** | HTML5 `<canvas>` with hardware-accelerated 60 FPS animation loops |
| **Fonts & Icons** | Google Fonts (*Outfit*), Custom inline SVGs |

---

## 📁 Project Structure

```
APP_01/
├── index.html        # Main HTML entrypoint, navigation drawer, modals, & bulk action bar
├── styles.css        # Responsive styling, design tokens, theme palettes, and animations
├── app.js            # Core application logic, state manager, APIs, canvas rendering, & Firebase hooks
└── README.md         # Comprehensive project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Google Chrome, Firefox, Edge, Safari, Brave, or Opera).
- A local HTTP server (such as Python `http.server`, VS Code Live Server, or Node.js `http-server`).

### Running Locally

1. **Clone or Navigate to the Directory**:
   ```bash
   cd d:\Antigravity\APP_01
   ```

2. **Start a Local Development Server**:
   Using Python:
   ```bash
   python -m http.server 8080
   ```
   Or using Node.js:
   ```bash
   npx serve .
   ```

3. **Open the App in your Browser**:
   Navigate to:
   ```
   http://localhost:8080
   ```

4. **Guest Mode vs. Account Creation**:
   - Click **"Continue as Guest"** to explore anime discovery, switch live wallpapers, and maintain a local watchlist stored in browser `localStorage`.
   - Click **"Sign Up"** or **"Login"** to synchronize your collection with Cloud Firestore and participate in the Community Wall and Leaderboard.

---

## ⚙️ Configuration & Firebase Credentials

AniVault connects directly to Firebase Cloud Services configured in `app.js`:

```javascript
const firebaseConfig = {
  apiKey: "...",
  authDomain: "anivault-9813c.firebaseapp.com",
  projectId: "anivault-9813c",
  storageBucket: "anivault-9813c.firebasestorage.app",
  messagingSenderId: "402464470619",
  appId: "1:402464470619:web:55c1a5455f377bb359317e"
};
```

---

## 👥 Platform Owner & Credits

- **Platform Owner**: `SIDDIK` ([abubakorsiddikpapel@gmail.com](mailto:abubakorsiddikpapel@gmail.com))
- **Data Providers**: [AniList API](https://anilist.gitbook.io/anilist-apiv2-docs/) & [Jikan API](https://jikan.moe/)
- **License**: MIT License
