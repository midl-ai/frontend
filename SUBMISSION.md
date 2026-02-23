<div align="center">
  <img src="https://raw.githubusercontent.com/midl-ai/assets/master/midl-ai-wordmark.svg" alt="MIDL.AI Logo" width="250"/>

  # MIDL.AI Terminal

  **The First AI-Powered MCP for Bitcoin L1 + EVM L2 Hybrid Chain**

  *Talk to your blockchain. Deploy contracts. Bridge assets. All through conversation.*

  [![Website](https://img.shields.io/badge/Website-midl--ai.xyz-blue)](https://midl-ai.xyz)
  [![MCP Server](https://img.shields.io/badge/MCP-mcp.midl--ai.xyz-green)](https://mcp.midl-ai.xyz)
  [![Documentation](https://img.shields.io/badge/Docs-midl--ai.xyz%2Fdocs-orange)](https://midl-ai.xyz/docs)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

  [Live Demo](https://midl-ai.xyz) • [MCP Server](https://mcp.midl-ai.xyz) • [Documentation](https://midl-ai.xyz/docs) • [GitHub](https://github.com/midl-ai)

</div>

---

![MIDL.AI Hero](https://raw.githubusercontent.com/midl-ai/assets/master/midl-hero.png)

## What is MIDL.AI?

MIDL.AI brings conversational AI to the MIDL Protocol — the world's first Bitcoin L1 + EVM L2 hybrid blockchain. We built two production-ready applications:

1. **AI Chat Terminal** - Beautiful Next.js interface with 27+ AI tools
2. **MCP Server** - Standalone server for Claude Desktop & Cursor

**Interact with Bitcoin and EVM layers through natural language. No CLI required.**

## The Problem

MIDL Protocol is groundbreaking — it combines Bitcoin's security (UTXO model) with EVM compatibility (account model). But this power comes with complexity:

**Problem 1: Dual-Layer Complexity**
Managing both Bitcoin UTXOs and EVM accounts requires mastering two completely different paradigms. Users need different tools, different wallets, different mental models.

**Problem 2: No Developer Tools**
There's no simple way to build applications that interact with both layers. Developers must write custom integrations for each operation.

**Problem 3: Barrier to Entry**
New users are intimidated by complex CLIs, hex addresses, gas calculations, and UTXO management. This limits mainstream adoption.

**Problem 4: Missing AI Integration**
In 2026, every blockchain should have an AI-native interface. Users should be able to deploy contracts, bridge assets, and manage runes through conversation — not commands.

## The Solution

<div align="center">
  <img src="https://raw.githubusercontent.com/midl-ai/assets/master/problem-diagram.svg" alt="Problem Diagram" width="100%"/>
</div>

<div align="center">
  <img src="https://raw.githubusercontent.com/midl-ai/assets/master/solution-architecture.svg" alt="Solution Architecture" width="100%"/>
</div>

## What Makes MIDL.AI Unique

### 1. World's First Bitcoin+EVM Hybrid MCP

MIDL Protocol is the ONLY blockchain that combines Bitcoin L1 with EVM L2. MIDL.AI is the first conversational interface purpose-built for this hybrid architecture.

**Seamlessly interact with both layers in a single conversation:**
- "Check my BTC balance on L1" → Bitcoin UTXO query
- "Deploy an ERC20 token on L2" → Solidity compilation + EVM deployment
- "Bridge 0.1 BTC to EVM" → Cross-layer bridge operation
- "Transfer a rune to this address" → Bitcoin Rune protocol transaction

### 2. Comprehensive Tool Coverage: 27 Tools Across 9 Categories

We built a complete toolkit covering every aspect of MIDL Protocol:

| Category | Tools | Description |
|----------|-------|-------------|
| **Network** | 3 tools | System contracts, network info, block data |
| **Balance** | 3 tools | EVM balance, BTC balance, token balance |
| **Transfer** | 3 tools | EVM transfers, token transfers, raw transactions |
| **Deploy** | 1 tool + templates | Compile and deploy Solidity contracts |
| **Contract** | 3 tools | Read contracts, verify contracts, get event logs |
| **Bridge** | 2 tools | BTC↔EVM bidirectional bridging |
| **Runes** | 4 tools | Rune balance, transfer, ERC20 bridging |
| **Bitcoin** | 4 tools | UTXO management, transaction tracking, fees |
| **Utility** | 3 tools | Unit conversion, address lookups, gas estimation |

**Total: 27 production-ready AI tools**

### 3. Dual Interface Design

**Frontend (midl-ai.xyz):**
- Beautiful Next.js chat interface with generative UI
- Each tool renders a custom React component
- Real-time transaction tracking with status updates
- Voice mode powered by OpenAI Realtime API
- Chat history persisted with PostgreSQL
- Dark/light mode with smooth transitions

**MCP Server (mcp.midl-ai.xyz):**
- Standalone server compatible with Claude Desktop, Cursor, and any MCP client
- Stdio + HTTP transports (dual transport architecture)
- Plugin-based architecture with 9 plugin categories
- MCP UI cards for rich visual feedback
- Server-side signing with secure key management

### 4. Production-Ready Infrastructure

This isn't a hackathon demo — it's production software:

- **Database**: PostgreSQL + Drizzle ORM for chat persistence
- **Caching**: Redis + resumable streams for long-running operations
- **Security**: Server-side signing, environment variable validation
- **AI**: Vercel AI SDK v6 with streaming tool calls
- **Voice**: OpenAI Realtime API integration with Web Audio
- **Error Handling**: Comprehensive error codes and user-friendly messages
- **Type Safety**: Full TypeScript with strict mode
- **Testing**: Unit tests for critical business logic
- **Documentation**: 6 documentation pages with examples

## Architecture

### MCP Server Architecture

<div align="center">
  <img src="https://raw.githubusercontent.com/midl-ai/assets/master/mcp-architecture.svg" alt="MCP Architecture" width="100%"/>
</div>

**Plugin-Based Design:**
Each category (Network, Balance, Transfer, etc.) is a plugin. Each plugin exports multiple tools. This makes the codebase maintainable and extensible.

**Dual Transport:**
- **Stdio**: For Claude Desktop and Cursor
- **HTTP**: For remote clients and web integrations

**UI Cards:**
Every tool result can be rendered as a beautiful MCP UI card with HTML formatting, syntax highlighting, and transaction links.

### Frontend Architecture

<div align="center">
  <img src="https://raw.githubusercontent.com/midl-ai/assets/master/frontend-architecture.svg" alt="Frontend Architecture" width="100%"/>
</div>

**Generative UI Pattern:**
Each tool has a dedicated React component that renders transaction details, status indicators, and action buttons.

**Resumable Streams:**
Long-running operations (contract deployment, bridge operations) use Redis to maintain state across API requests.

**Voice Mode:**
OpenAI Realtime API provides voice input/output with function calling support.

### Technical Deep Dive

<div align="center">
  <img src="https://raw.githubusercontent.com/midl-ai/assets/master/technical-deep-dive.svg" alt="Technical Deep Dive" width="100%"/>
</div>

### Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **AI** | Vercel AI SDK | v6.0.90 |
| | Anthropic Claude | Sonnet 3.5 |
| | OpenAI GPT-4 | GPT-4 Turbo |
| **Frontend** | Next.js | 16.1.6 |
| | React | 19.2.4 |
| | TypeScript | 5.9.3 |
| **Database** | PostgreSQL | 16 |
| | Drizzle ORM | 0.45.1 |
| | Redis | 7 |
| **Styling** | TailwindCSS | 4.1.18 |
| | Framer Motion | 12.34.2 |
| | Lucide Icons | 0.574.0 |
| **MIDL** | @midl/core | 3.0.2 |
| | @midl/executor | 3.0.2 |
| | @midl/node | 3.0.2 |
| | @midl/viem | 2.45.0 |
| **Solidity** | solc | 0.8.33 |
| | viem | 2.46.2 |
| **MCP** | @modelcontextprotocol/sdk | 1.26.0 |
| **Voice** | OpenAI Realtime API | WebSocket |

### Key Innovation: Hybrid Chain Tooling

**The Challenge:** Bitcoin uses UTXOs. EVM uses accounts. They're fundamentally different.

**Our Solution:** Abstract the complexity behind natural language. Users say what they want to do — we handle the underlying protocol differences.

**Example:**
```
User: "Bridge 0.5 BTC to my EVM address"

Behind the scenes:
1. Query Bitcoin UTXOs
2. Calculate required amount (0.5 BTC + fees)
3. Build Bitcoin transaction
4. Submit to Bitcoin L1
5. Wait for confirmations
6. Monitor bridge contract on L2
7. Notify user when EVM balance updates
```

All of this happens automatically. User just sees: Bridge complete.

## Features & User Experience

### For End Users

**Natural Language Interface:**
- "Deploy an ERC20 token called MyToken with 1 million supply"
- "What's my BTC balance?"
- "Transfer 100 tokens to kaspa:qr..."
- "Bridge this rune to ERC20 on the EVM side"

**Generative UI:**
Every tool renders a beautiful UI component:
- Transaction cards with status indicators
- Explorer links for transparency
- Balance displays with formatted amounts
- Action buttons for next steps

**Voice Mode:**
Speak your commands. Get voice responses. Perfect for mobile or hands-free operation.

**Chat History:**
All conversations saved. Resume anytime. Search past transactions.

**Real-Time Updates:**
Watch transactions confirm live. Status changes from "pending" → "confirming" → "confirmed" with visual feedback.

### For Developers

**MCP Server Integration:**
Add MIDL.AI to Claude Desktop in 5 minutes:
```json
{
  "mcpServers": {
    "midl": {
      "command": "node",
      "args": ["/path/to/midl-mcp-server/dist/index.js"],
      "env": {
        "MIDL_PRIVATE_KEY": "your-key"
      }
    }
  }
}
```

**Tool Development:**
Our plugin architecture makes adding new tools straightforward:
```typescript
export class MyPlugin extends PluginBase {
  @Tool({
    name: 'my_tool',
    description: 'Does something cool',
    schema: mySchema
  })
  async execute(params: MyParams): Promise<ToolResponse<MyResult>> {
    // Implementation
  }
}
```

**Full TypeScript Support:**
Every tool has complete type definitions. Autocomplete everywhere.

### For Blockchain Users

**No CLI Required:**
Never touch a terminal again. Do everything through conversation.

**Contract Templates:**
Deploy pre-audited contracts:
- ERC20 tokens
- Counter contracts
- Storage contracts

**Rune Support:**
Full Bitcoin Rune protocol integration:
- Check rune balances
- Transfer runes
- Bridge runes to ERC20 tokens

**Bridge Operations:**
Move assets between Bitcoin L1 and EVM L2:
- BTC → EVM (deposit)
- EVM → BTC (withdrawal)
- Automatic gas handling
- Real-time status tracking

## Demo Scenarios

### Scenario 1: Deploy an ERC20 Token

**User:** "Deploy an ERC20 token called MyToken with symbol MTK and 1 million initial supply"

**MIDL.AI:**
1. Compiles Solidity using solc 0.8.33
2. Deploys to MIDL L2
3. Waits for confirmation
4. Returns contract address + explorer link

**Time:** ~30 seconds

### Scenario 2: Bridge BTC to EVM

**User:** "Bridge 0.1 BTC to my EVM wallet"

**MIDL.AI:**
1. Checks BTC balance on L1
2. Builds bridge transaction
3. Submits to bridge contract
4. Monitors confirmation
5. Notifies when EVM balance updates

**Time:** ~2-3 minutes (Bitcoin block time)

### Scenario 3: Transfer a Rune

**User:** "Transfer 100 UNCOMMON•GOODS rune to kaspa:qr..."

**MIDL.AI:**
1. Validates rune balance
2. Builds Rune edict transaction
3. Submits to Bitcoin L1
4. Returns transaction ID

**Time:** ~10 seconds

### Scenario 4: Voice Interaction

**User:** "What's my balance?"

**MIDL.AI:** "You have 1.5 BTC on Bitcoin L1 and 0.3 BTC worth of assets on EVM L2"

**User:** "Deploy a counter contract"

**MIDL.AI:** "Deploying... Done! Your counter contract is at 0xabc..."

## Impact & Innovation

### Innovation #1: First AI Terminal for Hybrid Chains

No other blockchain has this architecture. No other AI terminal handles both UTXO and account models.

### Innovation #2: MCP Protocol Implementation

We're one of the first projects to build a full-featured MCP server with:
- Plugin architecture
- Dual transports
- UI cards
- 27 tools

### Innovation #3: Production-Grade Generative UI

Most AI chat interfaces just show text. We render custom React components for every tool result with:
- Transaction status indicators
- Explorer links
- Action buttons
- Error recovery

### Innovation #4: Voice Mode for Blockchain

Speaking to your blockchain is magical. OpenAI Realtime API + our tool system = voice-controlled Web3.

## Deployment & Access

| Service | URL | Purpose |
|---------|-----|---------|
| **Live Terminal** | [midl-ai.xyz](https://midl-ai.xyz) | Main chat interface |
| **MCP Server Docs** | [mcp.midl-ai.xyz](https://mcp.midl-ai.xyz) | MCP server setup guide |
| **Documentation** | [midl-ai.xyz/docs](https://midl-ai.xyz/docs) | Full documentation (6 pages) |
| **GitHub (Frontend)** | [github.com/midl-ai/midl-frontend](https://github.com/midl-ai/midl-frontend) | Frontend source code |
| **GitHub (MCP)** | [github.com/midl-ai/midl-mcp-server](https://github.com/midl-ai/midl-mcp-server) | MCP server source code |

## Project Structure

### Two Repositories

**1. midl-frontend (This Repo)**
```
midl-frontend/
├── app/
│   ├── api/chat/          # Vercel AI SDK endpoint
│   ├── api/voice/         # Realtime API endpoint
│   ├── chat/              # Main chat UI
│   ├── docs/              # 6 documentation pages
│   └── page.tsx           # Landing page
├── components/
│   ├── tools/             # 27 tool UI components
│   ├── chat/              # Chat interface
│   ├── voice/             # Voice mode UI
│   └── wallet/            # Wallet integration
└── lib/
    ├── ai/tools/          # 27 AI tool implementations
    ├── db/                # Drizzle ORM schema
    └── voice/             # Voice mode logic
```

**2. midl-mcp-server (Separate Repo)**
```
midl-mcp-server/
├── src/
│   ├── plugins/           # 9 plugin categories
│   │   ├── network/       # 3 tools
│   │   ├── balance/       # 3 tools
│   │   ├── transfer/      # 3 tools
│   │   ├── deploy/        # 1 tool + templates
│   │   ├── contract/      # 3 tools
│   │   ├── bridge/        # 2 tools
│   │   ├── runes/         # 4 tools
│   │   ├── bitcoin/       # 4 tools
│   │   └── utility/       # 3 tools
│   ├── ui/                # MCP UI card generators
│   └── server.ts          # MCP server entry
└── dist/                  # Built artifacts
```

## Installation & Setup

### Prerequisites
- Node.js 18+
- pnpm 8+
- PostgreSQL 16
- Redis 7
- MIDL Protocol RPC access

### Frontend Setup

```bash
# Clone repository
git clone https://github.com/midl-ai/midl-frontend
cd midl-frontend

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys

# Start services
docker-compose up -d postgres redis

# Push database schema
pnpm db:push

# Start development server
pnpm dev
```

Visit http://localhost:3000

### MCP Server Setup

```bash
# Clone MCP repository
git clone https://github.com/midl-ai/midl-mcp-server
cd midl-mcp-server

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Add your MIDL_PRIVATE_KEY

# Build
pnpm build

# Add to Claude Desktop config
# See docs at mcp.midl-ai.xyz
```

## Challenges & Solutions

### Challenge 1: Dual Chain Complexity

**Problem:** Bitcoin and EVM are fundamentally different. How do we provide a unified interface?

**Solution:** Abstract the differences behind tool interfaces. Each tool knows which layer it operates on. Users don't need to think about it.

### Challenge 2: Long-Running Operations

**Problem:** Bridge operations can take minutes. HTTP requests timeout.

**Solution:** Redis + resumable streams. Operations continue server-side. Client polls for updates.

### Challenge 3: Solidity Compilation

**Problem:** solc is designed for Node.js. We're on the edge runtime.

**Solution:** Custom compilation pipeline using solc-js with proper WASM integration.

### Challenge 4: MCP UI Cards

**Problem:** MCP UI is new. No examples for complex blockchain data.

**Solution:** Built our own card generators with syntax highlighting, tables, and transaction links.

### Challenge 5: Voice Mode Latency

**Problem:** Realtime API + tool calling = multiple round trips = slow.

**Solution:** Optimized tool schemas. Pre-fetch common data. Stream responses while processing.

## Team & Development

### Team
- **Sole Developer**: Built by one developer with extensive Claude Code assistance

### Development Timeline
- **Week 1**: Architecture design, MCP server foundation
- **Week 2**: Tool implementation (27 tools)
- **Week 3**: Frontend chat interface, generative UI
- **Week 4**: Voice mode, documentation, polish

### Development Approach

**AI-First Development:**
- Claude handled: Code generation, debugging, architecture decisions
- Human handled: Product vision, UX design, integration testing

**Iterative Process:**
1. Design tool interface
2. Claude implements
3. Test with real blockchain
4. Refine based on errors
5. Repeat

**Reference Architecture:**
Studied successful implementations:
- VeChain Terminal (generative UI patterns)
- Stacks Terminal (tool architecture)
- Official MCP examples (server patterns)

## AI Attribution & Methodology

### Claude's Role

Claude (Anthropic) provided:
- Code generation for all 27 tools
- Architecture decisions (plugin system, dual transport)
- Debugging complex integration issues:
  - WASM bundling with solc
  - viem custom chain configuration
  - MCP transport setup
  - Drizzle schema design
- Documentation writing
- Error handling patterns
- TypeScript type safety enforcement

### Methodology

**Full Context Access:**
- Claude had access to reference codebases (VeChain, Stacks)
- Complete MIDL SDK documentation
- MCP protocol specifications
- Vercel AI SDK documentation

**Pair Programming:**
- Human: "I need a tool that deploys contracts"
- Claude: *Generates implementation with Solidity compilation*
- Human: "The WASM isn't loading"
- Claude: *Debugs bundler configuration*
- Human: "Perfect, now add error handling"
- Claude: *Adds comprehensive error codes*

**Validation:**
Every tool was tested against real MIDL testnet. If Claude's code didn't work, we iterated until it did.

## Future Roadmap

### Short Term (Next 3 Months)
- [ ] Mainnet deployment
- [ ] More contract templates (NFTs, DEX, governance)
- [ ] Multi-wallet support (MetaMask, Rabby)
- [ ] Mobile-optimized interface
- [ ] Batch operations (multiple transfers in one prompt)

### Medium Term (6 Months)
- [ ] Community plugin system (let developers add tools)
- [ ] Natural language transaction simulation
- [ ] Gas optimization suggestions
- [ ] Smart contract auditing assistant
- [ ] Portfolio tracking and analytics

### Long Term (12 Months)
- [ ] Multi-chain support (other Bitcoin L2s)
- [ ] AI-powered smart contract generation
- [ ] Voice-only mobile app
- [ ] Integration with hardware wallets
- [ ] DAO governance tooling

## License & Contribution

### License
MIT License - 100% open source.

### Contributing
We welcome contributions! See CONTRIBUTING.md for guidelines.

### Commercial Use
Use MIDL.AI in your own projects. Build on our tools. Fork and customize.

## Acknowledgments

Built for **MIDL VibeHack 2026** (February 9-28, 2026).

### Special Thanks
- **MIDL Protocol Team**: For building the world's first Bitcoin+EVM hybrid
- **@midl-js Team**: For the comprehensive SDK that made this possible
- **Anthropic**: For Claude and the Model Context Protocol
- **Vercel**: For the AI SDK and Next.js framework
- **OpenAI**: For GPT-4 and Realtime API
- **VeChain & Stacks Teams**: For inspiration and reference implementations

### Community
Join our community:
- Twitter: [@midl_xyz](https://twitter.com/midl_xyz)
- GitHub: [github.com/midl-ai](https://github.com/midl-ai)
- Discord: [Coming soon]

---

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791)
![Redis](https://img.shields.io/badge/Redis-7-DC382D)
![AI](https://img.shields.io/badge/AI-Claude%20%2B%20GPT--4-orange)

**MIDL.AI: Talk to Your Blockchain**

[Website](https://midl-ai.xyz) • [MCP Server](https://mcp.midl-ai.xyz) • [Documentation](https://midl-ai.xyz/docs) • [GitHub](https://github.com/midl-ai)

Built for MIDL VibeHack 2026

</div>
