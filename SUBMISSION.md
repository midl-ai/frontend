<div align="center">
  <img src="https://raw.githubusercontent.com/midl-ai/assets/master/midl-ai-wordmark.svg" alt="MIDL.AI Logo" width="250"/>

  # MIDL.AI Terminal

  **The First AI-Powered MCP for Bitcoin L1 + EVM L2 Hybrid Chain**

  [![Website](https://img.shields.io/badge/Website-midl--ai.xyz-blue)](https://midl-ai.xyz)
  [![MCP Server](https://img.shields.io/badge/MCP-mcp.midl--ai.xyz-green)](https://mcp.midl-ai.xyz)
  [![Documentation](https://img.shields.io/badge/Docs-midl--ai.xyz%2Fdocs-orange)](https://midl-ai.xyz/docs)

  [Live Demo](https://midl-ai.xyz) • [Documentation](https://midl-ai.xyz/docs) • [GitHub](https://github.com/midl-ai)

</div>

---

![MIDL.AI Hero](https://raw.githubusercontent.com/midl-ai/assets/master/midl-hero.png)

## Overview

MIDL.AI is a production-ready AI terminal for MIDL Protocol — the world's first Bitcoin L1 + EVM L2 hybrid blockchain. We built two complete applications:

1. **AI Chat Terminal** (midl-ai.xyz) - Beautiful Next.js interface with 27 AI tools
2. **MCP Server** (mcp.midl-ai.xyz) - Standalone server for Claude Desktop & Cursor

**Interact with Bitcoin and EVM through natural conversation. Deploy contracts. Bridge assets. Manage runes.**

## The Problem

MIDL Protocol combines Bitcoin's UTXO model with EVM's account model — powerful, but complex:

- Users must master TWO different blockchain paradigms
- No developer-friendly tools or SDK
- Complex CLI commands for every operation
- No AI integration for modern Web3 interaction

## The Solution

Natural language interface for the entire MIDL Protocol stack:

**27 Tools Across 9 Categories:**
- Network (3) - System contracts, network info, blocks
- Balance (3) - EVM, BTC, token balances
- Transfer (3) - Native transfers, tokens, raw transactions
- Deploy (1) - Solidity compilation + templates
- Contract (3) - Read, verify, get logs
- Bridge (2) - BTC ↔ EVM bidirectional
- Runes (4) - Balance, transfer, ERC20 bridge
- Bitcoin (4) - UTXOs, transactions, fees
- Utility (3) - Conversions, lookups, gas estimation

**Example Interactions:**
- "Deploy an ERC20 token called MyToken with 1M supply"
- "Bridge 0.5 BTC from L1 to L2"
- "Transfer 100 UNCOMMON•GOODS rune to kaspa:qr..."
- "What's my balance on both layers?"

## Key Innovations

### 1. First Bitcoin+EVM Hybrid MCP
Only blockchain combining Bitcoin security with EVM programmability. Only AI terminal purpose-built for this architecture.

### 2. Dual Interface Design
- **Frontend**: Next.js chat with generative UI, voice mode, real-time updates
- **MCP Server**: Works with Claude Desktop, Cursor, any MCP client

### 3. Production Infrastructure
- PostgreSQL + Drizzle ORM for persistence
- Redis + resumable streams for long operations
- Voice mode with OpenAI Realtime API
- Server-side signing with secure key management
- Comprehensive error handling and logging

### 4. Generative UI
Custom React components for every tool result:
- Transaction cards with live status
- Explorer links for transparency
- Formatted addresses and amounts
- Action buttons for next steps

## Architecture

<div align="center">
  <img src="https://raw.githubusercontent.com/midl-ai/assets/master/mcp-architecture.svg" alt="MCP Architecture" width="100%"/>
</div>

**Plugin-Based MCP Server:**
- 9 plugin categories with 27 total tools
- Dual transport (stdio + HTTP)
- MCP UI cards with rich formatting
- Type-safe with full TypeScript

**AI Chat Frontend:**
- Vercel AI SDK v6 with streaming
- Tool-specific UI components
- Voice mode integration
- Chat history with PostgreSQL

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **AI** | Vercel AI SDK v6, Claude, GPT-4 |
| **Frontend** | Next.js 16, React 19, TypeScript |
| **Database** | PostgreSQL, Drizzle ORM, Redis |
| **Styling** | TailwindCSS v4, Framer Motion |
| **MIDL** | @midl/core, @midl/executor, @midl/viem |
| **Solidity** | solc 0.8.33, viem 2.46 |
| **MCP** | @modelcontextprotocol/sdk 1.26 |
| **Voice** | OpenAI Realtime API |

## Demo Scenarios

### Deploy Contract
```
User: Deploy an ERC20 token called DemoToken with symbol DEMO
AI: Compiling... Deploying... Done!
Contract: 0xabc... (with explorer link)
Time: ~30 seconds
```

### Bridge Assets
```
User: Bridge 0.1 BTC to my EVM address
AI: Building transaction... Submitting to L1...
Monitoring bridge... Complete!
Time: ~2 minutes
```

### Voice Interaction
```
User: [speaks] "What's my balance?"
AI: [responds] "You have 1.5 BTC on L1 and 0.3 BTC on L2"
```

## Deployment

| Service | URL | Purpose |
|---------|-----|---------|
| **Live Terminal** | [midl-ai.xyz](https://midl-ai.xyz) | Main chat interface |
| **MCP Docs** | [mcp.midl-ai.xyz](https://mcp.midl-ai.xyz) | MCP server setup |
| **Documentation** | [midl-ai.xyz/docs](https://midl-ai.xyz/docs) | Full docs (6 pages) |
| **GitHub Frontend** | [github.com/midl-ai/midl-frontend](https://github.com/midl-ai/midl-frontend) | Frontend source |
| **GitHub MCP** | [github.com/midl-ai/midl-mcp-server](https://github.com/midl-ai/midl-mcp-server) | MCP source |

## Installation

### Frontend
```bash
git clone https://github.com/midl-ai/midl-frontend
cd midl-frontend
pnpm install
cp .env.example .env  # Add your API keys
docker-compose up -d postgres redis
pnpm db:push
pnpm dev
```

### MCP Server
```bash
git clone https://github.com/midl-ai/midl-mcp-server
cd midl-mcp-server
pnpm install
cp .env.example .env  # Add MIDL_PRIVATE_KEY
pnpm build

# Add to Claude Desktop config (see docs)
```

## Project Structure

### Frontend
```
midl-frontend/
├── app/api/chat/     # Vercel AI SDK endpoint
├── app/api/voice/    # Realtime API endpoint
├── components/tools/ # 27 tool UI components
├── lib/ai/tools/     # 27 AI tool implementations
└── lib/db/           # Drizzle ORM schema
```

### MCP Server
```
midl-mcp-server/
├── src/plugins/      # 9 plugin categories (27 tools)
├── src/ui/           # MCP UI card generators
├── src/wallet.ts     # EVM wallet client
└── src/btc-wallet.ts # Bitcoin wallet client
```

## Impact

**For Users:**
- Natural language blockchain interaction
- No CLI commands required
- Voice-controlled Web3
- Beautiful generative UI

**For Developers:**
- Install MCP in Claude Desktop
- 27 tools instantly available
- Full TypeScript support
- Plugin architecture for extensions

**For MIDL Protocol:**
- First comprehensive AI interface
- Lowers barrier to entry
- Showcases hybrid chain capabilities
- Production-ready reference implementation

## Challenges Solved

1. **Dual Chain Complexity** - Abstracted UTXO + account models behind unified interface
2. **Long Operations** - Redis + resumable streams for multi-minute bridge operations
3. **Solidity Compilation** - Custom pipeline for edge runtime compatibility
4. **MCP UI** - Built card generators for complex blockchain data
5. **Voice Latency** - Optimized schemas and pre-fetching for real-time responses

## Development

**Timeline:** 4 weeks (Feb 9-28, 2026)

**Approach:** AI-first development with Claude Code
- Human: Product vision, UX design, testing
- AI: Code generation, debugging, documentation

**Testing:** All tools tested against real MIDL testnet

## AI Attribution

Claude (Anthropic) provided:
- Code generation for all 27 tools
- Architecture decisions (plugin system, dual transport)
- Debugging (WASM bundling, viem configuration, MCP setup)
- Documentation writing
- TypeScript type safety enforcement

**Methodology:** Full AI pair programming with human oversight and validation against real blockchain.

## Future Roadmap

**Short Term:**
- Mainnet deployment
- Multi-wallet support (MetaMask, Rabby)
- More contract templates (NFTs, DEX)
- Mobile optimization

**Long Term:**
- Community plugin system
- AI-powered contract generation
- Multi-chain support
- Hardware wallet integration

## License & Links

**License:** MIT - 100% open source

**Live Now:**
- Website: [midl-ai.xyz](https://midl-ai.xyz)
- MCP Server: [mcp.midl-ai.xyz](https://mcp.midl-ai.xyz)
- Docs: [midl-ai.xyz/docs](https://midl-ai.xyz/docs)
- GitHub: [github.com/midl-ai](https://github.com/midl-ai)

## Acknowledgments

Built for **MIDL VibeHack 2026** (February 9-28, 2026)

Thanks to:
- **MIDL Protocol Team** - Hybrid chain architecture
- **@midl-js** - Comprehensive SDK
- **Anthropic** - Claude and MCP specification
- **Vercel** - AI SDK and Next.js

---

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791)

**MIDL.AI: Talk to Your Blockchain**

[Website](https://midl-ai.xyz) • [Documentation](https://midl-ai.xyz/docs) • [GitHub](https://github.com/midl-ai)

</div>
