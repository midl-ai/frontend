<div align="center">
  <img src="https://raw.githubusercontent.com/midl-ai/assets/master/midl-ai-wordmark-light.svg" alt="MIDL.AI Logo" width="250"/>

  # MIDL.AI Terminal

  **AI-powered terminal for the Bitcoin L1 + EVM L2 hybrid chain**

  [Live Demo](https://midl-ai.xyz) · [MCP Setup](https://mcp.midl-ai.xyz) · [Docs](https://midl-ai.xyz/docs) · [GitHub](https://github.com/midl-ai)

</div>

---

## Try it

| Link | What |
|------|------|
| [midl-ai.xyz](https://midl-ai.xyz) | Chat terminal (voice supported) |
| [mcp.midl-ai.xyz](https://mcp.midl-ai.xyz) | Add to Claude Desktop / Cursor |
| [midl-ai.xyz/docs](https://midl-ai.xyz/docs) | Documentation |

Repos: [midl-frontend](https://github.com/midl-ai/midl-frontend) · [midl-mcp-server](https://github.com/midl-ai/midl-mcp-server)

---

## Quick Overview

**What it is:** MIDL.AI is an AI-powered terminal for the MIDL blockchain (Bitcoin L1 + EVM L2 hybrid). It’s two apps — a web chat UI and an MCP server — that expose the same 27 blockchain tools through natural language.

**What it’s meant to do:** Let users and developers interact with MIDL without SDKs or manual signing: check balances, manage Runes, read/write contracts, deploy Solidity, and bridge BTC↔EVM via chat, voice, or Claude Desktop/Cursor. One sentence (e.g. *“Deploy an ERC20 called BitcoinCoffee with 1M supply”*) returns a deployed contract and explorer link.

**Who it’s for:** Developers building on MIDL who want AI-assisted workflows in the IDE (MCP) or via web chat, and end users who prefer managing BTC/Runes/tokens through conversation instead of traditional wallet UIs.

---

## What it is

Talk to the MIDL blockchain in plain language. Two apps, same 27 tools:

- **Chat terminal** — Web UI at midl-ai.xyz: balances, Runes, contract read/write/deploy, BTC↔EVM bridge. Generative UI cards, optional voice.
- **MCP server** — For Claude Desktop and Cursor: same tools, rich cards in the IDE. HTTP transport for bots/integrations.

No SDK learning curve, no Hardhat setup. Example: *"Deploy an ERC20 called BitcoinCoffee with 1M supply"* → contract address + explorer link.

---

## Problem & solution

MIDL is powerful but complex: BIP322 signing, intention-based txs (sign on BTC L1, execute on EVM L2), UTXOs + EVM state, Runes↔ERC20. We hide that behind natural language and return structured results + visual cards.

<div align="center">
  <img src="https://raw.githubusercontent.com/midl-ai/assets/master/problem-diagram.svg" alt="Problem" width="100%"/>
</div>

<div align="center">
  <img src="https://raw.githubusercontent.com/midl-ai/assets/master/solution-overview.svg" alt="Solution" width="100%"/>
</div>

---

## What we built

**27 tools** in 9 categories. All return generative UI in chat and MCP UI in Claude/Cursor.

<div align="center">
  <img src="https://raw.githubusercontent.com/midl-ai/assets/master/tool-categories.svg" alt="Tool categories" width="100%"/>
</div>

**Stack:** Next.js 16, React 19, Vercel AI SDK v6, PostgreSQL + Drizzle, Redis. MCP: plugin architecture, stdio + HTTP transport, @mcp-ui/server for cards.

<div align="center">
  <img src="https://raw.githubusercontent.com/midl-ai/assets/master/bitcoin-evm-layers.svg" alt="Bitcoin L1 + EVM L2" width="100%"/>
</div>

<div align="center">
  <img src="https://raw.githubusercontent.com/midl-ai/assets/master/mcp-architecture.svg" alt="MCP architecture" width="100%"/>
</div>

---

## Why it matters

- **First AI terminal for a Bitcoin+EVM hybrid** — No existing AI/MCP stack for MIDL.
- **Conversation instead of SDK** — Deploy, bridge, and manage Runes via chat or Claude; no manual signing flows.
- **One surface for both users and devs** — Chat for explorers and power users, MCP for developers in the IDE.

---

## License

MIT. Built for MIDL VibeHack 2026.
