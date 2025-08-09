# BaseHub - Game Hub Mini App

BaseHub provides an interactive gaming center that runs directly within the Farcaster feed on Base.

## 🎮 Features

### 🎯 Game Hub
- **Gaming Center:** Main interface to select and launch different games
- **Seamless Switching:** Smooth transitions between various games
- **Farcaster Integration:** Save frame for quick access from feed

### 🎲 Caro Game (Gomoku)
- **15x15 Board:** Standard size for 5-in-a-row gameplay
- **2-Player Mode:** Alternating turns between X and O
- **Win Detection:** Automatic detection of 5 consecutive pieces (horizontal, vertical, diagonal)
- **Winning Line Highlight:** Emphasizes the 5 pieces that create victory

### 🔤 Word Chain Game
- **Starting Words:** Use predefined seed words or input custom ones
- **Chain Rules:** New words must start with the last letter of the previous word
- **Integrated Dictionary:** Word validation through API
- **Word Suggestions:** System suggests suitable words to continue the chain

### ⛓️ Onchain Integration
- **Base Sepolia:** Uses testnet for transaction demos
- **MiniKit:** Seamless integration with Farcaster
- **Wallet Connection:** Supports Coinbase Wallet and compatible wallets

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Access the app:**
   - Open http://localhost:3000
   - Select games from the Game Hub
   - Save frame to use on Farcaster

## 📁 Project Structure

```
my-minikit-app/
├── app/
│   ├── components/
│   │   ├── GameHub.tsx           # Main gaming center
│   │   ├── CaroGame.tsx          # Caro 5-in-a-row game
│   │   ├── WordChainGame.tsx     # Word chain game
│   │   └── OnchainMiniApp.tsx    # Blockchain integration (demo)
│   ├── api/
│   │   ├── dictionary/            # Dictionary validation API
│   │   │   └── route.ts
│   │   ├── vote/                  # Voting API (legacy)
│   │   │   └── route.ts
│   │   ├── webhook/               # Farcaster webhook
│   │   │   └── route.ts
│   │   └── notify/                # Notification API
│   │       └── route.ts
│   ├── page.tsx                   # Main page with Game Hub
│   ├── providers.tsx              # MiniKit provider
│   └── layout.tsx                 # Main layout with Farcaster frame
├── .well-known/
│   └── farcaster.json/            # Farcaster manifest
│       └── route.ts
├── public/                        # Static assets
└── package.json                   # Dependencies and scripts
```

## 🎯 Game Details

### CaroGame
- **Board:** 15x15 matrix with coordinate system
- **Win Logic:** Checks 4 directions (horizontal, vertical, left diagonal, right diagonal)
- **Interface:** Responsive with winning line highlighting
- **State Management:** Manages game turns and history

### WordChainGame
- **Seed Words:** List of blockchain-related starting words
- **Validation:** Word checking through Datamuse API and Free Dictionary API
- **Suggestions:** System suggests suitable words with prefix matching
- **Scoring:** Tracks score and history of played words

## 🔧 MiniKit Features

### Social Context
```typescript
const { context } = useMiniKit();

// User information
const userFid = context?.user?.fid;
const username = context?.user?.username;
const displayName = context?.user?.displayName;

// Client information
const isAdded = context?.client?.added;
const location = context?.location;
```

### Frame Integration
```typescript
import { useAddFrame } from "@coinbase/onchainkit/minikit";

const addFrame = useAddFrame();
const handleAddFrame = async () => {
  try {
    await addFrame();
  } catch {
    // Handle error
  }
};
```

## 🌐 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

### Environment Variables
Create `.env.local` file:
```
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key
NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME=BaseHub
NEXT_PUBLIC_ICON_URL=https://your-domain.com/icon.png
NEXT_PUBLIC_APP_HERO_IMAGE=https://your-domain.com/hero.png
NEXT_PUBLIC_URL=https://your-domain.com
```

### Farcaster Deployment
1. **Generate manifest:** `npx create-onchain --manifest`
2. **Connect FID:** Use custody address to sign manifest
3. **Update ENV:** Set environment variables on Vercel
4. **Redeploy:** Deploy again to apply changes

## 🎮 How to Play

### Caro
1. Select "Caro" from Game Hub
2. Take turns placing X and O pieces
3. Place 5 consecutive pieces to win
4. Use "Hub" button to return to Game Hub

### Word Chain
1. Select "Word Chain" from Game Hub
2. Start with seed words or input new words
3. Enter next word starting with the last letter
4. System will suggest suitable words

## 📱 Farcaster Integration

- **Frame metadata:** Automatically generated with `fc:frame` tags
- **Preview image:** Displays in feed with hero image
- **Launch button:** Direct navigation to Game Hub
- **Social context:** User identification and location awareness

## 🛠️ Technologies Used

- **Frontend:** Next.js 15, React, TypeScript
- **Styling:** Tailwind CSS with theme variables
- **Blockchain:** Base Sepolia, OnchainKit
- **Social:** MiniKit, Farcaster Protocol
- **APIs:** Datamuse, Free Dictionary API
- **Deployment:** Vercel

## 📚 References

- [MiniKit Documentation](https://base.org/builders/minikit)
- [OnchainKit Documentation](https://onchainkit.com)
- [Farcaster Protocol](https://farcaster.xyz)
- [Base Network](https://base.org)
- [Next.js App Router](https://nextjs.org/docs/app)

## 🤝 Community

- [Base Builders Discord](https://discord.gg/base)
- [Farcaster Community](https://farcaster.xyz)
- [Base Vietnam](https://t.me/basevietnam)

---

Built with ❤️ on Base with MiniKit and Farcaster
