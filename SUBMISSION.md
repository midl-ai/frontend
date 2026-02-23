<div align="center">
  <img src="https://raw.githubusercontent.com/midl-ai/assets/master/midl-ai-wordmark.svg" alt="MIDL.AI Logo" width="250"/>

  # MIDL.AI Terminal

  **The First AI-Powered Terminal for Bitcoin L1 + EVM L2 Hybrid Chain**

  [![Website](https://img.shields.io/badge/Website-midl--ai.xyz-blue)](https://midl-ai.xyz)
  [![MCP Server](https://img.shields.io/badge/MCP-mcp.midl--ai.xyz-green)](https://mcp.midl-ai.xyz)
  [![Documentation](https://img.shields.io/badge/Docs-midl--ai.xyz%2Fdocs-orange)](https://midl-ai.xyz/docs)

  [Live Demo](https://midl-ai.xyz) • [Documentation](https://midl-ai.xyz/docs) • [GitHub](https://github.com/midl-ai)

</div>

---

![MIDL.AI Hero](https://raw.githubusercontent.com/midl-ai/assets/master/midl-hero.png)

## Live Links

| Resource | URL | Description |
|----------|-----|-------------|
| **Live Terminal** | [midl-ai.xyz](https://midl-ai.xyz) | AI chat interface |
| **MCP Server** | [mcp.midl-ai.xyz](https://mcp.midl-ai.xyz) | Setup guide for Claude Desktop/Cursor |
| **Documentation** | [midl-ai.xyz/docs](https://midl-ai.xyz/docs) | Complete docs (6 pages) |
| **GitHub Frontend** | [github.com/midl-ai/midl-frontend](https://github.com/midl-ai/midl-frontend) | Chat terminal source code |
| **GitHub MCP** | [github.com/midl-ai/midl-mcp-server](https://github.com/midl-ai/midl-mcp-server) | MCP server source code |

## Executive Summary

MIDL AI Terminal makes the MIDL blockchain — a Bitcoin L1 + EVM L2 hybrid network — accessible through natural language conversation. Instead of learning SDKs, understanding complex signing flows, or managing intention-based transactions, users simply ask AI to perform blockchain operations. The system handles balance queries, Rune management, contract interactions, deployments, and BTC↔EVM bridging through conversational interface.

The project delivers two complete applications:

1. **AI Chat Terminal** (`midl-frontend`) - Next.js web interface with 27 AI tools, generative UI, voice mode, and PostgreSQL persistence
2. **MCP Server** (`midl-mcp-server`) - Standalone server exposing 27 blockchain tools for Claude Desktop, Cursor, and other MCP clients with rich MCP UI integration

**Target users:** Developers building on MIDL who want AI-assisted workflows, and end users managing BTC/Runes/tokens who prefer chat over traditional wallet UIs.

## Problem & Solution

### The Problem

<div align="center">
  <img src="https://raw.githubusercontent.com/midl-ai/assets/master/problem-diagram.svg" alt="Problem Diagram" width="100%"/>
</div>

MIDL Protocol's power comes with complexity:
- BIP322 Bitcoin signatures authorizing EVM transactions
- Intention-based transaction flow (sign on BTC L1, execute on EVM L2)
- Dual-layer state management (UTXOs + EVM accounts)
- Runes protocol integration with ERC20 bridging

Traditional developers face a steep learning curve. End users struggle with fragmented tools.

### The Solution

<div align="center">
  <img src="https://raw.githubusercontent.com/midl-ai/assets/master/solution-overview.svg" alt="Solution Overview" width="100%"/>
</div>

MIDL.AI abstracts all complexity behind natural language. Ask "deploy an ERC20 called BitcoinCoffee with 1 million supply" — get a deployed contract with address and explorer link. Zero Hardhat setup. Zero manual signing. It just works.

### What Makes This Special

- **First AI tooling for MIDL** — No existing AI/MCP integration for this Bitcoin+EVM hybrid chain
- **AI-accessible blockchain** — The harder something is manually (BIP322 signatures, Rune operations, intention-based tx flow), the more valuable AI abstraction becomes
- **Generative UI** — Unlike plain-text responses, tools return rich visual cards (balance displays, transaction receipts, Rune portfolios) via custom React components and MCP UI
- **Full lifecycle coverage** — Read operations (balances, UTXOs, contract state), write operations (transfers, contract calls), and deployment (compile Solidity → deploy → return address) in one cohesive system
- **"It just works" moment** — Ask "deploy an ERC20 called BitcoinCoffee with 1 million supply" and receive the deployed contract address and explorer link — zero Hardhat setup, no manual signing, no exposed complexity

## Success Criteria

### User Success
- **Developer "aha!" moment:** First successful operation in chat interface or Claude Desktop — balance query returns, contract deploys, tokens transfer — confirms the system works
- **Magic moment:** Natural language request ("deploy an ERC20 called BitcoinCoffee") results in deployed contract with address and explorer link, zero manual setup required
- **Completion scenario:** User can perform full MIDL workflow through AI conversation — check balances, read contracts, deploy, transfer tokens, bridge BTC, manage runes — without touching SDK directly

### Technical Success
- All 27 tools functional and tested against MIDL testnet
- Dual applications working (chat terminal + MCP server)
- Generative UI rendering rich visual responses
- Error handling: never throw — always return structured responses
- Code quality: 300-line file limit, no magic numbers, TypeScript strict mode

### Measurable Outcomes

| Metric | Target | Achieved |
|--------|--------|----------|
| Tool count | 27 tools across 9 categories | 27 |
| Applications | 2 (chat terminal + MCP server) | 2 |
| UI coverage | All tools return visual components | 100% |
| Documentation pages | 6 pages | 6 |
| Test coverage | Each tool tested against testnet | 100% |

## Product Scope

### Complete Build - 27 Tools

<div align="center">
  <img src="https://raw.githubusercontent.com/midl-ai/assets/master/tool-categories.svg" alt="Tool Categories" width="100%"/>
</div>

| Category | Tools | Count |
|----------|-------|-------|
| **Network** | `get_network_info`, `get_system_contracts`, `get_block` | 3 |
| **Balance** | `get_evm_balance`, `get_btc_balance`, `get_token_balance` | 3 |
| **Runes** | `get_runes`, `get_rune_balance`, `transfer_rune`, `bridge_rune_to_erc20` | 4 |
| **Contract** | `read_contract`, `write_contract`, `get_logs`, `verify_contract` | 4 |
| **Bitcoin** | `get_utxos`, `get_transaction`, `get_transaction_receipt`, `get_fee_rate` | 4 |
| **Deploy** | `deploy_contract` | 1 |
| **Transfer** | `transfer_evm`, `transfer_token`, `send_raw_transaction` | 3 |
| **Bridge** | `bridge_btc_to_evm`, `bridge_evm_to_btc` | 2 |
| **Utility** | `convert_btc_to_evm`, `get_rune_erc20_address`, `estimate_gas` | 3 |

### Infrastructure

**Chat Terminal:**
- Next.js 16 + React 19 frontend
- Vercel AI SDK v6 with streaming tool calls
- PostgreSQL + Drizzle ORM for chat persistence
- Redis + resumable streams for long-running operations
- Voice mode with OpenAI Realtime API
- Custom React components for each tool (generative UI)

**MCP Server:**
- Plugin architecture (PluginBase → ToolBase pattern)
- MidlWalletClient for server-side signing
- Dual transport (stdio for Claude Desktop + HTTP for remote clients)
- MCP UI integration (`@mcp-ui/server`) for rich visual cards

## User Journeys

### Journey 1: Sarah — First-Time User Exploring via Chat

**Who:** Sarah, a developer curious about MIDL's Bitcoin+EVM hybrid. She's heard about it but finds the documentation abstract. She prefers learning by doing.

**Opening Scene:**
Sarah visits midl-ai.xyz on a Saturday morning. The landing page shows a clean chat interface with a prompt: "Ask me anything about MIDL." She types: *"What is MIDL?"*

**Rising Action:**
The AI explains MIDL's architecture — Bitcoin L1 for security, EVM L2 for programmability. Sarah gets curious: *"What's my balance?"* The AI realizes she needs testnet BTC, provides a faucet link. She gets funds and asks again. A beautiful balance card appears showing her BTC on both layers.

She gets bolder: *"Show me the system contracts."* A table appears with all addresses — Executor, Bridge, Rune Factory. She copies the Executor address and asks: *"Read the getVersion function from the Executor contract."* It works instantly.

**Climax:**
Sarah types: *"Deploy a simple Counter contract with increment and decrement functions."*

The AI generates Solidity, compiles it, deploys it, and returns the contract address with an explorer link. Sarah clicks the link — her contract is live on MIDL testnet. She didn't configure Hardhat. She didn't write any deployment scripts. It just worked.

**Resolution:**
Sarah spends the next hour deploying test contracts, reading state, calling functions — all through conversation. By evening, she's decided to build her hackathon project on MIDL. The chat interface turned curiosity into commitment.

**Capabilities Revealed:** `get_network_info`, `get_system_contracts`, `get_evm_balance`, `read_contract`, `deploy_contract`, generative UI cards, voice mode option

---

### Journey 2: Marcus — Developer Using MCP in Claude Desktop

**Who:** Marcus, a Solidity developer working in Claude Desktop. He wants blockchain context while coding without breaking his flow.

**Opening Scene:**
Marcus is writing a Rune analytics dashboard and needs to understand MIDL's Rune data structure. Alt-tabbing to docs is killing his flow. He remembers someone mentioned a MIDL MCP server.

**Rising Action:**
He installs the MIDL MCP server following the docs at mcp.midl-ai.xyz, adds it to his Claude Desktop config, and restarts. In his coding session, he asks Claude: *"Get all runes for address bc1q...abc"*

The MCP server returns a structured list of Runes with IDs, names, and amounts — rendered as a clean table via MCP UI. Marcus sees exactly what fields he need to handle. He asks: *"What's the ERC20 address for rune 840000:1?"* — gets the CREATE2-derived address instantly.

He's writing transfer logic and wonders about gas costs. *"Estimate gas for transferring 100 tokens to 0x..."* — gets an estimate before committing to the transaction pattern.

**Climax:**
Marcus hits a bug — a transaction failed silently. He asks: *"Get transaction receipt for 0xabc123..."*

The receipt shows `status: 0` (reverted) and includes the revert reason in the logs. He spots the issue — wrong function selector. He fixes it, redeploys, and confirms success via another receipt check.

**Resolution:**
Marcus finishes his dashboard in one session. The MCP server became his blockchain co-pilot — answering questions, fetching data, and debugging transactions without breaking his coding flow.

**Capabilities Revealed:** `get_runes`, `get_rune_balance`, `get_rune_erc20_address`, `estimate_gas`, `get_transaction_receipt`, `get_logs`, MCP UI cards

---

### Journey 3: Alex — Voice Mode User on Mobile

**Who:** Alex, a crypto trader managing multiple positions. She's on the go and wants to check balances and make transfers via voice.

**Opening Scene:**
Alex is commuting and remembers she needs to check her MIDL balances. She opens midl-ai.xyz on her phone and taps the voice mode button.

**Rising Action:**
She speaks: *"What's my balance?"*

The AI responds audibly: "You have 1.5 BTC on Bitcoin L1 and 0.8 BTC on EVM L2." A visual card appears confirming the numbers.

She needs to move funds: *"Transfer 0.2 BTC to [destination address]"*

The AI confirms: "I'll transfer 0.2 BTC to the address you provided. Please confirm this transaction." She says: *"Confirm"*

**Climax:**
The transaction processes. The AI announces: "Transaction submitted. Hash: 0xabc... I'll notify you when it confirms."

30 seconds later: "Your transaction confirmed in block 12346."

**Resolution:**
Alex managed her crypto portfolio entirely via voice while commuting. No typing. No complex wallet UI. Just conversation.

**Capabilities Revealed:** Voice mode, `get_evm_balance`, `get_btc_balance`, `transfer_evm`, real-time transaction tracking, OpenAI Realtime API integration

---

### Journey 4: David — Backend Developer Using HTTP API

**Who:** David, a backend engineer building a Telegram bot that lets users check MIDL balances and transfer tokens via chat commands.

**Opening Scene:**
David's team wants to add MIDL support to their multi-chain Telegram bot. He doesn't want to learn another SDK — he just wants clean JSON endpoints.

**Rising Action:**
He reads the MCP server docs and sees HTTP transport is supported. He spins up the server with `MCP_TRANSPORT=http PORT=3001`. He tests with curl:

```bash
curl -X POST http://localhost:3001/mcp \
  -d '{"tool": "midl_get_evm_balance", "params": {"address": "0x..."}}'
```

JSON comes back. He integrates it into his bot's existing HTTP client pattern. Balance checks work. He adds token transfers using `midl_transfer_token`.

**Climax:**
A user reports their transfer "didn't work." David needs to debug. He calls `midl_get_transaction_receipt` via HTTP, gets the full receipt, sees the revert reason, and identifies the issue — user sent to a contract that rejects transfers. He adds validation to prevent this in the bot.

**Resolution:**
David's Telegram bot now supports MIDL alongside 5 other chains. The HTTP transport meant zero new patterns — just another REST endpoint in his existing architecture.

**Capabilities Revealed:** HTTP transport, JSON-only responses (no UI), `get_evm_balance`, `transfer_token`, `get_transaction_receipt`, programmatic access

## Innovation & Novel Patterns

### Detected Innovation Areas

**1. First AI Terminal for Bitcoin+EVM Hybrid Chain**
No existing AI integration for MIDL or any Bitcoin+EVM hybrid architecture. This is greenfield territory — the first AI tooling for a chain that combines Bitcoin's security model with EVM's programmability.

**2. Conversational Blockchain Paradigm**
Traditional blockchain interaction: Learn SDK → Write code → Compile → Deploy → Debug manually.
MIDL.AI interaction: *"Deploy an ERC20 called BitcoinCoffee"* → Done.

This isn't a thin wrapper — it's a fundamental shift in blockchain interaction.

**3. Complexity Abstraction Through AI**
MIDL's architecture is inherently complex:
- BIP322 Bitcoin signatures authorizing EVM transactions
- Intention-based transaction flow (sign on BTC, execute on EVM)
- Runes (Bitcoin-native tokens) bridgeable to ERC20s
- Dual-layer state (UTXOs + EVM accounts)

The innovation is making this complexity *invisible*. Users don't need to understand the signing flow — they just ask for what they want.

**4. Dual Application Architecture**
Most blockchain AI tools are either chat interfaces OR MCP servers. MIDL.AI is both:
- Chat terminal for end users (midl-ai.xyz)
- MCP server for developers (Claude Desktop/Cursor)

Same 27 tools, two interfaces, covering both user types.

**5. Rich Visual Responses Everywhere**
- **Chat Terminal:** Custom React components for each tool result (generative UI pattern)
- **MCP Server:** HTML cards via `@mcp-ui/server` integration
- **Voice Mode:** Audio responses + visual confirmation cards

This bridges the gap between CLI efficiency and GUI polish.

### Competitive Landscape

| Project | Scope | Chat UI | MCP Server | Voice | Runes | BTC+EVM |
|---------|-------|---------|------------|-------|-------|---------|
| VeChain Terminal | VeChain | Yes | Yes | No | N/A | No |
| Stacks Terminal | Stacks | Yes | Yes | No | N/A | No |
| **MIDL.AI** | MIDL | **Yes** | **Yes** | **Yes** | **Yes** | **Yes** |

No direct competitors for MIDL. Closest analogues (VeChain, Stacks) target different chains and lack voice mode.

## Technical Architecture

### Bitcoin L1 + EVM L2 Hybrid

<div align="center">
  <img src="https://raw.githubusercontent.com/midl-ai/assets/master/bitcoin-evm-layers.svg" alt="Bitcoin EVM Layers" width="100%"/>
</div>

MIDL Protocol uniquely combines Bitcoin's UTXO model (L1) with EVM's account model (L2). MIDL.AI seamlessly handles operations across both layers through a single conversational interface.

### MCP Server Architecture

<div align="center">
  <img src="https://raw.githubusercontent.com/midl-ai/assets/master/mcp-architecture.svg" alt="MCP Architecture" width="100%"/>
</div>

Plugin-based architecture with dual transport support (stdio for local development + HTTP for remote clients). Each plugin category contains specialized tools that return structured responses and rich UI cards.

### Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **AI** | Vercel AI SDK | v6.0.90 |
| | Anthropic Claude | Sonnet 3.5 |
| | OpenAI GPT-4 | Turbo + Realtime |
| **Frontend** | Next.js | 16.1.6 |
| | React | 19.2.4 |
| | TypeScript | 5.9.3 |
| **Database** | PostgreSQL | 16 |
| | Drizzle ORM | 0.45.1 |
| | Redis | 7 |
| **Styling** | TailwindCSS | 4.1.18 |
| | Framer Motion | 12.34.2 |
| **MIDL** | @midl/core | 3.0.2 |
| | @midl/executor | 3.0.2 |
| | @midl/viem | 2.45.0 |
| **Solidity** | solc | 0.8.33 |
| **MCP** | @modelcontextprotocol/sdk | 1.26.0 |

## AI Attribution

Claude (Anthropic) provided:
- Code generation for all 27 tools
- Architecture decisions (plugin system, generative UI, dual transport)
- Debugging complex integration issues (WASM bundling, viem configuration, MCP setup, Drizzle schemas)
- Documentation writing (6 doc pages)
- TypeScript type safety enforcement

**Methodology:** Full AI pair programming - human-driven product vision and UX design, AI-assisted implementation, testing, debugging, and documentation. Claude had full context access to reference codebases (VeChain Terminal, Stacks Terminal) and official MIDL SDK documentation.

## License

MIT - 100% open source

**Built for:** MIDL VibeHack 2026 (February 9-28, 2026)

---

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791)

**MIDL.AI: Talk to Your Blockchain**

[Website](https://midl-ai.xyz) • [Documentation](https://midl-ai.xyz/docs) • [GitHub](https://github.com/midl-ai)

</div>
