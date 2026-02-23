<div align="center">
  <img src="https://raw.githubusercontent.com/midl-ai/assets/master/midl-ai-wordmark.svg" alt="MIDL.AI Logo" width="200"/>

  # MIDL.AI Terminal

  **The first AI-powered MCP terminal for Bitcoin L1 + EVM L2 hybrid blockchain.**

  *Natural language commands. Bitcoin security. EVM compatibility.*

  [![Website](https://img.shields.io/badge/Website-midl--ai.xyz-blue)](https://midl-ai.xyz)
  [![MCP Server](https://img.shields.io/badge/MCP-mcp.midl--ai.xyz-green)](https://mcp.midl-ai.xyz/mcp)
  [![Documentation](https://img.shields.io/badge/Docs-midl--ai.xyz%2Fdocs-orange)](https://midl-ai.xyz/docs)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

  [Live Demo](https://midl-ai.xyz) • [MCP Server](https://mcp.midl-ai.xyz/mcp) • [Documentation](https://midl-ai.xyz/docs)

</div>

---

![MIDL.AI Hero](https://raw.githubusercontent.com/midl-ai/assets/master/midl-hero.png)

## What is MIDL.AI?

MIDL.AI is the first AI-powered terminal for interacting with MIDL Protocol — a Bitcoin L1 + EVM L2 hybrid blockchain. We built a comprehensive Model Context Protocol (MCP) server and a beautiful AI chat interface that lets you interact with both Bitcoin and EVM layers through natural language.

**Deploy contracts. Bridge assets. Transfer runes. All through conversation.**

## Problem & Solution

<div align="center">
  <img src="https://raw.githubusercontent.com/midl-ai/assets/master/problem-diagram.svg" alt="Problem Diagram" width="100%"/>
</div>

<div align="center">
  <img src="https://raw.githubusercontent.com/midl-ai/assets/master/solution-overview.svg" alt="Solution Overview" width="100%"/>
</div>

## What Makes MIDL.AI Special

### 1. World's First MCP Terminal for Bitcoin+EVM Hybrid

MIDL Protocol is unique — it combines Bitcoin's security (L1) with EVM compatibility (L2). MIDL.AI provides the first conversational interface to interact with both layers seamlessly.

### 2. Comprehensive Tool Coverage

**27 tools across 9 categories:**
- **Network Tools**: System contracts, network info, block data
- **Balance Tools**: EVM balance, BTC balance, token balance
- **Transfer Tools**: EVM transfers, token transfers, raw transactions
- **Deploy Tools**: Compile and deploy Solidity contracts with templates
- **Contract Tools**: Read contracts, verify contracts, get logs
- **Bridge Tools**: BTC↔EVM bidirectional bridging
- **Runes Tools**: Rune management, ERC20 bridging, balance tracking
- **Bitcoin Tools**: UTXO management, transaction tracking, fee estimation
- **Utility Tools**: Unit conversion, address lookups, gas estimation

### 3. Dual Interface Design

**Frontend**: Beautiful Next.js chat interface with generative UI, streaming responses, and real-time transaction tracking.

**MCP Server**: Standalone server compatible with Claude Desktop, Cursor, and any MCP client.

### 4. Production-Ready Infrastructure

- PostgreSQL + Drizzle ORM for chat persistence
- Redis + resumable streams for long-running operations
- Server-side signing with secure key management
- Vercel AI SDK v6 with tool streaming
- Comprehensive error handling and logging
- Voice mode with OpenAI Realtime API

## Architecture

### MCP Server Architecture

<div align="center">
  <img src="https://raw.githubusercontent.com/midl-ai/assets/master/mcp-architecture.svg" alt="MCP Architecture" width="100%"/>
</div>

### Bitcoin L1 + EVM L2 Hybrid

<div align="center">
  <img src="https://raw.githubusercontent.com/midl-ai/assets/master/bitcoin-evm-layers.svg" alt="Bitcoin EVM Layers" width="100%"/>
</div>

MIDL Protocol uniquely combines Bitcoin's UTXO model (L1) with EVM's account model (L2). MIDL.AI seamlessly handles operations across both layers through a single conversational interface.

### Tool Categories

<div align="center">
  <img src="https://raw.githubusercontent.com/midl-ai/assets/master/tool-categories.svg" alt="Tool Categories" width="100%"/>
</div>

### Tech Stack

| Layer | Technology |
|-------|-----------|
| **AI** | Vercel AI SDK v6, Anthropic Claude, OpenAI GPT-4 |
| **Frontend** | Next.js 16, React 19, TypeScript |
| **Database** | PostgreSQL, Drizzle ORM v0.45 |
| **Caching** | Redis, resumable-stream |
| **Styling** | TailwindCSS v4, Framer Motion, Lucide Icons |
| **MIDL Integration** | @midl/core, @midl/executor, @midl/node, @midl/viem |
| **Solidity** | solc 0.8.33, viem 2.46 |
| **MCP** | @modelcontextprotocol/sdk 1.26 |
| **Voice** | OpenAI Realtime API, Web Audio API |

### Key Innovation: Hybrid Chain Tooling

Seamlessly interact with both Bitcoin UTXO model and EVM account model in a single conversation. Bridge assets between layers, deploy contracts, and manage runes without switching contexts.

## Features

### For Users

- **Natural Language Interface**: "Deploy an ERC20 token called MyToken" → Done.
- **Generative UI**: Each tool renders a custom React component with transaction details
- **Voice Mode**: Speak your commands, get voice responses
- **Real-Time Updates**: Watch transactions confirm with live status indicators
- **Chat History**: All conversations persisted with PostgreSQL
- **Dark/Light Mode**: Beautiful UI that adapts to your preferences
- **Wallet Integration**: Xverse wallet support for Bitcoin operations

### For Developers

**Two Repos:**

**`midl-frontend`** - Next.js AI terminal with 27+ tools

**`midl-mcp-server`** - Standalone MCP server for Claude Desktop/Cursor

### For Blockchain Users

- **No CLI Required**: Interact with MIDL through conversation
- **Contract Deployment**: Templates for ERC20, counters, storage contracts
- **Rune Management**: Full Rune protocol support (etch, transfer, bridge)
- **Bridge Operations**: Move BTC↔EVM with automatic gas handling
- **Transaction Tracking**: Real-time confirmation with explorer links

## Getting Started

Visit [midl-ai.xyz/docs](https://midl-ai.xyz/docs) for full documentation including:

- **Getting Started Guide**: Quick setup and first interactions
- **Tools Reference**: Complete catalog of all 27 tools
- **Architecture**: MCP protocol and plugin system
- **Examples**: Sample prompts and workflows
- **MCP Server**: Configuration and transport options
- **FAQ**: Common questions answered

## Installation

### Frontend (AI Chat Interface)

```bash
# Clone repository
git clone https://github.com/midl-ai/frontend
cd midl-frontend

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your keys (see .env.example for required vars)

# Set up database
docker-compose up -d postgres redis
pnpm db:push

# Start development server
pnpm dev
```

### MCP Server (Claude Desktop/Cursor)

```bash
# Clone MCP server repository
git clone https://github.com/midl-ai/mcp-server
cd midl-mcp-server

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your MIDL_PRIVATE_KEY

# Build
pnpm build

# Add to Claude Desktop config
# See docs at midl-ai.xyz/docs/mcp-server
```

## Project Structure

### Frontend

```
midl-frontend/
├── app/
│   ├── api/
│   │   ├── chat/          # Vercel AI SDK chat endpoint
│   │   └── voice/         # OpenAI Realtime API endpoint
│   ├── chat/              # Main chat interface
│   ├── docs/              # Documentation pages
│   └── page.tsx           # Landing page
├── components/
│   ├── chat/              # Chat UI components
│   ├── tools/             # Tool-specific UI components (27 total)
│   ├── voice/             # Voice mode UI
│   └── wallet/            # Xverse wallet integration
├── lib/
│   ├── ai/
│   │   ├── tools/         # 27 AI tools across 9 categories
│   │   └── provider.ts    # AI provider configuration
│   ├── db/                # Drizzle schema and migrations
│   └── voice/             # Voice mode implementation
└── public/                # Static assets
```

### MCP Server

```
midl-mcp-server/
├── src/
│   ├── plugins/
│   │   ├── network/       # 3 network tools
│   │   ├── balance/       # 3 balance tools
│   │   ├── transfer/      # 3 transfer tools
│   │   ├── deploy/        # 1 deploy tool + templates
│   │   ├── contract/      # 3 contract tools
│   │   ├── bridge/        # 2 bridge tools
│   │   ├── runes/         # 4 runes tools
│   │   ├── bitcoin/       # 4 bitcoin tools
│   │   └── utility/       # 3 utility tools
│   ├── ui/                # MCP UI card generators
│   ├── wallet.ts          # EVM wallet client
│   ├── btc-wallet.ts      # Bitcoin wallet client
│   └── server.ts          # MCP server entry point
└── dist/                  # Built artifacts
```

## Development

```bash
# Install dependencies
pnpm install

# Type check
pnpm typecheck

# Lint
pnpm lint

# Build
pnpm build

# Run development server (frontend)
pnpm dev

# Database operations
pnpm db:push    # Push schema changes
pnpm db:studio  # Open Drizzle Studio
```

## Important Links

| Resource | URL |
|----------|-----|
| **Live Terminal** | [midl-ai.xyz](https://midl-ai.xyz) |
| **MCP Server** | [mcp.midl-ai.xyz](https://mcp.midl-ai.xyz/mcp) |
| **Documentation** | [midl-ai.xyz/docs](https://midl-ai.xyz/docs) |
| **GitHub (Frontend)** | [github.com/midl-ai/frontend](https://github.com/midl-ai/frontend) |
| **GitHub (MCP Server)** | [github.com/midl-ai/mcp-server](https://github.com/midl-ai/mcp-server) |
| **MIDL Protocol** | [midl.xyz](https://midl.xyz) |

## Environment Variables

### Frontend (.env)

```bash
# AI Providers
ANTHROPIC_API_KEY=         # Claude API key
OPENAI_API_KEY=            # GPT-4 + Realtime API

# Database
DATABASE_URL=              # PostgreSQL connection string
REDIS_URL=                 # Redis connection string

# MIDL
MIDL_PRIVATE_KEY=          # Server-side signing key
NEXT_PUBLIC_MIDL_RPC_URL=  # EVM RPC endpoint

# Optional
MIDL_NETWORK=              # 'mainnet' or 'testnet' (default: testnet)
```

### MCP Server (.env)

```bash
MIDL_PRIVATE_KEY=          # Required for signing transactions
MIDL_RPC_URL=              # Optional custom RPC endpoint
MIDL_NETWORK=              # 'mainnet' or 'testnet'
```

## License

MIT License - This project is 100% open source.

## Acknowledgments

Built for the **MIDL VibeHack 2026** hackathon (Feb 9-28, 2026).

Special thanks to:
- **MIDL Protocol Team** for the incredible hybrid chain architecture
- **@midl-js** team for the comprehensive SDK
- **Anthropic** for Claude and the Model Context Protocol
- **Vercel** for the AI SDK and Next.js framework

## AI Attribution

Claude (Anthropic) assisted extensively with code generation, architecture design, debugging complex integration issues (WASM + viem + MCP), and comprehensive documentation.

**Methodology**: Full AI pair programming - human-driven product vision and design decisions, AI-assisted implementation, testing, debugging, and documentation. Claude had full context access to reference codebases (VeChain Terminal, Stacks Terminal) and official MIDL SDK documentation.

---

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4-38bdf8)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791)
![Redis](https://img.shields.io/badge/Redis-7-DC382D)

[Website](https://midl-ai.xyz) • [MCP Server](https://mcp.midl-ai.xyz/mcp) • [Documentation](https://midl-ai.xyz/docs)

</div>
